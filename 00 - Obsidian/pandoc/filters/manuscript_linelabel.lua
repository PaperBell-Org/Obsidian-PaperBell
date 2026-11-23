--[[
  manuscript_linelabel.lua — 仅用于"抓行号"那一趟编译（manuscript-lines.sh），
  平时（正常导手稿 PDF）是 no-op。

  只有当元数据 mslabels 为真（脚本用 -M mslabels=true 传入）时，才把
      <!--ms:ID-->      → \linelabel{msl-ID}
      <!--/ms:ID-->     → \linelabel{msl-ID-end}
  \linelabel 是 lineno 包提供的零宽标签：不占空间、不改断行，所以这一趟算出的
  行号与正式 PDF 完全一致；lineno 会把每个 label 的行号/页码写进 .aux，脚本再解析。

  不开 mslabels 时本 filter 什么都不做，标记仍作为 HTML 注释被 pandoc 丢弃。
]]

local function on(meta)
  local v = meta.mslabels
  if v == nil then return false end
  local s = pandoc.utils.stringify(v):lower():gsub('%s+', '')
  return s == 'true' or s == 'yes' or s == '1'
end

-- 把一个 <!--ms:ID-->/<!--/ms:ID--> 标记（RawBlock 或 RawInline）翻成对应的
-- \linelabel latex 串；不是标记则返回 nil。开标记 → msl-ID，闭标记 → msl-ID-end。
local function label_for(el)
  if el.format ~= 'html' then return nil end
  local id = el.text:match('^<!%-%-ms:([%w%-_]+)%-%->$')
  if id then return '\\linelabel{msl-' .. id .. '}' end
  local endid = el.text:match('^<!%-%-/ms:([%w%-_]+)%-%->$')
  if endid then return '\\linelabel{msl-' .. endid .. '-end}' end
  return nil
end

local function is_para(b) return b and (b.t == 'Para' or b.t == 'Plain') end

-- 段首的 <!--ms:ID--> 会被 pandoc 解析成块级 RawBlock（在段落之前独立成块），而非段内
-- RawInline，于是逃过下面的 RawInline 转换、被当 html 块丢掉——.aux 里就只剩 -end 标签、
-- 起始行号缺失，manuscript-lines.sh 兜底把 sline 填成 eline，导致「起止行号相同」。
-- 这里在块级把这类标记 RawBlock 搬进相邻段落，变回行内 \linelabel：
--   开标记 → 后一个 Para/Plain 的最前面（片段正文正从这里开始）；
--   闭标记 → 前一个 Para/Plain 的末尾（闭标记单独成段时才会走到）。
local function relocate(blocks)
  local res = pandoc.List()
  for i, b in ipairs(blocks) do
    local latex = (b.t == 'RawBlock') and label_for(b) or nil
    if latex and latex:match('%-end}$') then          -- 闭标记 → 前段末尾
      if is_para(res[#res]) then res[#res].content:insert(pandoc.RawInline('latex', latex))
      else res:insert(pandoc.RawBlock('latex', latex)) end
    elseif latex then                                 -- 开标记 → 后段开头
      local nxt = blocks[i + 1]
      if is_para(nxt) then nxt.content:insert(1, pandoc.RawInline('latex', latex))
      elseif is_para(res[#res]) then res[#res].content:insert(pandoc.RawInline('latex', latex))
      else res:insert(pandoc.RawBlock('latex', latex)) end
    else
      res:insert(b)
    end
  end
  return res
end

function Pandoc(doc)
  if not on(doc.meta) then return doc end           -- 平时（正常导 PDF）仍是 no-op
  doc = doc:walk({ Blocks = relocate })             -- 先把段首/段末的块级标记搬进段落
  return doc:walk({
    RawInline = function(el)                        -- 再转段内标记（原逻辑）
      local latex = label_for(el)
      if latex then return pandoc.RawInline('latex', latex) end
      return nil
    end,
  })
end
