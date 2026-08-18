---
cate: 方法
date: 2026-07-14
tags:
  - output
  - workflow
longform: false
concepts:
---
# PaperOut 协作与使用场景

> [!abstract] **一句话认识 PaperOut**
> **PaperOut To-Authors** 是 PaperBell 套件里负责 **输出端（`50 - Outputs`）** 的写作与导出插件——你的草稿在这里变成可投稿的 PDF/Word。
>
> 本文讲三件事：它在整个套件里**站在哪**、现在**已经能和谁协作**、以及我们**打算把哪些环打通**。
>
> 🟢 **【现状】**＝已经能用　　🔵 **【设想】**＝写在路线图、还没做

> [!tip] 只想知道怎么操作？
> 本文偏"架构与规划"。**动手步骤**（新建项目、装 Pandoc、批量编译）请看同目录的 [[PaperOut To-Authors 使用指南.md]]。

---

## 🗺️ PaperOut 在 CIMPO 里的位置

PaperBell 套件按 **CIMPO** 五段分工，每段一个插件。PaperOut 守在**最下游的输出端**——前面四段积累的一切，最终在这里变成交付物。

```
  C ──────► I ──────► M ──────► P ──────► O
概念       输入      元数据     项目    【输出】
                                         👈 PaperOut
```

| 段 | 文件夹 | 负责插件 | 职责 |
| :---: | --- | --- | --- |
| **C** 概念 | `10 - Cards` | Cards Wrangler | 关键词/实体词条 + 有界 featured 核心词表 |
| **I** 输入 | `20 - Inputs` | Inputs Bell | 把论文/图书/剪藏归一化，只带 `keywords` |
| **M** 元数据 | `30 - Metadata` | Project Manager / 宿主 | 学者、机构、资助——人/地/时的流水账 |
| **P** 项目 | `40 - Projects` | Project Manager | 长周期项目，锚定 featured 概念 |
| 🎯 **O** 输出 | `50 - Outputs` | **PaperOut To-Authors** | 草稿与正式长文 → 交付物 |

> [!info] 宿主插件 `paperbell` 横跨五段
> 它统一派发 LLM 调用（**密钥不经过任何子插件**）、提供统一的 UI 语言。装了它，兄弟插件就能"说同一种话"。

---

## 一、现在能做什么 🟢【现状】

PaperOut 今天的协作分两层：**不装宿主也成立的文件约定**，和**装了宿主才有的握手**。

### 🗂️ 靠文件 / frontmatter 约定（无需宿主）

> [!success] 这些是"纯文件"契约——任何读库的插件都能看懂
>
> - 📁 **一个论文项目 = 一个文件夹 + 四份草稿**，共享一份 `metadata.json`。项目的组成从索引 frontmatter + `metadata.json` 一目了然。
> - 🔗 输出笔记用 `project: <acronym>` **指回项目**、用 `concepts:` **选取概念**——这正是 Project Manager 数「交付物」、Cards Wrangler 反查「围绕此概念的输出」的接口。
> - 📄 编译产出稳定的 **sidecar JSON**（`manuscript-lines.json`、`figure-numbers.json` 等）和固定路径的 PDF。
> - 📦 Pandoc 工具链按需从 **paperout-assets-market** 资产市场下载（不塞进库里）。

### 🤝 靠宿主握手（装了 `paperbell` 时）

> [!note]
> PaperOut 向宿主注册，**跟随宿主 UI 语言**，读取账户状态与能力。

### ⚠️ 当前的缺口

> [!warning] PaperOut 在输出端还比较"孤立"
> 目前它 **既不消费** 上游数据，**也不广播** 自己的动态：
>
> - ❌ 不消费：概念网络、学者/发表流水账、共享引文源
> - ❌ 不发布：不向 PaperBell 总线发数据 / 事件
>
> 👉 **这正是下面路线图要补的。**

---

## 二、想打通的场景 🔵【设想】

> [!quote] 目标
> 让 PaperOut 从"孤立的导出机"变成"套件里的连接点"——写作时自动带出素材，署名/发表列表自动生成，编译完成能触发下游。

| # | 场景 | 打通后的体验 |
| :---: | --- | --- |
| 1 | **概念驱动写作 / 材料检索** | 手稿 `concepts:` 里选 featured 概念 → 经 Cards 反查携带该概念的论文/输入，作为候选引文与素材。闭合"输出→概念"的环 |
| 2 | **作者信息预填** | 新建论文时从**显式的合著者名单**预填 `metadata.json` 的 `creators`/`corresponding`，免手填 |
| 3 | **发表列表自动化** | Zotero `corr:N` → Better BibTeX → LaTeX `publist`，做成一条"发表列表"导出；CV/发表列表从 bib 一键重生成、带通讯/共同一作标记 |
| 4 | **引文经 Zotero / Cards** | `[@citekey]` 与 `references.bib` 从 Zotero 或 Cards citekey 脚注解析，替代手维护 `.bib` |
| 5 | **向 Project Manager 暴露交付物** | 发布只读接口/事件，让草稿数、编译状态计入"交付物"；sidecar 供审稿追踪插件读取 |
| 6 | **编译完成事件** | 触发下游打包/投稿，或让分析插件刷新 `results.json` |

> [!danger] 一条刻意的边界（场景 2）
> 预填作者**只**从显式合著者名单取，**绝不**去抓 `30 - Metadata/Scholars`。
> **追踪他人 ≠ 手稿署名**——Scholars 是你关注的学者流水账，跟谁署你这篇论文的名是两回事。

---

## 三、改进路线（三个方向）🔵

> [!example]- 方向一：消费 概念 / 学者 / 发表 数据（点击展开）
>
> - 脚手架从合著者名单预填作者（`metadata.json` 的 `creators`/`corresponding`）
> - 读手稿 `concepts:` 反查 Cards，给出素材/引文建议
> - 新增"发表列表"编译工作流，复用现有多 bib 合并

> [!example]- 方向二：对外暴露数据 / 事件（点击展开）
>
> - 订阅 `paperbell:plugins-changed`，能力随兄弟插件增减刷新
> - 在 PaperBell 总线发布事件（编译完成、sidecar 写出、项目建成），注册只读枚举接口（项目/草稿/编译状态）
> - 把 sidecar（`manuscript-lines / figure-numbers / table-numbers.json`）文档化为**跨插件契约**

> [!example]- 方向三：引文 / Zotero 互通（点击展开）
>
> - bibliography 解析扩展：从 Zotero（含 `Author+an` 通讯作者约定）或 Cards citekey 脚注取 `.bib`/citekeys
> - （相邻）受保护资产下载：用 `activation` + `download-ticket` scope 门控付费工具链下载

---

## 四、跨切面建议 🔧

> [!bug] 契约去重
> IPC 契约 `shared-config.ts` 在各插件里**复制粘贴、已开始漂移**。
> 建议抽出**单一发布的共享契约包**；PaperOut 已按 `MAINTAINING.md` 的策略 vendoring，可作为种子。

> [!bug] 宿主版本号歧义
> 两个不同的宿主构建都报 `0.4.4`。
> 建议宿主在 API 表面变化时升 `version`/`schemaVersion`，方便消费方**可靠门控**。

---

> [!cite] 延伸阅读
> **技术文档**（插件仓库 `docs/`）：
>
> - `PAPERBELL_SUITE.md` — 本文英文版 + 路线图
> - `PAPERBELL_INTEGRATION.md` — 宿主握手
> - `PAPER_PROJECT.md` — 论文项目结构
> - `MANUSCRIPT_REFS.md` — 手稿引用同步
> - `METADATA_AND_PLACEHOLDERS.md` — 元数据与占位符
>
> **动手步骤**：同目录 [[PaperOut To-Authors 使用指南.md]]
