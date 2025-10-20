---
scene_alias: 结果
tags:
  - paper
  - results
  - features
status: completed
date: 2025-10-11
longform: true
---

本章展示 PaperBell 学术写作系统的核心特性和功能实现，通过具体示例说明各个组件如何协同工作，实现从写作到发布的完整流程。

### 特性一：项目化的长文本管理

#### Longform 插件集成

PaperBell 通过 Longform 插件实现论文的项目化管理，解决了单文件长文本难以维护的问题。每个研究项目以文件夹形式组织：

```text
Outputs/DEMO_Manuscript/
├── source/              # 章节源文件
│   ├── Introduction.md
│   ├── Methods.md
│   ├── Results.md
│   └── Discussion.md
├── imgs/                # 图片资源
├── Index.md             # 元数据配置
├── results.json         # 分析数据
└── manuscript.md        # 编译输出
```

这种结构化组织具有显著优势：

- **模块化写作**：每个章节独立编辑，降低认知负担（建议每章 < 500 行）
- **灵活排序**：通过拖拽调整章节顺序，无需重命名文件
- **协作友好**：多人可同时编辑不同章节，避免版本冲突
- **版本追踪**：Git 可精确追踪每个章节的修改历史

#### 场景（Scenes）系统

Longform 的场景系统支持复杂的文档结构。研究者可以创建章节组（如 Part I: Background），也可以将章节标记为草稿或待审阅状态：

```yaml
---
scene_title: "Methods"
tags: [draft, peer-review]
status: in-progress
---
```

编译时，Longform 会按照预设顺序自动合并所有章节，生成完整手稿。需要注意小标题的层级排布：

> [!tip] 标题层级说明
>
> 在 PaperBell 的 Longform 写作中，标题层级遵循以下规则：
>
> 1. **文档标题**（`title` in YAML）→ LaTeX 的 `\maketitle`
> 2. **Scene 标题**（`scene_title` in frontmatter）→ LaTeX 的 `\section`（二级标题 `##`）
> 3. **Scene 内的标题** → 从 `\subsection` 开始（三级标题 `###`）
>
> 这样可以确保最终 PDF 文档的标题层级结构清晰一致。

### 特性二：数据驱动的动态写作

> [!warning]
>
> 注意，本功能通过 Longform 的编译脚本 "Replace placeholders from JSON" 实现，如果你需要启用此功能，请将在“PaperBell 编译标准流程”（PaperBell-Standard）的基础上，将该脚本加入编译流程，并置于保存笔记（Save as Note）流程之前。

#### 占位符系统

PaperBell 的占位符系统实现了数据与文本的动态绑定。研究者在写作时使用占位符引用数据：

```markdown
我们整合了 {{results1.n_datasets}} 个重建数据集，
Pearson 相关系数为 {{results1.corr}}（p < 0.01）。
```

对应的 `results.json` 文件包含实际数值：

```json
{
  "results1": {
    "n_datasets": 10,
    "corr": 0.41,
    "n_pass_years": 30,
    "sig_sites_ratio": 0.9
  }
}
```

编译时，自定义脚本 `替换结果占位符.js` 自动将占位符替换为实际数值，生成：

```markdown
我们整合了 10 个重建数据集，
Pearson 相关系数为 0.41（p < 0.01）。
```

#### 路径解析能力

占位符系统支持复杂的数据结构访问：

- **嵌套对象**：`{{study.phase1.participants}}` → 访问 study.phase1.participants
- **数组索引**：`{{datasets[0].name}}` → 访问 datasets 数组第一个元素的 name 属性
- **混合路径**：`{{results.sites[2].correlation}}` → 嵌套对象与数组组合

这种灵活性使得研究者可以高效管理复杂的分析结果，实现真正的数据驱动写作。

#### 自动化优势

当实验数据更新时，研究者只需修改 `results.json` 文件，重新编译即可更新文档中所有相关数值。这避免了手动查找替换的错误风险，特别适合多次修订的论文项目。

### 特性三：智能化的元数据管理

#### YAML 前置元数据

PaperBell 使用 YAML 格式集中管理论文元数据，包括标题、作者、机构、摘要、关键词等：

```yaml
---
title: "Archival documentation reveals perceptual bias"
date: "2025-10-11"

authors:
  - name: "Shuang Song"
    affiliation: [1, 2, 3]
    corresponding: "song@gea.mpg.de"
  - name: "Bo Hu"
    affiliation: [4]

affiliations:
  - index: 1
    name: "Max Planck Institute of Geoanthropology"
  - index: 2
    name: "Beijing Normal University"

abstract: "It is well-documented that..."
keywords: ["collective memory", "extreme events"]

target: "Nature Human Behaviour"
acronym: "DEMO"
csl: "nature"
---
```

#### 自动化元数据注入

Longform 自定义脚本 `编译后增加头文件.js` 在编译时自动读取元数据，并注入到最终文档。该脚本具有以下特点：

1. **用户选项优先**：如果在编译时手动指定选项（如引用样式），会覆盖元数据中的默认值
2. **完整作者信息处理**：自动解析作者-机构索引关系，标记通讯作者
3. **灵活格式配置**：支持行号、图表位置、引用样式等动态选项

#### 多期刊适配

同一份手稿可以通过调整元数据快速适配不同期刊：

```yaml
# 投稿 Nature 系列
csl: "nature"
target: "Nature Human Behaviour"

# 投稿 APA 期刊
csl: "apa"
target: "Journal of Environmental Psychology"
```

编译时自动应用对应的引用格式和排版样式，无需手动调整。

### 特性四：专业级的 PDF 导出

#### PaperBell 学术模板

PaperBell 提供了基于 Eisvogel 定制的 LaTeX 模板 `paperbell.latex`，专为学术手稿设计。模板特性包括：

1. **统一字体系统**：全文使用 Times New Roman（标题、正文、图表标题、页眉页脚），符合国际期刊标准
2. **智能行号控制**：支持 `lineno: "true"` 选项显示行号，便于审稿和讨论；参考文献部分自动关闭行号
3. **图表位置灵活性**：支持 `figures-at-end: "true"` 将所有图表置于文末（参考文献之前）
4. **页眉页脚定制**：
   - 左页眉：Manuscript: {acronym}
   - 右页眉：{date}
   - 左页脚：Submission: {target}
   - 右页脚：页码
5. **图表标题格式化**：无缩进、两端对齐、Times New Roman 字体、加粗标签
6. **紧凑学术格式**：优化标题间距，移除不必要的空白

#### Pandoc 编译流程

PaperBell 使用 Pandoc 作为文档转换引擎，配置文件 `pdf.yaml` 定义了完整的编译流程：

```yaml
from: markdown+tex_math_single_backslash+wikilinks_title_after_pipe
pdf-engine: xelatex
template: paperbell.latex

filters:
  - pandoc-crossref  # 交叉引用
  - citeproc         # 引用处理

metadata:
  numbersections: true
  link-citations: true
```

编译过程如下：

1. **Markdown 解析**：支持扩展语法（数学公式、Wiki 链接、表格）
2. **交叉引用处理**：`pandoc-crossref` 解析 `{#fig:label}` 和 `[@eq:label]`
3. **引用格式化**：`citeproc` 根据 CSL 文件格式化参考文献
4. **LaTeX 渲染**：`xelatex` 生成最终 PDF

#### 多种导出选项

PaperBell 支持通过 Obsidian Enhancing Export 插件或命令行进行 PDF 导出：

**插件导出（推荐）**：

- 在 Obsidian 中右键点击 `manuscript.md`
- 选择 "Export with Enhancing Export"
- 选择 "PaperBell Academic" 配置
- 自动生成 PDF

**命令行导出**：

```bash
pandoc manuscript.md -o output.pdf \
  --defaults="40 - Obsidian/脚本/Pandoc/defaults/pdf.yaml" \
  -M lineno=true \
  -M figures-at-end=false
```

命令行方式适合批量编译和自动化流程（如 GitHub Actions）。

### 特性五：完整的引用管理集成

#### Zotero 联动

PaperBell 通过 ZotLit 插件实现与 Zotero 的深度集成：

1. **文献导入**：在 Zotero 中标注文献后，右键选择 "Create Literature Note(s)"，自动导入到 Obsidian
2. **高亮同步**：Zotero 中的彩色高亮和批注自动转换为 Obsidian 笔记
3. **引用键生成**：自动生成引用键（如 `song2025collective`），用于文中引用

#### 引用工作流

在写作时使用 Pandoc 引用语法：

```markdown
已有研究表明集体记忆影响气候适应 [@song2025collective; @smith2023memory]。
如 @jones2024perception 所述，认知偏差广泛存在。
```

编译时自动格式化为：

> 已有研究表明集体记忆影响气候适应 (Song et al., 2025; Smith et al., 2023)。
> 如 Jones et al. (2024) 所述，认知偏差广泛存在。

参考文献列表自动生成并格式化：

> **References**
>
> Jones, A., et al. (2024). Perception and cognition. *Nature*, 123, 456-789.
>
> Smith, B., et al. (2023). Memory studies. *Science*, 234, 567-890.

#### 多样化的引用样式

PaperBell 支持数千种期刊的引用样式（通过 CSL 文件）：

- **Nature 系列**：数字上标 [1, 2]
- **APA 格式**：作者-日期 (Author, 2024)
- **国标格式**：[1] 作者, 标题, 期刊, 年份

只需在元数据中指定 `csl: "nature"` 或 `csl: "apa"`，即可自动应用对应样式。

### 特性六：交叉引用与编号系统

#### 图表自动编号

使用 `pandoc-crossref` 过滤器，PaperBell 实现了智能的图表编号：

```markdown
![研究区域地图](imgs/study_area.png){#fig:map}

如 [@fig:map] 所示，研究区域位于...
```

编译后自动生成：

> **Figure 1.** 研究区域地图
>
> 如 Figure 1 所示，研究区域位于...

#### 公式编号

数学公式同样支持自动编号：

```markdown
我们使用以下模型：

$$ y = \beta_0 + \beta_1 x + \epsilon $$ {#eq:model}

根据 [@eq:model]，我们估计参数...
```

编译后：

> 我们使用以下模型：
>
> $$ y = \beta_0 + \beta_1 x + \epsilon \quad (1) $$
>
> 根据 Equation 1，我们估计参数...

#### 表格编号

表格编号与图表一致：

```markdown
| 变量 | 均值 | 标准差 |
|------|------|--------|
| 温度 | 15.3 | 2.1    |
| 降水 | 800  | 120    |

Table: 描述统计 {#tbl:stats}

[@tbl:stats] 展示了描述统计结果。
```

编译后自动编号并生成引用。

### 特性七：版本控制与协作

#### Git 集成

PaperBell 项目天然适合 Git 版本控制：

```bash
# 追踪修改
git add Outputs/DEMO_Manuscript/source/Results.md
git commit -m "Add correlation analysis"

# 创建版本标签
git tag -a v1.0-draft -m "First complete draft"

# 多人协作
git checkout -b coauthor-revision
```

纯文本格式使得 Git 可以精确显示每一行的修改，方便审阅和回滚。

#### 协作写作场景

PaperBell 支持多种协作模式：

1. **分章节协作**：作者 A 编辑 Methods.md，作者 B 编辑 Results.md，互不干扰
2. **审阅-修订循环**：导出带行号的 PDF 供审稿人标注，根据行号快速定位修改
3. **版本对比**：使用 Git diff 精确对比不同版本的修改内容

#### 云同步支持

除 Git 外，PaperBell 项目也兼容各种云同步服务：

- **iCloud**：Mac 用户的自动同步方案
- **OneDrive/Dropbox**：跨平台云存储
- **Obsidian Sync**：官方加密同步服务

小文件特性确保同步速度快且不易产生冲突。

### 特性八：可扩展的自动化系统

#### 自定义 Longform 脚本

PaperBell 提供了两个核心自定义脚本，用户也可以编写自己的脚本：

1. **编译后增加头文件.js**：
   - 从 Index.md 读取元数据
   - 注入 YAML 前置内容
   - 支持用户选项覆盖

2. **替换结果占位符.js**：
   - 解析 results.json
   - 替换 {{path.to.value}} 占位符
   - 支持嵌套对象和数组

#### Pandoc 过滤器

用户可以编写 Lua 过滤器扩展 Pandoc 功能：

```lua
-- 自动添加图表前缀
function Image(elem)
  elem.caption = pandoc.Str("Figure: ") .. elem.caption
  return elem
end
```

#### 批量处理脚本

PaperBell 支持批量编译多个项目：

```bash
#!/bin/bash
for project in Outputs/*/manuscript.md; do
  pandoc "$project" --defaults=pdf.yaml -o "${project%.md}.pdf"
done
```

这些自动化能力使 PaperBell 能够适应各种复杂的科研写作场景。

### 小结

本章展示了 PaperBell 的八大核心特性：项目化管理、数据驱动写作、智能元数据、专业导出、引用集成、交叉引用、版本控制和可扩展性。这些特性协同工作，构建了一套完整的现代化学术写作系统。

下一章将讨论如何根据不同场景配置 PaperBell，分享最佳实践和进阶自定义技巧。
