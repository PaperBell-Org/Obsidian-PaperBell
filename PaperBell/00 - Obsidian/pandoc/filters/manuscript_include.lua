--[[
  manuscript_include.lua — run FIRST in the response-letter pipeline (before
  manuscript_cite.lua and citeproc).

  Lets the response letter pull "revised manuscript" quotes straight from the
  manuscript source, so they stay in sync instead of being hand-pasted.

  ── How to use ────────────────────────────────────────────────────────────
  In a manuscript SCENE (Introduction.md, Discussion.md, …) wrap the exact span
  you want to quote in a pair of HTML comments (invisible in Obsidian reading
  view, dropped from the manuscript PDF, and stripped by longform remove-comments):

      … across groups [@zhao2021c]. <!--ms:sbs-def-->Among the many perceptual
      biases, Shifting Baseline Syndrome (SBS) [@pauly1995] … remains lacking.<!--/ms:sbs-def--> This …

  In the response letter, reference it by id inside a ```manuscript fence:

      ```manuscript
      @sbs-def
      ```

  This filter finds <!--ms:sbs-def-->…<!--/ms:sbs-def--> in the manuscript scenes,
  pulls the CURRENT text, and emits a Div{.manuscript} (with citations parsed, so
  the single citeproc pass numbers them into the shared bibliography). responseletter.lua
  then renders it as the framed manuscript box — exactly like the old hand-pasted fences.

  Several ids may be listed (one @id per line) to stitch a few spans into one box.
  ids must be unique across the manuscript. Unresolved ids render a visible marker
  so nothing fails silently. Old literal ```manuscript fences keep working (they fall
  through to manuscript_cite.lua), so you can migrate incrementally.

  data-msid / data-msfile are stashed on the Div for a later line-number stage.
]]

local function trim(s) return (s:gsub('^%s+', ''):gsub('%s+$', '')) end

local function dirname(path)
  return path:match('^(.*)[/\\][^/\\]*$') or '.'
end

local function input_dir()
  if PANDOC_STATE and PANDOC_STATE.input_files and PANDOC_STATE.input_files[1] then
    return dirname(PANDOC_STATE.input_files[1])
  end
  return '.'
end

local function read_all(p)
  local f = io.open(p, 'r'); if not f then return nil end
  local s = f:read('a'); f:close(); return s
end

-- Directory that holds the manuscript scenes (same source/ folder as the letter scenes)
local function source_dir()
  local d = input_dir()
  local ok, entries = pcall(pandoc.system.list_directory, d .. '/source')
  if ok and entries then return d .. '/source' end
  return d
end

-- ── {{ path }} 结果占位符 → results.json 里的实际数值 ─────────────────────────
-- 和 longform 的 "Replace placeholders from JSON" 步骤同源：让回复信引用/拉取的
-- 段落、图注里的 {{ results1.corr }} 也渲染成数字（在 pandoc 解析原文之前替换，
-- 因为 pandoc 会把 {{ x }} 拆成多个 inline、过后就没法整体匹配了）。
local results_cache = nil
local function results_data()
  if results_cache ~= nil then return results_cache end
  results_cache = false
  local raw = read_all(input_dir() .. '/results.json') or read_all(source_dir() .. '/results.json')
  if raw then
    local ok, data = pcall(pandoc.json.decode, raw)
    if ok and type(data) == 'table' then results_cache = data end
  end
  return results_cache
end

local function resolve_path(root, path)
  local cur = root
  for tok in path:gmatch('[^%.%[%]]+') do
    if type(cur) ~= 'table' then return nil end
    local n = tonumber(tok)
    if n ~= nil and cur[n] ~= nil then cur = cur[n] else cur = cur[tok] end
    if cur == nil then return nil end
  end
  return cur
end

local function render_placeholders(md)
  if type(md) ~= 'string' then return md end
  local data = results_data()
  if not data then return md end
  return (md:gsub('{{%s*([%w_%.%[%]%$%-]+)%s*}}', function(path)
    local v = resolve_path(data, path)
    if v == nil then return nil end               -- 找不到 → 保留原样（不替换）
    if type(v) == 'table' then return nil end
    if type(v) == 'number' then
      if v == math.floor(v) and math.abs(v) < 1e15 then
        return string.format('%d', v)             -- 整数值：不带小数点（对齐 longform 的 String()）
      end
      return tostring(v)
    end
    return tostring(v)
  end))
end

-- id → span-markdown, built once by scanning every .md in the source dir
local span_cache = nil
local function build_cache()
  if span_cache then return span_cache end
  span_cache = {}
  local dir = source_dir()
  local ok, entries = pcall(pandoc.system.list_directory, dir)
  if not ok or not entries then return span_cache end
  for _, name in ipairs(entries) do
    if name:match('%.md$') then
      local content = read_all(dir .. '/' .. name)
      if content then
        local pos = 1
        while true do
          local s, e, id = content:find('<!%-%-ms:([%w%-_:]+)%-%->', pos)
          if not s then break end
          local close = '<!--/ms:' .. id .. '-->'
          local cs, ce = content:find(close, e + 1, true)
          if cs then
            if not span_cache[id] then
              span_cache[id] = { text = trim(content:sub(e + 1, cs - 1)), file = name:gsub('%.md$', '') }
            end
            pos = e + 1   -- 只跳过开标记（不跳到闭标记之后），这样嵌套/内层标记也能被找到
          else
            pos = e + 1   -- unterminated marker: skip past the opener
          end
        end
      end
    end
  end
  return span_cache
end

-- Is this the manuscript-quote carrier?  tagged ```manuscript/ms/revision or an
-- untagged fence (the note convention).  Mirrors responseletter.lua / manuscript_cite.lua.
-- ── figure-number map ─────────────────────────────────────────────────────
-- Pulled manuscript spans reference figures as \ref{fig:label}; that label is
-- undefined in the response letter (→ "Figure ??"). The manuscript defines each
-- figure as  ![…](CollMemo_figureN.png){#fig:label}, so the number is right there
-- in the image filename. Build fig:label → N and rewrite \ref{fig:label} → N,
-- so the box shows "Figure 1a" like the hand-typed quotes did.
local fig_map = nil
local function build_fig_map()
  if fig_map then return fig_map end
  fig_map = {}
  local dir = source_dir()
  local ok, entries = pcall(pandoc.system.list_directory, dir)
  if not ok or not entries then return fig_map end
  for _, name in ipairs(entries) do
    if name:match('%.md$') then
      local content = read_all(dir .. '/' .. name)
      if content then
        -- ...figure<N>.png)…{#fig:<label>}   (attrs may sit between the image and the id)
        for n, label in content:gmatch('figure(%d+)%.png%)[^{}]-{#fig:([%w_%-]+)}') do
          fig_map['fig:' .. label] = n
        end
      end
    end
  end
  return fig_map
end

-- 权威图号来源：manuscript-lines.sh 抓取的 figure-numbers.json（正文 "1"、SI "S1"）。
-- 没有 sidecar 时退回按 CollMemo_figureN.png 文件名猜（只覆盖正文图）。
local fig_numbers_cache = nil
local function fig_numbers()
  if fig_numbers_cache then return fig_numbers_cache end
  local raw = read_all(input_dir() .. '/figure-numbers.json')
  if raw then
    local ok, data = pcall(pandoc.json.decode, raw)
    if ok and type(data) == 'table' then fig_numbers_cache = data; return data end
  end
  fig_numbers_cache = build_fig_map()   -- 兜底：文件名猜测（仅正文）
  return fig_numbers_cache
end

-- 表号来源：manuscript-lines.sh 抓取的 table-numbers.json（正文 "1"、SI "S1"）。
local tbl_numbers_cache = nil
local function tbl_numbers()
  if tbl_numbers_cache then return tbl_numbers_cache end
  tbl_numbers_cache = {}
  local raw = read_all(input_dir() .. '/table-numbers.json')
  if raw then
    local ok, data = pcall(pandoc.json.decode, raw)
    if ok and type(data) == 'table' then tbl_numbers_cache = data end
  end
  return tbl_numbers_cache
end

-- 回复信里 ```xlsx-table 引用了正文/SI 的表：按其 label 查真实表号，注入 number: 字段，
-- 让 xlsx_table.lua 用来源表号（Table 1 / Table S9）而非回复信自编的 Table R1。
-- 本 filter 只在回复信 pipeline 跑，故正文/SI 自身导出不受影响。
local function number_xlsx_table(blk)
  local is_xlsx = false
  for _, c in ipairs(blk.classes or {}) do if c:lower() == 'xlsx-table' then is_xlsx = true break end end
  if not is_xlsx then return nil end
  if blk.text:match('[\r\n]%s*number:%s*%S') or blk.text:match('^%s*number:%s*%S') then return nil end
  local label = blk.text:match('[\r\n]%s*label:%s*([%w:_%-]+)') or blk.text:match('^%s*label:%s*([%w:_%-]+)')
  if not label then return nil end
  local num = tbl_numbers()[label]
  if not num then return nil end
  local nb = blk:clone()
  nb.text = blk.text .. '\nnumber: ' .. tostring(num)
  return nb
end

-- rewrite \ref{fig:label}/\Cref{…}/\autoref{…} → the figure number, in both raw-TeX
-- inlines and plain strings (depending on how the reader tokenised the span)
local function resolve_figrefs(blocks)
  local fm = fig_numbers()
  local function sub_str(s)
    return (s:gsub('\\[Cc]?ref%b{}', function(m)
      local key = m:match('{(.-)}')
      return fm[key] or m
    end):gsub('\\autoref%b{}', function(m)
      local key = m:match('{(.-)}')
      return fm[key] or m
    end))
  end
  return pandoc.Pandoc(blocks):walk({
    RawInline = function(el)
      if el.format == 'tex' or el.format == 'latex' then
        local ns = sub_str(el.text)
        if ns ~= el.text then return pandoc.Str(ns) end
      end
    end,
    Str = function(el)
      if el.text:find('\\', 1, true) then
        local ns = sub_str(el.text)
        if ns ~= el.text then return pandoc.Str(ns) end
      end
    end,
  }).blocks
end

local CALLOUT_MS = { manuscript = true, ms = true, revision = true }
local function is_manuscript_cb(blk)
  if blk.t ~= 'CodeBlock' then return false end
  local classes = blk.classes or {}
  if #classes == 0 then return true end
  for _, c in ipairs(classes) do if CALLOUT_MS[c] then return true end end
  return false
end

-- 围栏的"来源标签"：```manuscript/ms/revision/无标签 → "Manuscript"；
-- ```SI/si/supplement/supplementary → "Supplementary Information"。二者拉取方式完全一样
-- （都扫 source/ 找 @id / @fig:label），只是盒子标题不同。非引文围栏返回 nil。
local function fence_src(blk)
  if blk.t ~= 'CodeBlock' then return nil end
  local classes = blk.classes or {}
  if #classes == 0 then return 'Manuscript' end            -- 无标签 = 手稿引文（沿用旧约定）
  for _, c in ipairs(classes) do
    local lc = c:lower()
    if lc == 'manuscript' or lc == 'ms' or lc == 'revision' then return 'Manuscript' end
    if lc == 'si' or lc == 'supplement' or lc == 'supplementary' then return 'Supplementary Information' end
  end
  return nil
end

-- Extract @id references if EVERY non-blank line of the fence body is `@id`.
-- Returns a list of ids, or nil if this fence isn't a reference fence.
local function ref_ids(text)
  local ids, any = {}, false
  for line in (text .. '\n'):gmatch('(.-)\n') do
    local t = trim(line)
    if t ~= '' then
      local id = t:match('^@([%w%-_:]+)$')
      if not id then return nil end   -- a non-@ line ⇒ literal quote, leave to manuscript_cite
      ids[#ids + 1] = id; any = true
    end
  end
  return any and ids or nil
end

-- ── line-number sidecar ───────────────────────────────────────────────────
-- manuscript-lines.sh writes <项目 index 文件夹>/manuscript-lines.json = { ID: {sline,eline,page} }.
-- 若存在则给盒子加 data-page/data-sline/data-eline，responseletter.lua 转成
-- \begin{manuscript}[page=,sline=,eline=]（"Manuscript · Page P, Line S–E"）。缺省则无行号。
-- 正文 span 行号 = manuscript-lines.json；SI span 行号 = si-lines.json（页码各自独立）。
local function read_json_map(fname)
  local m = {}
  local raw = read_all(input_dir() .. '/' .. fname)
  if raw then
    local ok, data = pcall(pandoc.json.decode, raw)
    if ok and type(data) == 'table' then m = data end
  end
  return m
end
local lines_map = nil
local function build_lines()
  if lines_map ~= nil then return lines_map end
  lines_map = read_json_map('manuscript-lines.json')
  return lines_map
end
local si_lines_map = nil
local function build_si_lines()
  if si_lines_map ~= nil then return si_lines_map end
  si_lines_map = read_json_map('si-lines.json')
  return si_lines_map
end

-- 浮动体（图、表、xlsx-table 围栏）不能塞进 tcolorbox 盒子，否则 "Not in outer par mode"。
-- 拉进来时把它们分出去、按普通浮动排（图带手稿号，见 number_figure）。
-- 注意 ```xlsx-table 此刻还是 CodeBlock（xlsx_table.lua 在本 filter 之后才转成表），
-- 若留在盒子里、之后被转成浮动表就会崩，所以这里就先分出去。
local function is_figurish(bl)
  if bl.t == 'Figure' or bl.t == 'Table' then return true end
  if bl.t == 'CodeBlock' then
    for _, c in ipairs(bl.classes or {}) do
      if c:lower() == 'xlsx-table' then return true end
    end
  end
  if (bl.t == 'Para' or bl.t == 'Plain') and #bl.content == 1 and bl.content[1].t == 'Image' then
    return true
  end
  return false
end

-- 给"拉进来的整图"套上手稿真实图号（正文 "1"、SI "S1"），而不是回复信自己的图计数。
-- 做法：把 figure 用 {\renewcommand{\thefigure}{号} … } 局部包住，\caption 就印手稿号；
-- 保留 figure 为真正的 pandoc 元素（让 pandoc 正常解析图片路径），只在前后加裸 LaTeX。
-- 未知图（没抓到号）保持原样（回复信自编号）。返回 block 列表。
local function number_figure(bl)
  -- 场景里内嵌的 ```xlsx-table（随 @id/![[…]] 一起拉进来的表）：注入真实表号，
  -- 否则 xlsx_table.lua 之后渲染成回复信自编的 Table R#。
  if bl.t == 'CodeBlock' then
    return pandoc.List{ number_xlsx_table(bl) or bl }
  end
  if bl.t ~= 'Figure' then return pandoc.List{ bl } end
  local id = bl.identifier
  local num = (id and id ~= '') and fig_numbers()[id] or nil
  if not num then return pandoc.List{ bl } end
  local clean = bl:clone(); clean.identifier = ''       -- 去 \label{fig:x}：号会被覆盖、免重复定义
  -- \addtocounter{figure}{-1}：\caption 会把 figure 计数器 +1，减回来，
  -- 免得拉进来的手稿图占用回复信自有图的 R 序号。
  return pandoc.List{
    pandoc.RawBlock('latex', '{\\renewcommand{\\thefigure}{' .. num .. '}%'),
    clean,
    pandoc.RawBlock('latex', '\\addtocounter{figure}{-1}}'),
  }
end

-- 把拉进来的 blocks 拆成：文字 → Div{.manuscript}（盒子，可带行号），图 → 普通浮动图（带手稿号）。
-- opts = { file=场景, first_id=起始span, last_id=末尾span }（first_id 仅 @id 路径有，用于行号）。
local function box_and_floats(blocks, opts)
  opts = opts or {}
  local text_blocks, fig_blocks = pandoc.List(), pandoc.List()
  for _, bl in ipairs(blocks) do
    if is_figurish(bl) then fig_blocks:extend(number_figure(bl)) else text_blocks:insert(bl) end
  end
  local out = pandoc.List()
  if #text_blocks > 0 then
    local function intstr(n) return n and string.format('%d', math.floor(n + 0.5)) or nil end
    local attrs = { ['data-msid'] = opts.msid or '', ['data-msfile'] = opts.file or '' }
    local box_src = opts.src or 'Manuscript'
    if opts.first_id then
      -- 双查：正文行号(manuscript-lines) 优先；正文没有、SI 有（如 ODD+ 独有片段）
      -- 或围栏显式 ```SI 时，用 SI 行号并把盒子标题改成 "Supplementary Information"——
      -- 否则会误标 Manuscript（且页码是 SI 的页，标 Manuscript 就错了）。
      local ml, sl = build_lines(), build_si_lines()
      local a = ml[opts.first_id]
      local b = opts.last_id and ml[opts.last_id]
      local want_si = (box_src == 'Supplementary Information')
      if (not a or want_si) and sl[opts.first_id] then
        a = sl[opts.first_id]
        b = opts.last_id and sl[opts.last_id]
        box_src = 'Supplementary Information'
      end
      if a then
        if a.fig then
          -- 引自图注的片段没有行号（\linelabel 在 \caption 里不产生行号标签），改标图号
          attrs['data-fig'] = tostring(a.fig)
        else
          if a.page  then attrs['data-page']  = intstr(a.page)  end
          if a.sline then attrs['data-sline'] = intstr(a.sline) end
          local el = (b and b.eline) or a.eline
          if el then attrs['data-eline'] = intstr(el) end
        end
      end
    end
    if box_src ~= 'Manuscript' then attrs['data-src'] = box_src end
    out:insert(pandoc.Div(text_blocks, pandoc.Attr('', { 'manuscript' }, attrs)))
  end
  out:extend(fig_blocks)
  return out
end

-- 图片自带 {#fig:label}，不用再打 <!--ms:--> 标记：扫场景收 label → 该图那行 markdown，
-- 让 @fig:label 直接把整张图（含图注）拉进来。
-- The pandoc-crossref in-caption id form ![cap {#fig:x attrs}](path) only becomes
-- a real figure when pandoc-crossref runs. The response-letter pipeline pulls the
-- figure without crossref, so move the id to the standard after-image position
-- ![cap](path){#fig:x attrs} first. Lines already in standard form pass through.
local function normalize_fig_line(line)
  local cap, id, tail =
    line:match('^(!%[.-)%s*({#fig:[%w_%-]+[^{}]*})%s*(%].*)$')
  if cap and id and tail then return cap .. tail .. id end
  return line
end

local fig_src_cache = nil
local function build_fig_src()
  if fig_src_cache then return fig_src_cache end
  fig_src_cache = {}
  local dir = source_dir()
  local ok, entries = pcall(pandoc.system.list_directory, dir)
  if ok and entries then
    for _, name in ipairs(entries) do
      if name:match('%.md$') then
        local content = read_all(dir .. '/' .. name)
        if content then
          for line in (content:gsub('\r\n', '\n') .. '\n'):gmatch('(.-)\n') do
            -- id may be followed by attributes, e.g. {#fig:x width=70%}
            local label = line:match('{#(fig:[%w_%-]+)[%s}]')
            if label and not fig_src_cache[label] then
              fig_src_cache[label] = normalize_fig_line(line)
            end
          end
        end
      end
    end
  end
  return fig_src_cache
end

local resolve_embed   -- 前向声明；定义在下方"路径 B"（供围栏里放 ![[…]] 时复用）

-- ── 路径 A：```manuscript / ```SI 里 @id 或 ![[…]] ──
--   @<marker>   → <!--ms:marker--> 标记的文字片段（句子级精度 + 行号）
--   @fig:label  → 按图片自带的 {#fig:label} 直接拉整张图（含图注，无需打标）
--   ![[场景#…]] → 块/节/整篇嵌入（用围栏的 src 标签：manuscript / SI）
function CodeBlock(blk)
  local numbered = number_xlsx_table(blk)   -- ```xlsx-table 引用来源表 → 注入真实表号
  if numbered then return numbered end

  local src = fence_src(blk)
  if not src then return nil end

  -- 围栏体若每行都是 ![[…]] 嵌入 → 按嵌入解析（用围栏的 src 标签）
  local embeds, all_embed = {}, true
  for line in (blk.text .. '\n'):gmatch('(.-)\n') do
    local t = trim(line)
    if t ~= '' then
      local s = t:match('^!%[%[(.-)%]%]$')
      if s then embeds[#embeds + 1] = s else all_embed = false; break end
    end
  end
  if all_embed and #embeds > 0 then
    local out = pandoc.List()
    for _, s in ipairs(embeds) do
      local blks = resolve_embed(s, src)
      if blks then out:extend(blks)
      else out:insert(pandoc.Para{ pandoc.Strong{ pandoc.Str('‹unresolved manuscript embed: ' .. s .. '›') } }) end
    end
    return out
  end

  local ids = ref_ids(blk.text)
  if not ids then return nil end       -- literal fence → handled downstream

  local cache = build_cache()
  local blocks = pandoc.List()
  local first_id, first_file, last_id
  for _, id in ipairs(ids) do
    local hit = cache[id]
    local figsrc = (not hit) and build_fig_src()[id] or nil
    if hit then
      first_id = first_id or id
      first_file = first_file or hit.file
      last_id = id
      local sub = pandoc.read(render_placeholders(hit.text), 'markdown')   -- 占位符→数字；citations 由 citeproc 解析
      blocks:extend(resolve_figrefs(sub.blocks))       -- \ref{fig:label} → figure number
    elseif figsrc then
      local sub = pandoc.read(render_placeholders(figsrc), 'markdown')      -- 整张图（含图注），占位符→数字
      blocks:extend(resolve_figrefs(sub.blocks))
    else
      blocks:insert(pandoc.Para{ pandoc.Strong{ pandoc.Str('‹unresolved manuscript ref: @' .. id .. '›') } })
    end
  end
  return box_and_floats(blocks, { msid = first_id or ids[1], file = first_file,
                                  first_id = first_id, last_id = last_id, src = src })
end

-- ── 路径 B：Obsidian 块/节引用 ![[场景#^块ID]] / ![[场景#小标题]] / ![[场景]] ──
-- 无需 HTML 标记、Obsidian 预览即所见。整段/整节/整篇拉进来。
-- （行号只在 @id 那条机制上有；块/节引用先不带行号。）
local function scene_content(target)
  return read_all(source_dir() .. '/' .. target .. '.md')
end

-- 从项目根目录的 SI Index（draftTitle: Supplementary_Information）读它的 scenes 清单，
-- 用来判断某个 ![[场景]] 是不是补充材料 → 盒子标题自动用 "Supplementary Information"。
local si_scenes_cache = nil
local function si_scenes()
  if si_scenes_cache then return si_scenes_cache end
  si_scenes_cache = {}
  local dir = input_dir()   -- 回复信编译笔记同级 = 项目根
  local ok, entries = pcall(pandoc.system.list_directory, dir)
  if not ok or not entries then return si_scenes_cache end
  for _, name in ipairs(entries) do
    if name:match('%.md$') then
      local content = read_all(dir .. '/' .. name)
      if content and content:find('draftTitle:%s*Supplementary') then
        local in_scenes = false
        for line in (content:gsub('\r\n', '\n') .. '\n'):gmatch('(.-)\n') do
          if line:match('^%s*scenes:%s*$') then
            in_scenes = true
          elseif in_scenes then
            local item = line:match('^%s+%-%s+(.+)$')
            if item then
              item = item:gsub('%s+$', ''):gsub('^["\']', ''):gsub('["\']$', '')
              si_scenes_cache[item] = true
            elseif line:match('%S') then
              in_scenes = false          -- 下一个非列表键（如 ignoredFiles:）→ scenes 结束
            end
          end
        end
      end
    end
  end
  return si_scenes_cache
end

local function extract_block(content, blockid)
  content = '\n' .. content:gsub('\r\n', '\n') .. '\n\n'
  for para in content:gmatch('\n(.-)\n\n') do
    local id = para:match('%^([%w%-_]+)%s*$')
    if id == blockid then
      return (para:gsub('%s*%^[%w%-_]+%s*$', ''))
    end
  end
  return nil
end

-- 归一空白：把不换行空格 U+00A0 (\194\160) 当普通空格、并折叠连续空白，
-- 免得标题里混了 NBSP（Obsidian 常见）导致 ![[场景#小标题]] 对不上。
local function norm_ws(s)
  return (s:gsub('\194\160', ' '):gsub('%s+', ' '):gsub('^ ', ''):gsub(' $', ''))
end

local function extract_section(content, heading)
  local target = norm_ws(heading)
  local lines = {}
  for l in (content:gsub('\r\n', '\n') .. '\n'):gmatch('(.-)\n') do lines[#lines + 1] = l end
  local start, level
  for i, l in ipairs(lines) do
    local h, txt = l:match('^(#+)%s+(.-)%s*$')
    if h and norm_ws(txt) == target then start = i; level = #h; break end
  end
  if not start then return nil end
  local out = { lines[start] }                      -- 含小标题本身
  for i = start + 1, #lines do
    local h = lines[i]:match('^(#+)%s')
    if h and #h <= level then break end
    out[#out + 1] = lines[i]
  end
  return table.concat(out, '\n')
end

local function embed_spec(blk)
  local s = trim(pandoc.utils.stringify(blk.content))
  return s:match('^!%[%[(.-)%]%]$')
end

-- 去掉拉进来的文本里残留的段末块 ID（整节/整篇里可能夹着别的 ^id）
local function strip_block_ids(md)
  md = md:gsub('\r\n', '\n')
  md = md:gsub('[ \t]+%^[%w%-_]+[ \t]*\n', '\n')   -- 行末 ^id
  md = md:gsub('[ \t]+%^[%w%-_]+[ \t]*$', '')      -- 文末 ^id
  return md
end

-- 小标题降级成加粗段落：整节引用时不想让手稿小标题变成回复信里带编号的 \section
local function demote_headers(blocks)
  return pandoc.Pandoc(blocks):walk({
    Header = function(h) return pandoc.Para{ pandoc.Strong(h.content) } end,
  }).blocks
end

-- 解析 ![[target#anchor]] → box_and_floats 的 block 列表；不是手稿 scene 返回 nil（调用方决定）。
-- src_override 有值（如围栏 ```SI）就用它当盒子标题，否则按 SI Index 自动判定 manuscript/SI。
resolve_embed = function(spec, src_override)
  spec = spec:gsub('|.*$', '')                      -- 去 |别名
  local target, anchor = spec:match('^(.-)#(.*)$')
  if not target then target, anchor = spec, nil end
  local content = scene_content(target)
  if not content then return nil end                -- 非手稿 scene（图片嵌入等）

  local md, line_id
  if anchor and anchor:match('^%^') then
    local bid = anchor:sub(2)
    md = extract_block(content, bid)                 -- 整段
    line_id = 'blk-' .. bid                          -- 块引用行号 sidecar 键（block_ids.lua 打的 \linelabel）
  elseif anchor and anchor ~= '' then
    md = extract_section(content, anchor)            -- 整节
  else
    md = (content:gsub('^%-%-%-\n.-\n%-%-%-\n', '', 1))  -- 整篇（去 frontmatter）
  end
  if not md or trim(md) == '' then
    return pandoc.List{ pandoc.Para{ pandoc.Strong{ pandoc.Str('‹unresolved manuscript embed: ' .. spec .. '›') } } }
  end
  local sub = pandoc.read(render_placeholders(strip_block_ids(md)), 'markdown')
  local src = src_override or (si_scenes()[target] and 'Supplementary Information' or 'Manuscript')
  return box_and_floats(demote_headers(resolve_figrefs(sub.blocks)),
    { msid = (anchor and anchor:gsub('^%^', '')) or target, file = target, src = src,
      first_id = line_id, last_id = line_id })
end

function Para(blk)
  local spec = embed_spec(blk)
  if not spec then return nil end
  return resolve_embed(spec)     -- nil（非 scene）→ 透传给 responseletter 的图占位逻辑
end

-- 全局再跑一遍图号解析：让作者在回复信正文里手写的 \ref{fig:overview}（正文，→"Figure 1"）
-- 或 \ref{fig:validate}（SI，→"Figure S1"）也自动变成手稿里的真实图号，不只是拉进来的片段。
function Pandoc(doc)
  return pandoc.Pandoc(resolve_figrefs(doc.blocks), doc.meta)
end
