import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "ไม่มีชื่อ",
    description: "ไม่ได้ระบุคำอธิบายย่อ",
  },
  components: {
    callout: {
      note: "หมายเหตุ",
      abstract: "บทคัดย่อ",
      info: "ข้อมูล",
      todo: "ต้องทำเพิ่มเติม",
      tip: "คำแนะนำ",
      success: "เรียบร้อย",
      question: "คำถาม",
      warning: "คำเตือน",
      failure: "ข้อผิดพลาด",
      danger: "อันตราย",
      bug: "บั๊ก",
      example: "ตัวอย่าง",
      quote: "คำพูกยกมา",
    },
    backlinks: {
      title: "หน้าที่กล่าวถึง",
      noBacklinksFound: "ไม่มีหน้าที่โยงมาหน้านี้",
    },
    themeToggle: {
      lightMode: "โหมดสว่าง",
      darkMode: "โหมดมืด",
    },
    explorer: {
      title: "รายการหน้า",
    },
    footer: {
      createdWith: "สร้างด้วย",
    },
    graph: {
      title: "มุมมองกราฟ",
    },
    recentNotes: {
      title: "บันทึกล่าสุด",
      seeRemainingMore: ({ remaining }) => `ดูเพิ่มอีก ${remaining} รายการ →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `รวมข้ามเนื้อหาจาก ${targetSlug}`,
      linkToOriginal: "ดูหน้าต้นทาง",
    },
    search: {
      title: "ค้นหา",
      searchBarPlaceholder: "ค้นหาบางอย่าง",
    },
    tableOfContents: {
      title: "สารบัญ",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `อ่านราว ${minutes} นาที`,
    },
  },
  pages: {
    rss: {
      recentNotes: "บันทึกล่าสุด",
      lastFewNotes: ({ count }) => `${count} บันทึกล่าสุด`,
    },
    error: {
      title: "ไม่มีหน้านี้",
      notFound: "หน้านี้อาจตั้งค่าเป็นส่วนตัวหรือยังไม่ถูกสร้าง",
      home: "กลับหน้าหลัก",
    },
    folderContent: {
      folder: "โฟลเดอร์",
      itemsUnderFolder: ({ count }) => `มี ${count} รายการในโฟลเดอร์นี้`,
    },
    tagContent: {
      tag: "แท็ก",
      tagIndex: "แท็กทั้งหมด",
      itemsUnderTag: ({ count }) => `มี ${count} รายการในแท็กนี้`,
      showingFirst: ({ count }) => `แสดง ${count} แท็กแรก`,
      totalTags: ({ count }) => `มีทั้งหมด ${count} แท็ก`,
    },
  },
} as const satisfies Translation
