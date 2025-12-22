---
cate: <%* const options = ["引言", "方法", "结果", "讨论"]; const choice = await tp.system.suggester(options, options); tR += choice; %>
date: <% tp.date.now('YYYY-MM-DD') %>
scene_alias: <% tp.file.title %>
tags:
  - output
  - project/<% tp.system.prompt("是否属于某个项目?") %>
banner: 40 - Obsidian/img/<%* tR += `${choice}.jpg`; %>
longform: true
status: not-started
---
