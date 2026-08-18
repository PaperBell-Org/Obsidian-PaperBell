---
cssclasses: longform-props
longform:
  format: scenes
  title: PaperBell-DEMO
  draftTitle: Main Manuscript
  workflow: PaperBell Manuscript
  sceneFolder: manuscript
  scenes:
    - DEMO_引言
    - DEMO_结果
    - DEMO_讨论
    - DEMO_方法
  sceneTemplate: 00 - Obsidian/模板/学术长文本模板 Longform academic template.md
  ignoredFiles: []
title: PaperBell：基于 Obsidian 的学术写作管理系统
subtitle: 从 Markdown 到专业论文的完整工作流
date: 2026-06-06
target: PaperBell Documentation
acronym: DEMO
concepts:
  - "[[输出系统]]"
  - "[[CIMPO]]"
  - "[[学术写作]]"
project: demo
---

**PaperBell-DEMO** 的主手稿。

出版元信息（标题、作者、机构、通讯作者、导出模板）统一放在本文件夹的 `metadata.json`，编译时由 `add-zenodo-frontmatter` 步骤注入编译产物的 frontmatter —— **不要**在这里重复写 `authors:`。

用 **PaperBell Manuscript** 工作流编译：它会替换 `results.json` 里的 `{{ }}` 占位符、注入作者块、导出 PDF，并抓取行号与图号（`manuscript-lines.json` / `figure-numbers.json`）供回复信引用。
