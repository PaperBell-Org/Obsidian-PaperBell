--[[
  manuscript_cite.lua — run BEFORE citeproc in the response-letter pipeline.

  responseletter.lua typesets ```manuscript fenced blocks as revised-manuscript
  quote boxes, re-reading their raw text itself. Because that happens AFTER
  citeproc, any [@key] inside a manuscript quote was never resolved — it stayed
  literal in the PDF.

  This filter expands every manuscript fence into a Div{.manuscript} whose text is
  parsed WITH citations, so the single citeproc pass that follows resolves those
  citations into the one shared bibliography (with numbering consistent with the
  rest of the response). responseletter.lua then wraps the Div in
  \begin{manuscript}…\end{manuscript}.

  Mirrors responseletter.lua's own is_manuscript_cb() so the two agree on what
  counts as a manuscript fence (explicitly tagged manuscript/ms/revision, or an
  untagged fence — the note convention that every bare fence is a quote).
--]]

local CALLOUT_MS = { manuscript = true, ms = true, revision = true }

local function is_manuscript_cb(blk)
  if blk.t ~= 'CodeBlock' then return false end
  local classes = blk.classes or {}
  if #classes == 0 then return true end            -- untagged fence = manuscript quote
  for _, c in ipairs(classes) do
    if CALLOUT_MS[c] then return true end
  end
  return false
end

function CodeBlock(blk)
  if not is_manuscript_cb(blk) then return nil end
  local sub = pandoc.read(blk.text, 'markdown')     -- citations ENABLED (vs markdown-citations)
  return pandoc.Div(sub.blocks, pandoc.Attr('', { 'manuscript' }))
end
