--[[
  cjk-format-fix.lua —— 中英文混排自动排版
  适用于 Obsidian/PaperBell 的 pandoc 导出（docx / pdf 通用）

  规则：
    1. 中英文间距：汉字 ↔ 字母数字 之间插空格（含跨行内元素边界）
    2. 半角 → 全角：中文语境（至少一侧汉字），半角标点转全角
    3. 全角 → 半角：英文语境（两侧都不是汉字），全角标点转回半角
    4. 全角标点两侧多余空格清除（Inlines 级 + Str 级）
    5. 英文半角标点后补空格（Hello,world → Hello, world）
    6. 小数点/千分位保护（3.14、1,000 不误转）
  跳过：Code / CodeBlock / Math / RawInline

--]]

-- ========== 字符判定 ==========
local function is_han(cp)
  return (cp >= 0x4E00 and cp <= 0x9FFF)
      or (cp >= 0x3400 and cp <= 0x4DBF)
      or (cp >= 0x3040 and cp <= 0x30FF)
      or (cp >= 0xF900 and cp <= 0xFAFF)
      or (cp >= 0x20000 and cp <= 0x2A6DF)
end

local function is_alnum(cp)
  return (cp >= 0x30 and cp <= 0x39)
      or (cp >= 0x41 and cp <= 0x5A)
      or (cp >= 0x61 and cp <= 0x7A)
end

local function is_digit(cp) return cp >= 0x30 and cp <= 0x39 end

-- CJK 全角标点（这些两侧不该有多余空格）
local function is_cjk_punct(cp)
  return (cp >= 0x3000 and cp <= 0x303F)   -- 、。「」【】等
      or (cp >= 0xFF01 and cp <= 0xFF60)   -- ，。！？（）等全角 ASCII
end

-- ========== 标点映射 ==========
local HALF2FULL = {
  [string.byte(",")] = "，", [string.byte(";")] = "；",
  [string.byte(":")] = "：", [string.byte("?")] = "？",
  [string.byte("!")] = "！", [string.byte("(")] = "（",
  [string.byte(")")] = "）",
}

local FULL2HALF_CP = {}
do
  local m = {
    ["，"] = ",", ["；"] = ";", ["："] = ":",
    ["？"] = "?", ["！"] = "!", ["（"] = "(",
    ["）"] = ")", ["。"] = ".",
  }
  for full, half in pairs(m) do
    for _, c in utf8.codes(full) do FULL2HALF_CP[c] = half end
  end
end

local NEED_SPACE_AFTER = {
  [string.byte(",")] = true, [string.byte(";")] = true,
  [string.byte(":")] = true, [string.byte(".")] = true,
  [string.byte("?")] = true, [string.byte("!")] = true,
}

-- ========== 核心：codepoint 级处理 ==========
local function process_str(s)
  local cps = {}
  for _, c in utf8.codes(s) do cps[#cps+1] = c end
  local out = {}

  for i, cp in ipairs(cps) do
    local prev = cps[i-1]
    local nxt  = cps[i+1]

    -- (a) 全角标点在英文语境 → 转半角
    if FULL2HALF_CP[cp] then
      local p_han = prev and is_han(prev)
      local n_han = nxt and is_han(nxt)
      if not p_han and not n_han then
        -- 全角标点前多余空格回退
        if out[#out] == " " then out[#out] = nil end
        local half = FULL2HALF_CP[cp]
        out[#out+1] = half
        -- 英文标点后：下一个是字母数字且不是数字紧邻 . , 时补空格
        if nxt and is_alnum(nxt) and NEED_SPACE_AFTER[string.byte(half)] then
          if not (is_digit(nxt) and (half == "." or half == ",")) then
            out[#out+1] = " "
          end
        end
      else
        -- 至少一侧是汉字 → 保留全角，清除前方多余空格
        if out[#out] == " " then out[#out] = nil end
        out[#out+1] = utf8.char(cp)
      end
      goto continue
    end

    -- (b) 半角标点 → 全角（中文语境）
    local converted = nil
    if HALF2FULL[cp] and ((prev and is_han(prev)) or (nxt and is_han(nxt))) then
      if (cp == string.byte(",") or cp == string.byte("."))
          and prev and nxt and is_digit(prev) and is_digit(nxt) then
        -- 小数点 / 千分位保护
      else
        converted = HALF2FULL[cp]
      end
    end

    -- (c) 句号特殊处理
    if not converted and cp == string.byte(".")
        and ((prev and is_han(prev)) or (nxt and is_han(nxt)))
        and not (prev and nxt and is_digit(prev) and is_digit(nxt)) then
      converted = "。"
    end

    if converted then
      if out[#out] == " " then out[#out] = nil end
      out[#out+1] = converted
    else
      -- (d) 中英文间距
      if prev and (
           (is_han(prev) and is_alnum(cp)) or
           (is_alnum(prev) and is_han(cp))
         ) then
        out[#out+1] = " "
      end

      -- (e) 英文标点后补空格
      if prev and NEED_SPACE_AFTER[prev] and is_alnum(cp) then
        -- 排除: 前面是数字相关的 . 或 ,（小数 / 千分位）
        local pprev = cps[i-2]
        if not (is_digit(cp) and (prev == string.byte(".") or prev == string.byte(","))
                and pprev and is_digit(pprev)) then
          -- 排除: 前面不是汉字上下文的标点（已被转全角了就不会到这里）
          if not is_han(prev) then
            if out[#out] ~= " " then
              out[#out+1] = " "
            end
          end
        end
      end

      out[#out+1] = utf8.char(cp)
    end

    ::continue::
  end
  return table.concat(out)
end

-- ========== Str 级处理 ==========
function Str(el)
  el.text = process_str(el.text)
  return el
end

-- ========== Inlines 级处理 ==========
local function first_cp(s)
  for _, c in utf8.codes(s) do return c end
end
local function last_cp(s)
  local last
  for _, c in utf8.codes(s) do last = c end
  return last
end

local function edge_cp(inline, which)
  local t = inline.tag
  if t == "Str" then
    return which == "tail" and last_cp(inline.text) or first_cp(inline.text)
  elseif t == "Code" then
    return which == "tail" and last_cp(inline.text) or first_cp(inline.text)
  elseif t == "Emph" or t == "Strong" or t == "Underline"
      or t == "Strikeout" or t == "Link" or t == "Span" or t == "Quoted" then
    local inner = inline.content
    if not inner or #inner == 0 then return nil end
    local idx = which == "tail" and #inner or 1
    return edge_cp(inner[idx], which)
  elseif t == "Math" then
    return 0x41  -- 公式视作西文
  end
  return nil
end

function Inlines(inlines)
  local out = {}
  for i = 1, #inlines do
    local cur = inlines[i]
    local prv = inlines[i-1]
    local nxt = inlines[i+1]

    -- 清除全角标点旁的 Space 元素
    if cur.tag == "Space" then
      -- 前一个元素尾部是全角标点 → 跳过此 Space
      if prv then
        local a = edge_cp(prv, "tail")
        if a and is_cjk_punct(a) then goto skip end
      end
      -- 后一个元素头部是全角标点 → 跳过此 Space
      if nxt then
        local b = edge_cp(nxt, "head")
        if b and is_cjk_punct(b) then goto skip end
      end
    end

    -- 中英文间距：跨元素边界补空格
    if prv then
      local a = edge_cp(prv, "tail")
      local b = edge_cp(cur, "head")
      if a and b then
        if (is_han(a) and is_alnum(b)) or (is_alnum(a) and is_han(b)) then
          out[#out+1] = pandoc.Space()
        end
      end
    end

    out[#out+1] = cur
    ::skip::
  end
  return out
end

-- 跳过这些环境
function Code(el)      return el end
function CodeBlock(el) return el end
function Math(el)      return el end
function RawInline(el) return el end
function RawBlock(el)  return el end