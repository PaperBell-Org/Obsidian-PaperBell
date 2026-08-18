---
tags:
  - obsidian/plugin
  - 说明文档
title: Inputs Bell 使用文档
created: 2026-07-09
plugin: paper-in-bell
repo: https://github.com/PaperBell-Org/Paper-In-Bell
---

# Inputs Bell 使用文档

> 一个 **Inputs 文件夹的「后处理钩子」** 插件。它**不负责采集**——采集交给各自的专业工具（浏览器 Web Clipper 抓豆瓣、ZotLit 导 Zotero 文献…）。Inputs Bell 只做一件事：**监听 Inputs 文件夹，笔记一落进来就自动跑一串「后处理脚本」**，把它检查、修好、归位。

- 插件 id：`paper-in-bell` ・ 显示名：**Inputs Bell** ・ 作者：[PaperBell-Org](https://github.com/PaperBell-Org)
- 仓库/发布：https://github.com/PaperBell-Org/Paper-In-Bell

---

## 1. 它解决什么问题

以前一篇输入笔记进库后，要手动做一堆收尾：豆瓣封面裂图要本地化、frontmatter 字段不齐、笔记还散在根目录没归类、ZotLit 导入的元数据要核对……Inputs Bell 把这些**收尾动作脚本化、自动化**：

```
监听 Inputs/（新建笔记）→ 去抖 1.2s → 依次跑「已启用脚本」→ 自动修复 + 汇总提示
```

关键设计：**开放**。所有后处理逻辑都是「脚本文件夹」里的 `.js` 脚本（内置几个 + 你自己写），像 Templater / QuickAdd 的用户脚本一样加载。插件本身只是**宿主**。

---

## 2. 安装与启用

1. 把 release 里的 `manifest.json` / `main.js` / `styles.css` 放进 `<库>/.obsidian/plugins/paper-in-bell/`（或用 BRAT 装 `PaperBell-Org/Paper-In-Bell`）。
2. **设置 → 第三方插件** 启用 **Inputs Bell**。
3. 首次加载会在「脚本文件夹」（**插件默认** `Inputs/_scripts`）写入 4 个内置脚本。

> 路径口径：插件出厂默认 `监听文件夹 = Inputs`、`脚本文件夹 = Inputs/_scripts`。本 CIMPO 示例库把它们
> 改成了 `监听文件夹 = 20 - Inputs`、`脚本文件夹 = 00 - Obsidian/InputsBell`（见第 9 节）——两种都行，
> 在设置里按你的库结构配即可。下文出现的 `Inputs/...` 均指你所配的「监听文件夹」。

---

## 3. 设置详解

设置页分五个区。

### 语言

- **设置界面语言**：跟随 PaperBell 主插件 / 强制中文 / 英文。

### 监听与执行

- **监听文件夹**（默认 `Inputs`）：这个文件夹**及其所有子文件夹**里新建的 `.md` 会被后处理。资源文件夹、脚本文件夹自动排除。
- **新笔记落入时**：
  - `自动处理`（默认）——落入即自动跑脚本；
  - `先询问`——弹框确认再跑；
  - `不自动`——只保留命令，手动触发。

### 后处理脚本

- **脚本文件夹**（默认 `Inputs/_scripts`）：存放 `.js` 脚本。`.js` 不会被当成输入笔记。
- **已发现的脚本**：列出加载到的脚本，`重新加载脚本` 按钮可在你改完脚本后刷新。
- 每个脚本一行**标题 + 说明 + 开关**；下面缩进显示**它自己声明的参数控件**（文本 / 多行 / 开关 / 数字 / 下拉）。改参数即时保存。

### 图片本地化（给 `localize-images` 脚本用）

- **资源文件夹**（默认 `Inputs/_assets`）：下载的图片存这里。
- **Referer 规则**：给防盗链站点用，每行 `域名片段 => Referer地址`。默认已内置豆瓣：`doubanio.com => https://www.douban.com/`。

### Zotero 校对（给 `verify-zotero` 脚本用）

- **Zotero 本地 API 地址**（默认 `http://localhost:23119`）：需 Zotero 7+ 运行，并在 **Zotero 设置 → 高级 → 允许本机其它应用通信** 打开。
- **受保护字段**（默认 `read, source, important, keywords`）：校对时**永不覆盖**这些手填字段。
- **忽略含以下片段的标签**：把 `✅初读`、`🌟星标` 这类你当字段用的 emoji 标签，从并入 `tags` 前剔除。
- **测试连接** 按钮：成功会显示 Zotero 库版本号。

---

## 4. 内置脚本详解

内置脚本首次运行写入脚本文件夹，**可直接编辑**（改完点「重新加载脚本」）。按文件名序号顺序执行，`move` 最后跑。

### `10-normalize-frontmatter.js` — 归一化 frontmatter

确保笔记有规范字段（`input_type` / `title` / `authors` / `keywords`）。给缺字段的笔记补齐，不破坏已有内容。**无参数**。

### `20-localize-images.js` — 本地化远程图片

把笔记里的远程图片（豆瓣等，按上面的 Referer 规则带 Referer 下载）存到资源文件夹，并把链接改成本地。豆瓣海报会自动升级成大图。下载失败的保留原链接。**无参数**（用「图片本地化」区的设置）。
> 为什么需要：豆瓣图片有防盗链，Obsidian 直接加载会裂图；本地化后离线、永不失效。

### `30-verify-zotero.js` — 向 Zotero 校对（默认关闭）

按笔记的 `zotero-key` 回 Zotero 本地 API 拉最新元数据，刷新 title/authors/DOI/citekey/publicationTitle 等**权威字段**，`tags` 做并集，**但永不动受保护字段**。需 Zotero 运行，故默认关。

- 参数 **仅处理有 zotero-key 的笔记**（默认开）：关掉则对所有笔记尝试（没 key 的会跳过）。

### `90-move-by-frontmatter.js` — 按 frontmatter 移动到子文件夹 ⭐

根据 frontmatter 判断归属，移动到监听文件夹下的对应子文件夹（用 `renameFile`，**保持反链**；已在目标里则不动）。**规则可在设置里直接改，不用动 .js**。

- 参数 **基准文件夹**：子文件夹的父目录，留空用「监听文件夹」。
- 参数 **归类规则**（多行）：每行 `条件 => 子文件夹`，**第一个命中生效**。条件三种：
  - `has:字段名` —— frontmatter 里有该字段且非空（如 `has:zotero-key`）
  - `url:域名片段` —— `douban_url`/`source`/`url` 里包含该片段（如 `url:movie.douban.com`）
  - `tag:标签片段` —— 任一 tag 包含该片段（如 `tag:电影`）

  默认规则：

  ```
  has:zotero-key => Zotero
  has:citekey => Zotero
  url:movie.douban.com => Movie
  url:book.douban.com => Books
  tag:电影 => Movie
  tag:reading => Books
  tag:clip => Clippings
  ```

---

## 5. 命令

- **Run post-processing on current note** —— 对当前笔记跑一遍脚本（也有左侧 ribbon 图标 🪄）
- **Run post-processing on folder…** —— 选个文件夹批量跑（适合处理存量）
- **Reload scripts** —— 改完脚本后重新加载

---

## 6. 使用场景（我的工作流）

### 场景 A：豆瓣电影 / 图书

1. 浏览器里用 **Web Clipper** 剪豆瓣页 → 笔记落进 `Inputs`。
2. Inputs Bell 自动：`localize-images` 把海报下载到 `Inputs/_assets`、改本地链接；`move-by-frontmatter` 按 `url:movie.douban.com => Movie` 把它挪进 `Inputs/Movie`。
3. 全程不用手动。

### 场景 B：Zotero 文献

1. 用 **ZotLit** 从 Zotero 导入文献笔记（正文 + 彩色标注由 ZotLit 生成）。
2. 笔记进 `Inputs`（或直接进 `Inputs/Zotero`）→ 启用 `verify-zotero` 后，Inputs Bell 按 `zotero-key` 回库校对元数据，**保护我手填的 `read/source/important/keywords`**；`move-by-frontmatter` 用 `has:zotero-key => Zotero` 确保归位。

### 场景 C：网页剪藏 / Cubox

落进来的剪藏跑 `normalize-frontmatter` 补 `input_type`/`keywords`，`move` 按 `tag:clip => Clippings` 归位。

---

## 7. 写自己的脚本

脚本 = 脚本文件夹里的一个 `.js`，CommonJS 导出：

```js
module.exports = {
  id: 'my-script',                 // 唯一 id（缺省用文件名）
  title: '我的脚本',
  description: '在设置页显示的说明。',
  enabledByDefault: true,          // 可选，默认 true
  settings: [                      // 可选，声明参数 → 设置页渲染成控件
    { id: 'greeting', name: '问候语', type: 'text', default: 'hi',
      description: '打招呼用的词' },
    // type: 'text' | 'textarea' | 'toggle' | 'number' | 'dropdown'
    // dropdown 需 options: [{ value, label }]
  ],
  async run(ctx) {
    // ctx.file          当前 TFile
    // ctx.frontmatter   frontmatter 只读快照
    // ctx.params        用户配的参数值（含默认值）→ ctx.params.greeting
    // ctx.settings      插件设置（watchFolder / assetsFolder 等）
    // ctx.getFrontmatter() / ctx.setFrontmatter(fm => { fm.x = 1 })
    // ctx.read() / ctx.modify(text)
    // ctx.moveTo(folder)         移动（保持反链）
    // ctx.notice('...')          弹提示
    // ctx.report('...')          报告一条问题（冒泡到最终通知）
    // ctx.utils.localizeImages() / normalizeFrontmatter() / verifyZotero()
    // ctx.ai                     借用 PaperBell 宿主的 LLM（见下一节）
    ctx.notice(ctx.params.greeting + ' from ' + ctx.file.basename);
  },
};
```

要点：

- 脚本文件名前缀数字控制**执行顺序**（如 `50-xxx.js`）；移动类脚本建议放最后。
- 某脚本 `moveTo` 移动文件后，本轮**后续脚本不再对它执行**（路径已变）。
- 改完脚本点 **Reload scripts** 生效。

---

## 7.5 用 AI 的脚本（`ctx.ai`）

从 **0.3.0** 起，脚本可以通过 `ctx.ai` **借用 PaperBell 主插件配置的 LLM**（供应商 / 模型 / 密钥），
自己不用配 key。每次调用都由**宿主弹一次授权框**；没装 PaperBell 时是安全空操作——先 `available()` 判断即可。

| 方法 | 作用 | key 去向 |
| --- | --- | --- |
| `ctx.ai.available()` | 宿主是否已连接、能否代发 AI | — |
| `ctx.ai.complete(params)` | 让宿主代发一次补全，返回文本（出错抛异常） | **密钥不出宿主**（推荐） |
| `ctx.ai.completeRaw(params)` | 同上，返回 `{ ok, text, model, error }`，不抛异常 | 密钥不出宿主 |
| `ctx.ai.config()` | 宿主公开 LLM 配置（`providerId`/`model`/`hasApiKey`…） | — |
| `ctx.ai.credentials()` | 含 `apiKey` 的真实凭证（仅供必须直连供应商的脚本，如流式） | **交给脚本**，用后即弃 |

```js
async run(ctx) {
  if (!ctx.ai.available()) return;            // 没有 PaperBell 宿主 → 跳过
  const kw = await ctx.ai.complete({
    system: '提取 3–8 个小写关键词，只回逗号分隔列表。',
    messages: [{ role: 'user', content: await ctx.read() }],
  });
  await ctx.setFrontmatter((fm) => {
    fm.keywords = Array.from(new Set([...(fm.keywords ?? []), ...kw.split(',').map(s => s.trim())]));
  });
}
```

> 更多 AI 配方（提关键词喂 Cards Wrangler、一句话摘要、学者链接体检、检测人/机构候选…）见仓库
> `docs/scripts-cookbook.md`。

---

## 7.6 落地后交给 Cards Wrangler（协作）

Inputs Bell 处理完一篇笔记后会 trigger 一个工作区事件 **`paper-in-bell:processed`**（载荷
`{ path, report }`），这是「这篇输入已归一化、已归位」的**精确信号**。下游插件（如 **Cards Wrangler**）
监听它，就能在输入**真正就绪后**再按 `keywords` 生长概念卡，而不必去抢 Obsidian 原生的 `create` 事件
（那个在后处理之前就触发了）。CIMPO 里「输入只带 `keywords`、连接交给概念一侧」正是靠这条链落地。
跨插件契约与路线图见仓库 `docs/collaboration.md`。

---

## 8. 安全说明

脚本以**插件权限执行本地 JavaScript**（与 Templater / QuickAdd 同理）。**只保留你信任的脚本**，别随便拷贝来路不明的脚本进脚本文件夹。

---

## 9. 我这个库的当前配置

- 监听文件夹：`Inputs` ・ 子文件夹：`Books / Movie / Zotero / Cubox`
- 资源文件夹：`Inputs/_assets`（豆瓣图片已批量本地化到这里）
- 脚本文件夹：`Inputs/_scripts`
- 处理模式：自动
- Zotero 受保护字段：`read, source, important, keywords`
- `move-by-frontmatter` 规则按上面默认，`Books/Movie/Zotero` 对应我的子文件夹；`Cubox` 目前不在默认规则里，需要的话加一行 `tag:cubox => Cubox`。

---

## 10. 排错

- **落入笔记没反应**：确认「处理模式」是自动、笔记在监听文件夹内、且是 `.md`；确认至少有一个脚本启用。
- **脚本没生效/报错**：命令面板跑 `Reload scripts`，看是否弹「N 个脚本，X 个出错」；出错详情在开发者控制台（`Cmd+Opt+I`）`[Inputs Bell]` 前缀。
- **豆瓣图还裂**：多半是那张图豆瓣已删（404），本地化救不了；或 Referer 规则被改坏。
- **verify-zotero 连不上**：Zotero 要开着并允许本机通信；用设置里「测试连接」验证。
- **move 没挪对**：检查「归类规则」里条件是否命中（`has/url/tag` 三种），规则是**第一个命中生效**。
