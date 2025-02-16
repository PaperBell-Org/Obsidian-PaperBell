# PaperBell 核心配置

本仓库用来同步 PaperBell 的核心配置，从而让用户能够自动更新。

## 前提条件

- 本地已经安装了 git
- 使用 git 管理本地的 Obsidian 仓库
- 更新前，本地 Obsidian 仓库是干净的索引（可以 merge）

## 使用方法

在本地执行以下命令，将本仓库的配置同步到本地 Obsidian 仓库：

```bash
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

## 注意事项

- 建议保留远程版本的文件：
  - `.obsidian/workspaces.json`: 工作区配置
  - `.obsidian/plugins/**/manifest.json`: 插件的核心功能
  - `40 - Obsidian/.`: 该文件夹内保留的模板文件，通常是 `PaperBell` 核心工作流所调用的
- 本仓库不追踪，因为通常不会做更改，或者 obsidian 会自动生成的文件：
  - `.obsidian/graph.json`: 图谱文件
  - `.obsidian/hotkeys.json`: 快捷键
  - `.obsidian/types.json`: 类别
- 建议保留本地版本的文件：
  - `.obsidan/plugins/**/data.json`: 插件的用户配置
  - `.gitignore`: 用户自定义的忽略文件
  - `README.md`: 用户自定义的 README 文件
