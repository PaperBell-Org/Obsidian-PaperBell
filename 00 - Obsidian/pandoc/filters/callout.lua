--[[
  Pandoc filter for Obsidian callouts

  Note: Remember to leave one blank line between the callout title and content
  Note: You can use Obsidian block-ID as label for the LaTeX environment

  Special callout types
  - remark, rmk
  - question, qn
  - important, impt
  - example, ex
  - meta, x
  - theorem, thm
  - definition, def
  - assumption, asmp
  - abstract

  By github.com/zcysxy
--]]

-- local logging = require "logging"

function BlockQuote(elem)
  -- Transform callout type to titlecase
  local function titlecase(str)
    return str:sub(1, 1):upper() .. str:sub(2, -1)
  end

  -- Check if the callout type is in a list
  local function has_value(tab, val)
    for index, value in ipairs(tab) do
      if value == val then
        return true
      end
    end
    return false
  end

  -- Parse callout title
  local function get_raw_tex(para)
    para.content = para.content:walk {
      Math = function(el) return "$" .. el.text .. "$" end,
      Emph = function(el) return "\\textit{" .. pandoc.utils.stringify(el.content) .. "}" end,
      Strong = function(el) return "\\textbf{" .. pandoc.utils.stringify(el.content) .. "}" end,
      Code = function(el) return "\\textit{" .. el.text .. "}" end
    }
    return para
  end

  -- callout_type = elem.content[1].content[1].text:match("^%[%!([a-z0-9%-]*)%]")
  callout_type = pandoc.utils.stringify(elem.content[1].content[1])
  callout_type = callout_type:match("^%[%!([a-z0-9%-]*)%]")

  -- Plain blockquote
  if not callout_type then
    return elem
  else
    -- Special callout types
    if has_value({ "rmk", "remark", "conclusion", }, callout_type) then
      block_color = "red"
      callout_type = "Remark"
    elseif has_value({ "qn", "question" }, callout_type) then
      block_color = "orange"
      callout_type = "Question"
    elseif has_value({ "impt", "important", "def", "definition", "highlight" }, callout_type) then
      block_color = "yellow!80!white"
      callout_type = "Important"
    elseif has_value({ "ex", "example", "quote", }, callout_type) then
      block_color = "green"
      callout_type = "Example"
    elseif has_value({ "meta", "x" }, callout_type) then
      return {}
    else
      block_color = "cyan!70!white"
    end
    callout_type = titlecase(callout_type)

    -- Get callout title
    callout_title = pandoc.utils.stringify(get_raw_tex(elem.content[1]))
    callout_title = callout_title:gsub("^%[%!([a-z0-9%-]*)%][%+%-]? ?", "")
    title, id = callout_title:match("(.*) *^([0-9a-zA-Z-]*)")
    if title then
      callout_title = title
    end

    table.remove(elem.content, 1)
    title_only = next(elem.content) == nil

    -- Special callout types
    if callout_type == "Abstract" then
      latex_begin_string = "\\begin{abstract}"
      latex_end_string = "\\end{abstract}"
    elseif has_value({ "Assumption", "Asmp" }, callout_type) then
      latex_begin_string = "\\begin{assumption}[" .. callout_title .. "]"
      latex_end_string = "\\end{assumption}"
    elseif has_value({ "Definition", "Def" }, callout_type) then
      latex_begin_string = "\\begin{definition}[" .. callout_title .. "]"
      latex_end_string = "\\end{definition}"
    elseif has_value({ "Theorem", "Thm" }, callout_type) then
      latex_begin_string = "\\begin{theorem}[" .. callout_title .. "]"
      latex_end_string = "\\end{theorem}"
    elseif has_value({ "Fact" }, callout_type) then
      latex_begin_string = "\\begin{fact}[" .. callout_title .. "]"
      latex_end_string = "\\end{fact}"
    elseif has_value({ "Prop", "Proposition" }, callout_type) then
      latex_begin_string = "\\begin{proposition}[" .. callout_title .. "]"
      latex_end_string = "\\end{proposition}"
    elseif has_value({ "Pf", "Proof" }, callout_type) then
      latex_begin_string = "\\begin{proof}"
      latex_end_string = "\\end{proof}"
    else
      if title_only then
        latex_begin_string_template =
        "\\begin{tcolorbox}[noparskip,breakable,coltitle=black,colback=%s!5!white,colframe=%s,fonttitle=\\bfseries] %s"
      else
        latex_begin_string_template =
        "\\begin{tcolorbox}[noparskip,breakable,coltitle=black,colback=%s!5!white,colframe=%s,title=%s,fonttitle=\\bfseries]"
      end
      latex_end_string = "\\end{tcolorbox}"
      if callout_title:match('[^%s]') then
        latex_begin_string = string.format(latex_begin_string_template, block_color, block_color, callout_title)
      else -- use type as title
        latex_begin_string = string.format(latex_begin_string_template, block_color, block_color, callout_type)
      end
    end

    -- Use Obsidian ID as label
    if id then
      latex_begin_string = latex_begin_string .. "\\label{" .. id .. "}"
    end

    return { pandoc.RawBlock("latex", latex_begin_string) } ..
        elem.content ..
        { pandoc.RawBlock("latex", latex_end_string) }
  end
end
