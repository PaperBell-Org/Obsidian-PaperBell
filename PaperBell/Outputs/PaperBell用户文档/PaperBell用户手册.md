---
title: "PaperBell用户手册"
date: "2025-03-01"
author: "Shuang Song"
---

# 日常记录

> [!quote]
> 日常记录是随时记录的闪念。

## 随手记录闪念

`PaperBell` 主要使用Thino 插件 进行每日记录，你可以点击库 **Daily Summary** 按钮来打开该插件，然后就在弹出的对话框内进行记录和标签即可。

![[使用thino进行随手记.gif]]

得益于 Thino 的强大，你可以任意检索、归档、分享这些条目，还可以根据定期复习，具体使用方法可以参考 Thino 插件的帮助文档。接下来，我们介绍使用 Thino 记录的这些条目将如何被 `PaperBell` 所管理，以及如何将它们关联到其它笔记，最终帮助到你的输出。

> [!tip]
> 我个人的工作流中，使用 thino 记录任何想法，事后再定期复习。复习时通过添加标签把它们分类到某一项目，整理完毕后就将该条目在 thino 中归档，这样 thino 就成为了你的收件箱。

## 关联项目

在 Thino 中被记录的条目只要被打上项目的特定标签，它就会被`PaperBell`的项目管理工作流所追踪。

> [!warning]
> 即便这个条目在 Thino 被归档或删除了，它仍然会被 `PaperBell` 项目追踪。这个特性可以让你在整理完笔记后，将它们归档，而不用担心丢失。但请注意，未来我们可能会考虑改变这个特性。

## 关联概念

如果一个闪念是一个科研想法（💡灵感来了！），你可以为它打上“#想法”标签。之后在你创建的概念卡片笔记里，`PaperBell` 都会帮你自动关联出现该字段的想法。

> [!example]
> 为便于理解，这里举一个例子。
>
> 今天我记录了闪念 “我有一个与社会-生态系统有关的想法” 并标记了 `#想法` 这个“闪念标签”，在术语Social ecological system这个概念卡片中，由于有 “社会-生态系统” 这个中文别名，`PaperBell` 便会自动收集该想法。

![自动关联想法与概念](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2011.20.35@2x.png)

想创建概念卡片，可以按 `Command(ctrl) + P` 触发 Obsidian 的命令行窗口，输入 `QuickAdd: 添加术语` 可以触发命令，依照提示输入信息即可。

> [!tip]
> 如果该概念有别名，可以在创建好卡片笔记后，为笔记的 `aliases` 属性增加别名，那么在关联该概念卡片所有的检索中，中文翻译和别名都会被考虑在内。


-----

# 文献阅读笔记

> [!quote]
> 有策略地阅读文献。

## 高亮与批注

在 Zotero 中阅读论文，并按照这样的格式进行高亮批注，导入 `PaperBell` 时便会自动被 `callout` 整理归类：

![阅读论文标注方法](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2012.19.14@2x.png)

实现上述笔记导入到 `PaperBell` 需要安装并正确配置 `ZotLit` 及其**配套的Zotero插件** `Obsidian Note for Zotero`，请按照[ZotLit 官方文档](https://zotlit.aidenlx.top/zh-CN/getting-started/install)对两者进行安装和配置。配置过程中碰到问题可以参考[[和 Zotero 的联动]]。

> [!warning]
> 在1.0版本依赖 `Zotero Integration` 插件，在 2.0 版本才更新至 `Zotlit` 插件，以下所以配置文档都是针对 `Zotlit` 的，使用 `Zotero Integration` 插件的请参考 Zotero Integration（不推荐，PaperBell 不再提供支持）。

完成配置后，在 Zotero 中阅读论文完毕，在右键菜单中选择 `Obsidian Actions > Create Literature Note(s)` 即可导入到 `Obsidian` 中， `PaperBell` 会自动将笔记归类到 `Inputs/Zotero` 文件夹下，并应用文献阅读模板。

![在 Zotero 中阅读论文后导入 Obsidian](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2012.39.58@2x.png)

## 文献标签

Zotero 里论文条目带的标签也会根据以下规则转换，以方便后续检索：

| Zotero 标签        | 笔记YAML     | 使用场景          |
| ---------------- | ---------- | ------------- |
| `#project`       | `tag`      | Obsidian 内的标签 |
| term             | `concepts` | 关联到术语笔记       |
| to-read/浏览/初读/精读 | `read`     | 标记阅读进度        |
| 更新/检索/推荐/关联      | `source`   | 标记文献来源        |
| 重要               | `star`     | 是否为重要文献       |

> [!example] 使用案例
>
> 周一早晨打开电脑，发现我追踪的期刊更新了，上面有篇文献看起来很有趣，于是我先导入到 Zotero 中，并标记 `更新` 标签，花一分钟初步读过摘要后，我认为它很重要，也许对于我的项目 A 有参考价值，于是我给它打上 `star` 标签和带井号的 "#project" 标签，但我没有时间仔细阅读，于是我给它打上 `to-read` 标签，表示我需要安排一个时间仔细阅读它。
>
> 再次阅读后，我给它打上 `精读` 标签，表示我已阅读完毕。阅读完毕后，我还为它里面出现的我感兴趣的 research keyword 打上不带井号的标签，表示我需要关注这些概念。导入到 Obsidian 后，该文献笔记会自动被标记为重要文献，并被项目 A 所检索到，也能被我感兴趣的 research keyword 所检索到。

想自定义标签系统的用户可以参考 文献笔记属性。

> [!tip]
> 推荐使用 Zotero 的 `Zotero-Style` 插件，可以对带井号的特殊标签和其它概念标签分开渲染，并提供和 Obsidian 保持一致的嵌套标签功能。


-----

# 管理科研项目

> [!quote]
> 项目管理，我们帮你整理。

## 追踪项目

`PaperBell` 的主页会汇总进行中的项目（带有标签`#project/open`），根据任务的完成进展自动生成进度条。此外，用户点击主页的 「**Project Tracking**」按钮时，会跳转到一个包含所有项目的 Kanban 列表（可称之为项目“**管理器**”）。在这里，你可以追踪所有项目的进展状态，或者打开某个特定项目，浏览该项目的**主页**。

![[追踪项目.gif]]

项目使用特定标签进行识别，如我预设了所有带有 `#project/PaperBell` 标签的笔记会被检索，那么该项目就会管理所有带此标签的数据。`PaperBell` 提供以下四种视图，以应对整理不同资料的需求：

- **表格**：追踪所有项目相关的输入资料和输出笔记。
- **日历**：追踪所有项目相关的笔记，包括日常记录。
- **输入**：追踪所有输入资料，并按照不同重要性排序。
- **输出**：追踪所有输出笔记，并按照不同类别展示。

> [!warning]
> 我们将在后续版本中，对项目管理的实现进行较大重构，以实现更强大的功能。

## 新建项目

强烈建议按照以下流程新建项目：

- **创建项目笔记页面**：在项目管理器页面点击“**新建笔记**”，`PaperBell` 将自动套用模板创建项目的笔记页面。在弹出的输入框中，选择自己在该项目中的职责 “负责人”、“参与者”、或 “打工人”，并输入项目的简介（可跳过）。

![[创建新项目.gif]]

- **创建项目主页**：在项目管理器页面找到一个已有的示例项目（如 PaperBell 项目）并创建副本，副本创建完成后再点击 “编辑项目”，为该项目设置一个独特的名称和标签。

![[创建项目主页.gif]]

- **完善项目信息**：在项目主页创建好后，可以继续细化项目笔记页面的一些细节，比如更新项目的 url 链接：在 `Projects` 插件的命令页面，为你新建的项目勾选 “显示在命令行”。唤出命令行，使用 Advanced URI: copy URI for command 命令，复制打开项目的链接并粘贴到项目页面。

![[更新项目url链接.gif]]


-----

# 撰写输出笔记

> [!quote]
> 用输出倒逼输入。

## 创建笔记草稿

`PaperBell` 鼓励用户**以项目为导向**进行输出，在某个特定项目的项目主页里点击 “新建笔记”，就会弹出提示框，引导用户在以下四类中选择一个开始写输出笔记：

- **引言**：介绍研究该议题的意义。
- **方法**：介绍使用怎样的技术手段进行研究。
- **结果**：介绍你得到的研究结果或总结的初步结论。
- **讨论**：将你的结果和前人研究进行对比和深入探讨。

> [!warning] 注意
>
> 目前上述四种分类仅仅是配图不同，以便用户区分。为了未经思考地避免创建过多笔记，输出的笔记仅存放在 `Drafts` 文件夹内，你不需要太强迫自己立即完成它。在未来，你需要撰写长文本时，你可以再导入这些草稿。

## 参考文献

`PaperBell` 默认使用 `Pandoc Reference List` 插件提供参考文献支持，请以下路径配置你的 `pandoc` 和 `.bib` 文件。

![Pandoc Reference List 配置](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2014.30.26@2x.png)

Pandoc是用于文档转换的工具，在导出学术文档时也需要使用，在正确安装和配置后，你可以在终端中应该能够使用 `pandoc --version` 命令查看 Pandoc 版本，Pandoc 的命令路径则可以使用 `which pandoc` 命令查看，复制后输入到上图的第一个输入框内。

`.bib` 文件可以使用文献管理软件，如 Zotero 的 `better-bibtex` 插件 导出到指定路径，并勾选自动更新，这样你的参考文献选择就能自动和 Zotero 里的条目保持一致。

> [!warning]
> 虽然 `.bib` 文件的路径在这里可以随意指定，但我们推荐保存在 `40 - Obsidian/mybib.bib` 路径下，否则在导出学术文档时，你仍然需要配置相关路径。

在完成上述配置后，写笔记时使用 `[@]` 便可自动触发一个参考文献列表，根据你要参考的文献选择，就会自动插入一个 `[@citekey]` 格式的条目，如 [@song2019]，它会被自动渲染成可读的参考文献格式，并在右上角形成参考文献列表。

![参考文献列表](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2014.39.24@2x.png)

如果该图标没有出现在右上角，请在 Obsidian 中使用 `Pandoc Reference List: Show reference list` 命令。


-----

# 撰写长文本

> [!quote]
> 写作在于把网状的思维变成线性的输出。

## 组织长文本项目

长文本功能主要使用LongForm插件实现。它允许你从一个大纲开始，将输出笔记积累成一篇长文本——这可能是一篇学术论文或者一份项目报告。

>[!note]
> 本手册无法穷极所有功能，具体的插件细节请参考原插件的相关文档。

你可以在仓库内任意文件夹下右键使用 `Create Longform Project` 按钮创建一个长文本项目。输入一个项目名字，（如这里的示例是 "**PaperBell用户文档**"）。这之后会自动创建一个新的文件夹，文件夹为项目名，内部有一个 `index.md` 文档。

>[!tip]
> 文件夹的名字和 `index.md` 的名字都是可以更改的，`index.md` 的头文件中“longform”字段才是LongForm 插件识别项目的关键，小心更改。

你的项目可以有很多的 `Scenes`，你可以认为每个 `Scene` 就是一小节，或者说你长文本中的最小写作单元。而在 Obsidian 中，每个 Scene 对应着一个 `.md` 文件。你可以从其它地方（如导入撰写输出笔记#创建笔记草稿）的笔记，也可以直接通过 LongForm 新建 Scene 来增加笔记。最后，再任意拖动的顺序来排列它们，这个顺序就会是未来整个项目的笔记编译和输出顺序：

>[!tip] 建议
> 由于稍后我们要编译 LongForm 项目，我们尽量所有 `Scene` 的笔记创建到子文件夹内，再配置 LongForm Project 里的 "Scene Folder" 去找这些笔记。这样你的项目文件夹会干净很多。本地的配图也建议放在另一个子文件夹 "imgs" 中（而不是 Obsidian 的默认附件文件夹）。这样你可以用挪动整个项目文件夹的方式迁移/同步你的项目。

你可以从 `学术长文本模板 Longform academic template` 中修改创建 scene 的模板。它和输出笔记草稿最关键的区别是 `longform: true`，这标识着该笔记已经归属于某个长文本项目。

## 编译项目

当准备好项目输出时，可以在 `Compile` 一栏编译项目的输出手稿。`Longform` 插件使用 "WorkFlow" 的概念来完成这一编译过程。这意味着，你的编译会包含一些步骤，他们将依次处理你的各章节，并整合成一篇完整的手稿。默认的步骤通常为：

1. 去除各章节的YAML属性 (Strip Frontmatter)
2. 移除文件的外部链接 (Remove Links)
3. 添加章节标题 (Prepend Title)
4. 聚合文本 (Concatenate Text)
5. 保存手稿 (Save as Note)

在 `PaperBell` 中，我们提供了另两个脚本：

- 将各章节YAML中变量`scene_alias`作为章节题目 (Rename scenes to aliases)
- 在最后输出的手稿中增加YAML头文件 (Add YAML Metadata)

>[!warning] 注意
>各个步骤的顺序很重要，如 Add YAML Metadata 一定要在 Save as Note 之前，Rename scenes to aliases 一定要在 Prepend Title 之前。

这些步骤如果成功处理，通常你会打开一个编译后的手稿，你接下来可以导出学术文档，直接完成由`.md`笔记到学术报告的华丽蜕变。

## 相关链接

- LongForm Multiple Scene Projects
- Obsidian LongForm Plugin


-----

# 导出学术文档

> [!quote]
> 专注内容，我们帮你格式化。

## 理论基础

当需要将 `MarkDown` 格式的笔记转化为其它格式时，底层有两条路线：

1. 将 `MarkDown` 笔记转化为 `LaTeX` 格式，再转化为其它格式
2. 将 `MarkDown` 笔记转化为 `HTML` 格式，再转化为其它格式

`PaperBell` 主要使用 Pandoc 作为底层工具，并使用 `LaTeX` 作为中转格式（路线1）。所以，你需要确保 Pandoc 和与之适配的 LaTeX 已经安装。

## 使用方法

`Enhancing Export` 是一个让用户更加灵活使用 Pandoc 的 Obsidian 插件。你可以在其中预定义许多命令，并存为模板，在导出时直接调用。

在希望导出笔记时，打开命令面板，调用 `Enhancing Export` 插件的 `导出为` 选项，选择类型为 `PaperBell` 来调用我们为您准备的模板，选择文件名和路径并点击【导出】按钮，即可完成导出。

![导出文档时选择我们的模板](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2009.06.40@2x.png)

举例来说，示例项目中的本笔记就可以轻松被导出成PDF，如以下效果：

![导出PDF效果示意](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-01-21%20at%2009.53.34@2x.png)

## 修改模板

通常情况下，用户可以直接在 YAML 头文件中对常用的参数进行设置，目前可以修改的变量包括：

- 文档标题: `title`
- 日期: `date`

对于想要订制模板的用户，可以参考 笔记导出模板 中的说明。

## 相关链接

- Obsidian Enhancing Export
- Obsidian Tutorial for Academic Writing
- Obsidian Pandoc Filters
- Markdown 导出 PDF 方法优劣分析


-----

# 追踪学者和组织

> [!quote]
> 学术共同体是个小圈子，追踪论文不如追踪学者。

## 添加学者

我们鼓励用户在学术生涯中，追踪感兴趣的学者。`PaperBell` 将自动帮您关联他们的相关文献阅读笔记，以及日常记录中记录的相关动态。

![自动追踪](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-02-02%20at%2012.50.21@2x.png)

目前支持通过以下两种方法添加学者：

### 自动剪藏（推荐）

借助 `Obsidian Web Clipper` 浏览器插件，和我们提供的剪藏模板，`PaperBell` 可以帮助您自动在网页上剪藏学者信息。

### 手动添加学者

通过 `Command + P` 快捷键触发命令面板，使用 `QuickAdd` 插件的【添加学者】，可以依照提示，自动从模板添加学者信息。

## 添加机构

学者通常隶属于一个或多个研究机构，`PaperBell` 能够帮助您关联隶属于该机构的所有学者，并提供其地理位置预览：

![关联机构](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-02-02%20at%2012.53.46@2x.png)

目前提供两种新建组织笔记的方法：

### 自动搜索添加（推荐，Pro）

> [!tip]
> 该功能需要 `PaperBell` 专属插件的 Pro 版本支持。该插件已经内嵌在 `PaperBell` 示例库中，但 Pro 版本需要单独购买。

- PaperBell 插件的 Pro 版本支持自动搜索机构
- 使用自动剪藏方法添加学者笔记时，其机构信息会自动触发该功能。

![自动搜索机构](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/CleanShot%202025-02-02%20at%2012.59.08@2x.png)

### 手动添加机构

通过 `Command + P` 快捷键触发命令面板，使用 `QuickAdd` 插件的【添加机构】，可以依照提示，自动从模板添加机构信息。
