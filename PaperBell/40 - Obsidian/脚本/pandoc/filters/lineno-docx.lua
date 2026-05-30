--[[
  lineno-docx.lua —— Word 导出时添加行号
  
  用法：在 YAML metadata 里设 lineno: true
  效果：Word 文档每页左侧显示行号（逐行编号，每页重新开始）
  
  原理：在文档末尾注入一个连续分节符，其节属性包含行号设置。
  PDF 导出时此 filter 不生效（PDF 靠 LaTeX 的 lineno 包）。
--]]

function Pandoc(doc)
  -- 仅对 docx 生效
  if not FORMAT:match("docx") then return end

  local meta = doc.meta
  if not meta.lineno then return end
  local v = pandoc.utils.stringify(meta.lineno)
  if v ~= "true" and v ~= "yes" then return end

  -- 注入 OOXML：连续分节符 + 行号属性
  local xml = [[
<w:p>
  <w:pPr>
    <w:sectPr>
      <w:type w:val="continuous"/>
      <w:lnNumType w:countBy="1" w:start="0" w:restart="newPage"/>
    </w:sectPr>
  </w:pPr>
</w:p>]]

  doc.blocks:insert(pandoc.RawBlock("openxml", xml))
  return doc
end
