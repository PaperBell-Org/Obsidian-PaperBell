--[[ demo-docx.lua —— 文档头部信息生成 作用： 读取 YAML 中的标题、摘要和关键词， 将其插入正文开头，并套用 Word 模板中的对应样式。 ]]

function Pandoc(doc)
  local meta = doc.meta
  local top_blocks = pandoc.List()

  local function get_inlines(val)
    if type(val) == "table" then
       if val.t == "MetaInlines" then return val end
       if val.t == "MetaString" then return pandoc.List{pandoc.Str(val)} end
       if #val > 0 then return val end
    elseif type(val) == "string" then
       return pandoc.List{pandoc.Str(val)}
    end
    return pandoc.List{pandoc.Str(tostring(val))}
  end

  local function styled_para(style_name, inlines)
    return pandoc.Div({pandoc.Para(inlines)}, pandoc.Attr("", {}, {{"custom-style", style_name}}))
  end

  -- 1. 插入标题 (强制套用 Title 样式以自动居中)
  if meta.title then
    top_blocks:insert(styled_para("Title", get_inlines(meta.title)))
  end

  -- 🛑 展示版本：跳过所有的 meta.authors 和 meta.affiliations 处理

  -- 2. 插入摘要 (强制套用 Normal 样式继承首行缩进)
  if meta.abstract then
    top_blocks:insert(styled_para("Abstract Title", {pandoc.Str("Abstract")}))
    local abs_blocks = pandoc.List()
    if type(meta.abstract) == "table" and meta.abstract.t == "MetaBlocks" then
       abs_blocks:extend(meta.abstract)
    else
       abs_blocks:insert(pandoc.Para(get_inlines(meta.abstract)))
    end
    top_blocks:insert(pandoc.Div(abs_blocks, pandoc.Attr("", {}, {{"custom-style", "Normal"}})))
  end

  -- 3. 插入关键词 (紧凑排版)
  if meta.keywords then
    local kw_line = pandoc.List()
    kw_line:insert(pandoc.Strong({pandoc.Str("Keywords: ")}))
    for i, kw in ipairs(meta.keywords) do
       kw_line:extend(get_inlines(kw))
       if i < #meta.keywords then kw_line:insert(pandoc.Str("; ")) end
    end
    top_blocks:insert(styled_para("Normal", kw_line))
  end

  top_blocks:insert(pandoc.Para({pandoc.Str("")}))

  -- 擦除原生元数据
  meta.title = nil
  meta.author = nil
  meta.date = nil
  meta.abstract = nil

  top_blocks:extend(doc.blocks)
  return pandoc.Pandoc(top_blocks, meta)
end

