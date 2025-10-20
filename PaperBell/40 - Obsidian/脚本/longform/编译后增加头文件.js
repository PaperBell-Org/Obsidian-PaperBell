module.exports = {
  description: {
    name: "Add YAML Metadata",
    description: "Prepends YAML metadata from a specific note in the current folder to the manuscript.",
    availableKinds: ["Manuscript"],
    options: [
      {
        id: "note-name",
        name: "Note Name",
        description: "Name of the note to get metadata from (e.g., 'Index', 'Metadata', etc.)",
        type: "Text",
        default: "Index",
      },
      {
        id: "author-name",
        name: "Author",
        description: "Name of the author to include in YAML frontmatter",
        type: "Text",
        default: "Unknown Author",
      },
      {
        id: "lineno",
        name: "Line Numbers",
        description: "Enable line numbers in the document",
        type: "Boolean",
        default: false,
      },
      {
        id: "csl-style",
        name: "Citation Style",
        description: "Citation style for the document",
        type: "Dropdown",
        options: [
          { value: "", label: "Default" },
          { value: "apa", label: "APA" },
          { value: "nature", label: "Nature" },
        ],
        default: "",
      },
      {
        id: "target-journal",
        name: "Target Journal",
        description: "Target journal for the manuscript",
        type: "Text",
        default: "",
      },
      {
        id: "acronym",
        name: "Project Acronym",
        description: "Acronym for the project/paper",
        type: "Text",
        default: "",
      },
      {
        id: "figures-at-end",
        name: "Figures at End",
        description: "Move all figures and tables to the end of the document",
        type: "Boolean",
        default: false,
      },
      {
        id: "template",
        name: "Pandoc Template",
        description: "Pandoc template to use (leave empty for auto-detection: macOS/Linux→paperbell, Windows→paperbell-windows)",
        type: "Text",
        default: "",
      },
    ],
  },

  compile: async function (input, context) {
    // 默认值
    let title = "Untitled";
    let date = new Date().toISOString().split('T')[0];
    let author = context.optionValues["author-name"];
    let abstract = "";
    let keywords = [];
    let target = context.optionValues["target-journal"];
    let acronym = context.optionValues["acronym"];
    let csl = context.optionValues["csl-style"];
    let style = "";
    let lineno = context.optionValues["lineno"];
    let figuresAtEnd = context.optionValues["figures-at-end"];
    let template = context.optionValues["template"];

    // 检测操作系统 (如果 template 为空)
    if (!template || template === "") {
      const platform = process.platform;
      // Unix-like 系统 (macOS, Linux)
      if (platform === "darwin" || platform === "linux") {
        template = "paperbell";
      }
      // Windows 系统
      else if (platform === "win32") {
        template = "paperbell-windows";
      }
      // 其他系统默认使用 Unix 版本
      else {
        template = "paperbell";
      }
      console.log(`[Add YAML Metadata] Auto-detected OS: ${platform}, using template: ${template}`);
    }

    // 作者信息结构
    let authors = [];
    let affiliations = [];

    try {
      // 获取当前项目路径
      const projectPath = context.projectPath;
      const noteName = context.optionValues["note-name"];

      // 构建目标笔记的完整路径
      const targetNotePath = `${projectPath}/${noteName}.md`;

      // 使用 Obsidian API 获取文件
      const targetNote = context.app.vault.getAbstractFileByPath(targetNotePath);

      if (targetNote) {
        // 使用 Obsidian 的 metadataCache 获取 frontmatter
        const metadata = context.app.metadataCache.getFileCache(targetNote);

        if (metadata && metadata.frontmatter) {
          const fm = metadata.frontmatter;

          // 从 frontmatter 中获取所有属性
          title = fm.title || title;
          date = fm.date || date;
          author = fm.author || fm["corresponding author"] || author;
          abstract = fm.abstract || abstract;

          // 处理 keywords 数组
          if (fm.keywords) {
            if (Array.isArray(fm.keywords)) {
              keywords = fm.keywords;
            } else {
              keywords = [fm.keywords];
            }
          }

          // 处理作者信息（支持复杂结构）
          if (fm.authors) {
            authors = fm.authors;
          } else if (fm.author) {
            authors = [{ name: fm.author }];
          } else {
            authors = [{ name: author }];
          }

          // 处理机构信息
          if (fm.affiliations) {
            affiliations = fm.affiliations;
          }

          // 其他属性（用户选项优先）
          target = context.optionValues["target-journal"] || fm.target || target;
          acronym = context.optionValues["acronym"] || fm.acronym || acronym;
          csl = context.optionValues["csl-style"] || fm.csl || csl;
          style = fm.style || style;
          lineno = context.optionValues["lineno"] !== undefined ? context.optionValues["lineno"] : (fm.lineno || false);

          // Template: 用户选项 > 元数据 > 自动检测
          if (!context.optionValues["template"] || context.optionValues["template"] === "") {
            template = fm.template || template;
          }
        }
      }
    } catch (error) {
      console.log('Error reading note metadata:', error);
      // 如果出错，使用默认值
      if (authors.length === 0) {
        authors = [{ name: author }];
      }
    }

    // 确保 keywords 是数组格式
    if (!Array.isArray(keywords)) {
      keywords = keywords ? [keywords] : [];
    }

    // 确保 authors 是数组格式
    if (!Array.isArray(authors) || authors.length === 0) {
      authors = [{ name: author }];
    }

    // 构建 YAML 前言内容
    let yamlFrontmatter = `---
title: "${title}"
date: "${date}"
`;

    // 添加作者信息
    if (authors.length > 0) {
      yamlFrontmatter += `authors:\n`;
      authors.forEach(author => {
        yamlFrontmatter += `  - name: "${author.name}"\n`;
        if (author.affiliation) {
          yamlFrontmatter += `    affiliation: [${Array.isArray(author.affiliation) ? author.affiliation.join(', ') : author.affiliation}]\n`;
        }
        if (author.corresponding) {
          yamlFrontmatter += `    corresponding: "${author.corresponding}"\n`;
        }
      });
    }

    // 添加机构信息
    if (affiliations.length > 0) {
      yamlFrontmatter += `affiliations:\n`;
      affiliations.forEach(aff => {
        yamlFrontmatter += `  - index: ${aff.index}\n`;
        yamlFrontmatter += `    name: "${aff.name}"\n`;
      });
    }

    // 添加其他信息
    yamlFrontmatter += `abstract: "${abstract}"\n`;

    if (keywords.length > 0) {
      yamlFrontmatter += `keywords:\n`;
      keywords.forEach(keyword => {
        yamlFrontmatter += `  - "${keyword}"\n`;
      });
    }

    yamlFrontmatter += `target: "${target}"\n`;
    yamlFrontmatter += `acronym: "${acronym}"\n`;
    yamlFrontmatter += `csl: "${csl}"\n`;
    yamlFrontmatter += `style: "${style}"\n`;

    // 添加模板设置
    if (template) {
      yamlFrontmatter += `template: "${template}"\n`;
    }

    // 添加行号设置
    if (lineno) {
      yamlFrontmatter += `lineno: "true"\n`;
    }

    // 添加图表置后设置
    if (figuresAtEnd) {
      yamlFrontmatter += `figures-at-end: "true"\n`;
    }

    yamlFrontmatter += `---\n`;

    // 将 YAML 前言插入文稿的顶部
    const newContents = yamlFrontmatter + "\n" + input.contents;

    // 返回带有 YAML 信息的文稿
    return { contents: newContents };
  },
};
