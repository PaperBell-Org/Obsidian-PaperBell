# `PaperBell`: Research, to be connected

![主页示意图](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/Pasted%20image%2020250204135426.png)

👋 `PaperBell` 是使用 `Obsidian` 管理你学术生涯的终极方案。

## 核心功能

我们的主页全新上线啦，欢迎访问 [paperbell.cn](https://paperbell.cn) 查看本示例库的核心功能和最新动态！

您可以通过[文档](https://paperbell.songshgeo.com) 或者我在 B 站上录制的[介绍视频](https://space.bilibili.com/390967345/channel/collectiondetail?sid=3005906) （视频更新很不及时）了解 `PaperBell` 提供的核心功能。

## 社区支持

我们为 `PaperBell` 项目创建了一个微信交流社群，欢迎交流任何关于学术生活的感想。用户可关注我的公众号【隅地】发送关键字 `Obsidian` 或 `PaperBell` 获取最新群聊二维码。

![follow_paperbell](https://songshgeo-picgo-1302043007.cos.ap-beijing.myqcloud.com/uPic/follow_paperbell.jpeg)

你也可以通过 [GitHub issue](https://github.com/PaperBell-Org/Obsidian-PaperBell/issues) 反馈问题，或者[通过邮箱联系我们](mailto:PaperBell@songshgeo.com)。

## 下载与安装

1. 在 [Releases](https://github.com/PaperBell-Org/Obsidian-PaperBell/releases) 下载最新的 `PaperBell-vX.Y.Z.zip`
2. 解压到一个空文件夹
3. 用 Obsidian 打开该文件夹作为库

本仓库的根目录就是示例库本身，也可以直接 `git clone` 后用 Obsidian 打开。

## 用 git 跟随更新（进阶）

已经在用 PaperBell、并用 git 管理自己库的用户，可以把本仓库作为 `template` 远端合并更新。

### 前提条件

- 本地已经安装了 git
- 使用 git 管理本地的 Obsidian 仓库
- 更新前，本地 Obsidian 仓库是干净的索引（可以 merge）

### 使用方法

在本地执行以下命令，将本仓库的配置同步到本地 Obsidian 仓库：

```bash
git remote add template https://github.com/PaperBell-Org/Obsidian-PaperBell.git
git fetch template
git merge template/main --allow-unrelated-histories
```

会产生很多冲突，我们生成冲突的文件列表：

```bash
git diff --name-only --diff-filter=U > merge-plan.txt
```

在上述文件中，分别手动选择每个文件保留本地版本还是远程版本：

```python
# ours
conflict-file-1
conflict-file-2

# theirs
conflict-file-3
conflict-file-4
```

然后执行以下脚本，解决冲突：

```bash
#!/bin/bash

# 处理本地版本
echo "处理本地版本..."
while IFS= read -r file; do
    [[ $file =~ ^#.* ]] && continue  # 跳过注释行
    [[ -z $file ]] && continue       # 跳过空行
    git checkout --ours "$file"
    git add "$file"
    echo "使用本地版本: $file"
done < <(sed -n '/^# ours/,/^# theirs/p' merge-plan.txt | grep -v '^#')

# 处理远程版本
echo "处理远程版本..."
while IFS= read -r file; do
    [[ $file =~ ^#.* ]] && continue  # 跳过注释行
    [[ -z $file ]] && continue       # 跳过空行
    git checkout --theirs "$file"
    git add "$file"
    echo "使用远程版本: $file"
done < <(sed -n '/^# theirs/,$p' merge-plan.txt | grep -v '^#')
```

解决冲突后，执行以下命令来保存更新：

```bash
# 这里有没有办法自动获取版本号？
git commit -m "Merge template/main, `PaperBell` is up-to-date (version: `git rev-parse HEAD`)."
```

### 注意事项

- 建议保留远程版本的文件：
  - `.obsidian/workspaces.json`: 工作区配置
  - `.obsidian/plugins/**/manifest.json`: 插件的核心功能
  - `00 - Obsidian/.`: 该文件夹内保留的模板文件，通常是 `PaperBell` 核心工作流所调用的
- 本仓库不追踪，因为通常不会做更改，或者 obsidian 会自动生成的文件：
  - `.obsidian/graph.json`: 图谱文件
  - `.obsidian/hotkeys.json`: 快捷键
  - `.obsidian/types.json`: 类别
- 建议保留本地版本的文件：
  - `.obsidan/plugins/**/data.json`: 插件的用户配置
  - `.gitignore`: 用户自定义的忽略文件
  - `README.md`: 用户自定义的 README 文件
- 有些设置**根本不在本仓库里**，合并配置带不过来，只能在每台机器上手动开一次：
  - Templater 自 `2.24` 起把「新建文件时触发」等开关挪进了 Obsidian 的本地设置，不再写入
    `data.json`，且默认关闭。它一关，五个文件夹模板（每日日记、概念卡、项目、学者、输出草稿）
    全都不会渲染，新笔记里会留下 `<% ... %>` 代码。见用户文档《关于如何使用示例仓库的问题》。

## ⚠️ 不要把 API Key 提交进来

本仓库会提交 `.obsidian/plugins/*/data.json`。Cards Wrangler 需要一个 LLM，但**随仓库分发的配置里
`apiKey` 必须为空**。请用下面两种方式之一提供密钥：

- **走 PaperBell host**（默认）：`configSource: "paperbell"`，由 PaperBell 插件统一派发 LLM 调用，
  密钥永远不经过本插件。
- **走系统钥匙串**：在插件设置里选一个 `apiKeySecretId`，密钥存进 Obsidian 的 keychain，只留一个 id 在
  `data.json` 里。host 不可用或你拒绝授权时，插件会自动回落到这份本地配置。

**不要**直接往设置页的 `apiKey` 里粘贴密钥——那会被写进 `data.json`，进而被 obsidian-git 提交、推送出去。

## 致谢 & 许可

本示例库的 UI 界面参考了以下出色的开源项目，欢迎给他们点个 star 或买杯咖啡：

- [AnuPpuccin](https://github.com/AnubisNekhet/AnuPpuccin)：非常棒的主题！欢迎 [Buy her a coffee](https://www.buymeacoffee.com/anubisnekhet)！
- [RainBell](https://github.com/RainBell129/Obsidian-Homepage)：最早启发 `PaperBell` 项目的示例库！

本项目遵循 [MIT 许可](LICENSE)，允许**非商业用途**的复制、修改、分发。但本项目配套的[专属插件](https://github.com/SongshGeo/Obsidian-PaperBell-Plugin)不属于本许可。
