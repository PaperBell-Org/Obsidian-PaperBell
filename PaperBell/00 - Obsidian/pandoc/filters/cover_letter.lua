-- cover_letter.lua
-- 从 cover letter 笔记同目录（必要时向上一层）的 metadata.json 里自动补齐
-- 标题 / 期刊 / 通讯作者 / 通讯邮箱，供 cover_letter.latex 模板使用。
--
-- 注入的键：PaperTitle, JournalName, AuthorName, AuthorEmail
-- 仅在 meta 里「尚无该键」时写入 —— 笔记 frontmatter 优先级更高，可覆盖。
-- 找不到 metadata.json / 解析失败时安静跳过（让 frontmatter / yaml 默认值兜底）。
--
-- 另外：支持在【正文】里用 {{key}} 占位符引用这些值（大小写不敏感），
-- 例如写 "for consideration for publication in *{{JournalName}}*" 会替换成期刊名。
-- 可用键：JournalName / PaperTitle / AuthorName / AuthorEmail，以及任意 frontmatter 顶层键
-- （如 {{manuscript}} / {{to}} / {{date}}）；并提供别名 journal/title/author/email。

local function file_exists(p)
  local f = io.open(p, "r")
  if f then f:close(); return true end
  return false
end

local function read_all(p)
  local f = io.open(p, "r")
  if not f then return nil end
  local s = f:read("a")
  f:close()
  return s
end

local function dirname(path)
  return path:match("^(.*)[/\\][^/\\]*$") or "."
end

-- 定位输入文件所在目录（pandoc 通过 --defaults 调用时 input_files 里是绝对/相对路径）
local function input_dir()
  if PANDOC_STATE and PANDOC_STATE.input_files and PANDOC_STATE.input_files[1] then
    return dirname(PANDOC_STATE.input_files[1])
  end
  return "."
end

-- 在同目录、然后向上一层里找 metadata.json
local function find_metadata()
  local dir = input_dir()
  local candidates = {
    dir .. "/metadata.json",
    dir .. "/../metadata.json",
  }
  for _, c in ipairs(candidates) do
    if file_exists(c) then return c end
  end
  return nil
end

-- 补齐 meta：AssetDir + 从 metadata.json 提取的标题/期刊/通讯作者/邮箱
local function populate_meta(meta)
  -- assets 绝对目录（templates/cover_letter），供模板 \graphicspath / \csvreader 使用。
  -- 用本 filter 自身路径推出，彻底不依赖插件 TEXINPUTS（图/签名/csv 都能零配置找到）。
  if PANDOC_SCRIPT_FILE then
    local fdir = dirname(PANDOC_SCRIPT_FILE)                      -- …/pandoc/filters
    local adir = fdir:gsub("[/\\]filters$", "") .. "/templates/cover_letter"
    -- 用 RawInline 注入，避免 pandoc 把路径里的 _ 转义成 \_（否则 \graphicspath 找不到文件）
    meta.AssetDir = pandoc.MetaInlines({ pandoc.RawInline("latex", adir) })
  end

  local path = find_metadata()
  if not path then return meta end

  local raw = read_all(path)
  if not raw then return meta end

  local ok, data = pcall(pandoc.json.decode, raw)
  if not ok or type(data) ~= "table" then return meta end

  -- 仅当 meta 里没有时才注入（frontmatter 优先）
  local function set_if_absent(key, value)
    if value ~= nil and value ~= "" and meta[key] == nil then
      meta[key] = pandoc.MetaString(tostring(value))
    end
  end

  set_if_absent("PaperTitle", data.title)
  set_if_absent("JournalName", data.journal_title)

  local lf = data._longform
  if type(lf) == "table" then
    -- 通讯作者名：_longform.corresponding[1]
    local corr = lf.corresponding
    if type(corr) == "table" and corr[1] then
      set_if_absent("AuthorName", corr[1])
    elseif type(corr) == "string" then
      set_if_absent("AuthorName", corr)
    end

    -- 通讯邮箱：藏在 _longform.extra_yaml 字符串里的 corresponding_email
    if type(lf.extra_yaml) == "string" then
      local email = lf.extra_yaml:match('corresponding_email:%s*"?([^"\n]+)"?')
      if email then
        email = email:gsub('%s+$', '')
        set_if_absent("AuthorEmail", email)
      end
    end
  end

  return meta
end

-- 用补齐后的 meta 构造 {{key}} → 值 的查找表（键统一小写，附常用别名）
local function build_vars(meta)
  local vars = {}
  for k, v in pairs(meta) do
    if k ~= "AssetDir" then                    -- AssetDir 是内部路径，不暴露给正文
      vars[k:lower()] = pandoc.utils.stringify(v)
    end
  end
  -- 别名：让 {{journal}} / {{title}} 等更顺手地映射到规范键
  local alias = {
    journal = "journalname", journal_name = "journalname",
    title = "papertitle", manuscript = "papertitle", papertitle = "papertitle",
    author = "authorname", corresponding = "authorname",
    email = "authoremail",
  }
  for a, target in pairs(alias) do
    if vars[a] == nil and vars[target] ~= nil then
      vars[a] = vars[target]
    end
  end
  return vars
end

function Pandoc(doc)
  local meta = populate_meta(doc.meta)
  local vars = build_vars(meta)

  -- 在正文里把 {{key}} 替换成对应值（大小写不敏感；找不到就原样保留，便于排错）
  local function subst(el)
    local changed = false
    local new = el.text:gsub("%{%{%s*([%w_%.%-]+)%s*%}%}", function(key)
      local val = vars[key:lower()]
      if val then changed = true; return val end
      return "{{" .. key .. "}}"
    end)
    if changed then return pandoc.Str(new) end
  end

  local blocks = doc:walk({ Str = subst }).blocks
  return pandoc.Pandoc(blocks, meta)
end
