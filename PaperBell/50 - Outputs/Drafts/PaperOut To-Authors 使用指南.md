# PaperOut To-Authors 使用指南

> [!abstract] **PaperOut 能帮你做什么**
> PaperBell 套件里负责 **学术写作与导出** 的 Obsidian 插件（基于 Longform 分支）。三步走：
>
> **① 一键搭好论文脚手架　→　② 从市场下载 Pandoc 工具链　→　③ 批量编译导出 PDF / Word**

> [!tip] 面板入口
> 左侧边栏的 **PaperOut 图标**，或命令面板搜索 `PaperOut`。

> [!note] 想了解它在整个套件里的定位与路线图？
> 见同目录 [[PaperOut 协作与使用场景.md]]。本文只讲**动手操作**。

---

## 一、🚀 一键新建论文项目

> [!success] 不用从空文件夹开始
> **文件夹右键 →「新建 PaperBell 论文项目…」**，或命令面板 `新建 PaperBell 论文项目`。
> 输入项目标题（缩写自动生成、可改），一次生成**一个项目的四份草稿**。

一个论文项目自动包含四份草稿：

| 草稿 | 用途 | 特点 |
| --- | --- | --- |
| 📄 **Main Manuscript** | 正稿 | 多场景：`manuscript/introduction · methods · results` |
| 📎 **Supplementary** | 补充材料 | 自动 S 编号 |
| ✉️ **Response Letter** | 审稿回复信 | 支持手稿引用同步 |
| 📮 **Cover Letter** | 投稿信 | 单文件，moderncv 信头 |

> [!info] 还会附带这些"开箱即用"文件
> `metadata.json`（出版元数据）· `results.json`（编译期占位符）· `references.bib` · `README.md`，
> 以及**内联示例图/表**（开箱即可编译）。
>
> 起步内容演示了**所有写作约定**——highlight、脚注、公式、图表交叉引用、`{{占位符}}`、`[@引用]`——照着改即可。

---

## 二、📦 资产市场（下载 Pandoc 工具链）

> [!warning] 为什么要单独下载？
> 导出 PDF 需要 Pandoc 工具链（**配方** recipe、**过滤器** filter、**模板** template、**CSL** 引用样式）。它**不随插件打包**，从独立资产仓库按需下载——保持插件轻量、工具链可更新。

### 🔍 打开市场（三个入口任选）

- 命令面板：`浏览 Pandoc 资产市场`
- 设置 → 编译 → Pandoc 资产 →「浏览资产市场…」
- 「设置 Pandoc 导出」页里的「浏览资产市场…」按钮

### 📦 套件 vs 单个资产

> [!tip] 推荐装**套件（Bundle）**——一个配方所需的全部东西一键装齐
>
> - **常用套件**：`PaperBell 手稿 (PDF)`、`审稿回复信 (PDF)`、`投稿信 (PDF)`、`补充材料`
> - **一次到位**：⭐ **`Full Pandoc toolchain`**（含全部配方 + 全部 CSL）

**单个资产**：单独的配方或 **CSL 样式**（如 `Nature 样式`、`APA 第 7 版`）。过滤器/模板会作为配方依赖自动安装，不单独列出。

### 🔘 安装 / 已安装 / 卸载

| 卡片状态 | 显示 |
| --- | --- |
| 未安装 | 「安装」按钮 |
| 已安装 | 绿色 ✓ +「已安装」 |
| 自己 sync 进来的 | ✓ +「重装」 |

> [!note] 查看资产详情
> **点开任意资产**进入详情页：看它的 README 用法、依赖、系统工具。
> 已安装的右下角有红色「**卸载**」按钮（确认后从资产目录删除文件）。

### ⚠️ 关键：不同草稿需要不同配方

> [!danger] 四份草稿用四种配方，各需对应资产
>
> | 草稿 | 配方 | 需要安装 |
> |---|---|---|
> | Main Manuscript / Supplementary | PaperBell Manuscript | `PaperBell 手稿` 套件 |
> | Response Letter | PaperBell Response Letter | `审稿回复信` 套件 |
> | Cover Letter | PaperBell Cover Letter | `投稿信` 套件 |
> | 引用样式（所有草稿） | — | 对应 **CSL**（如 `Nature 样式`） |
>
> ✅ **最省事**：直接装 **`Full Pandoc toolchain`** 套件，四种配方 + 全部 CSL 一次装齐。

### 🛠️ 首次配置（系统工具）

命令 `设置 Pandoc 导出` 会检查三个**需自行安装**的系统工具：

```bash
brew install pandoc              # pandoc
brew install --cask mactex-no-gui   # xelatex（MacTeX）
brew install pandoc-crossref     # pandoc-crossref
```

> [!info] 资产落在哪？
> 工具链资产在同一页「浏览资产市场」下载，默认落在库内 **`PaperBell/pandoc/`**。
> 👉 你在那里的**手动修改不会被插件更新覆盖**。

---

## 三、⚙️ 批量编译看板

> [!success] 一个看板搞定全部草稿
> 编译标签页 →「**Compile All Drafts…**」打开批量编译看板。

**看板怎么读、怎么用：**

- 📊 每行一个草稿，横向展示编译流水线：待运行步骤显示**序号**、完成 ✓、进行中转圈、出错 ✕
- 🔄 **左侧可切换**该草稿用的 workflow（默认已选对）
- 🔵 **点步骤圆点**查看/编辑该步骤参数（悬停预览步骤名）
- ↕️ **上下拖动整行**调整编译顺序
- 🎛️ 顶部**批量开关**（本次全部草稿生效）：干跑 / 导出后打开 PDF / 抓行号
- ▶️ 点「运行」串行编译；某行失败**不阻断**其余
- ❌ **失败行**：错误提示可点击 →「查看错误」展开完整错误（可选中、有「复制」按钮）

> [!danger] 顺序很重要！
> **Response Letter 依赖 Main Manuscript / SI 的行号**——务必先编译手稿，再编译回复信（拖动整行调整顺序）。

---

## 四、❓ 常见问题

> [!question]- 导出失败，提示缺 `defaults/xxx.yaml`
> 该草稿的**配方没装**。去市场装对应套件（见上面的配方对照表）。

> [!question]- 提示缺 `csl/nature.csl`
> **CSL 样式没装**。市场单资产区装「Nature 样式」，或直接装 `Full` 套件。

> [!question]- 回复信里 `@fig:demo` / `@手稿引用` 解析不到
> **先编译 Main Manuscript**（它会抓取行号/图号到 sidecar），再编译 Response Letter。

> [!question]- Cover Letter 信头空白
> 信头信息来自 `cover/Cover Letter.md` 的 frontmatter（`to`/`date`/`manuscript`/`corresponding`）+ `metadata.json`（标题/期刊）。

> [!question]- 想导出到库外
> 设置 → 编译 → Pandoc 输出文件夹填**绝对路径**（如 `~/Papers`）。

---

> [!cite] 延伸阅读
>
> - 资产仓库规范：插件仓库 `docs/ASSET_MARKETPLACE_SPEC.md`
> - Pandoc 导出细节：`docs/PANDOC_EXPORT.md`
> - 套件定位与路线图：[[PaperOut 协作与使用场景.md]]
