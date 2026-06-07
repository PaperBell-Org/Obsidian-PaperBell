--[[
  responseletter.lua — pandoc Lua filter

  Converts Obsidian-flavoured Markdown into the commands provided by
  responseletter.sty, so casual notes can be typeset as a polished response
  letter via pandoc + XeLaTeX.

  Authoring contract (matches how the notes are actually written in Obsidian)
  --------------------------------------------------------------------------
    Reviewer comment  →  a callout, with the reviewer label as its title:

        > [!quote] Reviewer #1 (optional sub-topic)
        > English text of the reviewer comment (may span several lines/paras).
        >
        > ---
        > **中文翻译：** 对应的中文。

      - callout kinds quote / comment / cite / info / rc / reviewer  → RC card.
      - the title "Reviewer #1" becomes a \section the first time it appears
        (deduped, so it is printed once even if every comment repeats it);
        a trailing "(...)" becomes a \subsection*.
      - the "---" rule and the "**中文翻译：**" paragraph are folded into the
        card as \zh{...} (draft-only).

    Author response  →  a bare paragraph led by a bold label:

        **Response:** English text of the response.

        %% 中文翻译（Obsidian 行内注释） %%

      - "**Response:**" (also 回复 / 作者回复 / Reply) → \AR with a hanging
        "AR:" label; the label is stripped.
      - a following  %% ... %%  Obsidian comment → \zh{...} for the response.
      - a following plain paragraph (no label) → \AR* continuation.
      - alternatively, a  > [!response] / [!ar]  callout works too.

    Revised manuscript text:

        > [!manuscript] page=5, sline=158, eline=160
        > Revised text, shown in a framed box.

    Other carriers still understood:
      - <!-- 中文翻译 ... --> after a comment/response → \zh{...}
      - <!-- note: ... -->        after a comment/response → \note{...}
      - ...text {difficulty=hard status=todo}  on an RC body → badges
      - # Heading / ## Heading → \section / \subsection* (manual override)

  Badges, 中文 and 批注 are draft-only; the .sty hides them in final mode, so
  the author never edits the source between modes.
]]

local utils = pandoc.utils

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------

local function raw(s)
  return pandoc.RawBlock('latex', s)
end

-- render a list of inlines to a LaTeX string (math, emphasis, \url … preserved)
local function inlines_to_latex(inlines)
  local s = pandoc.write(pandoc.Pandoc({ pandoc.Plain(inlines) }), 'latex')
  return (s:gsub('%s+$', ''))
end

-- escape plain text for use inside \section{}/\subsection*{} etc.
local function tex_escape(s)
  s = s:gsub('([\\{}%%&#%$_])', '\\%1')
  s = s:gsub('~', '\\textasciitilde{}')
  s = s:gsub('%^', '\\textasciicircum{}')
  return s
end

local function trim(s)
  return (s:gsub('^%s+', ''):gsub('%s+$', ''))
end

-- strip a trailing colon (half- or full-width).  NB: a byte-class like
-- [:：] is wrong here — "：" is a 3-byte UTF-8 char, so match it literally.
local function strip_colon(s)
  return trim(trim(s):gsub('：$', ''):gsub(':$', ''))
end

local function drop_leading_space(inlines)
  while #inlines > 0 and (inlines[1].t == 'Space' or inlines[1].t == 'SoftBreak') do
    table.remove(inlines, 1)
  end
  return inlines
end

-- "difficulty=hard status=todo" -> { difficulty="hard", status="todo" }
local function parse_kv_words(s)
  local t = {}
  for k, v in s:gmatch('(%w+)%s*=%s*([%w%-]+)') do t[k] = v end
  return t
end

-- "page=Supporting Information, sline=158" -> table (comma-separated, spaces ok)
local function parse_kv_commas(s)
  local t = {}
  for pair in s:gmatch('[^,]+') do
    local k, v = pair:match('^%s*(%w+)%s*=%s*(.-)%s*$')
    if k then t[k] = v end
  end
  return t
end

-- ---------------------------------------------------------------------------
-- callout detection:  > [!type]<-|+>? Title \n body...
-- ---------------------------------------------------------------------------

local CALLOUT_RC = {            -- reviewer comment
  quote = true, comment = true, cite = true, info = true,
  rc = true, reviewer = true, question = true, abstract = true,
}
local CALLOUT_AR = {            -- author response
  response = true, ar = true, reply = true, success = true, answer = true,
}
local CALLOUT_MS = { manuscript = true, ms = true, revision = true }

-- returns: kind (lowercased) or nil, the first block, the whole block list
local function callout_info(blk)
  if blk.t ~= 'BlockQuote' then return nil end
  local first = blk.content[1]
  if not first or (first.t ~= 'Para' and first.t ~= 'Plain') then return nil end
  local fi = first.content[1]
  if not fi or fi.t ~= 'Str' then return nil end
  local kind = fi.text:match('^%[!(%a+)%][%-%+]?$')
  if not kind then return nil end
  return kind:lower(), first, blk.content
end

-- split a callout's first para into (title inlines, first-body inlines),
-- dropping the leading "[!type]" marker token.
local function split_first(inlines)
  local title, body = {}, {}
  local seen_break = false
  for i = 2, #inlines do                       -- skip [1] = marker Str
    local el = inlines[i]
    if not seen_break and (el.t == 'SoftBreak' or el.t == 'LineBreak') then
      seen_break = true
    elseif not seen_break then
      table.insert(title, el)
    else
      table.insert(body, el)
    end
  end
  return drop_leading_space(title), drop_leading_space(body)
end

-- "Reviewer #1 (Remarks on code availability)" -> "Reviewer #1", "Remarks on…"
local function parse_title(t)
  t = trim(t)
  local sub = t:match('%((.-)%)')
  local rev = t:match('^(.-)%s*%(') or t
  rev = trim(rev)
  if sub then sub = trim(sub) end
  return rev, sub
end

-- strip a leading boilerplate parenthetical like "(Remarks to the Author)"
local function strip_leading_remarks(inlines)
  if #inlines == 0 then return inlines end
  if not utils.stringify(inlines):match('^%(%s*Remarks') then return inlines end
  local idx
  for k = 1, #inlines do
    if inlines[k].t == 'Str' and inlines[k].text:find('%)') then idx = k break end
  end
  if not idx then return inlines end
  local rest = {}
  local after = inlines[idx].text:gsub('^.-%)', '')
  if after ~= '' then rest[#rest + 1] = pandoc.Str(after) end
  for k = idx + 1, #inlines do rest[#rest + 1] = inlines[k] end
  return drop_leading_space(rest)
end

-- ---------------------------------------------------------------------------
-- translation / annotation carriers
-- ---------------------------------------------------------------------------

-- "**中文翻译：** ..." paragraph inside a callout -> remaining inlines, or nil
local ZH_LABELS = {
  ['中文翻译'] = true, ['中文'] = true, ['译文'] = true, ['翻译'] = true,
  ['translation'] = true,
}
local function strip_zh_label(inlines)
  if #inlines == 0 then return nil end
  local first = inlines[1]
  if first.t ~= 'Strong' and first.t ~= 'Str' then return nil end
  local head = strip_colon(utils.stringify(first))
  if not ZH_LABELS[head] then return nil end
  local rest = {}
  for k = 2, #inlines do rest[#rest + 1] = inlines[k] end
  return drop_leading_space(rest)
end

-- Obsidian inline comment  %% ... %%  (a whole paragraph) -> inner inlines, or nil
local function obsidian_zh(blk)
  if blk.t ~= 'Para' and blk.t ~= 'Plain' then return nil end
  local ins = blk.content
  if #ins == 1 and ins[1].t == 'Str' then
    local inner = ins[1].text:match('^%%%%(.-)%%%%$')
    if inner and inner ~= '' then return { pandoc.Str(inner) } end
    return nil
  end
  if #ins < 2 then return nil end
  if not (ins[1].t == 'Str' and ins[1].text == '%%') then return nil end
  if not (ins[#ins].t == 'Str' and ins[#ins].text == '%%') then return nil end
  local mid = {}
  for k = 2, #ins - 1 do mid[#mid + 1] = ins[k] end
  drop_leading_space(mid)
  while #mid > 0 and (mid[#mid].t == 'Space' or mid[#mid].t == 'SoftBreak') do
    table.remove(mid)
  end
  if #mid == 0 then return nil end
  return mid
end

-- HTML comment  <!-- 中文翻译 ... -->  /  <!-- note: ... -->  -> kind, text
local HTML_LABELS = {
  ['中文翻译'] = 'zh', ['中文'] = 'zh', ['zh'] = 'zh', ['translation'] = 'zh',
  ['note'] = 'note', ['批注'] = 'note', ['注'] = 'note',
}
local function html_comment(blk)
  if blk.t ~= 'RawBlock' or blk.format ~= 'html' then return nil end
  local inner = blk.text:match('^%s*<!%-%-(.-)%-%->%s*$')
  if not inner then return nil end
  local lines = {}
  for line in (inner .. '\n'):gmatch('(.-)\n') do
    local t = trim(line)
    if t ~= '' then lines[#lines + 1] = t end
  end
  if #lines == 0 then return nil end
  local kind = 'zh'
  local label = strip_colon(lines[1])
  local start = 1
  if HTML_LABELS[label] then kind = HTML_LABELS[label]; start = 2 end
  local rest = {}
  for i = start, #lines do rest[#rest + 1] = lines[i] end
  local text = table.concat(rest, ' ')
  if text == '' then return nil end
  return kind, text
end

-- a draft-aid carrier following a comment/response → emits \zh{}/\note{}, or nil
local function fold_aid(blk)
  local zh = obsidian_zh(blk)
  if zh then return '\\zh{' .. inlines_to_latex(zh) .. '}' end
  local k, txt = html_comment(blk)
  if k then return '\\' .. k .. '{' .. tex_escape(txt) .. '}' end
  return nil
end

-- ---------------------------------------------------------------------------
-- author-response label:  **Response:** ...   (also 回复 / Reply …)
-- ---------------------------------------------------------------------------
local AR_LABELS = {
  ['Response'] = true, ['response'] = true, ['RESPONSE'] = true,
  ['Reply'] = true, ['reply'] = true,
  ['回复'] = true, ['作者回复'] = true, ['答复'] = true, ['回應'] = true,
}
local function ar_label(inlines)
  if #inlines == 0 or inlines[1].t ~= 'Strong' then return nil end
  local head = strip_colon(utils.stringify(inlines[1]))
  if not AR_LABELS[head] then return nil end
  local rest = {}
  for k = 2, #inlines do rest[#rest + 1] = inlines[k] end
  return drop_leading_space(rest)
end

-- ---------------------------------------------------------------------------
-- RC inline option marker:  ...comment {difficulty=hard status=todo}
-- ---------------------------------------------------------------------------
local function strip_trailing_brace(inlines)
  local acc, cut = '', #inlines + 1
  for j = #inlines, 1, -1 do
    acc = utils.stringify({ inlines[j] }) .. acc
    if acc:match('^%s*%b{}%s*$') then cut = j break end
    if #acc > 120 then break end
  end
  local res = {}
  for j = 1, cut - 1 do res[#res + 1] = inlines[j] end
  while #res > 0 and res[#res].t == 'Space' do table.remove(res) end
  return res
end

local function extract_rc_opts(inlines)
  local s = utils.stringify(inlines)
  local brace = s:match('%s*(%b{})%s*$')
  if not (brace and brace:find('=')) then return '', inlines end
  local kv = parse_kv_words(brace:sub(2, -2))
  local parts = {}
  if kv.difficulty then parts[#parts + 1] = 'difficulty=' .. kv.difficulty end
  if kv.status then parts[#parts + 1] = 'status=' .. kv.status end
  if #parts == 0 then return '', inlines end
  return table.concat(parts, ', '), strip_trailing_brace(inlines)
end

-- ---------------------------------------------------------------------------
-- main pass: walk the flat block list, rebuild with LaTeX structure
-- ---------------------------------------------------------------------------

function Pandoc(doc)
  local out = pandoc.List()
  local blocks = doc.blocks
  local i = 1
  local cur_reviewer, cur_subtitle = nil, nil

  -- emit a deduped \section / \subsection* from a callout's title text
  local function emit_heading(title_str)
    local rev, sub = parse_title(title_str)
    if rev and rev ~= '' and rev ~= cur_reviewer then
      out:insert(raw('\\section{' .. tex_escape(rev) .. '}'))
      cur_reviewer = rev
      cur_subtitle = nil
    end
    if sub and sub ~= '' and sub ~= cur_subtitle then
      out:insert(raw('\\subsection*{' .. tex_escape(sub) .. '}'))
      cur_subtitle = sub
    end
  end

  -- emit a sequence of inline-paragraphs as \AR (first) / \AR* (rest)
  local function emit_ar(paras)
    for pi, p in ipairs(paras) do
      local cmd = (pi == 1) and '\\AR ' or '\\AR* '
      out:insert(raw(cmd .. inlines_to_latex(p)))
    end
  end

  while i <= #blocks do
    local blk = blocks[i]
    local kind, firstblk, content = callout_info(blk)

    -- 1. manual headings (override / supplement the auto sectioning)
    if blk.t == 'Header' then
      local txt = inlines_to_latex(blk.content)
      if blk.level == 1 then
        out:insert(raw('\\section{' .. txt .. '}'))
        cur_reviewer = trim(utils.stringify(blk.content)); cur_subtitle = nil
      else
        out:insert(raw('\\subsection*{' .. txt .. '}'))
        cur_subtitle = trim(utils.stringify(blk.content))
      end
      i = i + 1

    -- 2. revised manuscript box
    elseif kind and CALLOUT_MS[kind] then
      local title, body1 = split_first(firstblk.content)
      local kv = parse_kv_commas(utils.stringify(title))
      local optparts = {}
      for _, key in ipairs({ 'page', 'sline', 'eline' }) do
        if kv[key] then optparts[#optparts + 1] = key .. '=' .. kv[key] end
      end
      local opt = (#optparts > 0) and ('[' .. table.concat(optparts, ', ') .. ']') or ''
      out:insert(raw('\\begin{manuscript}' .. opt))
      if #body1 > 0 then out:insert(pandoc.Para(body1)) end
      for bi = 2, #content do out:insert(content[bi]) end
      out:insert(raw('\\end{manuscript}'))
      i = i + 1

    -- 3. author response written as a callout (alternative to **Response:**)
    elseif kind and CALLOUT_AR[kind] then
      local _, body1 = split_first(firstblk.content)
      local paras = {}
      if #body1 > 0 then paras[#paras + 1] = body1 end
      for bi = 2, #content do
        local b = content[bi]
        if b.t == 'Para' or b.t == 'Plain' then paras[#paras + 1] = b.content end
      end
      emit_ar(paras)
      -- fold trailing %% / <!-- --> aids that sit right after the callout
      local j = i + 1
      while j <= #blocks do
        local aid = fold_aid(blocks[j])
        if not aid then break end
        out:insert(raw(aid)); j = j + 1
      end
      i = j

    -- 4. reviewer comment callout  (the common case)
    elseif kind and (CALLOUT_RC[kind] or not (CALLOUT_AR[kind] or CALLOUT_MS[kind])) then
      local title, body1 = split_first(firstblk.content)
      emit_heading(utils.stringify(title))

      -- collect English body paragraphs + an inline 中文翻译 (if present)
      local body_paras, zh_inlines = {}, nil
      if #body1 > 0 then body_paras[#body_paras + 1] = body1 end
      for bi = 2, #content do
        local b = content[bi]
        if b.t == 'HorizontalRule' then
          -- separator before the translation; skip
        elseif (b.t == 'Para' or b.t == 'Plain') then
          local z = strip_zh_label(b.content)
          if z then zh_inlines = z
          else body_paras[#body_paras + 1] = b.content end
        end
        -- any other block kind inside the callout is dropped from the RC
      end
      if #body_paras > 0 then
        body_paras[1] = strip_leading_remarks(body_paras[1])
      end

      -- difficulty / status badges from a trailing {..} on the last body para
      local opt = ''
      if #body_paras > 0 then
        opt, body_paras[#body_paras] = extract_rc_opts(body_paras[#body_paras])
      end

      out:insert(raw('\\begin{RC}' .. ((opt ~= '') and ('[' .. opt .. ']') or '')))
      for _, p in ipairs(body_paras) do out:insert(pandoc.Para(p)) end
      if zh_inlines then out:insert(raw('\\zh{' .. inlines_to_latex(zh_inlines) .. '}')) end
      out:insert(raw('\\end{RC}'))
      i = i + 1

    -- 5. author response written as a bare  **Response:**  paragraph
    elseif (blk.t == 'Para' or blk.t == 'Plain') and ar_label(blk.content) then
      local first_para = ar_label(blk.content)
      out:insert(raw('\\AR ' .. inlines_to_latex(first_para)))
      local j = i + 1
      while j <= #blocks do
        local b = blocks[j]
        local aid = fold_aid(b)
        if aid then
          out:insert(raw(aid)); j = j + 1
        elseif (b.t == 'Para' or b.t == 'Plain')
            and not callout_info(b) and not ar_label(b.content)
            and not obsidian_zh(b) and not html_comment(b) then
          out:insert(raw('\\AR* ' .. inlines_to_latex(b.content)))   -- continuation
          j = j + 1
        else
          break
        end
      end
      i = j

    -- 6. orphan translation/annotation (e.g. a heading's translation) → drop
    elseif obsidian_zh(blk) or html_comment(blk) then
      i = i + 1

    -- 7. fallback bare paragraph → reviewer comment card (back-compat)
    elseif blk.t == 'Para' or blk.t == 'Plain' then
      local opt, body = extract_rc_opts(blk.content)
      out:insert(raw('\\begin{RC}' .. ((opt ~= '') and ('[' .. opt .. ']') or '')))
      out:insert(pandoc.Para(body))
      local j = i + 1
      while j <= #blocks do
        local aid = fold_aid(blocks[j])
        if not aid then break end
        out:insert(raw(aid)); j = j + 1
      end
      out:insert(raw('\\end{RC}'))
      i = j

    else
      out:insert(blk)                                -- tables, lists, etc.
      i = i + 1
    end
  end

  return pandoc.Pandoc(out, doc.meta)
end
