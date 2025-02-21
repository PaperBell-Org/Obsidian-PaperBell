import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "無題",
    description: "無描述",
  },
  components: {
    callout: {
      note: "筆記",
      abstract: "摘要",
      info: "提示",
      todo: "待辦",
      tip: "提示",
      success: "成功",
      question: "問題",
      warning: "警告",
      failure: "失敗",
      danger: "危險",
      bug: "錯誤",
      example: "範例",
      quote: "引用",
    },
    backlinks: {
      title: "反向連結",
      noBacklinksFound: "無法找到反向連結",
    },
    themeToggle: {
      lightMode: "亮色模式",
      darkMode: "暗色模式",
    },
    explorer: {
      title: "探索",
    },
    footer: {
      createdWith: "Created with",
    },
    graph: {
      title: "關係圖譜",
    },
    recentNotes: {
      title: "最近的筆記",
      seeRemainingMore: ({ remaining }) => `查看更多 ${remaining} 篇筆記 →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `包含 ${targetSlug}`,
      linkToOriginal: "指向原始筆記的連結",
    },
    search: {
      title: "搜尋",
      searchBarPlaceholder: "搜尋些什麼",
    },
    tableOfContents: {
      title: "目錄",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `閱讀時間約 ${minutes} 分鐘`,
    },
  },
  pages: {
    rss: {
      recentNotes: "最近的筆記",
      lastFewNotes: ({ count }) => `最近的 ${count} 條筆記`,
    },
    error: {
      title: "無法找到",
      notFound: "私人筆記或筆記不存在。",
      home: "返回首頁",
    },
    folderContent: {
      folder: "資料夾",
      itemsUnderFolder: ({ count }) => `此資料夾下有 ${count} 條筆記。`,
    },
    tagContent: {
      tag: "標籤",
      tagIndex: "標籤索引",
      itemsUnderTag: ({ count }) => `此標籤下有 ${count} 條筆記。`,
      showingFirst: ({ count }) => `顯示前 ${count} 個標籤。`,
      totalTags: ({ count }) => `總共有 ${count} 個標籤。`,
    },
  },
} as const satisfies Translation
