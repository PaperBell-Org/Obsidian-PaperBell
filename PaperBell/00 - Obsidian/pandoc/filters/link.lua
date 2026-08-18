--[[
 Transform Obsidian wikilinks to Pandoc-recognizable links
 Support combinations of {internal, external} x {no alias, alias} x {file, heading, block} links

  By github.com/zcysxy
--]]

function Link(link)

  -- 如果是外部链接（以 http 开头）
  if link.target:match("^https?://") then
    return pandoc.RawInline("latex", "\\href{" .. link.target .. "}{" .. pandoc.utils.stringify(link.content) .. "}")
  end

  -- 如果是 wikilink
  if link.title == "wikilink" then
    local content = pandoc.utils.stringify(link.content)
    local target = link.target

    -- 处理带有 # 的目标（章节引用）
    if target:match("#") then
      local base, section = target:match("([^#]*)#(.*)")
      if base == "" then
        -- 只有章节引用
        return pandoc.RawInline("latex", "\\hyperref[" .. section .. "]{" .. section .. "}")
      else
        -- 文件名和章节引用
        local display_text = base .. " => " .. section
        return pandoc.RawInline("latex", "\\href{" .. section .. "}{" .. display_text .. "}")
      end
    else
      -- 普通文件引用
      return pandoc.RawInline("latex", "\\href{" .. target .. "}{" .. content .. "}")
    end
  end

  -- 其他情况保持原样
  return link
end

-- Remove block ids
function Inlines(el)
  if next(el) and el[#el].tag == "Str" and el[#el].text:match('^%^') then
    el[#el] = nil
  end
  return el
end
