-- 屏蔽所有不想出现的元素

-- 屏蔽 `=(this.abstract)`
-- > [!abstract]
-- >
-- > `=(this.abstract)`

function BlockQuote(elem)
  -- 检查是否是 callout（以 [! 开头）
  local first_line = pandoc.utils.stringify(elem.content[1])
  if first_line:match("^%[%!") then
    -- 检查 callout 内容是否包含 dataview 代码
    for _, block in ipairs(elem.content) do
      local text = pandoc.utils.stringify(block)
      if text:match("`=%(?.*%)?`") then
        io.stderr:write("Found dataview in callout, removing entire block\n")
        return nil  -- 屏蔽整个 callout
      end
    end
  end

  return nil
end

function Code(elem)
  -- 屏蔽 Dataview 相关的内联代码
  if elem.text:match("^=%(") then
    return pandoc.Str("")  -- 返回空字符串
  end
  return elem
end

function CodeBlock(elem)
  -- 屏蔽 Dataview 代码块
  if elem.text:match("^=%(?") or
     elem.text:match("^```dataview") then
    return pandoc.Str("")
  end
  return elem
end

function Link(elem)
  -- 屏蔽特定格式的链接
  if elem.target:match("^%^%w+$") then  -- 匹配 Obsidian 引用链接 (^xxxxx)
    return pandoc.Str("")
  end
  return elem
end

-- 如果需要屏蔽整个段落，可以这样：
function Para(elem)
  -- 检查段落是否只包含要屏蔽的内容
  local text = pandoc.utils.stringify(elem)
  if text:match("^`=%(?.*%)?`%s*$") then  -- 匹配只包含 Dataview 内联代码的段落
    return nil
  end
  return elem
end
