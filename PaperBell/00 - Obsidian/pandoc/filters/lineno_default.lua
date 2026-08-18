-- lineno_default.lua
-- 让 paperbell 导出的行号（lineno）默认开启，但仍可被笔记 frontmatter 覆盖。
--
-- 为什么用 filter 而不是在 defaults 里写 lineno: true：
--   pandoc 的 defaults `metadata:`/`variables:` 优先级都高于文档 frontmatter，
--   一旦写死就无法被单篇笔记的 `lineno: false` 关掉。filter 直接改文档 meta，
--   只在「笔记没写 lineno」时才默认 true，因此 `lineno: false` 能正常关闭。
--
-- 规则：缺省 → true；写了值 → 归一成真正的布尔（false/no/0/off/空 视为关闭）。

local function truthy(v)
  local s = pandoc.utils.stringify(v):lower():gsub('%s+', '')
  return not (s == 'false' or s == 'no' or s == '0' or s == 'off' or s == '')
end

function Meta(meta)
  if meta.lineno == nil then
    meta.lineno = true
  else
    meta.lineno = truthy(meta.lineno)
  end
  return meta
end
