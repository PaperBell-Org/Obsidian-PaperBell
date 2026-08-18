---
name: CIMPO
aliases:
  - CIPO
  - Cards-Inputs-Metadata-Projects-Outputs
  - CIMPO methodology
ch: 卡片-输入-元数据-项目-输出
keywords:
  - methodology
  - workflow
  - 方法论
  - 工作流
tags:
  - concept
category: concept
featured: true
---

## Description

> [!note] Definition
>
> **CIMPO** 是 `PaperBell` 的学术生涯管理方法论骨架：**Concepts（概念）- Inputs（输入）- Metadata（元数据）- Projects（项目）- Outputs（输出）**，分别对应仓库的 `10 - Cards` / `20 - Inputs` / `30 - Metadata` / `40 - Projects` / `50 - Outputs` 五个文件夹（`00 - Obsidian` 存放配置与脚本，不计入字母）。
>
> - **Concepts（概念）**：你写作时真正会用到的[[概念卡|概念]]，是一个有界的词表（软上限约 50）；
> - **Inputs（输入）**：论文、图书、网络文章等输入资料，携带[[关键词]]；
> - **Metadata（元数据）**：学者、机构、日记——把"人 / 地 / 时"的流水账沉淀下来，被关键词自动检索、被概念自动整合，供写作时调用素材；
> - **Projects（项目）**：长周期的[[科研项目]]，是最顶级的管理层，每个项目都锚定在几个概念上；
> - **Outputs（输出）**：你亲笔写下的[[输出系统|草稿与长文本]]，编辑性地选取概念。
>
> CIMPO 由 CIPO 扩展而来——新增的 **M（Metadata）** 把学者、机构、日记这类"元信息"单独成层。整套结构通过自动关联把知识连起来：项目-笔记、概念-想法、关键词-元信息。灵感，正产生于在这些已有知识之间建立新的关联。

%%cw:body%%
%%/cw:body%%

## 相关论文

![[概念反查.base#相关论文]]

## 相关学者

![[概念反查.base#相关学者]]

## 围绕此概念的输出

![[概念反查.base#围绕的输出]]

## 相关想法

```dataviewjs

let folderChoicePaths = ["30 - Metadata/DailyNote", "20 - Inputs", "50 - Outputs", "40 - Projects"];
const specificTag = "#想法"; // 指定要检查的标签，可以更改

const files = app.vault.getMarkdownFiles().filter(file => folderChoicePaths.some(path => file.path.includes(path)) );

let names = dv.current().aliases ? dv.current().aliases : [];
names.push(dv.current().name);
names.push(dv.current().ch);

let arr = files.map(async(file) => {
    const content = await app.vault.cachedRead(file);
    if (content.includes(specificTag)) {
        let lines = content.split("\n").filter(line => names.some(name => name && line.includes(name)));
        return ["[[" + file.name.split(".")[0] + "]]", lines];
    }
    return null;
});

Promise.all(arr).then(values => {
    const filteredValues = values.filter(value => value != null);
    const beautify = filteredValues.map(value => {
        const temp = value[1].map(line => line);
        return [value[0], temp];
    });
    const exists = beautify.filter(value => value[1][0])
        .sort((a, b) => a[0].localeCompare(b[0]));
    dv.table(["日期", "动态"], exists);
});

```
