<%
// 尝试从 paperbell 插件获取配置
let label = {};
let readSuccess = false; // 添加一个标志来跟踪是否成功读取数据
let readSource = "未知"; // 记录数据来源

try {
  // 假设可以通过 app.plugins.plugins 访问插件
  const paperbellPlugin = app.plugins.plugins.paperbell;
  if (paperbellPlugin && paperbellPlugin.settings &&
      paperbellPlugin.settings.ZotLitColors &&
      paperbellPlugin.settings.ZotLitColors.mapping) {

    // 从插件设置中提取颜色标签映射
    const colorMapping = paperbellPlugin.settings.ZotLitColors.mapping;

    // 将 mapping 对象转换成我们需要的格式 {colorName: label}
    Object.keys(colorMapping).forEach(color => {
      if (colorMapping[color] && colorMapping[color].label) {
        label[color] = colorMapping[color].label;
      }
    });

    // 如果至少读取到一个颜色标签，则标记为成功
    if (Object.keys(label).length > 0) {
      readSuccess = true;
      readSource = "paperbell插件";
    }
  }
} catch (e) {
  console.error("无法读取 paperbell 插件配置:", e);
}

console.log("paperbell插件检测:", !!app.plugins.plugins.paperbell);
console.log("paperbell设置检测:", !!(app.plugins.plugins.paperbell && app.plugins.plugins.paperbell.settings));
console.log("ZotLitColors检测:", !!(app.plugins.plugins.paperbell &&
                              app.plugins.plugins.paperbell.settings &&
                              app.plugins.plugins.paperbell.settings.ZotLitColors));

// 如果读取失败，使用默认映射作为备份
if (Object.keys(label).length === 0) {
  label = {
    "red": "Conclusion",
    "orange": "Keyword",
    "yellow": "Highlight",
    "gray": "Comment",
    "green": "Quote",
    "cyan": "Task",
    "blue": "Definition",
    "navy": "Definition",
    "purple": "Question",
    "brown": "Source",
    "magenta": "To Do"
  };
  readSource = "默认映射";
  console.log("使用默认映射进行笔记提取，请检查 PaperBell 插件配置。")
}
const byColor = Object.groupBy(it, (annot) => annot.colorName);
// 保持原来的逻辑
const colorSet = new Set([...Object.keys(label), ...Object.keys(byColor)]);
%>
<% for (const color of colorSet) {
  if (!(color in byColor)) continue
-%>

### <%= label[color] ?? color %>

<%_for (const annot of byColor[color]) { %>
<%~ include("annotation", annot) %>
<%%>
<%_ } %>
<% } %>
