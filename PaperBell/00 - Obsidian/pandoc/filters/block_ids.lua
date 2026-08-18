-- block_ids.lua
-- 从手稿/SI 导出里剥掉行尾的 Obsidian 块 ID（^blockid），否则 pandoc 会把它当字面
-- 文本印进 PDF。块 ID 是为了让回复信用 ![[场景#^blockid]] 整段引用而加在段末的。
-- 只删「段落末尾、独立成 Str 的 ^blockid」；正文里正常的 x^2^ 上标是 Superscript，不受影响。
--
-- 抓行号那一趟（manuscript-lines.sh，-M mslabels=true）额外在该段首/段尾插入零宽
--   \linelabel{msl-blk-<id>}  (段首→sline)   \linelabel{msl-blk-<id>-end} (段尾→eline)
-- 让 ![[场景#^blockid]] 整段引用也能自动带行号（与 <!--ms:--> 片段同一套 sidecar）。
-- 不开 mslabels 时只剥 ID、不插标签，正式 PDF 不变。

local function on(meta)
  local v = meta.mslabels
  if v == nil then return false end
  local s = pandoc.utils.stringify(v):lower():gsub('%s+', '')
  return s == 'true' or s == 'yes' or s == '1'
end

local function strip(el, mslabels)
  local c = el.content
  local n = #c
  if n >= 1 and c[n].t == 'Str' and c[n].text:match('^%^[%w%-_]+$') then
    local id = c[n].text:sub(2)
    c:remove(n)
    if #c >= 1 and c[#c].t == 'Space' then c:remove(#c) end
    if mslabels then
      c:insert(pandoc.RawInline('latex', '\\linelabel{msl-blk-' .. id .. '-end}'))   -- 段尾 → eline
      c:insert(1, pandoc.RawInline('latex', '\\linelabel{msl-blk-' .. id .. '}'))     -- 段首 → sline
    end
    return el
  end
  return nil
end

function Pandoc(doc)
  local ms = on(doc.meta)
  return doc:walk({
    Para  = function(el) return strip(el, ms) end,
    Plain = function(el) return strip(el, ms) end,
  })
end
