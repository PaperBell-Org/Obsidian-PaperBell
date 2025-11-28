<a id='changelog-0.3.1'></a>
# 0.3.1 — 2024-09-29


## Fixed

- 更新所有插件

## Docs

- 增加文档介绍地图功能的使用
- 修改自我介绍依赖


<a id='changelog-0.3.0'></a>
# 0.3.0 — 2024-08-21

## Added

- 使用Virtual Linker插件进行潜在链接
- 模板中增加longform: true/false的YAML属性选项
- 使用Drafts文件夹存储临时的项目笔记文件
- 增加 LongForm Step: 项目编译添加头文件
- 增加强化导出功能以及eisvogel模板

## Deprecated

- 导出时过滤掉字符串不存在的警告（缺失emoji字体）
- 优化一些插件的配置

## Fixed

- 更新所有插件

## Docs

- 增加文档介绍新的长文本和导出功能
- 更新README，发布3.0介绍视频
- 增加输出笔记使用说明
- 更新插件列表
- 导出PDF版本用户手册

## Appearance

- 图谱展示附件
- 增加卡片和无序列表callout视图
- virtual linker 插件展示潜在链接

<a id='changelog-0.2.2'></a>
# 0.2.2 — 2024-06-16

## Added

- 置顶了特性相关的 quick add 操作

## Deprecated

- 不再使用 periodic note 插件，改用核心日记插件

## Fixed

- 修复了 thino 和 periodic note 插件不兼容的问题

<a id='changelog-0.2.1'></a>
# 0.2.1 — 2024-06-02

## 文档

- 整理了关于近几周用户提出疑问的相关文档。
- 在[个人网站](https://paperbell.songshgeo.com/) 公开发布了项目文档。

## 修复

- 修复了 `QuickAdd` 不能以正确格式加入作者和机构信息的问题。

<a id='changelog-0.2.0'></a>
# 0.2.0 — 2024-05-19

## 新特性

- 使用 Projects 进行项目管理 📅 2024-05-13
- 使用 Zolit 管理文献 📅 2024-05-13

## 修复

- 修复了一些已知问题 📅 2024-05-13

<a id='changelog-0.1.0'></a>
## [3.0.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v3.0.1...v3.0.1) (2025-11-28)


### ⚠ BREAKING CHANGES

* **project:** move PaperBell to our GitHub organization now!

### Features

* :sparkles: force adding all demo notes ([0061055](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0061055432032f1fc9b322845b53500464204a38))
* **base:** :sparkles: Add new base templates for concepts, library, institutions, and scholars ([610d20c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/610d20c83ace8329ebef8e0cc8b84b4429cce65d))
* **demo:** Add comprehensive demo manuscript and enhance export configurations ([415d17d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/415d17d95ae84dd112befa72baea880cc39660e2))
* **demo:** Add new images for demo manuscript and update references ([1b044e9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1b044e90a318dd166b77f7be26e4f80a8441a6f2))
* **demo:** Add organizing image to enhance demo manuscript visuals ([7baeb7e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/7baeb7e34d4961ffc2f1158fd3fab3ce180bb3d0))
* **demo:** Enhance Pandoc configuration documentation and add custom workflow instructions ([ef9baad](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ef9baade9d97b1de7d4db91e9f686346cfa324e4))
* **docs:** :memo: 更新用户文档 ([4ff9060](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/4ff9060c092c195ba0a715c2985df84cd59be8b6))
* **feature:** :bug: split anno notes correctly now ([873d211](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/873d211acab3ca013255f98476056513ea1d7d5a))
* **feature:** :lipstick: Now users can set ZotLit import template colors in paperbell plugin ([b855824](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b855824460171ec5d838ea58f019de5e5c733ac7))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([763ea84](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/763ea8483dcffbc32cb54d2ccbe21691f1db3450))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([5447396](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5447396361b5b8b245ad57dd010113b78874fea0))
* **feature:** :sparkles: update PaperBell using special plugin, make all plugins up-to-date ([b7d39d3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b7d39d36aec2363ac3c2fe0dc78e737773a46a0e))
* **feature:** :sparkles: 使用 enhancing pdf 和 pandoc defaults 来创建导出 ([eef2441](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/eef2441397e617313c7bd844e74ef5f71b062455))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([53ae3b5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/53ae3b5fb8bd16a0b223a7d92132231e4a2a4a02))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([75c7e7f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/75c7e7f545988d6b510c7a868068a6017583a5d0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([ab25c78](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ab25c78b42662f0fec243ded2e6d4531a155dee0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([96e4740](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/96e4740a59225ed87ce0ee51abd60ad7941835ce))
* **feature:** :sparkles: 增加AI智能查询关键词定义 ([0636a62](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0636a62c3599b6e396588fa7fca55c225d464526))
* **feature:** :sparkles: 增加强化导出功能 ([6c23889](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/6c2388982face883b93f98e61612a93a76d45983))
* **feature:** :sparkles: 增加强化导出功能 ([a085c34](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a085c3490eb6b3ba6c3ace0f9e77cd48da34232b))
* **feature:** :sparkles: 增加缩短链接功能 ([eb457b0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/eb457b0c1eb59f8e96bdad5cb1080536284d0014))
* **feature:** :sparkles: 增加缩短链接功能 ([143c06e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/143c06e5f34d23539f71cd14b0f1df4ad1925af0))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([02f653d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/02f653de809347ff03599d095b56358caad3ffb7))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([0ab6283](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0ab6283a8fe93360760f077c6ceda812d00aa682))
* **feature:** :sparkles: 示例仓库初步建立 ([d24c7f9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d24c7f930dbc6d1fb752dcc77dcc1f355502fc3b))
* **longform:** Add template option for Pandoc export and enhance manuscript metadata ([e26130a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e26130a1a320e9eb6241d39328d43d6b59cd8514))
* **longform:** Revamp PaperBell Longform project structure and enhance metadata ([ff7f45f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ff7f45f9da5d915b8dabfb694fef246b5e601310))
* **map-view:** Enhance map view functionality and update plugin versions ([2cd6d0f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2cd6d0fe01c478b23b66376c28a631a0be64403f))
* **notes:** :sparkles: Demo to use task genius ([3720add](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/3720add7eff5e7085322a219674309b8c0f9933e))
* **notes:** :sparkles: Reading Chinese paper into Zotero docs. ([d9c6025](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d9c6025ceb696cce7e38d3c9580493b0810fa5b1))
* **plugins:** :sparkles: Add new plugins and update configurations ([e929a19](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e929a19c593daf36c482943d7155a50a4aec9a18))
* **plugins:** :sparkles: Update and remove plugins for improved functionality ([67dc7d7](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/67dc7d751065a44fefb4dc74b16b34419090432b))
* **plugins:** :sparkles: Update and reorganize plugin configurations ([c833bc8](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c833bc85efadd3fddd700869d88498f3bfe0f251))
* **plugins:** :sparkles: Update community plugins and enhance floating TOC ([058a460](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/058a460fff4081b1df6be4c9126b573cfb265030))
* **plugins:** :sparkles: Update core plugins and modify library references ([14f4c8c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/14f4c8c8121cd751ce459ab46206337eb4aeff97))
* **project:** :sparkles: 使用 quartz 管理文档 ([dc735f3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/dc735f35a6f7b9f52ad7327c07994d071420d246))
* **project:** :sparkles: 初步更新至2.0版本 ([10a4114](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/10a4114c79dfeec921badf952b1b1f927ff5708f))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([2074d1b](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2074d1b0a530978b5f9ec1904087033f63e7b771))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([b9b2629](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b9b2629b9e4216109c88f6c32b531af5f6dcb471))
* **project:** :sparkles: 完善用户文档 ([4ea0eeb](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/4ea0eeb06ca4555991dfc8d066aa7566c1101687))
* **project:** :sparkles: 用Zotlit替代了ZoteroIntegration ([5dc9c01](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5dc9c0161d8ec20c75b3575d3302a912b58005cb))
* **project:** 🚀 Major plugins and templates optimization ([#87](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/87)) ([1eb75ee](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1eb75eebca23b7eca8f5eec0b74af4a55079614f))
* **projects:** :sparkles: Enhance project templates and documentation ([f512548](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f51254899218f55c12177376294e11bc9d4ce1ae))
* **template:** :sparkles: Enhance daily note template with intelligent date handling ([0800177](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0800177105387d9a8eedb2682f9ed83860ba9102))
* **template:** :sparkles: Revise terminology templates and introduce new base files ([e2ea547](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e2ea547c844188c072f8c2800a6bcd5364fb803f))
* **template:** :sparkles: Update templates and references for scholars and papers ([1b288f9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1b288f9b32513dd8d7fc46685b8dc034ba12f822))
* **template:** Update longform academic template metadata and add scene alias ([d606152](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d606152f94cd4eb63946d311b11afefcacedb41a))
* **templator:** :sparkles: add term explanation module and update templates ([c940802](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c940802d2cb827334bec420a16f9bc403fafe86b))
* **theme:** :art: 增加卡片和无序列表callout视图 ([342e1aa](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/342e1aa15db8b0beeaa6b2f8437f6f3c9e51bf43))
* **theme:** :art: 增加卡片和无序列表callout视图 ([6d945e1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/6d945e14e94c5b032e2a3eb3aefe8ab4f02493fb))
* **theme:** :lipstick: choose bluze style ([2d9b44e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2d9b44e9def8a49bf7f95c2409698b70f6dc1562))
* **workspace:** :sparkles: Update workspace configuration and add daily note ([aba3362](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/aba336263194f2dd455b844feb953f562299b696))


### Bug Fixes

* :bug: correct previous commit type ([29529d4](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/29529d4022dac7f362768c4ce84f2d28c6741f1c))
* 🐛 fix-zotlit-templater ([3ca7588](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/3ca758812e020330883f743fbfeb30eaa2cb7f00))
* 🐛 improve template keyword display and metadata for release automation ([d0ed5e7](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d0ed5e70f04df8b8750a7c09c579f3ce64feba67))
* 🐛 LaTeX compilation error: Counter undefined (Pandoc: 3.8.2.1, pandoc-crossref: 0.3.22a) ([da47d79](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/da47d7981c102145807489bc6be077291acf5c54))
* 🐛 update workspace configuration with localized labels and modified timestamp ([a42317f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a42317f48adb55ea34226ed8d5de4689800d1a91))
* correct previous commit type ([a4a385e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a4a385e3e86b8d05418c8726713c23c2a75027ce))
* **daily-note:** Add a quick note for section view feature announcement and feedback request ([339d1b3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/339d1b3b4f5c6062f9c8de687c366a394f4f3455))
* **demo:** Update manuscript content and image references for clarity ([bbfd22d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/bbfd22dcff39bf91726842624197ffc1211eb43e))
* **docs:** :ambulance: README添加下载链接 ([08bc619](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/08bc6193ae816b0a193a256c4535bb137a9027b7))
* **docs:** :bug: 修复README内的链接 ([8988788](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/8988788171ddb96e31d0b04299df7b1808594f26))
* **docs:** :bug: 修复README内的链接 ([b924a9a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b924a9a3734437c20c84af6f9f4824778dec16f1))
* **docs:** :memo: Provide baidu cloud disk download link for 4.0.1 ([bb1b6f3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/bb1b6f3957a52ac28048b9c66008753e0a782760))
* **docs:** :memo: 修复文档一个小显示错误 ([76aa2f5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/76aa2f50309563cccc30cae4b72706c3f17d064d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([344a871](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/344a871506f178a49c594a70b898722000dce14d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([a12b94a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a12b94a5570d820291974e48556a66234974230b))
* **export:** Update PDF export arguments for improved resource handling ([d5173b1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d5173b1b1b8acb083dd66f117c6bc402f17a7a93))
* **feature:** :ambulance: 选择文件更小的白噪音 ([b8fe2bf](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b8fe2bf414a1b2cc3dc8ee889cf4f6f0b672505e))
* **feature:** :bug: delete abstract field when connecting with ZotLit ([9629595](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/96295952b73f24e721f3c10df28be1fdb1352504))
* **feature:** :bug: Fixed term and institute template ([65116ba](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/65116ba6ab222c72be8efa6e52604023e6ccf1da))
* **feature:** :bug: Fixed ZotLit templator rending bug ([3714123](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/371412377ccdf9f9e943359ba0611ef3e6059b59))
* **feature:** :bug: split anno notes correctly now ([7d5bc6c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/7d5bc6cb87377db24112e90f85db2c99f36201fb))
* **feature:** :bug: 修复了导出学术文本时的字体问题 ([ea81d19](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ea81d1902426ac725e012b74003816e6882afc12))
* **feature:** :bug: 修复了添加机构和学者的quickadd ([67dbe58](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/67dbe581d0380b942da3eddd2ed24a52654aef99))
* **feature:** :bug: 修复智能术语明文上传API密钥的问题 ([b0b80f6](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b0b80f648fe496383c531ba3785171775430edc3))
* **feature:** 🐛 delete abstract field when connecting with ZotLit ([22a1d67](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/22a1d67efea9a18101b5efa9c0d90c3a406b572a))
* **feature:** 🐛移除过期的 registration ID ([#96](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/96)) ([54018c5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/54018c531ef7acd85e0f4671c62553f8fdf182f0))
* **notes:** :bug: 一些Output的笔记例子 ([ff477bc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ff477bc0662b4ececc137f4d894c1a3c2841ebe1))
* **notes:** :bug: 修复概念墙过度检索的bug ([c5e33b3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c5e33b3495e4bda664c5e868cbfb9d6a9e53b178))
* **notes:** :memo: 新增了一些示例笔记 ([92f9276](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/92f9276094e1a0673f1d72a2c9df63d74ec3bc9f))
* **project:** :adhesive_bandage: 简单修改 quartz 配置 ([9f2cc4c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/9f2cc4caa056f8eb89b9cafe77f740eaa686a79d))
* **project:** :arrow_up: Upgrade paperbell and homepage plugins ([a5aebea](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a5aebeadcad1930ebf4b4e2a8e8e280702ea3c8f))
* **project:** :bug: delete .git of quartz ([58bf9b9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/58bf9b93c66ed9ed301d2a93d1bca1122da0c6a7))
* **project:** :bug: Projects plugin now can create note ([1343e6f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1343e6f449012630e4e00287d5f37dbfce3404e2))
* **project:** :bug: 不再追踪 .DS_Store ([f211ac2](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f211ac29e0a648d1f9c870b18ba160c018910f7d))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([591c0fd](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/591c0fd72b899953437dd9bb6e8e5cb5c9601c4c))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([1bf4ffc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1bf4ffc0fa539fb072871f98882f3cee4c632c31))
* **project:** :bug: 修复了工作区失效的问题 ([69ebb0a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/69ebb0af8ed5e12f6f9d742711a0e7da74ac48d2))
* **project:** :bug: 修复了工作区失效的问题 ([56d0d28](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/56d0d28a00933e98f353cc95ed2ed30bcf3c89d0))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([75605c1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/75605c1c442c41ae2a636fa8b7ea0739d4572452))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([ba9d20a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ba9d20a8064011eb49ae225916b0f4b1acb425e9))
* **project:** :bug: 修改项目 README 和 quartz 配置 ([1a851a3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1a851a3b7d936cb26e4ab708156675e7ef29153e))
* **project:** :green_heart: 增加 vercel ([580001f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/580001f4ec53214b9613b2460acf126d894c185c))
* **project:** :green_heart: 重命名 Index 页面为 index，删除测试阶段多余生成的 output.pdf ([706122f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/706122fcacdd66e434740785baa879f521e475a8))
* **project:** :pencil2: 改回 BaseUrl ([c800db6](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c800db6be5e2dcad6a986a852e4ab97479e4da96))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([b6efe15](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b6efe151496139efa0deee43c10a701ea854c7a1))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([1043855](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/10438555772c29f1a6bbd79f3b2721156b5ba34d))
* **template:** :bug: Clean up book template formatting and remove unnecessary tags ([532e0e0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/532e0e0ab7e01d55fa6fdfd3e929b06607082b08))
* **theme:** :art: 修复由于gitignore而PaperBell路径内img没有上传的问题 ([d2a384f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d2a384fd0b4b4e987bb725587133ecb28f400cfb))
* **theme:** :bug: 修复了主页 banner 不显示的问题 ([da24046](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/da24046997f9f92796d3c7adf9157585c3f962ff))
* typo for QuickAdd Button ([5de35a0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5de35a08ed2b4065dbf74f3f7a4849209fdea89c))
* Update main.js for localization and license management improvements ([99fde6d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/99fde6d37883c1fb59309903fce92be498338e4b))
* Update project tracking link in homepage for accurate navigation ([59d43ed](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/59d43ed1f0edff7d406dce3b80b367400f71e8c9))
* Update project tracking link in homepage for improved navigation ([f9e694d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f9e694dd036be4902178a9130d560dc4c3b85256))


### Performance Improvements

* **feature:** :zap: By default, do not activate pandoc-crossref ([c8b85bc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c8b85bc90b84ec22924562a62d1469e3040b35e6))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([e806c36](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e806c36245b262ebe5387fce681fa51a01ecafec))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([771835a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/771835ab8775305b97d98779b160c0ae640e7ce0))


### Documentation

* **project:** :tada: redirect all dead repo links to our organization on GitHub ([ae119d4](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ae119d416a4421a8dc995522c757466e3e8a96ee))

## [3.0.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.4.0...v3.0.1) (2025-10-23)


### ⚠ BREAKING CHANGES

* **project:** move PaperBell to our GitHub organization now!

### Features

* :sparkles: force adding all demo notes ([0061055](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0061055432032f1fc9b322845b53500464204a38))
* **base:** :sparkles: Add new base templates for concepts, library, institutions, and scholars ([610d20c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/610d20c83ace8329ebef8e0cc8b84b4429cce65d))
* **demo:** Add comprehensive demo manuscript and enhance export configurations ([415d17d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/415d17d95ae84dd112befa72baea880cc39660e2))
* **demo:** Add new images for demo manuscript and update references ([1b044e9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1b044e90a318dd166b77f7be26e4f80a8441a6f2))
* **demo:** Add organizing image to enhance demo manuscript visuals ([7baeb7e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/7baeb7e34d4961ffc2f1158fd3fab3ce180bb3d0))
* **demo:** Enhance Pandoc configuration documentation and add custom workflow instructions ([ef9baad](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ef9baade9d97b1de7d4db91e9f686346cfa324e4))
* **docs:** :memo: 更新用户文档 ([4ff9060](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/4ff9060c092c195ba0a715c2985df84cd59be8b6))
* **feature:** :bug: split anno notes correctly now ([873d211](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/873d211acab3ca013255f98476056513ea1d7d5a))
* **feature:** :lipstick: Now users can set ZotLit import template colors in paperbell plugin ([b855824](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b855824460171ec5d838ea58f019de5e5c733ac7))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([763ea84](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/763ea8483dcffbc32cb54d2ccbe21691f1db3450))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([5447396](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5447396361b5b8b245ad57dd010113b78874fea0))
* **feature:** :sparkles: update PaperBell using special plugin, make all plugins up-to-date ([b7d39d3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b7d39d36aec2363ac3c2fe0dc78e737773a46a0e))
* **feature:** :sparkles: 使用 enhancing pdf 和 pandoc defaults 来创建导出 ([eef2441](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/eef2441397e617313c7bd844e74ef5f71b062455))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([53ae3b5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/53ae3b5fb8bd16a0b223a7d92132231e4a2a4a02))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([75c7e7f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/75c7e7f545988d6b510c7a868068a6017583a5d0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([ab25c78](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ab25c78b42662f0fec243ded2e6d4531a155dee0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([96e4740](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/96e4740a59225ed87ce0ee51abd60ad7941835ce))
* **feature:** :sparkles: 增加AI智能查询关键词定义 ([0636a62](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0636a62c3599b6e396588fa7fca55c225d464526))
* **feature:** :sparkles: 增加强化导出功能 ([6c23889](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/6c2388982face883b93f98e61612a93a76d45983))
* **feature:** :sparkles: 增加强化导出功能 ([a085c34](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a085c3490eb6b3ba6c3ace0f9e77cd48da34232b))
* **feature:** :sparkles: 增加缩短链接功能 ([eb457b0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/eb457b0c1eb59f8e96bdad5cb1080536284d0014))
* **feature:** :sparkles: 增加缩短链接功能 ([143c06e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/143c06e5f34d23539f71cd14b0f1df4ad1925af0))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([02f653d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/02f653de809347ff03599d095b56358caad3ffb7))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([0ab6283](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0ab6283a8fe93360760f077c6ceda812d00aa682))
* **feature:** :sparkles: 示例仓库初步建立 ([d24c7f9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d24c7f930dbc6d1fb752dcc77dcc1f355502fc3b))
* **longform:** Add template option for Pandoc export and enhance manuscript metadata ([e26130a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e26130a1a320e9eb6241d39328d43d6b59cd8514))
* **longform:** Revamp PaperBell Longform project structure and enhance metadata ([ff7f45f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ff7f45f9da5d915b8dabfb694fef246b5e601310))
* **map-view:** Enhance map view functionality and update plugin versions ([2cd6d0f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2cd6d0fe01c478b23b66376c28a631a0be64403f))
* **notes:** :sparkles: Demo to use task genius ([3720add](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/3720add7eff5e7085322a219674309b8c0f9933e))
* **notes:** :sparkles: Reading Chinese paper into Zotero docs. ([d9c6025](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d9c6025ceb696cce7e38d3c9580493b0810fa5b1))
* **plugins:** :sparkles: Add new plugins and update configurations ([e929a19](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e929a19c593daf36c482943d7155a50a4aec9a18))
* **plugins:** :sparkles: Update and remove plugins for improved functionality ([67dc7d7](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/67dc7d751065a44fefb4dc74b16b34419090432b))
* **plugins:** :sparkles: Update and reorganize plugin configurations ([c833bc8](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c833bc85efadd3fddd700869d88498f3bfe0f251))
* **plugins:** :sparkles: Update community plugins and enhance floating TOC ([058a460](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/058a460fff4081b1df6be4c9126b573cfb265030))
* **plugins:** :sparkles: Update core plugins and modify library references ([14f4c8c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/14f4c8c8121cd751ce459ab46206337eb4aeff97))
* **project:** :sparkles: 使用 quartz 管理文档 ([dc735f3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/dc735f35a6f7b9f52ad7327c07994d071420d246))
* **project:** :sparkles: 初步更新至2.0版本 ([10a4114](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/10a4114c79dfeec921badf952b1b1f927ff5708f))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([2074d1b](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2074d1b0a530978b5f9ec1904087033f63e7b771))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([b9b2629](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b9b2629b9e4216109c88f6c32b531af5f6dcb471))
* **project:** :sparkles: 完善用户文档 ([4ea0eeb](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/4ea0eeb06ca4555991dfc8d066aa7566c1101687))
* **project:** :sparkles: 用Zotlit替代了ZoteroIntegration ([5dc9c01](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5dc9c0161d8ec20c75b3575d3302a912b58005cb))
* **project:** 🚀 Major plugins and templates optimization ([#87](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/87)) ([1eb75ee](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1eb75eebca23b7eca8f5eec0b74af4a55079614f))
* **projects:** :sparkles: Enhance project templates and documentation ([f512548](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f51254899218f55c12177376294e11bc9d4ce1ae))
* **template:** :sparkles: Enhance daily note template with intelligent date handling ([0800177](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/0800177105387d9a8eedb2682f9ed83860ba9102))
* **template:** :sparkles: Revise terminology templates and introduce new base files ([e2ea547](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e2ea547c844188c072f8c2800a6bcd5364fb803f))
* **template:** :sparkles: Update templates and references for scholars and papers ([1b288f9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1b288f9b32513dd8d7fc46685b8dc034ba12f822))
* **template:** Update longform academic template metadata and add scene alias ([d606152](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d606152f94cd4eb63946d311b11afefcacedb41a))
* **templator:** :sparkles: add term explanation module and update templates ([c940802](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c940802d2cb827334bec420a16f9bc403fafe86b))
* **theme:** :art: 增加卡片和无序列表callout视图 ([342e1aa](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/342e1aa15db8b0beeaa6b2f8437f6f3c9e51bf43))
* **theme:** :art: 增加卡片和无序列表callout视图 ([6d945e1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/6d945e14e94c5b032e2a3eb3aefe8ab4f02493fb))
* **theme:** :lipstick: choose bluze style ([2d9b44e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2d9b44e9def8a49bf7f95c2409698b70f6dc1562))
* **workspace:** :sparkles: Update workspace configuration and add daily note ([aba3362](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/aba336263194f2dd455b844feb953f562299b696))


### Bug Fixes

* :bug: correct previous commit type ([29529d4](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/29529d4022dac7f362768c4ce84f2d28c6741f1c))
* 🐛 fix-zotlit-templater ([3ca7588](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/3ca758812e020330883f743fbfeb30eaa2cb7f00))
* 🐛 improve template keyword display and metadata for release automation ([d0ed5e7](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d0ed5e70f04df8b8750a7c09c579f3ce64feba67))
* 🐛 LaTeX compilation error: Counter undefined (Pandoc: 3.8.2.1, pandoc-crossref: 0.3.22a) ([da47d79](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/da47d7981c102145807489bc6be077291acf5c54))
* 🐛 update workspace configuration with localized labels and modified timestamp ([a42317f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a42317f48adb55ea34226ed8d5de4689800d1a91))
* correct previous commit type ([a4a385e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a4a385e3e86b8d05418c8726713c23c2a75027ce))
* **daily-note:** Add a quick note for section view feature announcement and feedback request ([339d1b3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/339d1b3b4f5c6062f9c8de687c366a394f4f3455))
* **demo:** Update manuscript content and image references for clarity ([bbfd22d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/bbfd22dcff39bf91726842624197ffc1211eb43e))
* **docs:** :ambulance: README添加下载链接 ([08bc619](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/08bc6193ae816b0a193a256c4535bb137a9027b7))
* **docs:** :bug: 修复README内的链接 ([8988788](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/8988788171ddb96e31d0b04299df7b1808594f26))
* **docs:** :bug: 修复README内的链接 ([b924a9a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b924a9a3734437c20c84af6f9f4824778dec16f1))
* **docs:** :memo: Provide baidu cloud disk download link for 4.0.1 ([bb1b6f3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/bb1b6f3957a52ac28048b9c66008753e0a782760))
* **docs:** :memo: 修复文档一个小显示错误 ([76aa2f5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/76aa2f50309563cccc30cae4b72706c3f17d064d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([344a871](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/344a871506f178a49c594a70b898722000dce14d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([a12b94a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a12b94a5570d820291974e48556a66234974230b))
* **export:** Update PDF export arguments for improved resource handling ([d5173b1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d5173b1b1b8acb083dd66f117c6bc402f17a7a93))
* **feature:** :ambulance: 选择文件更小的白噪音 ([b8fe2bf](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b8fe2bf414a1b2cc3dc8ee889cf4f6f0b672505e))
* **feature:** :bug: delete abstract field when connecting with ZotLit ([9629595](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/96295952b73f24e721f3c10df28be1fdb1352504))
* **feature:** :bug: Fixed term and institute template ([65116ba](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/65116ba6ab222c72be8efa6e52604023e6ccf1da))
* **feature:** :bug: Fixed ZotLit templator rending bug ([3714123](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/371412377ccdf9f9e943359ba0611ef3e6059b59))
* **feature:** :bug: split anno notes correctly now ([7d5bc6c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/7d5bc6cb87377db24112e90f85db2c99f36201fb))
* **feature:** :bug: 修复了导出学术文本时的字体问题 ([ea81d19](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ea81d1902426ac725e012b74003816e6882afc12))
* **feature:** :bug: 修复了添加机构和学者的quickadd ([67dbe58](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/67dbe581d0380b942da3eddd2ed24a52654aef99))
* **feature:** :bug: 修复智能术语明文上传API密钥的问题 ([b0b80f6](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b0b80f648fe496383c531ba3785171775430edc3))
* **feature:** 🐛 delete abstract field when connecting with ZotLit ([22a1d67](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/22a1d67efea9a18101b5efa9c0d90c3a406b572a))
* **feature:** 🐛移除过期的 registration ID ([#96](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/96)) ([54018c5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/54018c531ef7acd85e0f4671c62553f8fdf182f0))
* **notes:** :bug: 一些Output的笔记例子 ([ff477bc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ff477bc0662b4ececc137f4d894c1a3c2841ebe1))
* **notes:** :bug: 修复概念墙过度检索的bug ([c5e33b3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c5e33b3495e4bda664c5e868cbfb9d6a9e53b178))
* **notes:** :memo: 新增了一些示例笔记 ([92f9276](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/92f9276094e1a0673f1d72a2c9df63d74ec3bc9f))
* **project:** :adhesive_bandage: 简单修改 quartz 配置 ([9f2cc4c](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/9f2cc4caa056f8eb89b9cafe77f740eaa686a79d))
* **project:** :arrow_up: Upgrade paperbell and homepage plugins ([a5aebea](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a5aebeadcad1930ebf4b4e2a8e8e280702ea3c8f))
* **project:** :bug: delete .git of quartz ([58bf9b9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/58bf9b93c66ed9ed301d2a93d1bca1122da0c6a7))
* **project:** :bug: Projects plugin now can create note ([1343e6f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1343e6f449012630e4e00287d5f37dbfce3404e2))
* **project:** :bug: 不再追踪 .DS_Store ([f211ac2](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f211ac29e0a648d1f9c870b18ba160c018910f7d))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([591c0fd](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/591c0fd72b899953437dd9bb6e8e5cb5c9601c4c))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([1bf4ffc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1bf4ffc0fa539fb072871f98882f3cee4c632c31))
* **project:** :bug: 修复了工作区失效的问题 ([69ebb0a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/69ebb0af8ed5e12f6f9d742711a0e7da74ac48d2))
* **project:** :bug: 修复了工作区失效的问题 ([56d0d28](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/56d0d28a00933e98f353cc95ed2ed30bcf3c89d0))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([75605c1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/75605c1c442c41ae2a636fa8b7ea0739d4572452))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([ba9d20a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ba9d20a8064011eb49ae225916b0f4b1acb425e9))
* **project:** :bug: 修改项目 README 和 quartz 配置 ([1a851a3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1a851a3b7d936cb26e4ab708156675e7ef29153e))
* **project:** :green_heart: 增加 vercel ([580001f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/580001f4ec53214b9613b2460acf126d894c185c))
* **project:** :green_heart: 重命名 Index 页面为 index，删除测试阶段多余生成的 output.pdf ([706122f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/706122fcacdd66e434740785baa879f521e475a8))
* **project:** :pencil2: 改回 BaseUrl ([c800db6](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c800db6be5e2dcad6a986a852e4ab97479e4da96))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([b6efe15](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b6efe151496139efa0deee43c10a701ea854c7a1))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([1043855](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/10438555772c29f1a6bbd79f3b2721156b5ba34d))
* **template:** :bug: Clean up book template formatting and remove unnecessary tags ([532e0e0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/532e0e0ab7e01d55fa6fdfd3e929b06607082b08))
* **theme:** :art: 修复由于gitignore而PaperBell路径内img没有上传的问题 ([d2a384f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d2a384fd0b4b4e987bb725587133ecb28f400cfb))
* **theme:** :bug: 修复了主页 banner 不显示的问题 ([da24046](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/da24046997f9f92796d3c7adf9157585c3f962ff))
* typo for QuickAdd Button ([5de35a0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5de35a08ed2b4065dbf74f3f7a4849209fdea89c))
* Update main.js for localization and license management improvements ([99fde6d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/99fde6d37883c1fb59309903fce92be498338e4b))
* Update project tracking link in homepage for accurate navigation ([59d43ed](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/59d43ed1f0edff7d406dce3b80b367400f71e8c9))
* Update project tracking link in homepage for improved navigation ([f9e694d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f9e694dd036be4902178a9130d560dc4c3b85256))


### Performance Improvements

* **feature:** :zap: By default, do not activate pandoc-crossref ([c8b85bc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c8b85bc90b84ec22924562a62d1469e3040b35e6))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([e806c36](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e806c36245b262ebe5387fce681fa51a01ecafec))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([771835a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/771835ab8775305b97d98779b160c0ae640e7ce0))


### Documentation

* **project:** :tada: redirect all dead repo links to our organization on GitHub ([ae119d4](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ae119d416a4421a8dc995522c757466e3e8a96ee))

## [4.4.0](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.3.4...v4.4.0) (2025-10-20)


### Features

* **demo:** Add comprehensive demo manuscript and enhance export configurations ([415d17d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/415d17d95ae84dd112befa72baea880cc39660e2))
* **demo:** Add new images for demo manuscript and update references ([1b044e9](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1b044e90a318dd166b77f7be26e4f80a8441a6f2))
* **demo:** Add organizing image to enhance demo manuscript visuals ([7baeb7e](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/7baeb7e34d4961ffc2f1158fd3fab3ce180bb3d0))
* **demo:** Enhance Pandoc configuration documentation and add custom workflow instructions ([ef9baad](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ef9baade9d97b1de7d4db91e9f686346cfa324e4))
* **longform:** Add template option for Pandoc export and enhance manuscript metadata ([e26130a](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/e26130a1a320e9eb6241d39328d43d6b59cd8514))
* **longform:** Revamp PaperBell Longform project structure and enhance metadata ([ff7f45f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ff7f45f9da5d915b8dabfb694fef246b5e601310))
* **map-view:** Enhance map view functionality and update plugin versions ([2cd6d0f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/2cd6d0fe01c478b23b66376c28a631a0be64403f))
* **template:** Update longform academic template metadata and add scene alias ([d606152](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d606152f94cd4eb63946d311b11afefcacedb41a))


### Bug Fixes

* **demo:** Update manuscript content and image references for clarity ([bbfd22d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/bbfd22dcff39bf91726842624197ffc1211eb43e))
* **export:** Update PDF export arguments for improved resource handling ([d5173b1](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/d5173b1b1b8acb083dd66f117c6bc402f17a7a93))

## [4.3.4](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.3.3...v4.3.4) (2025-09-28)


### Bug Fixes

* Update project tracking link in homepage for accurate navigation ([59d43ed](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/59d43ed1f0edff7d406dce3b80b367400f71e8c9))
* Update project tracking link in homepage for improved navigation ([f9e694d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/f9e694dd036be4902178a9130d560dc4c3b85256))

## [4.3.3](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.3.2...v4.3.3) (2025-09-27)


### Bug Fixes

* Update main.js for localization and license management improvements ([99fde6d](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/99fde6d37883c1fb59309903fce92be498338e4b))

## [4.3.2](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.3.1...v4.3.2) (2025-09-26)


### Bug Fixes

* **daily-note:** Add a quick note for section view feature announcement and feedback request ([339d1b3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/339d1b3b4f5c6062f9c8de687c366a394f4f3455))

## [4.3.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.3.0...v4.3.1) (2025-09-26)


### Bug Fixes

* **feature:** 🐛移除过期的 registration ID ([#96](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/96)) ([54018c5](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/54018c531ef7acd85e0f4671c62553f8fdf182f0))

## [4.3.0](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.2.1...v4.3.0) (2025-09-26)


### Features

* **project:** 🚀 Major plugins and templates optimization ([#87](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues/87)) ([1eb75ee](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1eb75eebca23b7eca8f5eec0b74af4a55079614f))

## [4.2.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.2.0...v4.2.1) (2025-06-12)


### Bug Fixes

* **feature:** 🐛 delete abstract field when connecting with ZotLit ([22a1d67](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/22a1d67efea9a18101b5efa9c0d90c3a406b572a))

## [4.2.0](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.1.1...v4.2.0) (2025-06-10)


### Features

* **feature:** :lipstick: Now users can set ZotLit import template colors in paperbell plugin ([b855824](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b855824460171ec5d838ea58f019de5e5c733ac7))

## [4.1.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.1.0...v4.1.1) (2025-04-26)


### Bug Fixes

* **feature:** :bug: Fixed ZotLit templator rending bug ([3714123](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/371412377ccdf9f9e943359ba0611ef3e6059b59))

## [4.1.0](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.0.2...v4.1.0) (2025-04-01)


### Features

* **feature:** :sparkles: update PaperBell using special plugin, make all plugins up-to-date ([b7d39d3](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/b7d39d36aec2363ac3c2fe0dc78e737773a46a0e))


### Bug Fixes

* **project:** :bug: Projects plugin now can create note ([1343e6f](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/1343e6f449012630e4e00287d5f37dbfce3404e2))


### Performance Improvements

* **feature:** :zap: By default, do not activate pandoc-crossref ([c8b85bc](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/c8b85bc90b84ec22924562a62d1469e3040b35e6))

## [4.0.2](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.0.1...v4.0.2) (2025-03-02)


### Bug Fixes

* typo for QuickAdd Button ([5de35a0](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/5de35a08ed2b4065dbf74f3f7a4849209fdea89c))

## [4.0.1](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v4.0.0...v4.0.1) (2025-02-04)


### Bug Fixes

* **project:** :arrow_up: Upgrade paperbell and homepage plugins ([a5aebea](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/a5aebeadcad1930ebf4b4e2a8e8e280702ea3c8f))

## [4.0.0](https://github.com/PaperBell-Org/Obsidian-PaperBell/compare/v3.1.2...v4.0.0) (2025-02-04)


### ⚠ BREAKING CHANGES

* **project:** move PaperBell to our GitHub organization now!

### Bug Fixes

* **feature:** :bug: Fixed term and institute template ([65116ba](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/65116ba6ab222c72be8efa6e52604023e6ccf1da))


### Documentation

* **project:** :tada: redirect all dead repo links to our organization on GitHub ([ae119d4](https://github.com/PaperBell-Org/Obsidian-PaperBell/commit/ae119d416a4421a8dc995522c757466e3e8a96ee))

## [3.1.2](https://github.com/SongshGeo/Obsidian-PaperBell/compare/v3.1.1...v3.1.2) (2025-01-22)


### Bug Fixes

* **theme:** :bug: 修复了主页 banner 不显示的问题 ([da24046](https://github.com/SongshGeo/Obsidian-PaperBell/commit/da24046997f9f92796d3c7adf9157585c3f962ff))

## [3.0.1](https://github.com/SongshGeo/Obsidian-PaperBell/compare/v3.0.1...v3.0.1) (2025-01-21)


### Features

* **docs:** :memo: 更新用户文档 ([4ff9060](https://github.com/SongshGeo/Obsidian-PaperBell/commit/4ff9060c092c195ba0a715c2985df84cd59be8b6))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([763ea84](https://github.com/SongshGeo/Obsidian-PaperBell/commit/763ea8483dcffbc32cb54d2ccbe21691f1db3450))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([5447396](https://github.com/SongshGeo/Obsidian-PaperBell/commit/5447396361b5b8b245ad57dd010113b78874fea0))
* **feature:** :sparkles: 使用 enhancing pdf 和 pandoc defaults 来创建导出 ([eef2441](https://github.com/SongshGeo/Obsidian-PaperBell/commit/eef2441397e617313c7bd844e74ef5f71b062455))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([53ae3b5](https://github.com/SongshGeo/Obsidian-PaperBell/commit/53ae3b5fb8bd16a0b223a7d92132231e4a2a4a02))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([75c7e7f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/75c7e7f545988d6b510c7a868068a6017583a5d0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([ab25c78](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ab25c78b42662f0fec243ded2e6d4531a155dee0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([96e4740](https://github.com/SongshGeo/Obsidian-PaperBell/commit/96e4740a59225ed87ce0ee51abd60ad7941835ce))
* **feature:** :sparkles: 增加AI智能查询关键词定义 ([0636a62](https://github.com/SongshGeo/Obsidian-PaperBell/commit/0636a62c3599b6e396588fa7fca55c225d464526))
* **feature:** :sparkles: 增加强化导出功能 ([6c23889](https://github.com/SongshGeo/Obsidian-PaperBell/commit/6c2388982face883b93f98e61612a93a76d45983))
* **feature:** :sparkles: 增加强化导出功能 ([a085c34](https://github.com/SongshGeo/Obsidian-PaperBell/commit/a085c3490eb6b3ba6c3ace0f9e77cd48da34232b))
* **feature:** :sparkles: 增加缩短链接功能 ([eb457b0](https://github.com/SongshGeo/Obsidian-PaperBell/commit/eb457b0c1eb59f8e96bdad5cb1080536284d0014))
* **feature:** :sparkles: 增加缩短链接功能 ([143c06e](https://github.com/SongshGeo/Obsidian-PaperBell/commit/143c06e5f34d23539f71cd14b0f1df4ad1925af0))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([02f653d](https://github.com/SongshGeo/Obsidian-PaperBell/commit/02f653de809347ff03599d095b56358caad3ffb7))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([0ab6283](https://github.com/SongshGeo/Obsidian-PaperBell/commit/0ab6283a8fe93360760f077c6ceda812d00aa682))
* **feature:** :sparkles: 示例仓库初步建立 ([d24c7f9](https://github.com/SongshGeo/Obsidian-PaperBell/commit/d24c7f930dbc6d1fb752dcc77dcc1f355502fc3b))
* **notes:** :sparkles: Reading Chinese paper into Zotero docs. ([d9c6025](https://github.com/SongshGeo/Obsidian-PaperBell/commit/d9c6025ceb696cce7e38d3c9580493b0810fa5b1))
* **project:** :sparkles: 使用 quartz 管理文档 ([dc735f3](https://github.com/SongshGeo/Obsidian-PaperBell/commit/dc735f35a6f7b9f52ad7327c07994d071420d246))
* **project:** :sparkles: 初步更新至2.0版本 ([10a4114](https://github.com/SongshGeo/Obsidian-PaperBell/commit/10a4114c79dfeec921badf952b1b1f927ff5708f))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([2074d1b](https://github.com/SongshGeo/Obsidian-PaperBell/commit/2074d1b0a530978b5f9ec1904087033f63e7b771))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([b9b2629](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b9b2629b9e4216109c88f6c32b531af5f6dcb471))
* **project:** :sparkles: 完善用户文档 ([4ea0eeb](https://github.com/SongshGeo/Obsidian-PaperBell/commit/4ea0eeb06ca4555991dfc8d066aa7566c1101687))
* **project:** :sparkles: 用Zotlit替代了ZoteroIntegration ([5dc9c01](https://github.com/SongshGeo/Obsidian-PaperBell/commit/5dc9c0161d8ec20c75b3575d3302a912b58005cb))
* **theme:** :art: 增加卡片和无序列表callout视图 ([342e1aa](https://github.com/SongshGeo/Obsidian-PaperBell/commit/342e1aa15db8b0beeaa6b2f8437f6f3c9e51bf43))
* **theme:** :art: 增加卡片和无序列表callout视图 ([6d945e1](https://github.com/SongshGeo/Obsidian-PaperBell/commit/6d945e14e94c5b032e2a3eb3aefe8ab4f02493fb))
* **theme:** :lipstick: choose bluze style ([2d9b44e](https://github.com/SongshGeo/Obsidian-PaperBell/commit/2d9b44e9def8a49bf7f95c2409698b70f6dc1562))


### Bug Fixes

* **docs:** :ambulance: README添加下载链接 ([08bc619](https://github.com/SongshGeo/Obsidian-PaperBell/commit/08bc6193ae816b0a193a256c4535bb137a9027b7))
* **docs:** :bug: 修复README内的链接 ([8988788](https://github.com/SongshGeo/Obsidian-PaperBell/commit/8988788171ddb96e31d0b04299df7b1808594f26))
* **docs:** :bug: 修复README内的链接 ([b924a9a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b924a9a3734437c20c84af6f9f4824778dec16f1))
* **docs:** :memo: 修复文档一个小显示错误 ([76aa2f5](https://github.com/SongshGeo/Obsidian-PaperBell/commit/76aa2f50309563cccc30cae4b72706c3f17d064d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([344a871](https://github.com/SongshGeo/Obsidian-PaperBell/commit/344a871506f178a49c594a70b898722000dce14d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([a12b94a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/a12b94a5570d820291974e48556a66234974230b))
* **feature:** :ambulance: 选择文件更小的白噪音 ([b8fe2bf](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b8fe2bf414a1b2cc3dc8ee889cf4f6f0b672505e))
* **feature:** :bug: 修复了导出学术文本时的字体问题 ([ea81d19](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ea81d1902426ac725e012b74003816e6882afc12))
* **feature:** :bug: 修复了添加机构和学者的quickadd ([67dbe58](https://github.com/SongshGeo/Obsidian-PaperBell/commit/67dbe581d0380b942da3eddd2ed24a52654aef99))
* **feature:** :bug: 修复智能术语明文上传API密钥的问题 ([b0b80f6](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b0b80f648fe496383c531ba3785171775430edc3))
* **notes:** :bug: 一些Output的笔记例子 ([ff477bc](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ff477bc0662b4ececc137f4d894c1a3c2841ebe1))
* **notes:** :bug: 修复概念墙过度检索的bug ([c5e33b3](https://github.com/SongshGeo/Obsidian-PaperBell/commit/c5e33b3495e4bda664c5e868cbfb9d6a9e53b178))
* **notes:** :memo: 新增了一些示例笔记 ([92f9276](https://github.com/SongshGeo/Obsidian-PaperBell/commit/92f9276094e1a0673f1d72a2c9df63d74ec3bc9f))
* **project:** :adhesive_bandage: 简单修改 quartz 配置 ([9f2cc4c](https://github.com/SongshGeo/Obsidian-PaperBell/commit/9f2cc4caa056f8eb89b9cafe77f740eaa686a79d))
* **project:** :bug: delete .git of quartz ([58bf9b9](https://github.com/SongshGeo/Obsidian-PaperBell/commit/58bf9b93c66ed9ed301d2a93d1bca1122da0c6a7))
* **project:** :bug: 不再追踪 .DS_Store ([f211ac2](https://github.com/SongshGeo/Obsidian-PaperBell/commit/f211ac29e0a648d1f9c870b18ba160c018910f7d))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([591c0fd](https://github.com/SongshGeo/Obsidian-PaperBell/commit/591c0fd72b899953437dd9bb6e8e5cb5c9601c4c))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([1bf4ffc](https://github.com/SongshGeo/Obsidian-PaperBell/commit/1bf4ffc0fa539fb072871f98882f3cee4c632c31))
* **project:** :bug: 修复了工作区失效的问题 ([69ebb0a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/69ebb0af8ed5e12f6f9d742711a0e7da74ac48d2))
* **project:** :bug: 修复了工作区失效的问题 ([56d0d28](https://github.com/SongshGeo/Obsidian-PaperBell/commit/56d0d28a00933e98f353cc95ed2ed30bcf3c89d0))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([75605c1](https://github.com/SongshGeo/Obsidian-PaperBell/commit/75605c1c442c41ae2a636fa8b7ea0739d4572452))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([ba9d20a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ba9d20a8064011eb49ae225916b0f4b1acb425e9))
* **project:** :bug: 修改项目 README 和 quartz 配置 ([1a851a3](https://github.com/SongshGeo/Obsidian-PaperBell/commit/1a851a3b7d936cb26e4ab708156675e7ef29153e))
* **project:** :green_heart: 增加 vercel ([580001f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/580001f4ec53214b9613b2460acf126d894c185c))
* **project:** :green_heart: 重命名 Index 页面为 index，删除测试阶段多余生成的 output.pdf ([706122f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/706122fcacdd66e434740785baa879f521e475a8))
* **project:** :pencil2: 改回 BaseUrl ([c800db6](https://github.com/SongshGeo/Obsidian-PaperBell/commit/c800db6be5e2dcad6a986a852e4ab97479e4da96))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([b6efe15](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b6efe151496139efa0deee43c10a701ea854c7a1))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([1043855](https://github.com/SongshGeo/Obsidian-PaperBell/commit/10438555772c29f1a6bbd79f3b2721156b5ba34d))
* **theme:** :art: 修复由于gitignore而PaperBell路径内img没有上传的问题 ([d2a384f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/d2a384fd0b4b4e987bb725587133ecb28f400cfb))


### Performance Improvements

* **project:** :fire: 移除datacore 和 BRAT 插件 ([e806c36](https://github.com/SongshGeo/Obsidian-PaperBell/commit/e806c36245b262ebe5387fce681fa51a01ecafec))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([771835a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/771835ab8775305b97d98779b160c0ae640e7ce0))

## [3.0.1](https://github.com/SongshGeo/Obsidian-PaperBell/compare/v2.1.0...v3.0.1) (2024-12-19)


### Bug Fixes

* **theme:** :art: 修复由于gitignore而PaperBell路径内img没有上传的问题 ([d2a384f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/d2a384fd0b4b4e987bb725587133ecb28f400cfb))

## [2.1.0](https://github.com/SongshGeo/Obsidian-PaperBell/compare/2.0.0...v2.1.0) (2024-12-01)


### Features

* **docs:** :memo: 更新用户文档 ([4ff9060](https://github.com/SongshGeo/Obsidian-PaperBell/commit/4ff9060c092c195ba0a715c2985df84cd59be8b6))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([763ea84](https://github.com/SongshGeo/Obsidian-PaperBell/commit/763ea8483dcffbc32cb54d2ccbe21691f1db3450))
* **feature:** :sparkles: LongForm 项目编译添加头文件 ([5447396](https://github.com/SongshGeo/Obsidian-PaperBell/commit/5447396361b5b8b245ad57dd010113b78874fea0))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([53ae3b5](https://github.com/SongshGeo/Obsidian-PaperBell/commit/53ae3b5fb8bd16a0b223a7d92132231e4a2a4a02))
* **feature:** :sparkles: 使用 Title Formatter Workflow 导出用户手册 ([75c7e7f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/75c7e7f545988d6b510c7a868068a6017583a5d0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([ab25c78](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ab25c78b42662f0fec243ded2e6d4531a155dee0))
* **feature:** :sparkles: 使用Virtual Linker插件进行潜在链接 ([96e4740](https://github.com/SongshGeo/Obsidian-PaperBell/commit/96e4740a59225ed87ce0ee51abd60ad7941835ce))
* **feature:** :sparkles: 增加AI智能查询关键词定义 ([0636a62](https://github.com/SongshGeo/Obsidian-PaperBell/commit/0636a62c3599b6e396588fa7fca55c225d464526))
* **feature:** :sparkles: 增加强化导出功能 ([6c23889](https://github.com/SongshGeo/Obsidian-PaperBell/commit/6c2388982face883b93f98e61612a93a76d45983))
* **feature:** :sparkles: 增加强化导出功能 ([a085c34](https://github.com/SongshGeo/Obsidian-PaperBell/commit/a085c3490eb6b3ba6c3ace0f9e77cd48da34232b))
* **feature:** :sparkles: 增加缩短链接功能 ([eb457b0](https://github.com/SongshGeo/Obsidian-PaperBell/commit/eb457b0c1eb59f8e96bdad5cb1080536284d0014))
* **feature:** :sparkles: 增加缩短链接功能 ([143c06e](https://github.com/SongshGeo/Obsidian-PaperBell/commit/143c06e5f34d23539f71cd14b0f1df4ad1925af0))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([02f653d](https://github.com/SongshGeo/Obsidian-PaperBell/commit/02f653de809347ff03599d095b56358caad3ffb7))
* **feature:** :sparkles: 尝试引入datacore进行笔记检索 ([0ab6283](https://github.com/SongshGeo/Obsidian-PaperBell/commit/0ab6283a8fe93360760f077c6ceda812d00aa682))
* **project:** :sparkles: 使用 quartz 管理文档 ([dc735f3](https://github.com/SongshGeo/Obsidian-PaperBell/commit/dc735f35a6f7b9f52ad7327c07994d071420d246))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([2074d1b](https://github.com/SongshGeo/Obsidian-PaperBell/commit/2074d1b0a530978b5f9ec1904087033f63e7b771))
* **project:** :sparkles: 增加 longform 和 virtual linker 插件 ([b9b2629](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b9b2629b9e4216109c88f6c32b531af5f6dcb471))
* **project:** :sparkles: 完善用户文档 ([4ea0eeb](https://github.com/SongshGeo/Obsidian-PaperBell/commit/4ea0eeb06ca4555991dfc8d066aa7566c1101687))
* **theme:** :art: 增加卡片和无序列表callout视图 ([342e1aa](https://github.com/SongshGeo/Obsidian-PaperBell/commit/342e1aa15db8b0beeaa6b2f8437f6f3c9e51bf43))
* **theme:** :art: 增加卡片和无序列表callout视图 ([6d945e1](https://github.com/SongshGeo/Obsidian-PaperBell/commit/6d945e14e94c5b032e2a3eb3aefe8ab4f02493fb))


### Bug Fixes

* **docs:** :bug: 修复README内的链接 ([8988788](https://github.com/SongshGeo/Obsidian-PaperBell/commit/8988788171ddb96e31d0b04299df7b1808594f26))
* **docs:** :bug: 修复README内的链接 ([b924a9a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b924a9a3734437c20c84af6f9f4824778dec16f1))
* **docs:** :memo: 修复文档一个小显示错误 ([76aa2f5](https://github.com/SongshGeo/Obsidian-PaperBell/commit/76aa2f50309563cccc30cae4b72706c3f17d064d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([344a871](https://github.com/SongshGeo/Obsidian-PaperBell/commit/344a871506f178a49c594a70b898722000dce14d))
* **docs:** :memo: 增加longform: true/false的模板选项 ([a12b94a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/a12b94a5570d820291974e48556a66234974230b))
* **feature:** :bug: 修复了添加机构和学者的quickadd ([67dbe58](https://github.com/SongshGeo/Obsidian-PaperBell/commit/67dbe581d0380b942da3eddd2ed24a52654aef99))
* **feature:** :bug: 修复智能术语明文上传API密钥的问题 ([b0b80f6](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b0b80f648fe496383c531ba3785171775430edc3))
* **project:** :bug: delete .git of quartz ([58bf9b9](https://github.com/SongshGeo/Obsidian-PaperBell/commit/58bf9b93c66ed9ed301d2a93d1bca1122da0c6a7))
* **project:** :bug: 不再追踪 .DS_Store ([f211ac2](https://github.com/SongshGeo/Obsidian-PaperBell/commit/f211ac29e0a648d1f9c870b18ba160c018910f7d))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([591c0fd](https://github.com/SongshGeo/Obsidian-PaperBell/commit/591c0fd72b899953437dd9bb6e8e5cb5c9601c4c))
* **project:** :bug: 修复了 periodic note 和 thino 插件不兼容的问题 ([1bf4ffc](https://github.com/SongshGeo/Obsidian-PaperBell/commit/1bf4ffc0fa539fb072871f98882f3cee4c632c31))
* **project:** :bug: 修复了工作区失效的问题 ([69ebb0a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/69ebb0af8ed5e12f6f9d742711a0e7da74ac48d2))
* **project:** :bug: 修复了工作区失效的问题 ([56d0d28](https://github.com/SongshGeo/Obsidian-PaperBell/commit/56d0d28a00933e98f353cc95ed2ed30bcf3c89d0))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([75605c1](https://github.com/SongshGeo/Obsidian-PaperBell/commit/75605c1c442c41ae2a636fa8b7ea0739d4572452))
* **project:** :bug: 修复了重命名后enhancing-export无法正常导出的问题 ([ba9d20a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/ba9d20a8064011eb49ae225916b0f4b1acb425e9))
* **project:** :green_heart: 增加 vercel ([580001f](https://github.com/SongshGeo/Obsidian-PaperBell/commit/580001f4ec53214b9613b2460acf126d894c185c))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([b6efe15](https://github.com/SongshGeo/Obsidian-PaperBell/commit/b6efe151496139efa0deee43c10a701ea854c7a1))
* **project:** :rotating_light: 过滤掉字符串不存在的警告⚠️缺失emoji字体 ([1043855](https://github.com/SongshGeo/Obsidian-PaperBell/commit/10438555772c29f1a6bbd79f3b2721156b5ba34d))


### Performance Improvements

* **project:** :fire: 移除datacore 和 BRAT 插件 ([e806c36](https://github.com/SongshGeo/Obsidian-PaperBell/commit/e806c36245b262ebe5387fce681fa51a01ecafec))
* **project:** :fire: 移除datacore 和 BRAT 插件 ([771835a](https://github.com/SongshGeo/Obsidian-PaperBell/commit/771835ab8775305b97d98779b160c0ae640e7ce0))

## 0.1.0 — 2023-09-28

## 新特性

- 学者与论文管理 📅 2023-09-01
- 创建学者 📅 2023-09-01
- 创建事件 📅 2023-09-01
- 创建地点 📅 2023-09-01
- 创建学术机构 📅 2023-09-01
