# PaperBell-DEMO

一个完整的 PaperOut To-Authors 演示项目：一个项目、四份草稿，展示 PaperBell 从分场景写作到投稿级导出的全流程。

## 结构

```
paper-demo/
├── metadata.json                  出版元信息（作者 / 机构 / 通讯作者 / 导出模板）——唯一权威来源
├── results.json                   编译期占位符数据，供 {{ summary.n_plugins }} 之类替换
├── references.bib                 本项目的参考文献（就近查找，优先于全局 bib）
├── figs/                          图片
├── Main Manuscript (Index).md     主手稿  + manuscript/
├── Response Letter (Index).md     回复信  + response/
├── Cover Letter.md                投稿信（单文件草稿）
└── supplementary/                 补充材料（自带 metadata.json → 图表 S 编号）
```

## 四条工作流

| 草稿 | 工作流 | 产出 |
|---|---|---|
| Main Manuscript | `PaperBell Manuscript` | 手稿 PDF，并抓取行号 / 图号供回复信引用 |
| Supplementary | `PaperBell Supplementary` | 补充材料 PDF（图表 S1、S2……） |
| Response Letter | `PaperBell Response Letter` | 回复信 PDF，同步引用手稿的行号与图号 |
| Cover Letter | `PaperBell Cover Letter` | 投稿信 PDF |

**顺序要紧**：先编译 Main Manuscript（产出 `manuscript-lines.json` / `figure-numbers.json`），
再编译 Response Letter，否则回复信里对手稿的行号引用无从解析。

## 前置条件

1. 本机装了 `pandoc`（PDF 还需要一套 LaTeX，如 TinyTeX / MacTeX）。
2. 在 PaperOut 面板里下载 Pandoc 资产（来自 [paperout-assets-market](https://github.com/PaperBell-Org/paperout-assets-market)），
   默认落盘到 `00 - Obsidian/pandoc/`。`metadata.json` 里 `_longform.template: "paperbell"`
   对应其中的 `defaults/paperbell.yaml`。

## 约定

- **作者只写在 `metadata.json` 的 `creators` 里**，编译时由 `add-zenodo-frontmatter` 步骤生成
  `authors:` 块注入编译产物。Index 的 frontmatter 里不要再写一份。
- `30 - Metadata/Scholars/` 是你追踪的**他人**，与手稿署名无关。
- 每份草稿的 `concepts:` 选取概念卡，于是能被概念卡的「围绕此概念的输出」反查到。
