---
longform:
  format: scenes
  title: PaperBell学术写作完全指南
  workflow: PaperBell-Standard
  sceneFolder: source
  scenes:
    - DEMO_引言
    - DEMO_结果
    - DEMO_讨论
    - DEMO_方法
  ignoredFiles: []
title: PaperBell：基于 Obsidian 的学术写作管理系统
subtitle: 从 Markdown 到专业论文的完整工作流
date: 2025-10-11
authors:
  - name: Shuang Song
    affiliation:
      - 1
      - 2
    corresponding: paperbell@songshgeo.com
  - name: Sen Jiang
    affiliation:
      - 2
affiliations:
  - index: 1
    name: Max Planck Institute of Geoanthropology, Jena, Germany
  - index: 2
    name: PaperBell Technology, Beijing, China
abstract: 本文介绍了 PaperBell 学术写作管理系统，一套基于 Obsidian、Longform、Pandoc 和 LaTeX 的现代化学术写作解决方案。传统的 Microsoft Word 写作存在版本追踪混乱、输入输出分离、格式调整分散注意力等问题。虽然 Markdown 写作具有纯文本、版本控制友好、易于自动化等优势，但传统 Markdown 工作流在长文本管理、导出格式和手动调整方面仍有局限。PaperBell 通过整合项目化管理、数据驱动写作、智能元数据管理和专业级 PDF 导出等核心特性，系统性地解决了这些问题。本文从引言、结果、讨论、方法四个方面全面介绍了 PaperBell 的设计理念、核心特性、配置方案、最佳实践和安装步骤，为学术研究者提供了一套完整的现代化写作工具链。
keywords:
  - academic writing
  - Obsidian
  - Longform
  - Pandoc
  - LaTeX
  - knowledge management
  - workflow automation
target: PaperBell Documentation
acronym: DEMO
csl: nature
lineno: "false"
figures-at-end: "false"
titlepage: true
numbersections: true
---

这是一个完整的 PaperBell Longform 演示项目，展示了如何使用 PaperBell 进行学术论文写作。

## 📚 项目结构

```bash
demo/
├── Index.md              # 项目元数据配置
├── source/               # 章节源文件
│   ├── DEMO_引言.md     # 第一章：引言
│   ├── DEMO_结果.md     # 第二章：结果
│   ├── DEMO_讨论.md     # 第三章：讨论
│   └── DEMO_方法.md     # 第四章：方法
├── imgs/                 # 图片资源文件夹
└── README.md            # 本文件
```

## 🎯 内容概览

这份文档模仿学术论文的结构，分为四个章节：

### 1️⃣ 引言

- 传统学术写作的挑战
- Markdown 写作的优势与局限
- PaperBell 工作流的创新价值
- 本文的目标与结构

### 2️⃣ 结果

展示 PaperBell 的八大核心特性：

- 项目化的长文本管理
- 数据驱动的动态写作
- 智能化的元数据管理
- 专业级的 PDF 导出
- 完整的引用管理集成
- 交叉引用与编号系统
- 版本控制与协作
- 可扩展的自动化系统

### 3️⃣ 讨论

- 常用配置方案（快速投稿、审稿讨论、修订响应、期刊特定）
- 最佳实践（元数据管理、数据文本分离、渐进式写作等）
- 进阶自定义（扩展占位符、多语言支持、自动化等）

### 4️⃣ 方法

- 前期准备（系统要求、软件安装）
- 配置 PaperBell（插件、模板、导出）
- 创建第一个项目
- 故障排除

## 📝 标题层级规则

在 PaperBell 的 Longform 写作中，标题层级遵循以下规则：

- **文档标题**（`title` in YAML）→ LaTeX 的 `\maketitle`
- **Scene 标题**（`scene_title` in frontmatter）→ LaTeX 的 `\section`（二级标题 `##`）
- **Scene 内的标题** → 从 `\subsection` 开始（三级标题 `###`）

这样可以确保最终 PDF 文档的标题层级结构清晰一致。

## 🚀 如何使用

### 在 Obsidian 中查看

1. 在 Obsidian 中打开 PaperBell 仓库
2. 在左侧边栏找到 Longform 图标
3. 选择 "PaperBell学术写作完全指南" 项目
4. 点击各个 scene 查看内容

### 编译为完整手稿

1. 在 Longform 面板中选择本项目
2. 点击 **Compile** 选项卡
3. 确保编译步骤包含：
   - Strip Frontmatter
   - Remove Links
   - Prepend Title
   - Concatenate Text
   - Add YAML Metadata (Note Name: `Index`)
   - Save as Note
4. 点击 **Compile** 生成 `manuscript.md`

### 导出为 PDF

方法 1：使用 Enhancing Export

1. 右键点击编译生成的 `manuscript.md`
2. 选择 "Export with Enhancing Export"
3. 选择 "PaperBell Academic" 配置

方法 2：使用命令行

```bash
cd Outputs/demo
pandoc manuscript.md -o PaperBell_Guide.pdf \
  --defaults="../../40 - Obsidian/脚本/Pandoc/defaults/pdf.yaml"
```

## 📖 文档特点

- **内容全面**：涵盖 PaperBell 的所有核心功能和最佳实践
- **结构清晰**：遵循学术论文的标准结构（引言-结果-讨论-方法）
- **实用导向**：包含大量代码示例、配置模板和操作步骤
- **可操作性强**：提供详细的安装指南和故障排除方案

## 🎓 适合人群

- 初次接触 PaperBell 的用户
- 想要了解 Longform 学术写作流程的研究者
- 需要参考最佳实践的高级用户
- 准备自定义 PaperBell 工作流的开发者

## 📧 联系方式

- **PaperBell**: <paperbell@songshgeo.com>
- **Shuang Song**: <songshgeo@gmail.com>
- **GitHub**: <https://github.com/SongshGeo/PaperBell>
