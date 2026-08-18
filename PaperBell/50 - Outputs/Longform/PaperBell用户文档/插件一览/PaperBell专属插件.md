---
cate: 方法
date: 2025-02-04
tags:
  - output
  - project/PaperBell
banner: 00 - Obsidian/img/方法.jpg
longform: true
banner_icon: 🔌
title: PaperBell 专属插件
keywords:
  - 学术工作流
  - 社区插件
  - 专属插件
  - 用户体验
  - 功能付费
  - 自动化处理
---

## 缘起

最初，`PaperBell` 项目完全[基于 `Obsidian` 的社区插件](插件及其作用.md)构建学术工作流。但是随着项目的发展，`PaperBell` 项目的用户体验严重受限于社区插件的局限性与不稳定性，因此，我们决定为 `PaperBell` 项目开发其专属插件，以订制地支持其工作流。

在 2025 年开始，`PaperBell` 项目也由 [@SongshGeo](https://songshgeo.com/) 的个人项目，转变为一个组织共同维护的项目。这将使得 `PaperBell` 项目更加稳定。但同时，也需要我们花更多的时间和精力来维护。因此，`PaperBell` 项目决定在未来采取【**专属插件的部分功能付费**】的模式，支付日渐增加的维护成本，支持项目的长远发展。

> [!tip]
> 所有 AI 功能在未来都将通过专属插件实现。

## 功能介绍

专属插件[目前 0.1.x 版本](https://github.com/PaperBell-Org/Obsidian-PaperBell-Plugin)，随下载示例库自带，主要实现以下功能：

- 检索学术机构，实现自动[[追踪学者和组织]]

> [!tip]
> 我们会陆续实现更多功能并逐步开放。

## PaperBell 系列插件

除主插件外，`PaperBell` 采用**模块化**思路，把 [[CIMPO]] 的各层分别交给各司其职的专属插件（随示例库自带、可单独启停）：

| 插件 | 负责的层 | 作用 |
| --- | --- | --- |
| **PaperBell Cards Wrangler** | C · 概念 | 用 AI 把输入里的[[关键词]]沉淀成[[概念卡]]词条、维护双链与精选词表（见[[维护概念卡片]]） |
| **Inputs Bell** | I · 输入 | 监听输入文件夹，对新笔记跑可插拔脚本做归一化 |
| **PaperBell Project Manager** | P · 项目 | 把[[科研项目]]渲染成 Bases 卡片（见[[管理科研项目]]） |
| **PaperOut To-Authors** | O · 输出 | 撰写并导出学术手稿（见[[撰写长文本]]） |
| **PaperBell Section** | 全局 | 一个纵览全库的工作台仪表盘视图 |

> [!note]
> 这些插件之间不直接互相调用，而是**共享同一套文件夹与 frontmatter 约定**（如 `concepts:` / `keywords:` / `.base`）来协作——这也是整套工作流都用纯文本的好处。

## 注册方式

访问项目[主页](https://paperbell.cn)查看专属插件功能和购买价格。

> [!note] 核心理念
> `PaperBell` 倡导的工作流免费分享，但对工作流的部分自动化处理，尤其是通过专属插件才能实现的功能，会是付费版本专属的。

![follow_paperbell](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/follow_paperbell.jpeg)
