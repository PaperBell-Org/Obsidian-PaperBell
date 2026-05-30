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

  -- 1. 标题 (左对齐：使用标准的一级标题)
  if meta.title then
    top_blocks:insert(pandoc.Header(1, get_inlines(meta.title)))
  end

  -- 2. 作者 (左对齐：使用默认段落格式)
  if meta.authors then
    local author_lines = pandoc.List()
    for i, a in ipairs(meta.authors) do
      if a.name then author_lines:extend(get_inlines(a.name)) end
      if a.affiliation then
         local aff_str = pandoc.utils.stringify(a.affiliation)
         author_lines:insert(pandoc.Superscript(pandoc.Str(aff_str)))
      end
      if a.corresponding then
         author_lines:insert(pandoc.Superscript(pandoc.Str("*")))
      end
      if i < #meta.authors then
         author_lines:insert(pandoc.Str(", "))
         author_lines:insert(pandoc.Space())
      end
    end
    top_blocks:insert(pandoc.Para(author_lines))
  end

  -- 3. 机构 (左对齐)
  if meta.affiliations then
    for _, aff in ipairs(meta.affiliations) do
      local aff_line = pandoc.List()
      if aff.index then
         aff_line:insert(pandoc.Superscript(pandoc.Str(pandoc.utils.stringify(aff.index))))
         aff_line:insert(pandoc.Space())
      end
      if aff.name then aff_line:extend(get_inlines(aff.name)) end
      top_blocks:insert(pandoc.Para(aff_line))
    end
    top_blocks:insert(pandoc.Para({pandoc.Str("")}))
  end

  -- 4. 通讯邮箱 (左对齐)
  if meta.authors then
    for _, a in ipairs(meta.authors) do
      if a.corresponding then
         local corr_line = pandoc.List()
         corr_line:insert(pandoc.Superscript(pandoc.Str("*")))
         corr_line:insert(pandoc.Space())
         corr_line:insert(pandoc.Str("Correspondence: "))
         corr_line:extend(get_inlines(a.corresponding))
         top_blocks:insert(pandoc.Para(corr_line))
      end
    end
    top_blocks:insert(pandoc.Para({pandoc.Str("")}))
  end

  -- 5. 摘要 (强制加上首行缩进！)
  if meta.abstract then
    top_blocks:insert(pandoc.Para({pandoc.Strong({pandoc.Str("Abstract")})}))
    local abs_blocks = pandoc.List()
    if type(meta.abstract) == "table" and meta.abstract.t == "MetaBlocks" then
       abs_blocks:extend(meta.abstract)
    else
       abs_blocks:insert(pandoc.Para(get_inlines(meta.abstract)))
    end
    -- 🛑 核心修复：强制套用 Normal 样式，让摘要段落获得与正文一样的首行缩进
    top_blocks:insert(pandoc.Div(abs_blocks, pandoc.Attr("", {}, {{"custom-style", "Normal"}})))
  end

  -- 6. 关键词
  if meta.keywords then
    local kw_line = pandoc.List()
    kw_line:insert(pandoc.Strong({pandoc.Str("Keywords: ")}))
    for i, kw in ipairs(meta.keywords) do
       kw_line:extend(get_inlines(kw))
       if i < #meta.keywords then kw_line:insert(pandoc.Str("; ")) end
    end
    top_blocks:insert(pandoc.Div({pandoc.Para(kw_line)}, pandoc.Attr("", {}, {{"custom-style", "Normal"}})))
  end

  -- 自动插入分页符 (如果你需要手稿标题页独立，取消下面这行的注释即可)
  -- top_blocks:insert(pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'))

  meta.title = nil
  meta.author = nil
  meta.date = nil
  meta.abstract = nil

  top_blocks:extend(doc.blocks)
  return pandoc.Pandoc(top_blocks, meta)
end
