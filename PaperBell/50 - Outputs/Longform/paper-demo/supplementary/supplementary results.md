---
scene_alias: 补充结果
tags:
  - longform
status: not-started
longform: true
---

# 补充结果

本节演示补充材料的编号规则：因为 `supplementary/metadata.json` 里 `extra_yaml` 设了 `supplementary: true`，下面的图会被编号为 **S1** 而不是 1。

![PaperBell 的格式化效果](formatting.png){#fig:si-formatting height=300px}

正文里可以用 `@fig:si-formatting` 引用它，编译后会渲染成「图 S1」。

`results.json` 的占位符在补充材料里同样可用：本示例库共有 {{ summary.n_plugins }} 个核心插件、{{ summary.n_workflows }} 条 PaperBell 编译工作流。
