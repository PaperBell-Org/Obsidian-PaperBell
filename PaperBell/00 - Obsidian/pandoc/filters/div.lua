--[[
  Custom Pandoc Divs

  Pandoc divs syntx:
    ::: {.class1 .class2}
    content
    :::

  Current supported classes:
    - hidden: hide the div

  By github.com/zcysxy
--]]

function Inlines(el)
  if next(el) and el[1].tag == "Str" and el[#el].tag == "Str" and el[1].text:match('^%%%%') and el[#el].text:match('^%%%%') then
	el[1] = '::: hidden\n'
	el[#el] = ':::\n'
	return {}
  end
  return el
end

function Div(el)
  if el.classes[1] == 'hidden' then
    return {}
  else
    return el
  end
end
