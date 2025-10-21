---
scene_alias: 方法
tags:
  - paper
  - methods
  - installation
status: completed
date: 2025-10-11
longform: true
---

本章提供 PaperBell 学术写作系统的完整安装指南、详细配置步骤和常见问题的解决方案。

### 前期准备

#### 系统要求

##### 操作系统

- macOS 10.15+
- Windows 10/11
- Linux (Ubuntu 20.04+)

##### 必需软件

- Obsidian 1.0.0+
- Pandoc 2.19+
- LaTeX 发行版（TeX Live 2022+ 或 MacTeX 2022+）
- Zotero 6.0+（用于文献管理）

##### 硬件建议

- RAM: ≥8GB（编译大型文档需要）
- 存储: ≥5GB 可用空间（LaTeX 发行版约 4GB）
- 处理器: 现代多核处理器（编译速度更快）

#### 软件安装

##### 1. 安装 Obsidian

访问 [Obsidian 官网](https://obsidian.md/) 下载对应平台的安装包。

##### macOS

```bash
brew install --cask obsidian
```

##### Windows

下载 `.exe` 安装程序

##### Linux

```bash
# Debian/Ubuntu
wget https://github.com/obsidianmd/obsidian-releases/releases/download/v1.4.0/obsidian_1.4.0_amd64.deb
sudo dpkg -i obsidian_1.4.0_amd64.deb

# Arch Linux
yay -S obsidian
```

##### 2. 安装 Pandoc

**macOS**:

```bash
brew install pandoc
```

**Windows**:

- 下载 [Pandoc MSI 安装程序](https://pandoc.org/installing.html)
- 或使用 Chocolatey: `choco install pandoc`

**Linux**:

```bash
# Debian/Ubuntu
sudo apt install pandoc

# Fedora
sudo dnf install pandoc
```

**验证安装**:

```bash
pandoc --version
# 应显示 pandoc 2.19 或更高版本
```

##### 3. 安装 LaTeX

**macOS**:

```bash
# 使用 Homebrew 安装 BasicTeX（轻量级）
brew install --cask basictex

# 或安装完整的 MacTeX（推荐，约 4GB）
brew install --cask mactex

# 安装后更新包管理器
sudo tlmgr update --self
sudo tlmgr install collection-fontsrecommended
```

**Windows**:

- 下载 [MiKTeX](https://miktex.org/download) 或 [TeX Live](https://www.tug.org/texlive/)
- 运行安装程序，选择完整安装
- 在安装过程中启用 "自动安装缺失包"

**Linux**:

```bash
# Debian/Ubuntu
sudo apt install texlive-full

# Fedora
sudo dnf install texlive-scheme-full
```

**验证安装**:

```bash
xelatex --version
# 应显示 XeTeX 版本信息
```

##### 4. 安装 Pandoc Crossref

**macOS/Linux**:

```bash
# 方法 1: 使用包管理器
brew install pandoc-crossref  # macOS

# 方法 2: 手动下载
wget https://github.com/lierdakil/pandoc-crossref/releases/download/v0.3.17.0/pandoc-crossref-macOS.tar.xz
tar -xf pandoc-crossref-macOS.tar.xz
sudo mv pandoc-crossref /usr/local/bin/
```

**Windows**:

- 下载 [pandoc-crossref Windows 版本](https://github.com/lierdakil/pandoc-crossref/releases)
- 解压后将 `pandoc-crossref.exe` 放入 Pandoc 安装目录

**验证安装**:

```bash
pandoc-crossref --version
```

##### 5. 安装 Zotero 及插件

**Zotero 主程序**:

- 访问 [Zotero 官网](https://www.zotero.org/download/) 下载安装

**Better BibTeX 插件**:

1. 下载 [Better BibTeX XPI 文件](https://retorque.re/zotero-better-bibtex/installation/)
2. 在 Zotero 中：Tools → Add-ons → 齿轮图标 → Install Add-on From File
3. 选择下载的 `.xpi` 文件

**配置 Better BibTeX**:

- 在 Zotero 设置中，Better BibTeX → Citation Keys
- Citation key formula: `[auth:lower][year][shorttitle1_1]`
- 例如生成：`song2025collective`

### 配置 PaperBell

#### 步骤一：获取 PaperBell 模板

##### 方法 1：克隆完整仓库（推荐）

```bash
# 克隆 PaperBell 仓库
git clone https://github.com/SongshGeo/PaperBell.git

# 在 Obsidian 中打开 PaperBell 文件夹
```

##### 方法 2：手动配置

如果只想使用核心组件，可以手动创建目录结构：

```bash
mkdir -p YourVault/40\ -\ Obsidian/脚本/{longform,Pandoc/{defaults,templates,filters}}
mkdir -p YourVault/Outputs
mkdir -p YourVault/Inputs/Zotero
```

#### 步骤二：安装 Obsidian 插件

在 Obsidian 中打开设置（Settings → Community plugins）：

##### 核心插件列表

| 插件名称 | 用途 | 必需性 |
|---------|------|--------|
| **Longform** | 长文本项目管理 | ✅ 必需 |
| **Templater** | 模板引擎 | ✅ 必需 |
| **Obsidian Enhancing Export** | PDF 导出 | ✅ 必需 |
| **ZotLit** | Zotero 集成 | ✅ 必需 |
| **Dataview** | 数据查询展示 | 推荐 |
| **Obsidian Git** | 版本控制 | 推荐 |

**安装步骤**：

1. 关闭安全模式（Turn off Safe Mode）
2. 点击 Browse 搜索插件名称
3. 点击 Install，然后 Enable

#### 步骤三：配置 Longform 插件

**基础设置**（Settings → Longform）：

```yaml
# Projects Folder
Projects folder: Outputs

# Scenes
Scene folder name: source
Include scene titles in compile: Yes

# Compile Workflow
Workflow folder: 40 - Obsidian/脚本/longform
Compile in place: Yes

# Draft Management
Draft folder: Drafts
Auto-save sessions: Yes
```

**添加自定义编译脚本**：

1. 将 `编译后增加头文件.js` 放入 `40 - Obsidian/脚本/longform/`
2. 将 `替换结果占位符.js` 放入同一目录
3. 重启 Obsidian 或重新加载 Longform 插件

**验证脚本加载**：

- 在 Longform 面板中选择任一项目
- 点击 Compile → Configure Steps
- 应能看到 "Add YAML Metadata" 和 "Replace placeholders from JSON"

#### 步骤四：配置 Pandoc 模板

PaperBell 提供了完整的 Pandoc 配置系统，包括 defaults 文件、LaTeX 模板、Lua 过滤器和 CSL 引用样式。

##### 理解 Pandoc Defaults 文件

PaperBell 在 `40 - Obsidian/脚本/pandoc/defaults/` 目录下提供了预配置的 defaults 文件：

| 文件名 | 用途 | 主要差异 |
|--------|------|----------|
| `paperbell.yaml` | macOS/Linux 系统 | 中文字体：Songti SC、Heiti SC、STFangsong |
| `paperbell-windows.yaml` | Windows 系统 | 中文字体：SimSun、SimHei、FangSong |
| `beamer.yaml` | 演示文稿导出 | 使用 Beamer 模板 |
| `crossref.yaml` | 交叉引用配置 | pandoc-crossref 插件配置 |

**为什么需要两个 paperbell 配置？**

不同操作系统的中文字体名称不同：

```yaml
# macOS/Linux (paperbell.yaml)
metadata:
  CJKmainfont: Songti SC      # 宋体
  CJKsansfont: Heiti SC       # 黑体
  CJKmonofont: STFangsong     # 仿宋

# Windows (paperbell-windows.yaml)
metadata:
  CJKmainfont: SimSun         # 宋体
  CJKsansfont: SimHei         # 黑体
  CJKmonofont: FangSong       # 仿宋
```

##### 自动检测机制

Longform 的 "Add YAML Metadata" 脚本会自动检测操作系统：

```javascript
// 自动检测逻辑
if (!template || template === "") {
  const platform = process.platform;
  if (platform === "darwin" || platform === "linux") {
    template = "paperbell";           // 使用 paperbell.yaml
  } else if (platform === "win32") {
    template = "paperbell-windows";   // 使用 paperbell-windows.yaml
  }
}
```

##### 手动指定模板

在 Longform 编译时，可以在 "Pandoc Template" 文本框中手动指定：

```yaml
# 使用 Unix 版本（即使在 Windows 上）
Pandoc Template: paperbell

# 使用 Windows 版本（即使在 macOS 上）
Pandoc Template: paperbell-windows

# 使用其他模板
Pandoc Template: eisvogel
Pandoc Template: my-custom-template
```

##### 创建自定义 Defaults 文件

你可以创建自己的 defaults 配置文件：

1. **创建新的 defaults 文件**：

在 `40 - Obsidian/脚本/Pandoc/defaults/` 创建 `my-workflow.yaml`：

```yaml
---
## General options
standalone: true
pdf-engine: xelatex
data-dir: ${.}/..

## Templates
template: ${USERDATA}/templates/my-template.latex

## Bibliography
bibliography: ${USERDATA}/../../mybib.bib
csl: ${USERDATA}/my-style.csl

## Filters
filters:
  - ${USERDATA}/filters/shift_headings.lua
  - pandoc-crossref
  - citeproc

## Metadata
metadata:
  CJKmainfont: "Your Preferred Font"
  mainfont: "Your Preferred Font"
  numbersections: true
  link-citations: true
```

2. **在 Longform 中使用**：

编译时在 Template 选项中输入 `my-workflow`。

##### 文件结构说明

```bash
40 - Obsidian/脚本/pandoc/
├── defaults/              # Pandoc defaults 配置文件
│   ├── paperbell.yaml    # Unix 系统配置
│   ├── paperbell-windows.yaml  # Windows 系统配置
│   ├── beamer.yaml       # 演示文稿配置
│   └── crossref.yaml     # 交叉引用配置
│
├── templates/             # LaTeX 模板文件
│   └── paperbell.latex   # PaperBell 学术模板
│
├── filters/               # Pandoc Lua 过滤器
│   ├── shift_headings.lua  # 调整标题层级
│   ├── image.lua          # 图片处理
│   ├── callout.lua        # Callout 渲染
│   └── ...                # 其他过滤器
│
├── csl/                   # 引用样式文件
│   ├── nature.csl
│   ├── apa.csl
│   └── ...
│
└── preamble.sty          # LaTeX 导言区自定义
```

##### 验证配置

```bash
# 查看 defaults 文件内容
cat "40 - Obsidian/脚本/pandoc/defaults/paperbell.yaml"

# 测试 defaults 配置
cd "40 - Obsidian/脚本/pandoc"
pandoc --defaults=paperbell.yaml test.md -o test.pdf

# 查看可用的过滤器
ls "40 - Obsidian/脚本/pandoc/filters/"
```

#### 步骤五：配置 Zotero 导出

**配置 Better BibTeX 自动导出**：

1. 在 Zotero 中选择你的文献库
2. 右键 → Export Library
3. 格式选择：Better BibTeX
4. 勾选 "Keep updated"
5. 导出位置：`YourVault/40 - Obsidian/mybib.bib`

**配置 ZotLit 插件**（Obsidian）：

Settings → ZotLit：

```yaml
# Zotero Connection
Zotero Path: /Users/yourname/Zotero  # Zotero 数据目录

# Note Templates
Literature Note Template: 40 - Obsidian/模板/Literature Note.md
Note Location: Inputs/Zotero

# Annotation Settings
Color Mapping:
  - Yellow (#ffd400): Highlight
  - Green (#5fb236): Method
  - Blue (#2ea8e5): Theory
  - Red (#ff6666): Question

# Citation Key
Use Better BibTeX Key: Yes
```

**Zotlit文献笔记模板**：

在Zotlit 插件的 template 界面或者在`40 - Obsidian/模板`文件夹找到下面md文件进行修改:

zt-annot.eta：

```markdown
[!<%= it.colorName %>] Page <%= it.pageLabel %>

<%= it.imgEmbed %><%= it.text %>
<% if (it.comment) { %>
---
<%= it.comment %>
<% } %>

<%= it.tags.filter(t => t.type === 0).map(t => `#${t.name}`).join(' ') %>
```


zt-annots.eta

```markdown
<% const byColor = Object.groupBy(it, (annot) => annot.colorName);
const label = {
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
// Merge colors with customized label with unexpected colors, if any
// Keep the order of the colors from the original color-label map
const colorSet = new Set([...Object.keys(label), ...Object.keys(byColor)]);
for (const color of colorSet) { 
if (!(color in byColor)) continue -%>

### <%= label[color] ?? color %>
  <%_ for (const annot of byColor[color]) { %>

<%~ include("annotation", annot) %>
  <%_ } %>
<% } %>
```


zt-cite.eta

```markdown
[<%= it.map(lit => `@${lit.citekey}`).join("; ") %>]
```


zt-cite2.eta

```markdown
<%= it.map(lit => `@${lit.citekey}`).join("; ") %>
```


zt-colored.eta

```markdown
<mark style="
<%- if (it.color) { _%> color: <%= it.color %>; <%_ } -%>
<%- if (it.bgColor) { _%> background-color: <%= it.bgColor %>; <%_ } -%>
"><%= it.content %></mark>
```


zt-field.eta

```markdown
title: "<%= it.title %>"

citekey: "<%= it.citekey %>"

tags: [paper, <% = it.tags.filter(t => t.name && t.name.startsWith('#')).map(t => '"' + t.name.slice(1) + '"').join(', ') %>]

cate: 论文

concepts: [<%let excludeEndings = ['更新', '推荐', '关联', '检索', '浏览', '初读', '精读', '星标'];
let filteredConceptTags = (Array.isArray(it.tags) ? it.tags : []).filter(t =>
  t.name &&
  !t.name.startsWith('#') &&
  !excludeEndings.some(ending => t.name.endsWith(ending))
).map(t => '"' + t.name + '"');
%> <%= filteredConceptTags.join(', ') %>]

read: [<% let endings = ['浏览', '初读', '精读']; let filteredTags = it.tags.filter(t => t.name && endings.some(ending => t.name.endsWith(ending))); if (filteredTags.length === 1) { %> "<%= filteredTags[0].name %>" <% } else if (filteredTags.length > 1) { %> 错误：存在多个符合条件的标签。 <% } else { %> 错误：没有找到符合条件的标签。 <% } %>]

source: [<% let endings_2 = ['更新', '推荐', '关联', '检索']; let filteredTags_2 = it.tags.filter(t => t.name && endings_2.some(ending => t.name.endsWith(ending))); if (filteredTags_2.length === 1) { %> "<%= filteredTags_2[0].name %>" <% } else if (filteredTags_2.length > 1) { %> 错误：存在多个符合条件的标签。 <% } else { %> 错误：没有找到符合条件的标签。 <% } %>]

authors: [<%= it.authors %>]

journal: <%= it.publicationTitle %>

paper_date: <%= it.date %>

date: <%= (new Date(it.dateModified || Date.now())).toISOString().slice(0, 10) %>

<%
let isImportant = it.tags.some(t => t.name === '🌟星标');
%>

important: <%= isImportant ? 'True' : 'False' %>
```


zt-note.eta

```markdown
| Zotero                       | File               | Journal                                    |
| ---------------------------- | ------------------ | ------------------------------------------ |
| [Zotero](<%= it.backlink %>) | <%= it.fileLink %> | [<%= it.publicationTitle %>](<%= it.url%>) |

## Annotations

<%~ include("annots", it.annotations) %>
```



#### 步骤六：配置 Enhancing Export

Settings → Obsidian Enhancing Export：

**添加 PaperBell Academic 导出配置**：

```json
{
  "name": "PaperBell Academic",
  "type": "pandoc",
  "arguments": "-f ${fromFormat} --resource-path=\"${currentDir}\" --resource-path=\"${currentDir}/imgs\" --resource-path=\"${currentDir}/figs\" --resource-path=\"${attachmentFolderPath}\" --pdf-engine=xelatex --template=paperbell -o \"${outputPath}\" -t pdf",
  "customArguments": "--bibliography=\"${vaultDir}/40 - Obsidian/mybib.bib\" --filter pandoc-crossref --number-sections --citeproc -M reference-section-title=References --listings",
  "extension": ".pdf",
  "outputPath": "${currentDir}/${fileName}.pdf"
}
```

**添加带行号版本**：

```json
{
  "name": "PaperBell Academic (Line Numbers)",
  "type": "pandoc",
  "arguments": "-f ${fromFormat} --resource-path=\"${currentDir}\" --resource-path=\"${currentDir}/imgs\" --pdf-engine=xelatex --template=paperbell -M lineno=true -o \"${outputPath}\" -t pdf",
  "customArguments": "--bibliography=\"${vaultDir}/40 - Obsidian/mybib.bib\" --filter pandoc-crossref --number-sections --citeproc -M reference-section-title=References",
  "extension": ".pdf",
  "outputPath": "${currentDir}/${fileName}_lineno.pdf"
}
```

### 创建第一个项目

#### 步骤一：创建 Longform 项目

1. 打开 Obsidian 左侧边栏的 Longform 图标
2. 点击 **New Project**
3. 配置项目：
   - Name: `MyFirstPaper`
   - Type: Manuscript
   - Location: `Outputs/`
4. 点击 **Create**

#### 步骤二：添加项目结构

手动创建以下文件和文件夹：

```bash
cd Outputs/MyFirstPaper
mkdir imgs
touch results.json
```

创建章节文件：

```bash
cd source
touch Introduction.md Methods.md Results.md Discussion.md
```

#### 步骤三：配置元数据

编辑 `Index.md`：

```yaml
---
title: "My First Academic Paper with PaperBell"
date: "2025-10-11"

authors:
  - name: "Your Name"
    affiliation: [1]
    corresponding: "your.email@institution.edu"

affiliations:
  - index: 1
    name: "Your Institution"

abstract: "This is my first paper using PaperBell workflow."
keywords:
  - "academic writing"
  - "Obsidian"
  - "automation"

target: "Test Journal"
acronym: "MyPaper"
csl: "nature"

lineno: "false"
figures-at-end: "false"
titlepage: true
---
```

#### 步骤四：编写示例内容

`source/Introduction.md`:

```markdown
# Introduction

This is a demonstration of the PaperBell workflow.

We analyzed {{demo.n_samples}} samples and found a correlation of {{demo.correlation}}.

Previous studies have shown [@example2024paper] that this approach is effective.

![Example figure](imgs/demo.png){#fig:demo width=80%}

As shown in [@fig:demo], our method works well.
```

`results.json`:

```json
{
  "demo": {
    "n_samples": 100,
    "correlation": 0.75,
    "pvalue": 0.001
  }
}
```

#### 步骤五：添加引用和图片

**添加测试引用**：

在 `40 - Obsidian/mybib.bib` 中添加：

```bibtex
@article{example2024paper,
  title={An Example Paper},
  author={Author, A. and Coauthor, B.},
  journal={Example Journal},
  volume={1},
  pages={1--10},
  year={2024},
  publisher={Example Publisher}
}
```

**添加测试图片**：

将任意图片复制到 `imgs/demo.png`。

#### 步骤六：编译项目

1. 在 Longform 面板中选择 `MyFirstPaper`
2. 点击 **Compile** 选项卡
3. 配置编译步骤（按顺序）：
   - Strip Frontmatter
   - Remove Links
   - Prepend Title
   - Concatenate Text
   - **Add YAML Metadata** (Note Name: `Index`)
   - **Replace placeholders from JSON**
   - Save as Note (输出：`manuscript.md`)
4. 点击 **Compile**

**验证编译结果**：

打开 `manuscript.md`，检查：

- [ ] YAML 前置内容包含完整元数据
- [ ] 占位符 `{{demo.n_samples}}` 已替换为 `100`
- [ ] 章节按顺序合并

#### 步骤七：导出 PDF

##### 方法 1：使用 Enhancing Export

1. 右键点击 `manuscript.md`
2. 选择 "Export with Enhancing Export"
3. 选择 "PaperBell Academic"
4. 等待编译完成（首次编译可能需要 1-2 分钟）

##### 方法 2：使用命令行

```bash
cd Outputs/MyFirstPaper
pandoc manuscript.md -o output.pdf \
  --defaults="../../40 - Obsidian/脚本/Pandoc/defaults/pdf.yaml"
```

**检查 PDF 输出**：

打开 `output.pdf`，验证：

- [ ] 标题页显示正确
- [ ] 作者和机构信息完整
- [ ] 参考文献正确格式化
- [ ] 图片正常显示
- [ ] 图表编号和引用正确

### 故障排除

#### 问题 1：占位符未替换

**症状**：编译后的 `manuscript.md` 中仍有 `{{placeholder}}`

**可能原因**：

1. `results.json` 不在项目根目录或 `source/` 目录
2. JSON 语法错误
3. 路径拼写错误

**解决方案**：

```bash
# 1. 检查文件位置
ls Outputs/MyFirstPaper/results.json
ls Outputs/MyFirstPaper/source/results.json

# 2. 验证 JSON 语法
cat results.json | python -m json.tool

# 3. 启用调试模式
# 在 Longform 编译选项中勾选 "Enable debug log"
# 查看 Obsidian 控制台输出（Cmd+Option+I）
```

#### 问题 2：Pandoc 编译失败

**症状**：导出 PDF 时报错

**常见错误及解决方案**：

##### 错误：`xelatex not found`

```bash
# 验证 LaTeX 安装
which xelatex

# macOS: 添加到 PATH
echo 'export PATH="/Library/TeX/texbin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Windows: 在系统环境变量中添加 MiKTeX bin 目录
```

##### 错误：`Template paperbell.latex not found`

```bash
# 检查模板路径
ls "40 - Obsidian/脚本/Pandoc/templates/paperbell.latex"

# 使用绝对路径
pandoc manuscript.md -o output.pdf \
  --template="/full/path/to/paperbell.latex"
```

##### 错误：`File 'tikz.sty' not found`

```bash
# 安装缺失的 LaTeX 包
sudo tlmgr install tikz                # macOS/Linux
mpm --install=tikz                     # Windows MiKTeX
```

##### 错误：`pandoc-crossref not found`

```bash
# 验证安装
which pandoc-crossref

# 重新安装
brew reinstall pandoc-crossref         # macOS
```

#### 问题 3：字体问题

**症状**：PDF 中文显示为方块或编译报错

**解决方案**：

```bash
# 检查系统字体
fc-list | grep "Times New Roman"
fc-list | grep "Songti"                # 中文字体

# macOS: 安装中文字体
# 系统字体册 → 全部字体 → 确认有 "宋体"

# Linux: 安装中文字体
sudo apt install fonts-noto-cjk        # Debian/Ubuntu

# 修改 pdf.yaml 使用系统可用字体
metadata:
  CJKmainfont: "Noto Serif CJK SC"    # 替代宋体
  mainfont: "Liberation Serif"        # 替代 Times New Roman
```

#### 问题 4：引用无法解析

**症状**：PDF 中显示 `[@unknown]` 而非正确引用

**诊断步骤**：

```bash
# 1. 检查 .bib 文件路径
ls "40 - Obsidian/mybib.bib"

# 2. 验证引用键存在
grep "@article{unknown" "40 - Obsidian/mybib.bib"

# 3. 测试 citeproc
pandoc test.md -o test.pdf \
  --bibliography="40 - Obsidian/mybib.bib" \
  --citeproc
```

**常见问题**：

- 引用键拼写错误（区分大小写）
- .bib 文件编码问题（应为 UTF-8）
- 引用键格式不符合 Better BibTeX 规则

#### 问题 5：行号显示异常

**症状**：行号未显示或参考文献也有行号

**解决方案**：

```yaml
# 确保使用最新的 paperbell.latex 模板
# 检查模板中是否有以下代码：

% 在参考文献前关闭行号
\AtBeginEnvironment{thebibliography}{
  \linenomathNonumbers
  \nolinenumbers
}
```

如果模板过旧，从 PaperBell 仓库下载最新版本。

#### 问题 6：图表位置错误

##### 症状

启用 `figures-at-end: true` 但图表未移到文末

##### 检查项

1. YAML 元数据中是否正确设置：

```yaml
figures-at-end: "true"  # 注意是字符串格式
```

2. 模板是否支持该功能（检查 `paperbell.latex` 版本）

3. 图表标记是否正确：

```markdown
![Caption](image.png){#fig:label}   # ✅ 正确
![Caption](image.png)                # ❌ 不会被识别
```

#### 问题 7：Longform 脚本未加载

**症状**：编译步骤中看不到自定义脚本

**解决方案**：

```bash
# 1. 检查脚本位置
ls "40 - Obsidian/脚本/longform/"

# 2. 检查脚本格式
# 确保文件名为 .js 且导出 module.exports

# 3. 验证脚本语法
node --check "40 - Obsidian/脚本/longform/编译后增加头文件.js"

# 4. 重启 Obsidian
# 或重新加载 Longform 插件（Settings → Community plugins → Reload）
```

#### 问题 8：编译速度慢

**优化方案**：

1. **缓存图片**：

```yaml
# pdf.yaml
resource-path:
  - .
  - imgs
```

2. **使用增量编译**：

```bash
# 仅在内容变化时重新编译
make -f Makefile
```

3. **减少过滤器**：

```yaml
# 调试时暂时禁用部分过滤器
filters:
  # - some-slow-filter
  - pandoc-crossref
  - citeproc
```

4. **使用 LuaLaTeX 替代 XeLaTeX**（如不需要复杂字体）：

```yaml
pdf-engine: lualatex
```

#### 调试工具和日志

**Obsidian 控制台**：

```javascript
// 在 Obsidian 中按 Cmd+Option+I (Mac) 或 Ctrl+Shift+I (Windows)
// 查看 Longform 脚本的 console.log 输出
```

**Pandoc 详细日志**：

```bash
pandoc manuscript.md -o output.pdf \
  --defaults=pdf.yaml \
  --verbose 2>&1 | tee pandoc.log
```

**LaTeX 日志**：

```bash
# 编译失败时查看详细日志
cat output.log | grep "Error"
```

**测试最小示例**：

创建 `test.md`：

```markdown
---
title: "Test"
---

# Test

This is a test [@example2024].
```

逐步测试：

```bash
# 1. 测试 Markdown 到 PDF
pandoc test.md -o test.pdf

# 2. 测试引用
pandoc test.md -o test.pdf --bibliography=mybib.bib --citeproc

# 3. 测试模板
pandoc test.md -o test.pdf --template=paperbell.latex
```

### 更新和维护

#### 更新 PaperBell 模板

```bash
# 进入 PaperBell 目录
cd /path/to/PaperBell

# 拉取最新更新
git pull origin main

# 复制更新的模板文件
cp templates/paperbell.latex YourVault/40\ -\ Obsidian/脚本/Pandoc/templates/
```

#### 更新插件

在 Obsidian 中：

1. Settings → Community plugins
2. 点击 "Check for updates"
3. 更新所有可用更新

#### 备份策略

**每日自动备份**（使用 Obsidian Git）：

Settings → Obsidian Git:

```yaml
Automatic pull/push/commit:
  - Auto pull: Every 10 minutes
  - Auto commit: Every 30 minutes
  - Auto push: Every 60 minutes
```

**手动备份**：

```bash
# 备份整个 Vault
tar -czf paperbell_backup_$(date +%Y%m%d).tar.gz YourVault/

# 仅备份项目文件
tar -czf projects_backup_$(date +%Y%m%d).tar.gz YourVault/Outputs/
```

### 小结

本章详细介绍了 PaperBell 的完整安装配置流程，从系统准备、软件安装、插件配置到创建第一个项目。我们提供了常见问题的系统化诊断和解决方案，以及更新维护建议。

通过遵循本章的步骤，研究者可以在 1-2 小时内完成 PaperBell 的完整配置，开始享受现代化学术写作的便利。

---

**相关资源**：

- [PaperBell GitHub](https://github.com/SongshGeo/PaperBell)
- [Pandoc 文档](https://pandoc.org/MANUAL.html)
- [Longform 插件](https://github.com/kevboh/longform)
- [问题反馈](mailto:paperbell@songshgeo.com)

![请关注我们 PaperBell 的官方账号](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/follow_paperbell.jpeg)
