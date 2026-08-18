--[[
  Transform Obsidian Plugins' code blocks

  Currently supports:
  - TikZ
  - Pseudocode

  By github.com/zcysxy
--]]

function CodeBlock(el)
  local class = el.attr.classes[1]
  --[[
    For Pseudocode, you can put addtional LaTeX commands after "\begin{algorithm}%".
    Specifically, you can use "\label{...}" to label the pseudocode block.
  --]]
  if class == "pseudo" then
    return pandoc.RawBlock("latex", el.text
      :gsub("%%\\label", "\\label")
      :gsub("\\begin{algorithm}%%", "\\begin{algorithm}"))

  --[[
    For TikZ, you can put addtional LaTeX commands after "\begin{document}%" and "\end{document}%".
    Specifically, "\caption{...}" and "\centering" are transformed regardless of their positions.
    And you can add "\label{...}" at the same line as "\caption".
    Note that "\usepackage{...}" are removed; re-add them in the frontmatter.
  --]]
  elseif class == "tikz" then
    return pandoc.RawBlock("latex", el.text
      :gsub("\\begin{document}%%", "")
      :gsub("\\end{document}%%", "")
      :gsub("\\usepackage[^\n]*", "")
      :gsub("%%\\caption", "\\caption")
      :gsub("%%\\centering", "\\centering")
      :gsub("\\begin{document}", "\\begin{figure}[ht]")
      :gsub("\\end{document}", "\\end{figure}"))
  else
    return el
  end
end
