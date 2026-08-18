--[[
  quotes-i18n.lua — 中英混排引号/撇号本地化（仅 latex / beamer；其它格式原样放行）。

  ⚠ LIBRARY OVERRIDE：本文件比规范源 vault 的同名 filter 更进一步，由
  scripts/sync-pandoc-assets.sh 在每次同步后覆盖回 pandoc-assets/。改这里，别改 pandoc-assets/。
  见 MAINTAINING.md →「Pandoc assets 同步 / Library overrides」。

  修三件事：
  ① smart 在「引号紧贴 CJK」时解析失败（他说"你好" → Str 里两个都成裸 ”，开引号丢失）。
     段落内对「与 CJK 相邻的裸双/单引号」按 open/close 交替，改成正确全角 “ ”/‘ ’。
  ② 成对 Quoted：处在中文句子里（相邻字符 CJK）→ 字面全角、贴紧；
     处在英文句子里 → \textquote…{} 命令（西文字体、间距正常，末尾 {} 防吞后随空格）。
  ③ 英文 Str 里的弯引号/撇号（it's / don't / O'Brien，不邻 CJK）→ 同样换 \textquote 命令。

  与规范源 vault 版的关键区别：英文引号用 \textquote **命令**而非 ``…'' 连字，因此
  **不需要**模板里的 \xeCJKDeclareCharClass{Default} —— 中文引号得以保持全角（vault 版靠
  Default 类修英文，代价是中文引号被排成西文半角、还带空格）。判定上下文只看引号紧邻的可见字符。
]]

local function active()
  return FORMAT and (FORMAT:match('latex') or FORMAT:match('beamer'))
end

local function is_cjk(cp)
  if not cp then return false end
  return (cp >= 0x3400 and cp <= 0x9FFF)
      or (cp >= 0xF900 and cp <= 0xFAFF)
      or (cp >= 0x3000 and cp <= 0x303F)
      or (cp >= 0xFF00 and cp <= 0xFFEF)
      or (cp >= 0x20000 and cp <= 0x2FFFF)
end

local LDQUO, RDQUO = 0x201C, 0x201D   -- “ ”
local LSQUO, RSQUO = 0x2018, 0x2019   -- ‘ ’

-- 西文引号 → LaTeX 命令（Latin 字体、正常间距）
local TQ = {
  [LSQUO] = '\\textquoteleft{}',   [RSQUO] = '\\textquoteright{}',
  [LDQUO] = '\\textquotedblleft{}', [RDQUO] = '\\textquotedblright{}',
}

local function last_cp(s) local cp; for _, c in utf8.codes(s) do cp = c end; return cp end
local function first_cp(s) for _, c in utf8.codes(s) do return c end end

-- 引号紧邻的可见字符是否 CJK（决定上下文语言）
local function ctx_is_cjk(inlines, i)
  for j = i - 1, 1, -1 do
    local s = pandoc.utils.stringify(inlines[j]):gsub('%s+$', '')
    if s ~= '' then return is_cjk(last_cp(s)) end
  end
  for j = i + 1, #inlines do
    local s = pandoc.utils.stringify(inlines[j]):gsub('^%s+', '')
    if s ~= '' then return is_cjk(first_cp(s)) end
  end
  return false
end

-- ② 成对 Quoted：中文 → 字面全角；英文 → \textquote 命令
local function quoted_pass(inlines)
  local out, changed = pandoc.Inlines({}), false
  for i, el in ipairs(inlines) do
    if el.t == 'Quoted' then
      local dq = (el.quotetype == 'DoubleQuote')
      if ctx_is_cjk(inlines, i) then
        out:insert(pandoc.RawInline('latex', utf8.char(dq and LDQUO or LSQUO)))
        out:extend(el.content)
        out:insert(pandoc.RawInline('latex', utf8.char(dq and RDQUO or RSQUO)))
      else
        out:insert(pandoc.RawInline('latex', dq and TQ[LDQUO] or TQ[LSQUO]))
        out:extend(el.content)
        out:insert(pandoc.RawInline('latex', dq and TQ[RDQUO] or TQ[RSQUO]))
      end
      changed = true
    else
      out:insert(el)
    end
  end
  if changed then return out end
  return nil
end

-- ① + ③ Str 层：CJK 相邻裸引号 → 全角交替；英文弯引号/撇号 → 命令
-- 全角引号必须走 RawInline：塞进 pandoc.Str 的话 latex writer 会把 U+201C 又写回 ``。
local function fix_str_text(text, st)
  local cps = {}
  for _, c in utf8.codes(text) do cps[#cps + 1] = c end
  local segs, buf, changed = pandoc.Inlines({}), {}, false
  local function flush()
    if #buf > 0 then segs:insert(pandoc.Str(utf8.char(table.unpack(buf)))); buf = {} end
  end
  for k, c in ipairs(cps) do
    local adj_cjk = is_cjk(cps[k - 1]) or is_cjk(cps[k + 1])
    if adj_cjk and (c == 0x22 or c == LDQUO or c == RDQUO) then       -- " “ ” 邻 CJK
      flush(); segs:insert(pandoc.RawInline('latex', utf8.char(st.d and LDQUO or RDQUO)))
      st.d = not st.d; changed = true
    elseif adj_cjk and (c == 0x27 or c == LSQUO or c == RSQUO) then    -- ' ‘ ’ 邻 CJK
      flush(); segs:insert(pandoc.RawInline('latex', utf8.char(st.s and LSQUO or RSQUO)))
      st.s = not st.s; changed = true
    elseif TQ[c] then                                                 -- 英文弯引号/撇号 → 命令
      flush(); segs:insert(pandoc.RawInline('latex', TQ[c]))
      changed = true
    else
      buf[#buf + 1] = c
    end
  end
  flush()
  if not changed then return nil end
  return segs
end

local function bare_pass(block)
  local st = { d = true, s = true }   -- 每段重置：首个裸引号视为开引号
  return block:walk({ Str = function(s) return fix_str_text(s.text, st) end })
end

function Pandoc(doc)
  if not active() then return nil end
  -- 先 Str 层（裸引号 + 英文撇号），再 Inlines 层（成对 Quoted）
  doc = doc:walk({
    Para = bare_pass, Plain = bare_pass, Header = bare_pass,
    Caption = bare_pass, TableCell = bare_pass,
  })
  doc = doc:walk({ Inlines = quoted_pass })
  return doc
end
