title: "<%= it.title %>"

citekey: "<%= it.citekey %>"

tags: [paper, <%= it.tags.filter(t => t.name && t.name.startsWith('#')).map(t => '"' + t.name.slice(1) + '"').join(', ') %>]

cate: 论文

keywords: [<%let excludeEndings = ['更新', '推荐', '关联', '检索', '浏览', '初读', '精读', '星标'];
let filteredKeywordTags = (Array.isArray(it.tags) ? it.tags : []).filter(t =>
  t.name &&
  !t.name.startsWith('#') &&
  !t.name.includes('⭐') &&
  !t.name.includes('🌟') &&
  !excludeEndings.some(ending => t.name.endsWith(ending))
).map(t => '"' + t.name + '"');
%> <%= filteredKeywordTags.join(', ') %>]

read: [<% let endings = ['浏览', '初读', '精读']; %><%= it.tags.filter(t => t.name && endings.some(e => t.name.endsWith(e))).map(t => '"' + t.name + '"').join(', ') %>]

source: [<% let endings_2 = ['更新', '推荐', '关联', '检索']; %><%= it.tags.filter(t => t.name && endings_2.some(e => t.name.endsWith(e))).map(t => '"' + t.name + '"').join(', ') %>]

authors: [<%= it.authors %>]

journal: <%= it.publicationTitle %>

paper_date: <%= it.date %>

date: <%= (new Date(it.dateModified || Date.now())).toISOString().slice(0, 10) %>

<%

let isImportant = it.tags.some(t => t.name === '🌟星标');

%>

important: <%= isImportant ? 'True' : 'False' %>
