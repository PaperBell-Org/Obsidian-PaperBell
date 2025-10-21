[!<%= it.colorName %>] Page <%= it.pageLabel %>

<%= it.imgEmbed %><%= it.text %>
<% if (it.comment) { %>
---
<%= it.comment %>
<% } %>

<%= it.tags.filter(t => t.type === 0).map(t => `#${t.name}`).join(' ') %>