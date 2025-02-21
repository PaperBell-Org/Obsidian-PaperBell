import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "İsimsiz",
    description: "Herhangi bir açıklama eklenmedi",
  },
  components: {
    callout: {
      note: "Not",
      abstract: "Özet",
      info: "Bilgi",
      todo: "Yapılacaklar",
      tip: "İpucu",
      success: "Başarılı",
      question: "Soru",
      warning: "Uyarı",
      failure: "Başarısız",
      danger: "Tehlike",
      bug: "Hata",
      example: "Örnek",
      quote: "Alıntı",
    },
    backlinks: {
      title: "Backlinkler",
      noBacklinksFound: "Backlink bulunamadı",
    },
    themeToggle: {
      lightMode: "Açık mod",
      darkMode: "Koyu mod",
    },
    explorer: {
      title: "Gezgin",
    },
    footer: {
      createdWith: "Şununla oluşturuldu",
    },
    graph: {
      title: "Grafik Görünümü",
    },
    recentNotes: {
      title: "Son Notlar",
      seeRemainingMore: ({ remaining }) => `${remaining} tane daha gör →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `${targetSlug} sayfasından alıntı`,
      linkToOriginal: "Orijinal bağlantı",
    },
    search: {
      title: "Arama",
      searchBarPlaceholder: "Bir şey arayın",
    },
    tableOfContents: {
      title: "İçindekiler",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} dakika okuma süresi`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Son notlar",
      lastFewNotes: ({ count }) => `Son ${count} not`,
    },
    error: {
      title: "Bulunamadı",
      notFound: "Bu sayfa ya özel ya da mevcut değil.",
      home: "Anasayfaya geri dön",
    },
    folderContent: {
      folder: "Klasör",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "Bu klasör altında 1 öğe." : `Bu klasör altındaki ${count} öğe.`,
    },
    tagContent: {
      tag: "Etiket",
      tagIndex: "Etiket Sırası",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "Bu etikete sahip 1 öğe." : `Bu etiket altındaki ${count} öğe.`,
      showingFirst: ({ count }) => `İlk ${count} etiket gösteriliyor.`,
      totalTags: ({ count }) => `Toplam ${count} adet etiket bulundu.`,
    },
  },
} as const satisfies Translation
