---
scene_alias: 讨论
tags:
  - paper
  - discussion
  - best-practices
status: completed
date: 2025-10-11
longform: true
---

本章探讨 PaperBell 在不同学术写作场景下的配置方案，分享经过实践验证的最佳实践，并介绍进阶自定义技巧。

### 常用配置方案

> [!tip] Pandoc Defaults 与 Template 配置说明
>
> PaperBell 的导出系统基于 Pandoc 的 defaults 文件配置。在 `40 - Obsidian/脚本/pandoc/defaults/` 目录下，我们提供了两个预配置的 defaults 文件：
>
> - **paperbell.yaml** - macOS/Linux 系统使用（中文字体：Songti SC、Heiti SC、STFangsong）
> - **paperbell-windows.yaml** - Windows 系统使用（中文字体：SimSun、SimHei、FangSong）
>
> 这两个配置文件的主要区别在于**中文字体设置**，以适应不同操作系统的字体可用性。
>
> #### 自动检测与手动指定
>
> 在 Longform 编译时，"Add YAML Metadata" 脚本会：
>
> 1. **自动检测操作系统**（如果 Template 选项留空）：
>    - macOS/Linux → 使用 `paperbell` 模板
>    - Windows → 使用 `paperbell-windows` 模板
>
> 2. **支持手动指定**：在 Template 文本框中输入任何模板名称，如：
>    - `paperbell` - 使用 Unix 版本
>    - `paperbell-windows` - 使用 Windows 版本
>    - `eisvogel` - 使用 Eisvogel 模板
>    - `my-custom` - 使用你自己的自定义模板
>
> #### 创建自定义工作流
>
> 你完全可以定义自己的 defaults 配置文件和工作流：
>
> 1. 在 `40 - Obsidian/脚本/pandoc/defaults/` 创建新的 `.yaml` 文件
> 2. 在 `40 - Obsidian/脚本/pandoc/templates/` 创建新的 `.latex` 模板
> 3. 在 Longform 编译时的 Template 选项中指定你的配置名称
>
> 例如，创建 `my-workflow.yaml` 后，在编译时输入 `my-workflow` 即可使用。
>
> **相关文件路径**：
>
> ```bash
> 40 - Obsidian/脚本/pandoc/
> ├── defaults/          # Pandoc 默认配置文件
> │   ├── paperbell.yaml
> │   ├── paperbell-windows.yaml
> │   ├── beamer.yaml
> │   └── crossref.yaml
> ├── templates/         # LaTeX 模板文件
> │   └── paperbell.latex
> ├── filters/           # Pandoc Lua 过滤器
> └── csl/              # 引用样式文件
> ```

#### 方案一：快速投稿配置（Clean Submission）

**适用场景**：论文已基本定稿，准备首次投稿

**配置要点**：

```yaml
---
title: "Your Research Title"
date: "2025-10-11"
target: "Nature Human Behaviour"
acronym: "YourAcronym"
csl: "nature"

# 关键设置
lineno: "false"           # 不显示行号
figures-at-end: "false"   # 图表嵌入正文
titlepage: true           # 生成封面页
---
```

**Longform 编译步骤**：

1. Strip Frontmatter
2. Remove Links
3. Prepend Title
4. Concatenate Text
5. Add YAML Metadata（Note Name: `Index`）
6. Replace placeholders from JSON
7. Save as Note

**导出设置**：

- 使用 "PaperBell Academic" 配置
- 确保所有图片为高分辨率（≥300 DPI）
- 检查参考文献格式与目标期刊一致

**检查清单**：

- [ ] 字数符合期刊要求
- [ ] 图表数量在限制内
- [ ] 所有引用在 .bib 文件中
- [ ] 作者信息完整准确
- [ ] 摘要和关键词符合要求

#### 方案二：审稿讨论配置（Review Version）

**适用场景**：发送给合作者或审稿人审阅

**配置要点**：

```yaml
---
lineno: "true"            # 显示行号便于标注
figures-at-end: "false"   # 图表嵌入便于阅读
titlepage: true
---
```

**为什么显示行号？**

- 便于审稿人精确指出需要修改的位置
- 便于作者团队讨论时引用具体段落
- 便于记录修订历史（如 "Line 156: revised as suggested"）

**协作建议**：

- 导出 PDF 时在文件名中注明版本和日期：`manuscript_v2_20251011_review.pdf`
- 使用 Git 标签标记审稿版本：`git tag -a review-v2 -m "Sent to co-authors"`
- 创建修订记录文档，记录每个行号的修改内容

#### 方案三：修订响应配置（Revision Response）

**适用场景**：响应审稿意见，准备修订稿

**工作流程**：

1. **创建修订分支**：

```bash
git checkout -b revision-round1
```

2. **配置双版本对比**：

```yaml
# original.yaml
lineno: "true"
csl: "nature"

# revised.yaml
lineno: "true"
csl: "nature"
highlight-changes: true  # 标记修改内容（需自定义过滤器）
```

3. **使用占位符记录修改**：
在 `results.json` 中添加修订信息：

```json
{
  "revision": {
    "response_to_reviewer1": "We have added additional analysis as suggested...",
    "new_sample_size": 150,
    "previous_sample_size": 120
  }
}
```

在修订说明文档中引用：

```markdown
**Reviewer 1, Comment 3**: Sample size seems insufficient.

**Response**: We have increased the sample size from
{{revision.previous_sample_size}} to {{revision.new_sample_size}}.
```

#### 方案四：期刊特定配置

##### Nature 系列期刊

```yaml
---
csl: "nature"
target: "Nature Human Behaviour"
reference-section-title: "References"

# Nature 特定要求
lineno: "false"
figures-at-end: "false"  # 图表嵌入正文
titlepage: false         # 不需要单独封面
numbersections: true
---
```

**注意事项**：

- Nature 系列使用数字上标引用 [1, 2]
- 图表标题格式：**Figure 1 |** Title in sentence case.
- 参考文献按引用顺序排列

##### Science 系列期刊

```yaml
---
csl: "science"
target: "Science"
reference-section-title: "References and Notes"

# Science 特定要求
lineno: "true"           # 初稿需要行号
figures-at-end: "true"   # 图表置于文末
titlepage: false
---
```

**注意事项**：

- Science 要求图表和说明分离
- 参考文献格式较为严格，需仔细检查
- 补充材料需单独准备

##### 社会科学期刊（APA 格式）

```yaml
---
csl: "apa"
target: "Journal of Environmental Psychology"
reference-section-title: "References"

# APA 格式要求
lineno: "false"
figures-at-end: "false"
titlepage: true          # 需要封面页
abstract-title: "Abstract"
keywords-title: "Keywords"
---
```

**注意事项**：

- APA 使用作者-日期引用格式 (Author, 2024)
- 参考文献按字母顺序排列
- 标题层级有严格规定

### 最佳实践

#### 实践一：元数据集中管理

**问题**：多个项目的元数据分散，难以统一维护。

**解决方案**：创建元数据模板和复用策略。

**实施步骤**：

1. 创建作者信息库 `40 - Obsidian/authors.yaml`：

```yaml
authors:
  songshgeo:
    name: "Shuang Song"
    email: "song@gea.mpg.de"
    affiliations:
      - "Max Planck Institute of Geoanthropology"
      - "Beijing Normal University"
    orcid: "0000-0002-XXXX-XXXX"

  coauthor1:
    name: "Bo Hu"
    email: "bohu@nju.edu.cn"
    affiliations:
      - "Nanjing University"
```

2. 在新项目中引用：

```yaml
# 使用 templater 插件动态插入
<%*
const authors = await tp.file.include("[[authors]]");
%>
```

3. 维护机构索引映射表，确保一致性。

**优势**：

- 作者信息一处修改，所有项目同步更新
- 避免拼写错误和格式不一致
- 便于管理大型合作项目（多作者、多机构）

#### 实践二：数据与文本分离

**原则**：所有可能变化的数值都应使用占位符，而非硬编码。

**示例**：

**❌ 不推荐**：

```markdown
我们分析了 150 个样本，发现相关系数为 0.45（p < 0.01）。
```

**✅ 推荐**：

```markdown
我们分析了 {{study.n_samples}} 个样本，
发现相关系数为 {{study.correlation}}（p < {{study.pvalue}}）。
```

对应 `results.json`：

```json
{
  "study": {
    "n_samples": 150,
    "correlation": 0.45,
    "pvalue": 0.01
  }
}
```

**优势**：

- 数据更新时无需逐行查找修改
- 降低人为错误（如漏改某个数值）
- 便于进行敏感性分析（替换不同数据集）
- 便于审稿人要求的额外分析

**进阶技巧**：

- 在 `results.json` 中包含数据来源和计算日期：

```json
{
  "metadata": {
    "generated_date": "2025-10-11",
    "script": "analysis/main_analysis.R"
  },
  "study": {
    "n_samples": 150
  }
}
```

#### 实践三：渐进式写作策略

**问题**：论文初稿往往需要反复调整结构和内容。

**解决方案**：采用渐进式写作，充分利用 Longform 的灵活性。

**阶段一：大纲阶段**（Outline Phase）

创建章节骨架，每个文件只包含标题和要点：

```markdown
# Introduction

### Background
- Point 1: Traditional methods
- Point 2: Current challenges
- Point 3: Our innovation

### Research Questions
- RQ1: ...
- RQ2: ...
```

**阶段二：初稿阶段**（Draft Phase）

逐章节扩展内容，标记状态：

```yaml
---
status: draft
completeness: 60%
next_steps:
  - Add literature review
  - Expand methodology
---
```

**阶段三：修订阶段**（Revision Phase）

使用 Git 分支管理不同版本：

```bash
git checkout -b draft-v2
# 大幅修改
git checkout main
git merge draft-v2
```

**阶段四：抛光阶段**（Polish Phase）

- 启用 Linting 检查拼写和语法
- 检查段落逻辑和过渡
- 统一术语和表达方式

**优势**：

- 降低初稿心理压力（先完成后完美）
- 便于追踪写作进度
- 易于回滚不成熟的修改

#### 实践四：图表管理规范

**问题**：图片文件命名混乱，难以维护。

**解决方案**：建立图表命名和组织规范。

**命名规范**：

```text
imgs/
├── fig1_study_area_map.png          # 主文图
├── fig2_temporal_trends.png
├── fig3_spatial_patterns.png
├── figS1_validation_results.png     # 补充图
├── figS2_sensitivity_analysis.png
└── raw/                              # 原始图片
    └── fig1_raw_from_gis.png
```

**命名模式**：`{type}{number}_{descriptive_name}.{ext}`

**在文中引用**：

```markdown
![Study area and sampling sites](imgs/fig1_study_area_map.png){#fig:study-area width=80%}

As shown in [@fig:study-area], our study area covers...
```

**版本控制**：

使用 `.gitattributes` 管理图片：

```gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
```

大型图片文件使用 Git LFS（Large File Storage）。

**优势**：

- 文件名即说明，易于理解
- 便于快速定位和替换
- 版本控制更高效

#### 实践五：引用管理工作流

**工作流程**：

1. **文献阅读阶段**（Zotero）：
   - 使用彩色高亮标注关键内容：
     - 🟡 黄色：重要发现
     - 🟢 绿色：方法论
     - 🔵 蓝色：理论框架
     - 🔴 红色：局限性/疑问
   - 添加标签：`#project/DEMO`、`#method/ABM`

2. **笔记导入阶段**（ZotLit）：
   - 右键选择 "Create Literature Note(s)"
   - 自动导入到 `Inputs/Zotero/`
   - 验证引用键格式（如 `song2025collective`）

3. **写作引用阶段**（Obsidian）：
   - 使用自动完成：输入 `[@song` 触发补全
   - 多引用：`[@author1; @author2; @author3]`
   - 文内引用：`@author2024 demonstrated that...`

4. **编译检查阶段**（Pandoc）：
   - 检查是否有未解析的引用（会显示为 `[@unknown]`）
   - 验证参考文献格式与期刊要求一致
   - 检查引用顺序（Nature 系列按引用顺序，APA 按字母顺序）

**常见问题处理**：

| 问题 | 解决方案 |
|------|----------|
| 引用无法解析 | 检查 .bib 文件路径，验证引用键拼写 |
| 参考文献格式错误 | 更换 CSL 文件，检查 Zotero 中的元数据 |
| 多次引用同一文献 | 使用 `-@author` 隐藏作者名，只保留年份 |

#### 实践六：模板复用与项目快速启动

**问题**：每次创建新项目都需要重新配置，效率低下。

**解决方案**：创建项目模板和快速启动脚本。

**创建项目模板**：

1. 在 `40 - Obsidian/模板/` 创建 `Longform_Project_Template/`：

```text
Longform_Project_Template/
├── source/
│   ├── 01_Introduction.md
│   ├── 02_Methods.md
│   ├── 03_Results.md
│   └── 04_Discussion.md
├── imgs/.gitkeep
├── Index.md
└── results.json
```

2. `Index.md` 包含常用元数据框架：

```yaml
---
title: "{{TITLE}}"
date: "{{DATE}}"
authors:
  - name: "{{AUTHOR}}"
    affiliation: [1]
    corresponding: "{{EMAIL}}"
affiliations:
  - index: 1
    name: "{{INSTITUTION}}"
abstract: ""
keywords: []
target: ""
acronym: ""
csl: "nature"
lineno: "false"
figures-at-end: "false"
---
```

3. 使用 Templater 插件创建快速启动命令：

```javascript
// QuickAdd script: Create Longform Project
const projectName = await tp.system.prompt("Project name");
const acronym = await tp.system.prompt("Project acronym");

const template = "40 - Obsidian/模板/Longform_Project_Template";
const target = `Outputs/${projectName}`;

await tp.file.create_new("", projectName, false, tp.file.folder(target));
// Copy template files...
```

**优势**：

- 新项目 1 分钟内完成初始化
- 确保项目结构一致性
- 避免遗漏必要文件

### 进阶自定义

#### 自定义一：扩展占位符功能

**需求**：希望占位符支持计算和格式化（如保留小数位数、千位分隔符）。

**解决方案**：扩展 `替换结果占位符.js` 脚本。

**示例代码**：

```javascript
// 支持格式化语法：{{value | format}}
const pattern = /{{\\s*([^|]+?)\\s*(\\|\\s*([^}]+?))?\\s*}}/g;

const replaced = input.contents.replace(pattern, (match, path, _, format) => {
  let value = getByPath(data, path.trim());

  if (format) {
    const fmt = format.trim();
    if (fmt.startsWith('toFixed')) {
      const digits = parseInt(fmt.match(/\\d+/)[0]);
      value = Number(value).toFixed(digits);
    } else if (fmt === 'percent') {
      value = (Number(value) * 100).toFixed(1) + '%';
    } else if (fmt === 'comma') {
      value = Number(value).toLocaleString();
    }
  }

  return String(value);
});
```

**使用示例**：

```markdown
相关系数为 {{study.correlation | toFixed2}}
样本量为 {{study.n_samples | comma}}
显著性比例为 {{study.sig_ratio | percent}}
```

输出：

```text
相关系数为 0.45
样本量为 1,250
显著性比例为 87.3%
```

#### 自定义二：多语言支持

**需求**：同一手稿需要中英文两个版本。

**解决方案**：使用条件渲染和多元数据文件。

**实施方案**：

1. 创建双语元数据：

```json
{
  "title": {
    "en": "Perceptual bias in collective memory",
    "zh": "集体记忆中的感知偏差"
  },
  "abstract": {
    "en": "It is well-documented that...",
    "zh": "已有充分研究表明..."
  }
}
```

2. 修改脚本支持语言选择：

```javascript
{
  id: "language",
  name: "Document Language",
  type: "Dropdown",
  options: [
    { value: "en", label: "English" },
    { value: "zh", label: "中文" }
  ],
  default: "en"
}

// In compile function
const lang = context.optionValues["language"];
title = metadata.title[lang] || metadata.title;
```

3. 章节文本也可以使用占位符：

```markdown
# {{headings.introduction}}

{{text.intro_para1}}
```

#### 自定义三：高级交叉引用

**需求**：希望引用时自动包含页码或章节信息。

**解决方案**：创建自定义 Pandoc Lua 过滤器。

**示例过滤器**（`enhanced_crossref.lua`）：

```lua
function Cite(elem)
  -- 为图表引用添加 "on page X"
  if elem.citations[1].id:match("^fig:") then
    return {
      pandoc.Str("Figure"),
      pandoc.Space(),
      elem,
      pandoc.Str(" (on page \\pageref{" .. elem.citations[1].id .. "})")
    }
  end
  return elem
end
```

在 `pdf.yaml` 中启用：

```yaml
filters:
  - enhanced_crossref.lua
  - pandoc-crossref
  - citeproc
```

#### 自定义四：自动化补充材料

**需求**：自动生成补充材料文档（Supplementary Information）。

**解决方案**：创建独立的 Longform 项目和编译配置。

**项目结构**：

```text
Outputs/DEMO_Manuscript/
├── main/
│   └── manuscript.md        # 主文档
└── supplementary/
    ├── source/
    │   ├── S1_Methods.md
    │   ├── S2_Results.md
    │   └── S3_Figures.md
    ├── Index_SI.md
    └── supplementary.md     # 补充材料编译输出
```

**配置差异**：

```yaml
# Index_SI.md
---
title: "Supplementary Information"
subtitle: "Perceptual bias in collective memory"
numbersections: true
section-numbering: "S"       # 章节编号前缀 S
figure-numbering: "S"        # 图表编号前缀 S
---
```

**批量编译**：

```bash
# compile_all.sh
pandoc main/manuscript.md -o manuscript.pdf --defaults=pdf.yaml
pandoc supplementary/supplementary.md -o SI.pdf --defaults=pdf_si.yaml
```

#### 自定义五：集成外部数据源

**需求**：直接从数据库或 API 获取最新数据，而非手动更新 JSON。

**解决方案**：创建数据同步脚本。

**示例**（Python）：

```python
# sync_data.py
import json
import requests
from pathlib import Path

def fetch_analysis_results(project_id):
    """从远程服务器获取分析结果"""
    response = requests.get(f"https://api.example.com/results/{project_id}")
    return response.json()

def update_results_json(project_path, data):
    """更新 results.json"""
    results_file = Path(project_path) / "results.json"
    with open(results_file, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    data = fetch_analysis_results("DEMO_2025")
    update_results_json("Outputs/DEMO_Manuscript", data)
    print("✅ Data synchronized successfully")
```

**配合 Makefile 自动化**：

```makefile
.PHONY: sync compile all

sync:
 python scripts/sync_data.py

compile:
 pandoc Outputs/DEMO_Manuscript/manuscript.md -o output.pdf --defaults=pdf.yaml

all: sync compile
```

运行 `make all` 即可自动同步数据并编译文档。

### 小结

本章讨论了 PaperBell 在不同场景下的配置方案，包括快速投稿、审稿讨论、修订响应和期刊特定配置。我们分享了六大最佳实践：元数据集中管理、数据文本分离、渐进式写作、图表管理规范、引用工作流和模板复用。最后，我们探讨了五种进阶自定义方案：扩展占位符、多语言支持、高级交叉引用、自动化补充材料和外部数据集成。

这些方案和实践经过实际项目验证，能够显著提升学术写作效率和质量。下一章将详细介绍 PaperBell 的安装配置方法和故障排除技巧。
