---
cate: 方法
date: 2024-06-12
tags:
  - output
  - project/PaperBell
banner: "40 - Obsidian/img/方法.jpg"
author:
  - Shuang Song
longform: false
title: "关于和 Zotero 的联动问题"
banner_icon: 🧭
---

## ZotLit 无法导入文献时排除错误

> [!question]
> 为什么我导入文献时，ZotLit 无法导入文献？

### 排查 ZotLit 版本

首先排查 ZotLit 版本问题，确保你使用的是最新的插件版本，并适配当前的 Obsidian 版本。

> [!warning]
> 【参见 [GitHub Issue #14](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/14)】已知对于obsidian 1.7.7，可能会出现失败的问题。这是一个Zotlit带来的问题。目前的解决办法是降级到obsidian 1.6.x 或者升级到1.8.x（推荐升级）。

### 排查模板问题

其次排查模板问题，打开 `ZotLit` 插件的设置，上方的 `Template` 标签页，检查 `Ejectable` 栏目下的文档是否能正常打开（路径没问题）。

![lvPLDZ](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/lvPLDZ.png)

> [!tip]
>
> 通常来说无法导入文献都是由于转换成 `Markdown` 时的 YAML 属性出错，建议先检查 Note properties 这个模板。

如果能够正常找到模板，在 Obsidian 命令板里找到 "**ZotLit: Open Zotero annotation view in side panel**" 并运行，你会在打开的侧边栏中找到如下图所示的图标。

![SLVQ8b](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/SLVQ8b.png)

选择一篇你要测试的文献进行绑定，再点击左边第一个小图标 “Show details”，以该文献为例，查看根据模板导入 Obsidian 后的笔记示例。

![1zAUIC](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/1zAUIC.png)

在三栏中，最左侧为模板，最右侧为 Zotero 的文献元数据，中间则为导入后的示例笔记。当最右侧数据出现时，通常说明 Zotero 到 Obsidian 的链接没有问题。但当中间一栏没有出现预期的笔记时，通常先换一篇文献看看是不是之前选定文献存在必要属性缺失的情况。如果换了几篇文献都问题，可以在最左侧一栏删去模板中的部分属性，排查出问题在哪里。

> [!tip]
> 检查出问题属性最快速的策略是用“二分法”，先删除一半的模板，看看问题出在上半部分还是下半部分，再对出问题的那部分继续二分 ... ...

## 如何引用文献？

`PaperBell` 实现在 `Obsidian` 中引用文献的功能依赖于 [obsidian-pandoc-reference-list](https://github.com/mgmeyers/obsidian-pandoc-reference-list)插件，本质上是依赖于 `pandoc` 和 `BibTex` 的。前者是一种格式导入/导出的开源工具，后者是一套广为接受的参考文献引用系统。

前者基本可以不管，但我认为有必要对 `BibTex` 做简要了解。因为你的 `Zotero` 或其它参考文献软件进行导入/导出时，基本都是用这种格式进行数据交换。

- [BibTeX简单介绍](https://blog.ciaran.cn/2018/02/15/BibTeX%E7%AE%80%E5%8D%95%E4%BB%8B%E7%BB%8D/#:~:text=BibTex%20%E6%98%AF%E4%B8%80%E4%B8%AA%E7%94%A8%E4%BA%8E,BibTeX%E5%81%9A%E5%BC%95%E7%94%A8%E7%9A%84%E7%AE%A1%E7%90%86%E3%80%82)

> [!question]
>
> Q: 如果我刚把一个文献通过浏览器插件导入zotero，它似乎没法很快在obsidian中用`[@`的方式引用。
>
> A: `Zotero` 插件 `Better bibtex` 可以自动后台导出 `.bib` 文件到指定路径，你可以手动设置其刷新频率。刷新太频繁浪费内存，刷新太慢就更新不及时咯。

## 从 projects 里关联不到论文的问题

> [!bug] 已知问题
> `Projects` 插件会出现一个 bug，即从表格里打开某些导入的文献是空白，但在输入（Inputs 文件夹）里实际是有数据的：

![72iAX0](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/72iAX0.jpg)

确实有这个bug，因此仅在视频和示例库里，为了演示好看我示例库里用标题，我个人的库会使用 `citekey` 作为笔记标题，而不是文献标题，这样更稳定：

![Bq7ka3](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/Bq7ka3.png)

## 导入文献时 Zotero 总会弹出窗口

> [!question]
>
> 为什么我导入文献时，Zotero 总会弹出一个烦人的确认窗口？

可以参考[这篇帖子](https://forums.zotero.org/discussion/109031/allow-this-site-to-open-the-obsidian-link-with-obsidian)，我个人的经验是，在 Zotero 的 `Better BibTeX` 插件设置里，将 `Allow this site to open the Obsidian link with Obsidian` 设置为 `Always` 即可。

## 如何批量导入文献？

> [!question]
> 如何批量导入 Zotero 的文献到 `PaperBell`？

这是一个 `ZotLit` 插件正在努力解决的问题，目前没有稳定的解决方案，但可以参考[这篇帖子](https://github.com/PKM-er/obsidian-zotlit/pull/351)。
