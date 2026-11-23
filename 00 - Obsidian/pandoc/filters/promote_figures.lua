--[[
  promote_figures.lua — 修复"图被上文粘住、变成行内图、丢了题注/编号"的问题。

  当图片和上一段之间没有空行（longform 编译常把 <!--/ms:id--> 之类弄成紧贴图片、去掉空行），
  pandoc 会把 ![题注](图){#fig:x} 解析成某个 Para **末尾的行内图**，于是没有 \caption/\label ——
  该图不计数，后面所有图号错位（overview 丢失、wdi 变成 Figure 1 等）。

  本 filter：若一个 Para 以「带 {#fig:label} 标识 + 题注、且自成一行（前面是换行）」的图片结尾，
  就把它拆成「前面的文字/注释 → 普通段落」+「该图 → 正常 Figure」。
  句中真正的行内图（前面紧挨文字、无换行）不动；带 id 的图几乎总是图表，故按 id 判定安全。
]]

local function is_break(x) return x.t == 'SoftBreak' or x.t == 'LineBreak' end

local function promote(el)
  local c = el.content
  local n = #c
  if n < 2 then return nil end                 -- 纯图 Para 由 implicit_figures 处理
  local img = c[n]
  if img.t ~= 'Image' or img.identifier == '' or #img.caption == 0 then return nil end
  if not is_break(c[n - 1]) then return nil end  -- 图必须自成一行（前面是换行），否则是句中行内图

  -- 前面的内容（去掉末尾的换行/空白）→ 普通段落
  local before = pandoc.List()
  for i = 1, n - 1 do before:insert(c[i]) end
  while #before > 0 and (is_break(before[#before]) or before[#before].t == 'Space') do
    before:remove(#before)
  end

  local out = pandoc.List()
  if #before > 0 then out:insert(pandoc.Para(before)) end

  local imgcopy = img:clone()
  imgcopy.caption = {}
  imgcopy.attr = pandoc.Attr()                 -- id/题注放到 Figure 上；内层清空免重复
  out:insert(pandoc.Figure(
    { pandoc.Plain{ imgcopy } },
    pandoc.Caption(pandoc.Blocks{ pandoc.Plain(img.caption) }),
    pandoc.Attr(img.identifier, img.classes, img.attributes)
  ))
  return out
end

return { { Para = promote, Plain = promote } }
