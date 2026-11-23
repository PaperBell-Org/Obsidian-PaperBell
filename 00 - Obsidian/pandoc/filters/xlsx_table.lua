--[[
  xlsx_table.lua — embed a spreadsheet sheet as a booktabs LaTeX table.

  Authored in a note as a fenced code block:

      ```xlsx-table
      file: tables/mytables.xlsx
      sheet: Sheet1
      caption: Drought severity classification.   -- optional; presence -> numbered float
      label: tbl:drought                          -- optional; \label for \ref{tbl:drought}
      notes: ^a^ calibrated r. ^b^ validation. * p<0.05  -- optional; small-font table notes under the table (markdown: ^sup^, *em*, $math$)
      range: A1:E6        -- optional; default = every used cell
      skip_n: 0           -- optional; drop the first n rows before the header (default 0)
      align: llrll        -- optional; verbatim column spec (l/r/c, or p{}, >{}, |, …)
      widths: - - 0.3 0.4 -- optional; per-column: blank=natural, 0.3=0.3\linewidth, 3cm
      fontsize: small     -- optional; default \small (a size word, or points e.g. 9)
      placement: !ht      -- optional; float placement when captioned (default !ht)
      decimals: 3         -- optional; round numeric cells to n places (trim zeros)
      landscape: true     -- optional; rotated page(s) + longtable (wide/big tables)
      longtable: true     -- optional; break a long table across pages (repeats header)
      ```

  At export time this filter resolves `file` against pandoc's --resource-path
  (PaperBell already passes currentDir / attachmentFolderPath / figs / ../figs),
  reads the workbook, and injects a three-line table as a raw LaTeX block — so
  the PDF compiles a real booktabs table with no manual step.

  No external dependency: an .xlsx is a zip of XML, cracked here with the
  built-in `pandoc.zip` module (pandoc 3.0+). Values only; first row = bold
  header + \midrule. CJK passes through verbatim for xeCJK. PDF/LaTeX route only.

  Citations: a cell may contain pandoc citations (`[@key]`, `@key`) just like in
  the note body — they are resolved by the normal citeproc pass (correct numbers
  and bibliography entry).

  Column widths: with neither `align` nor `widths`, if any column was sized in
  Excel the whole table uses those Excel widths *proportionally*, normalised to
  the line width (a sheet that fits one page in Excel fits here too); otherwise
  columns auto-size (l/r). Merged cells render as their value in the first row
  with the spanned rows blank. The table body is one step smaller than the body
  font, and numeric float noise (0.20999…) is cleaned (see `decimals`).

  Only `xlsx-table` (alias `xlsx`) code blocks are touched.
--]]

----------------------------------------------------------------- small helpers

-- key: value lines from the code block body -> table of trimmed strings.
local function parse_config(text)
	local cfg = {}
	for line in text:gmatch("[^\r\n]+") do
		local key, val = line:match("^%s*([%w_-]+)%s*:%s*(.-)%s*$")
		if key then
			val = val:gsub("%s*%-%-.*$", "")            -- strip inline `-- comment`
			val = val:gsub('^"(.*)"$', "%1"):gsub("^'(.*)'$", "%1")
			cfg[key:lower()] = val
		end
	end
	return cfg
end

local function file_exists(path)
	local f = io.open(path, "r")
	if f then f:close(); return true end
	return false
end

local function read_binary(path)
	local f = io.open(path, "rb")
	if not f then return nil end
	local data = f:read("*a"); f:close()
	return data
end

-- Resolve `file` against the resource paths, like images are resolved.
local function resolve_file(file)
	if file:match("^/") and file_exists(file) then return file end
	for _, dir in ipairs(PANDOC_STATE.resource_path or {}) do
		local candidate = dir .. "/" .. file
		if file_exists(candidate) then return candidate end
	end
	return nil
end

-------------------------------------------------------------------- xml helpers

local function xml_unescape(s)
	s = s:gsub("&lt;", "<"):gsub("&gt;", ">"):gsub("&quot;", '"'):gsub("&apos;", "'")
	s = s:gsub("&#x(%x+);", function(h) return utf8.char(tonumber(h, 16)) end)
	s = s:gsub("&#(%d+);", function(d) return utf8.char(tonumber(d)) end)
	return (s:gsub("&amp;", "&"))                      -- ampersand last
end

-- "BC12" -> column index 55 (1-based, A=1). Ignores the row digits.
local function col_index(ref)
	local letters = ref:match("^(%a+)")
	if not letters then return nil end
	local n = 0
	for i = 1, #letters do
		n = n * 26 + (letters:byte(i) - 64)            -- 'A' == 65
	end
	return n
end

------------------------------------------------------------- workbook traversal

-- Map sheet name -> worksheet entry path, in workbook order; also return the
-- ordered list so an unnamed request can take the first sheet.
local function sheet_paths(entries)
	local workbook = entries["xl/workbook.xml"]
	local rels = entries["xl/_rels/workbook.xml.rels"]
	local rid_to_target = {}
	if rels then
		for attrs in rels:gmatch("<Relationship%s+([^>]*)>") do
			local id = attrs:match('Id="([^"]*)"')
			local target = attrs:match('Target="([^"]*)"')
			if id and target then
				if target:match("^/") then target = target:sub(2)
				else target = "xl/" .. target end
				rid_to_target[id] = target
			end
		end
	end

	local by_name, order = {}, {}
	if workbook then
		local idx = 0
		for attrs in workbook:gmatch("<sheet%s+([^>]*)>") do
			idx = idx + 1
			local name = attrs:match('name="([^"]*)"')
			local rid = attrs:match('r:id="([^"]*)"') or attrs:match('[%w]+:id="([^"]*)"')
			local path = rid and rid_to_target[rid] or nil
			if not path or not entries[path] then        -- fallback: positional sheetN.xml
				path = "xl/worksheets/sheet" .. idx .. ".xml"
			end
			if name then
				by_name[name] = path
				order[#order + 1] = { name = name, path = path }
			end
		end
	end
	return by_name, order
end

-- sharedStrings.xml -> 0-based array of strings.
local function shared_strings(entries)
	local xml = entries["xl/sharedStrings.xml"]
	local out = {}
	if not xml then return out end
	for si in xml:gmatch("<si>(.-)</si>") do
		local parts = {}
		for t in si:gmatch("<t[^>]*>(.-)</t>") do parts[#parts + 1] = t end
		out[#out + 1] = xml_unescape(table.concat(parts))
	end
	return out
end

------------------------------------------------------------------ sheet -> grid

-- Returns rows = { {cell, cell, ...}, ... } where cell = { v = string, num = bool };
-- blank cells are nil. ncol = widest row.
local function parse_sheet(xml, sstrings, range)
	-- optional A1:E6 bounds
	local rmin_col, rmin_row, rmax_col, rmax_row
	if range and range ~= "" then
		local a, b = range:match("^%s*([%a]+%d+)%s*:%s*([%a]+%d+)%s*$")
		if a and b then
			rmin_col, rmin_row = col_index(a), tonumber(a:match("(%d+)$"))
			rmax_col, rmax_row = col_index(b), tonumber(b:match("(%d+)$"))
		end
	end

	-- default column width (char units) for columns the user did not size
	local default_w = 8.43
	local fmt = xml:match("<sheetFormatPr[^>]*>")
	if fmt then
		default_w = tonumber(fmt:match('defaultColWidth="([%d.]+)"'))
			or tonumber(fmt:match('baseColWidth="([%d.]+)"')) or 8.43
	end

	-- Excel column widths: only columns the user explicitly sized (customWidth)
	-- are captured; keyed by OUTPUT column index (after any range offset).
	local colwidths = {}
	local cols_xml = xml:match("<cols>(.-)</cols>")
	if cols_xml then
		for cattrs in cols_xml:gmatch("<col%s+([^>]*)>") do
			local cmin = tonumber(cattrs:match('min="(%d+)"'))
			local cmax = tonumber(cattrs:match('max="(%d+)"'))
			local w = tonumber(cattrs:match('width="([%d.]+)"'))
			if cmin and cmax and w and cattrs:match('customWidth="1"') then
				for c = cmin, cmax do
					local oc = rmin_col and (c - rmin_col + 1) or c
					if oc >= 1 and not (rmin_col and (c < rmin_col or c > rmax_col)) then
						colwidths[oc] = w
					end
				end
			end
		end
	end

	local rows, ncol = {}, 0
	local out_r = 0
	for rowattr, body in xml:gmatch("<row%s*([^>]*)>(.-)</row>") do
		local rnum = tonumber(rowattr:match('r="(%d+)"')) or (#rows + 1)
		if not (rmin_row and (rnum < rmin_row or rnum > rmax_row)) then
			out_r = out_r + 1
			local row = {}
			-- Drop self-closing empty cells (`<c r=".." s=".."/>`, common in merged
			-- regions). They carry no value; leaving them in would let the `<c>…</c>`
			-- pattern span across them and misattribute the next cell's value/type.
			body = body:gsub("<c[^>]-/>", "")
			for cattr, cbody in body:gmatch("<c%s+([^>]*)>(.-)</c>") do
				local ref = cattr:match('r="([^"]*)"')
				local ctype = cattr:match('t="([^"]*)"')
				local c = ref and col_index(ref) or (#row + 1)
				if not (rmin_col and (c < rmin_col or c > rmax_col)) then
					local text, numeric = "", false
					if ctype == "s" then                        -- shared string
						local i = tonumber(cbody:match("<v>(.-)</v>"))
						text = (i ~= nil and sstrings[i + 1]) or ""
					elseif ctype == "inlineStr" then            -- inline string
						local parts = {}
						for t in cbody:gmatch("<t[^>]*>(.-)</t>") do parts[#parts + 1] = t end
						text = xml_unescape(table.concat(parts))
					elseif ctype == "str" then                  -- formula -> string
						text = xml_unescape(cbody:match("<v>(.-)</v>") or "")
					elseif ctype == "b" then                    -- boolean
						text = (cbody:match("<v>(.-)</v>") == "1") and "True" or "False"
					else                                        -- number (no t / t="n")
						local raw = cbody:match("<v>(.-)</v>") or ""
						text = raw:gsub("%.0$", "")             -- 3.0 -> 3
						numeric = tonumber(raw) ~= nil
					end
					local col = rmin_col and (c - rmin_col + 1) or c
					row[col] = { v = text, num = numeric }
					if col > ncol then ncol = col end
				end
			end
			rows[out_r] = row
		end
	end

	-- drop trailing all-blank rows
	while #rows > 0 do
		local last, blank = rows[#rows], true
		for j = 1, ncol do
			if last[j] and last[j].v ~= "" then blank = false; break end
		end
		if blank then rows[#rows] = nil else break end
	end
	return rows, ncol, colwidths, default_w
end

------------------------------------------------------------------ latex builder

local ESC = {
	["\\"] = "\\textbackslash{}", ["&"] = "\\&", ["%"] = "\\%", ["$"] = "\\$",
	["#"] = "\\#", ["_"] = "\\_", ["{"] = "\\{", ["}"] = "\\}",
	["~"] = "\\textasciitilde{}", ["^"] = "\\textasciicircum{}",
}
local function escape_plain(s)
	return (s:gsub("[\\&%%$#_{}~^]", ESC))
end

-- Math-aware: a cell may hold inline LaTeX math in `$...$` (the same convention
-- the manuscript uses, e.g. `$\leq -1.17\sigma$`). Pass math spans through
-- verbatim; escape only the surrounding text. An unmatched `$` is escaped.
local function tex_escape(s)
	if not s:find("%$") then return escape_plain(s) end
	local out, i, n = {}, 1, #s
	while i <= n do
		local ds = s:find("%$", i)
		if not ds then
			out[#out + 1] = escape_plain(s:sub(i)); break
		end
		if ds > i then out[#out + 1] = escape_plain(s:sub(i, ds - 1)) end
		local de = s:find("%$", ds + 1)
		if not de then
			out[#out + 1] = escape_plain(s:sub(ds)); break   -- lone $, escape it
		end
		out[#out + 1] = s:sub(ds, de)                        -- $...$ verbatim
		i = de + 1
	end
	return table.concat(out)
end

-- prefix that makes a p{} column wrap (ragged-right) instead of justifying.
local WRAP = "\\raggedright\\arraybackslash"

local function auto_align(rows, ncol)
	local spec = {}
	for j = 1, ncol do
		local any, all_num = false, true
		for i = 2, #rows do                                -- skip header row
			local cell = rows[i][j]
			if cell and cell.v ~= "" then
				any = true
				if not cell.num then all_num = false; break end
			end
		end
		spec[j] = (any and all_num) and "r" or "l"
	end
	return table.concat(spec)
end

-- Default column spec from the spreadsheet's own layout. If the user sized any
-- column in Excel, every column is given a width *proportional* to its Excel
-- width and the whole table is normalised to \linewidth — so a sheet that "fits
-- one page" in Excel fits the text block here too (rather than overflowing, as
-- absolute widths would). If no column was sized, fall back to auto l/r.
local function spec_from_xlsx(rows, ncol, colwidths, default_w)
	if next(colwidths) == nil then
		return auto_align(rows, ncol)
	end
	local weights, total = {}, 0
	for j = 1, ncol do
		weights[j] = colwidths[j] or default_w or 8.43
		total = total + weights[j]
	end
	local out = {}
	for j = 1, ncol do
		-- subtract the column's share of inter-column padding so the row fills,
		-- but does not exceed, the line width.
		out[j] = string.format(">{%s}p{\\dimexpr %.4f\\linewidth-2\\tabcolsep\\relax}",
			WRAP, weights[j] / total)
	end
	return table.concat(out)
end

-- Render a numeric cell. `decimals` (if set) rounds to that many places and trims
-- trailing zeros; otherwise long values that are float-representation noise
-- (e.g. 0.21099999999999999) are cleaned to ~10 significant digits.
local function fmt_number(s, decimals)
	local n = tonumber(s)
	if not n then return s end
	if decimals and decimals ~= "" then
		local r = string.format("%." .. math.floor(tonumber(decimals)) .. "f", n)
		if r:find("%.") then r = r:gsub("0+$", ""):gsub("%.$", "") end
		return r
	end
	if #s > 12 and s:find("%.") then
		return string.format("%.10g", n)
	end
	return s
end

-- Font-size command for the table body. Default `\small` (one step under the
-- body font); a size word (footnotesize/normalsize/…) or a number of points
-- (`fontsize: 9`) overrides it.
local function size_cmd(fontsize)
	if not fontsize or fontsize == "" then return "\\small" end
	if fontsize:match("^%d*%.?%d+$") then
		return string.format("\\fontsize{%s}{%g}\\selectfont", fontsize, tonumber(fontsize) * 1.2)
	end
	return "\\" .. fontsize
end

-- Citation support: the table is emitted as raw LaTeX, which citeproc never
-- looks inside. So a cell containing a citation (`[@key]`, `@key`) is parsed to
-- real inlines (a Cite node) stashed in CITES, and a \1N\1 placeholder is left
-- in the string. After the table string is built, cite_interleave() splits it
-- back into RawInline chunks with the Cite nodes spliced in, so the main
-- citeproc pass resolves them (correct numbering + bibliography).
local CITES = { n = 0 }

local function has_citation(s)
	return s:find("%[@") or s:find("@%a")
end

local function cite_placeholder(text, header)
	local doc = pandoc.read(text, "markdown")
	local inl = (doc.blocks[1] and doc.blocks[1].content) or {}
	if header then inl = { pandoc.Strong(inl) } end
	CITES.n = CITES.n + 1
	CITES[CITES.n] = inl
	return "\1" .. CITES.n .. "\1"
end

-- string with \1N\1 placeholders -> list of inlines (RawInline chunks + Cites).
local function cite_interleave(out)
	local inlines, i = {}, 1
	while true do
		local s, e, idx = out:find("\1(%d+)\1", i)
		if not s then
			inlines[#inlines + 1] = pandoc.RawInline("latex", out:sub(i))
			break
		end
		if s > i then inlines[#inlines + 1] = pandoc.RawInline("latex", out:sub(i, s - 1)) end
		for _, il in ipairs(CITES[tonumber(idx)]) do inlines[#inlines + 1] = il end
		i = e + 1
	end
	return inlines
end

local function format_row(row, ncol, header, decimals)
	local cells = {}
	for j = 1, ncol do
		local cell = row[j]
		local raw = cell and cell.v or ""
		if cell and has_citation(raw) then
			cells[j] = cite_placeholder(raw, header)   -- defer to citeproc
		else
			if cell and cell.num then raw = fmt_number(raw, decimals) end
			local text = tex_escape(raw)
			if header and text ~= "" then text = "\\textbf{" .. text .. "}" end
			cells[j] = text
		end
	end
	return table.concat(cells, " & ") .. " \\\\"
end

-- Build a column spec from the friendly `widths:` field. One token per column,
-- separated by spaces or commas:
--   ""  "-"  "0"   -> natural column (auto l/r alignment)
--   0.3            -> wrapping p{0.3\linewidth}  (fraction of line width)
--   3cm / 2.5in    -> wrapping p{3cm}            (absolute width)
--   l / r / c      -> that alignment, verbatim
local function spec_from_widths(widths, rows, ncol)
	local toks = {}
	for t in widths:gmatch("[^%s,]+") do toks[#toks + 1] = t end
	if #toks ~= ncol then
		return nil, ("widths has " .. #toks .. " columns but table has " .. ncol)
	end
	local auto = auto_align(rows, ncol)
	local out = {}
	for j = 1, ncol do
		local t = toks[j]
		if t == "" or t == "-" or t == "0" then
			out[j] = auto:sub(j, j)
		elseif t == "l" or t == "r" or t == "c" then
			out[j] = t
		elseif t:match("^%d*%.?%d+$") and tonumber(t) and tonumber(t) <= 1 then
			out[j] = ">{" .. WRAP .. "}p{" .. t .. "\\linewidth}"
		elseif t:match("^%d*%.?%d+%a+$") then       -- number + unit, e.g. 3cm
			out[j] = ">{" .. WRAP .. "}p{" .. t .. "}"
		else
			out[j] = t                               -- verbatim escape hatch
		end
	end
	return table.concat(out)
end

-- Wrap the assembled LaTeX string in a Block: a plain RawBlock when there are
-- no citations, or a Plain of interleaved RawInline/Cite when there are (so the
-- main citeproc pass resolves them).
local function as_block(out)
	if CITES.n == 0 then return pandoc.RawBlock("latex", out) end
	return pandoc.Plain(cite_interleave(out))
end

-- Render the optional `notes:` string as a small-font, left-aligned block placed
-- directly under the table (table footnotes, e.g. markers a / b / *). Parsed as
-- markdown so ^a^ superscripts, *emphasis* and $math$ work; falls back to escaped
-- text if parsing fails. Returns nil when there are no notes.
local function notes_block(notes)
	if not notes or notes == "" then return nil end
	local ok, latex = pcall(function()
		return pandoc.write(pandoc.read(notes, "markdown"), "latex")
	end)
	local body = (ok and latex) and latex:gsub("%s+$", "") or escape_plain(notes)
	return "\\par\\vspace{0.5ex}{\\footnotesize\\raggedright " .. body .. "\\par}"
end

local function build_table(rows, ncol, colwidths, default_w, cfg)
	CITES = { n = 0 }                                  -- reset per table
	local align, widths = cfg.align, cfg.widths

	-- skip_n: drop the first n rows (e.g. spreadsheet title/notes) before the
	-- next row is taken as the header. Recompute ncol over what remains.
	local skip_n = tonumber(cfg.skip_n) or 0
	for _ = 1, math.min(skip_n, #rows) do table.remove(rows, 1) end
	if skip_n > 0 then
		ncol = 0
		for _, r in ipairs(rows) do
			for j in pairs(r) do if j > ncol then ncol = j end end
		end
	end

	if #rows == 0 or ncol == 0 then return nil, "no data rows found (empty sheet, range, or skip_n too large)" end
	-- Column spec precedence: explicit `align` > explicit `widths` > Excel column
	-- widths (for columns sized in the sheet) > automatic l/r alignment.
	if align and align ~= "" then
		-- A plain l/r/c string is length-checked; anything richer (p{..}, >{..},
		-- |, etc.) is treated as a verbatim LaTeX column spec for wide/wrapping
		-- tables and passed through untouched.
		if align:match("^[lrc]+$") and #align ~= ncol then
			return nil, ("align has " .. #align .. " columns but table has " .. ncol)
		end
	elseif widths and widths ~= "" then
		local spec, err = spec_from_widths(widths, rows, ncol)
		if not spec then return nil, err end
		align = spec
	else
		align = spec_from_xlsx(rows, ncol, colwidths, default_w)
	end

	-- With a caption or label the table becomes a numbered floating `table`;
	-- without either it stays an inline, unnumbered centred tabular (matching how
	-- a plain markdown table renders, so migrating one doesn't introduce a number).
	local caption, label = cfg.caption, cfg.label
	local has_cap = caption and caption ~= ""
	local has_lbl = label and label ~= ""
	local float = has_cap or has_lbl

	-- 引用来源表（回复信里 manuscript_include 注入 number: 正文"1" / SI"S1"）时，
	-- 把 \thetable 局部覆盖成真实表号，并 \addtocounter{table}{-1} 归还计数——
	-- 表就显示来源表号、且不占用回复信自有表的 R 序号（与 number_figure 同理）。
	-- 正文/SI 自身导出不注入 number，此处 no-op，编号照旧。
	local num = float and cfg.number and cfg.number ~= "" and cfg.number or nil
	local num_pre  = num and ("{\\renewcommand{\\thetable}{" .. tostring(num) .. "}%") or nil
	local num_post = num and "\\addtocounter{table}{-1}}" or nil

	-- landscape: put a wide table on its own rotated page (pdflscape); the wider
	-- \linewidth there gives proportional columns much more room. A big table is
	-- usually also tall, and a plain `tabular` can't break across pages, so in
	-- landscape (or with `longtable: true`) we render a `longtable`, which breaks
	-- across pages with a repeated header and numbers itself via \caption.
	local landscape = ({ ["true"] = 1, yes = 1, ["1"] = 1, on = 1 })[(cfg.landscape or ""):lower()]
	local want_longtable = ({ ["true"] = 1, yes = 1, ["1"] = 1, on = 1 })[(cfg.longtable or ""):lower()]
	local use_longtable = landscape or want_longtable

	local header = format_row(rows[1], ncol, true, cfg.decimals)

	if use_longtable then
		local L = {}
		if landscape then L[#L + 1] = "\\begin{landscape}" end
		if num_pre then L[#L + 1] = num_pre end               -- 覆盖表号（引用来源表时）
		L[#L + 1] = "{" .. size_cmd(cfg.fontsize)              -- scope the font switch
		L[#L + 1] = "\\begin{longtable}{" .. align .. "}"
		if has_cap then
			L[#L + 1] = "\\caption{" .. tex_escape(caption) .. "}" ..
				(has_lbl and ("\\label{" .. label .. "}") or "") .. "\\\\"
		end
		L[#L + 1] = "\\toprule"
		L[#L + 1] = header
		L[#L + 1] = "\\midrule\\endfirsthead"               -- repeated below on each page
		L[#L + 1] = "\\toprule"
		L[#L + 1] = header
		L[#L + 1] = "\\midrule\\endhead"
		L[#L + 1] = "\\bottomrule\\endlastfoot"
		for i = 2, #rows do L[#L + 1] = format_row(rows[i], ncol, false, cfg.decimals) end
		L[#L + 1] = "\\end{longtable}"
		local nb = notes_block(cfg.notes)
		if nb then L[#L + 1] = nb end
		L[#L + 1] = "}"
		if num_post then L[#L + 1] = num_post end             -- 归还表计数
		if landscape then L[#L + 1] = "\\end{landscape}" end
		return as_block(table.concat(L, "\n"))
	end

	-- Non-longtable: caption/label -> numbered floating `table`; otherwise an
	-- inline, unnumbered centred tabular (so migrating a plain markdown table
	-- introduces no number).
	local placement = (cfg.placement and cfg.placement ~= "") and cfg.placement or "!ht"
	local L = {}
	if num_pre then L[#L + 1] = num_pre end                   -- 覆盖表号（引用来源表时）
	if float then
		L[#L + 1] = "\\begin{table}[" .. placement .. "]"
		L[#L + 1] = "\\centering"
		if has_cap then L[#L + 1] = "\\caption{" .. tex_escape(caption) .. "}" end
		if has_lbl then L[#L + 1] = "\\label{" .. label .. "}" end
	else
		L[#L + 1] = "\\begin{center}"
	end
	L[#L + 1] = size_cmd(cfg.fontsize)
	L[#L + 1] = "\\begin{tabular}{" .. align .. "}"
	L[#L + 1] = "\\toprule"
	L[#L + 1] = header
	L[#L + 1] = "\\midrule"
	for i = 2, #rows do L[#L + 1] = format_row(rows[i], ncol, false, cfg.decimals) end
	L[#L + 1] = "\\bottomrule"
	L[#L + 1] = "\\end{tabular}"
	local nb = notes_block(cfg.notes)
	if nb then L[#L + 1] = nb end
	L[#L + 1] = float and "\\end{table}" or "\\end{center}"
	if num_post then L[#L + 1] = num_post end                 -- 归还表计数
	return as_block(table.concat(L, "\n"))
end

------------------------------------------------------------------------ filter

local function error_block(msg)
	io.stderr:write("xlsx_table.lua: " .. msg .. "\n")
	return pandoc.Div(
		pandoc.Para({ pandoc.Strong(pandoc.Str("[xlsx-table error] ")), pandoc.Str(msg) }),
		pandoc.Attr("", { "xlsx-table-error" })
	)
end

function CodeBlock(el)
	local is_target = false
	for _, c in ipairs(el.classes) do
		if c == "xlsx-table" or c == "xlsx" then is_target = true; break end
	end
	if not is_target then return nil end

	local cfg = parse_config(el.text)
	if not cfg.file or cfg.file == "" then
		return error_block("missing required `file:` key")
	end

	local path = resolve_file(cfg.file)
	if not path then
		return error_block("file not found on resource-path: " .. cfg.file)
	end

	local ok, result = pcall(function()
		local bytes = read_binary(path)
		if not bytes then error("cannot read file") end
		local archive = pandoc.zip.Archive(bytes)
		local entries = {}
		for _, e in ipairs(archive.entries) do entries[e.path] = e:contents() end

		local by_name, order = sheet_paths(entries)
		local sheet_path
		if cfg.sheet and cfg.sheet ~= "" then
			sheet_path = by_name[cfg.sheet]
			if not sheet_path then
				local names = {}
				for _, s in ipairs(order) do names[#names + 1] = s.name end
				error("sheet '" .. cfg.sheet .. "' not found; available: " .. table.concat(names, ", "))
			end
		else
			sheet_path = order[1] and order[1].path or "xl/worksheets/sheet1.xml"
		end

		local xml = entries[sheet_path]
		if not xml then error("worksheet xml missing: " .. sheet_path) end

		local rows, ncol, colwidths, default_w = parse_sheet(xml, shared_strings(entries), cfg.range)
		local block, err = build_table(rows, ncol, colwidths, default_w, cfg)
		if not block then error(err) end
		return block
	end)

	if not ok then
		return error_block("failed for " .. cfg.file ..
			" (sheet " .. (cfg.sheet or "first") .. "): " .. tostring(result))
	end
	return result
end
