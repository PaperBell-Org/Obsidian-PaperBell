
-- local logging = require 'logging'

function Math (el)
    el.text = el.text:gsub("\\mathbb{1}", "\\mathbbm{1}")
    el.text = el.text:gsub('%%\\label', '\\label')
    el.text = el.text:gsub('\\tag{.-}%%', '')
    return el
end
