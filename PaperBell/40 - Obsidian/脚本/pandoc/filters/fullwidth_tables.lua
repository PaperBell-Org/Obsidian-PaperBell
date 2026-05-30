-- paperbell_fullwidth_tables.lua
-- 作用：让 Pandoc 导出 docx 时，所有表格列宽总和为 100% 版心宽度。
-- 配合 reference-doc 中的 Table 表格样式形成三线表。

function Table(tbl)
  local n = #tbl.colspecs
  if n == 0 then
    return tbl
  end

  local total = 0
  for _, cs in ipairs(tbl.colspecs) do
    local w = cs[2]
    if type(w) == "number" and w > 0 then
      total = total + w
    end
  end

  for i, cs in ipairs(tbl.colspecs) do
    local align = cs[1]
    local old_width = cs[2]
    local new_width

    if total > 0 and type(old_width) == "number" and old_width > 0 then
      new_width = old_width / total
    else
      new_width = 1 / n
    end

    tbl.colspecs[i] = { align, new_width }
  end

  -- docx writer 会使用 reference-doc 中名为 Table 的表格样式。
  -- 这里保留一个属性标记，便于后续扩展；不依赖它单独生效。
  tbl.attributes["custom-style"] = tbl.attributes["custom-style"] or "Table"

  return tbl
end
