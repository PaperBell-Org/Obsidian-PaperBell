--[[
  Process images
  Supports caption, Pandoc attributes, and Obsidian image alias.
  Also supports inline plots and pandoc-crossref subplots.

  Syntax: ![caption {attributes} | alias](/path/to/image)
  Example: ![caption {width=70% #fig:label} | 500x300](/path/to/image)
  All components are optional

  By github.com/zcysxy
--]]

local function get_raw_tex(para)
	para = para:walk {
		Math = function(el) return "$" .. el.text .. "$" end,
		Emph = function(el) return "\\textit{" .. pandoc.utils.stringify(el.content) .. "}" end,
		Strong = function(el) return "\\textbf{" .. pandoc.utils.stringify(el.content) .. "}" end,
		Code = function(el) return "\\textit{" .. el.text .. "}" end
	}
	return para
end

function Image(el)
	-- Remove Obsidian image alias
	local pipe = false
	el.caption = el.caption:walk {
		Str = function(s)
			if pipe == true then
				return nil
			else
				a, b = s.text:gsub('|.*', '')
				if b == 1 then pipe = true end
				return pandoc.Str(a)
			end
		end,
	}
	caption = pandoc.utils.stringify(get_raw_tex(el.caption))
	caption = caption:gsub('|.*', '')

	-- Assign attributes
	attr_str = caption:match('{[^}]*}%s*$')
	if attr_str then
		attr = pandoc.read('![]()' .. attr_str, 'markdown').blocks[1].content[1].attr
		el.attr = attr
	end

	-- Extract caption。只在成功解析出内容时才覆盖 el.caption——
	-- 空题注时旧代码会把 el.caption 设成空字符串（非 Inlines 列表），
	-- 损坏该 Image，导致 pandoc latex 写出时丢掉 \caption/\label、图不计数。
	if not (caption == nil or caption == '') then
		local parsed = pandoc.read(caption:gsub('{[^}]*}%s*$', ''), 'markdown')
		if next(parsed.blocks) ~= nil then
			el.caption = parsed.blocks[1].content
		end
	end
	return el
end

function Figure(el)
	if #el.caption.long >= 1 then
		local capstr = pandoc.utils.stringify(get_raw_tex(el.caption.long[1].content)):gsub('|.*', '')
		local attr_str = capstr:match('{[^}]*}%s*$')
		-- 只处理"题注末尾带内联 {attr}"（Obsidian ![cap {#fig:x}](img) 写法）的图。
		-- 标准 ![cap](img){#fig:x}（属性在图上）不动它——之前无条件重解析 caption 会把
		-- 整张图（含 \caption/\label）搞坏，使该图不计数、后面所有图号错位。
		if attr_str then
			local attr = pandoc.read('![]()' .. attr_str, 'markdown').blocks[1].content[1].attr
			el.attr = attr
			el.content[1].content[1].attr = attr
			local reparsed = pandoc.read(capstr:gsub('{[^}]*}%s*$', ''), 'latex')
			if next(reparsed.blocks) ~= nil then
				el.caption.long[1].content = reparsed.blocks[1].content
				el.content[1].content[1].caption = reparsed.blocks[1].content
			end
		end
	end
	return el
end
