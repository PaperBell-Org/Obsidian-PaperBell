--[[ figures-at-end.lua —— 图表后置处理 作用： 根据 YAML 开关，将正文中的图片和表格统一移动到文末， 同时尽量保留图题、表题和交叉引用结构。 ]]

local move_figures = false
local move_tables = false

function Meta(meta)
  if meta["figures-at-end"] then
    local v = pandoc.utils.stringify(meta["figures-at-end"])
    move_figures = (v == "true" or v == "yes")
  end
  if meta["tables-at-end"] then
    local v = pandoc.utils.stringify(meta["tables-at-end"])
    move_tables = (v == "true" or v == "yes")
  end
  return meta
end

function Pandoc(doc)
  if not move_figures and not move_tables then return doc end

  local collected_figures = pandoc.List()
  local collected_tables = pandoc.List()

  -- 自定义 Top-down 遍历引擎，防止破坏容器结构
  local function walk_blocks(blocks)
    local out = pandoc.List()
    for _, block in ipairs(blocks) do
      local is_fig = false
      local is_tbl = false

      -- 1. 识别整体图表容器或原生对象
      if move_figures then
        if block.tag == "Figure" then
          is_fig = true
        elseif block.tag == "Div" and (block.classes:includes("figure") or (block.identifier and block.identifier:match("^fig:"))) then
          -- 成功捕获 pandoc-crossref 的整体打包容器！
          is_fig = true
        elseif block.tag == "Para" or block.tag == "Plain" then
          -- 兜底逻辑：普通无图名的图片段落
          for _, inline in ipairs(block.content) do
            if inline.tag == "Image" then
              is_fig = true
              break
            end
          end
        end
      end

      if move_tables and not is_fig then
        if block.tag == "Table" then
          is_tbl = true
        elseif block.tag == "Div" and (block.classes:includes("table") or (block.identifier and block.identifier:match("^tbl:"))) then
          is_tbl = true
        end
      end

      -- 2. 整体提取或继续深挖
      if is_fig then
        collected_figures:insert(block)
      elseif is_tbl then
        collected_tables:insert(block)
      else
        -- 仅对普通容器往下深挖，防止漏掉被普通 Div 包裹的内容
        if block.tag == "Div" or block.tag == "BlockQuote" then
          block.content = walk_blocks(block.content)
        end
        out:insert(block)
      end
    end
    return out
  end

  -- 执行全文档遍历和提取
  doc.blocks = walk_blocks(doc.blocks)

  -- 3. 统一放置到文档末尾（保持原样，无额外空行）
  if #collected_figures > 0 then
    doc.blocks:insert(pandoc.Header(1, pandoc.Str("Figures")))
    for _, fig in ipairs(collected_figures) do
      doc.blocks:insert(fig)
    end
  end

  if #collected_tables > 0 then
    doc.blocks:insert(pandoc.Header(1, pandoc.Str("Tables")))
    for _, tbl in ipairs(collected_tables) do
      doc.blocks:insert(tbl)
    end
  end

  return doc
end

-- 废弃默认的 Blocks 函数，完全接管 Pandoc 层级
return {
  { Meta = Meta },
  { Pandoc = Pandoc },
}
