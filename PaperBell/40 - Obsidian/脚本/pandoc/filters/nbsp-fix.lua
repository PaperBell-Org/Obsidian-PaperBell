--[[
  nbsp-fix.lua —— 修复 Pandoc / Obsidian / Word 导出中的 NBSP 问题

  作用：
    1. 将 HTML 实体 &nbsp; / &#160; / &#xA0; / &#8239; / &#x202F; 归一化
    2. 将 Unicode 不换行空格 U+00A0、窄不换行空格 U+202F 转成普通空格
    3. 清除零宽不换行空格 / BOM：U+FEFF
    4. 把 Str 内的空格重新拆成 Pandoc 的 Space 节点，避免 Word 中残留不可见 NBSP
    5. 折叠连续 Space，减少多余空格

  建议位置：
    放在 cjk_format.lua 前面：
      --lua-filter=nbsp-fix.lua
      --lua-filter=cjk_format.lua

  可选 YAML：
    nbsp-mode: space      # 默认：把 NBSP 转普通空格
    # nbsp-mode: remove   # 可选：直接删除 NBSP
    nbsp-collapse: true   # 默认：折叠连续空格
--]]

local nbsp_mode = "space"
local collapse_spaces = true

local NBSP  = utf8.char(0x00A0) -- no-break space
local NNBSP = utf8.char(0x202F) -- narrow no-break space
local FEFF  = utf8.char(0xFEFF) -- zero-width no-break space / BOM

local function meta_bool(v, default)
  if v == nil then return default end
  local s = pandoc.utils.stringify(v):lower()
  return s == "true" or s == "yes" or s == "1"
end

function Meta(meta)
  if meta["nbsp-mode"] then
    local v = pandoc.utils.stringify(meta["nbsp-mode"]):lower()
    if v == "remove" or v == "delete" or v == "strip" then
      nbsp_mode = "remove"
    else
      nbsp_mode = "space"
    end
  end
  collapse_spaces = meta_bool(meta["nbsp-collapse"], true)
  return meta
end

local function replacement()
  if nbsp_mode == "remove" then
    return ""
  end
  return " "
end

local function normalize_nbsp_text(s)
  local r = replacement()

  -- Unicode NBSP variants
  s = s:gsub(NBSP, r)
       :gsub(NNBSP, r)
       :gsub(FEFF, "")

  -- HTML entity variants that sometimes survive as literal text/raw HTML
  s = s:gsub("&nbsp;", r)
       :gsub("&#160;", r)
       :gsub("&#xA0;", r)
       :gsub("&#xa0;", r)
       :gsub("&#8239;", r)
       :gsub("&#x202F;", r)
       :gsub("&#x202f;", r)

  return s
end

local function contains_nbsp_like(s)
  return s:find(NBSP, 1, true)
      or s:find(NNBSP, 1, true)
      or s:find(FEFF, 1, true)
      or s:find("&nbsp;", 1, true)
      or s:find("&#160;", 1, true)
      or s:find("&#xA0;", 1, true)
      or s:find("&#xa0;", 1, true)
      or s:find("&#8239;", 1, true)
      or s:find("&#x202F;", 1, true)
      or s:find("&#x202f;", 1, true)
end

-- 将含普通空格的字符串拆成 Str / Space，避免把空格继续藏在 Str 里
local function text_to_inlines(s)
  local out = pandoc.List()
  local i = 1

  while i <= #s do
    local a, b = s:find(" +", i)
    if not a then
      local rest = s:sub(i)
      if rest ~= "" then
        out:insert(pandoc.Str(rest))
      end
      break
    end

    if a > i then
      out:insert(pandoc.Str(s:sub(i, a - 1)))
    end

    if collapse_spaces then
      out:insert(pandoc.Space())
    else
      for _ = a, b do
        out:insert(pandoc.Space())
      end
    end

    i = b + 1
  end

  if #out == 0 then
    return pandoc.Str("")
  elseif #out == 1 then
    return out[1]
  else
    return out
  end
end

function Str(el)
  if not contains_nbsp_like(el.text) then
    return el
  end

  local s = normalize_nbsp_text(el.text)
  return text_to_inlines(s)
end

function RawInline(el)
  if not el.format:match("html") then
    return el
  end

  if not contains_nbsp_like(el.text) then
    return el
  end

  local s = normalize_nbsp_text(el.text)

  -- 只处理纯 NBSP 实体；其他复杂 HTML 保持原样，避免误伤标签结构
  if s:match("^%s*$") then
    if nbsp_mode == "remove" then
      return pandoc.Str("")
    end
    return pandoc.Space()
  end

  return el
end

-- 折叠相邻 Space；不处理 Code / CodeBlock / Math，避免破坏代码和公式
function Inlines(inlines)
  if not collapse_spaces then
    return inlines
  end

  local out = pandoc.List()
  local prev_space = false

  for _, el in ipairs(inlines) do
    if el.tag == "Space" then
      if not prev_space then
        out:insert(el)
        prev_space = true
      end
    else
      out:insert(el)
      prev_space = false
    end
  end

  return out
end

return {
  { Meta = Meta },
  { Str = Str, RawInline = RawInline },
  { Inlines = Inlines },
}
