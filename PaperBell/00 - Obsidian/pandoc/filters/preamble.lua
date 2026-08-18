--[[
  Reusable LaTeX preambles
  Source the preamble file specified in the defaults file or the frontmatter

  By github.com/zcysxy
--]]

user_dir = PANDOC_STATE['user_data_dir']:gsub(" ", "\\space "):gsub("~", "\\string~") .. "/"
basic_preamble = [[
\usepackage{xcolor}
\usepackage{tcolorbox}
\tcbuselibrary{skins,breakable}
\usepackage{algorithm}
\usepackage[noEnd=false,indLines=false]{algpseudocodex}
\usepackage{tikz}
\usepackage{amsthm}
\newtheorem{theorem}{Theorem}[section]
\newtheorem{fact}{Fact}[section]
\newtheorem{proposition}{Proposition}[section]
\theoremstyle{definition}
\newtheorem{definition}{Definition}[section]
\newtheorem{assumption}{Assumption}[section]
\usepackage[normalem]{ulem} % use normalem to protect \emph
\usepackage{soul}
\usepackage{pdflscape} % landscape pages for wide tables (xlsx-table landscape: true)
\renewcommand\hl{\bgroup\markoverwith
  {\textcolor{yellow}{\rule[-.5ex]{2pt}{2.5ex}}}\ULon}
]]


local function truthy(v)
	if v == true then return true end
	if v == nil or v == false then return false end
	local s = pandoc.utils.stringify(v):lower()
	return s == "true" or s == "yes" or s == "1" or s == "on"
end

function Meta (m)
    local header = m['header-includes'] and m['header-includes'] or pandoc.List()
	table.insert(header, 1, pandoc.RawBlock("tex", basic_preamble))

    -- `supplementary: true` in the note frontmatter -> S-prefixed numbering for
    -- both tables and figures (S1, S2, …). Works because pandoc-crossref figures
    -- and the xlsx-table captions both use LaTeX's native \thefigure / \thetable.
    if truthy(m['supplementary']) then
        table.insert(header, pandoc.RawBlock("tex",
            "\\renewcommand{\\thetable}{S\\arabic{table}}\n" ..
            "\\renewcommand{\\thefigure}{S\\arabic{figure}}"))
    end

    if m['preamble-file'] then
        preamble = pandoc.RawInline("tex", "\\usepackage{\"" .. user_dir .. m['preamble-file']:gsub("%.sty$", "") .. "\"}")
		table.insert(header, 1, preamble)
    end

    m["header-includes"] = header
    return m
end
