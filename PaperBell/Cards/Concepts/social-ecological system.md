---
name: social-ecological system
aliases:
  - 
  - social-ecological system
tags:
  - concept
---

## Description
> [!seealso]+ Source
> 💡 **本概念由 [[ABSESpy]] 笔记创建而来**

> [!bot] AI
> 
> "social-ecological system"是一个重要的概念，建议进一步研究和定义其内涵和外延。 #TODO
## 相关论文
![[概念检索论文.base]]

## 相关想法

```dataviewjs

let folderChoicePaths = ["00 - 每日日记/DailyNote", "Inputs", "Outputs", "Projects"];
const specificTag = "#想法"; // 指定要检查的标签，可以更改

const files = app.vault.getMarkdownFiles().filter(file => folderChoicePaths.some(path => file.path.includes(path)) );

let names = dv.current().aliases ? dv.current().aliases : [];
names.push(dv.current().name);
names.push(dv.current().ch);

let arr = files.map(async(file) => {
    const content = await app.vault.cachedRead(file);
    // 确保文件内容包含特定标签
    if (content.includes(specificTag)) {
        let lines = content.split("\n").filter(line => names.some(name => line.includes(name)));
        return ["[[" + file.name.split(".")[0] + "]]", lines];
    }
    return null; // 如果不包含标签，返回 null
});

Promise.all(arr).then(values => {
    // 过滤掉 null 结果
    const filteredValues = values.filter(value => value != null);

    const beautify = filteredValues.map(value => {
        const temp = value[1].map(line => line); // 美化处理
        return [value[0], temp];
    });

    const exists = beautify.filter(value => value[1][0] && value[0] != "[[未命名 10]]")
        .sort((a, b) => a[0].localeCompare(b[0])); // 排序处理修正为 localeCompare

    dv.table(["日期", "动态"], exists);
});

```
