--[[
  Shift Markdown headings
  to avoid duplicate H1 titles

  Variable: heading_shift (integer)
  If heading_shift = 1, then H2 headings will be shifted to H1, H3 to H2, etc.

  By github.com/zcysxy
--]]

title = nil

-- Get variable
function get_meta(m)
  heading_shift = m.heading_shift
  if heading_shift then
    heading_shift = m.heading_shift[1].text
    assert(tonumber(heading_shift), "heading_shift must be a number")
  end
  -- assert heading_shift is a number
  title = m.title

  -- Remove Markdown H1 if title is set
  if not heading_shift then
    if title then
      heading_shift = 1
    else
      heading_shift = 0
    end
  end

  return m
end

function shift_headings(h)
  h.level = h.level - heading_shift
  if h.level > 0 then
    return h
  else
    return {}
  end
end

return { { Meta = get_meta }, { Header = shift_headings } }
