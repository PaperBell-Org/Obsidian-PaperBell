import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Be Pavadinimo",
    description: "Aprašymas Nepateiktas",
  },
  components: {
    callout: {
      note: "Pastaba",
      abstract: "Santrauka",
      info: "Informacija",
      todo: "Darbų sąrašas",
      tip: "Patarimas",
      success: "Sėkmingas",
      question: "Klausimas",
      warning: "Įspėjimas",
      failure: "Nesėkmingas",
      danger: "Pavojus",
      bug: "Klaida",
      example: "Pavyzdys",
      quote: "Citata",
    },
    backlinks: {
      title: "Atgalinės Nuorodos",
      noBacklinksFound: "Atgalinių Nuorodų Nerasta",
    },
    themeToggle: {
      lightMode: "Šviesus Režimas",
      darkMode: "Tamsus Režimas",
    },
    explorer: {
      title: "Naršyklė",
    },
    footer: {
      createdWith: "Sukurta Su",
    },
    graph: {
      title: "Grafiko Vaizdas",
    },
    recentNotes: {
      title: "Naujausi Užrašai",
      seeRemainingMore: ({ remaining }) => `Peržiūrėti dar ${remaining} →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Įterpimas iš ${targetSlug}`,
      linkToOriginal: "Nuoroda į originalą",
    },
    search: {
      title: "Paieška",
      searchBarPlaceholder: "Ieškoti",
    },
    tableOfContents: {
      title: "Turinys",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min skaitymo`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Naujausi užrašai",
      lastFewNotes: ({ count }) =>
        count === 1
          ? "Paskutinis 1 užrašas"
          : count < 10
            ? `Paskutiniai ${count} užrašai`
            : `Paskutiniai ${count} užrašų`,
    },
    error: {
      title: "Nerasta",
      notFound:
        "Arba šis puslapis yra pasiekiamas tik tam tikriems vartotojams, arba tokio puslapio nėra.",
      home: "Grįžti į pagrindinį puslapį",
    },
    folderContent: {
      folder: "Aplankas",
      itemsUnderFolder: ({ count }) =>
        count === 1
          ? "1 elementas šiame aplanke."
          : count < 10
            ? `${count} elementai šiame aplanke.`
            : `${count} elementų šiame aplanke.`,
    },
    tagContent: {
      tag: "Žyma",
      tagIndex: "Žymų indeksas",
      itemsUnderTag: ({ count }) =>
        count === 1
          ? "1 elementas su šia žyma."
          : count < 10
            ? `${count} elementai su šia žyma.`
            : `${count} elementų su šia žyma.`,
      showingFirst: ({ count }) =>
        count < 10 ? `Rodomos pirmosios ${count} žymos.` : `Rodomos pirmosios ${count} žymų.`,
      totalTags: ({ count }) =>
        count === 1
          ? "Rasta iš viso 1 žyma."
          : count < 10
            ? `Rasta iš viso ${count} žymos.`
            : `Rasta iš viso ${count} žymų.`,
    },
  },
} as const satisfies Translation
