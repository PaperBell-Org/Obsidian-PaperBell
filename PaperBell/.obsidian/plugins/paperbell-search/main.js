/* PaperSearch — generated bundle. Edit src/, then run: npm run build */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  PaperSearchPlugin: () => PaperSearchPlugin,
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var obsidian12 = __toESM(require("obsidian"));
var nodeFs3 = __toESM(require("fs"));
var nodePath5 = __toESM(require("path"));
var nodeOs = __toESM(require("os"));
var nodeCrypto2 = __toESM(require("crypto"));

// src/constants.ts
var VIEW_TYPE = "paperbell-papersearch";
var PROTOCOL = "papersearch";
var LEGACY_PROTOCOL = "paperbell-search";
var TAG_META = {
  unclassified: { label: "未分类", cls: "pb-rt-unclassified" },
  support: { label: "核心支撑", cls: "pb-rt-support" },
  method: { label: "方法参考", cls: "pb-rt-method" },
  contrast: { label: "反例与边界", cls: "pb-rt-contrast" },
  bg: { label: "背景信息", cls: "pb-rt-bg" },
  data: { label: "数据来源", cls: "pb-rt-data" },
  theory: { label: "理论框架", cls: "pb-rt-theory" }
};
var TAG_KEYS = Object.keys(TAG_META);
var CHEV = `<svg class="pb-chevron" width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 4L4 1.2L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
var COMPANION_VIEW_TYPE = "paperbell-companion";
var CITE_TEMPLATES = {
  // AI 综述：转述学者观点，自然融入行文
  ai: (d) => `${d.title}的研究表明，${d.reasonShort.replace(/，$/, "")}（${d.venue}，被引 ${Number(d.cites).toLocaleString()} 次）。
`,
  // 原文引用：直接插入原文节选 + 引注
  raw: (d) => `
> ${d.origFull}
>
> ——${d.title}，*${d.venue}*

`,
  // 先引用后 AI 改写：插入原文并标记 #ai-pending
  mixed: (d) => `
> ${d.origFull}
>
> ——${d.title}，*${d.venue}* \`#ai-pending\`

`
};
var DEFAULT_REWRITE_PROMPT = [
  "你是资深中文学术写作编辑。把用户给的「原文」改写成可供核对和修改的规范学术表达：",
  "- 书面、严谨、客观，用词准确，逻辑连贯，符合学术行文与论证习惯；",
  "- 完整保留原意与关键论点，不杜撰原文没有的事实、数据或引用；",
  '- 仅输出改写后的文本，不要任何解释、前后缀、引号或 markdown，不要出现"改写""作者认为"之类的元叙述；',
  "- 除非用户「指令」明确要求换一种语言，否则保持原文语言。"
].join("\n");
var DEFAULT_AI_ANSWER_PROMPT = [
  "你是学术文献综述助手。根据用户的检索主题和系统召回的文献片段，写一段文献综述式的综合回答：",
  "- 直接围绕检索主题展开，综合多篇文献的观点，呈现它们的共识、分歧与脉络；",
  "- 引用文献时一律用 Pandoc 的 [@citekey] 格式（citekey 见每条来源开头方括号里的内容）；同一处可并列 [@a; @b]；",
  "- 没有 citekey 的来源，用 [N] 标号兜底；",
  "- 客观严谨，只综合来源里有的内容，不杜撰事实、数据或结论；",
  '- 直接输出综述段落本身，不要列大纲、不要 markdown 标题、不要"综上所述"之类套话。'
].join("\n");
var DEFAULT_SETTINGS = {
  backendUrl: "http://127.0.0.1:8000",
  // PaperSearch 后端地址
  apiKey: "",
  // [legacy] PaperSearch 不再保存 AI 密钥，改为按需向 PaperBell 授权读取
  apiBaseUrl: "",
  // [legacy] 保留兼容旧 data.json，当前不再使用
  apiModel: "",
  // [legacy] 保留兼容旧 data.json，当前不再使用
  defaultView: "list",
  originalPreviewLines: 5,
  // 原文默认显示五行，超出后折叠
  lastLibrary: "",
  // 最近一次真实使用的文献库；不让空 default 抢占任务
  searchMode: "balanced",
  // quick | balanced | deep
  searchIntent: "support",
  // support | contrast | method | definition
  searchExpertMode: false,
  // top_k / recall / chunk 上限只在专家模式显示
  litNoteDir: "PaperSearch笔记",
  // [旧/兼容] 平铺文献笔记目录
  conceptDir: "PaperSearch/概念",
  // 已升格的正式概念笔记
  // P0 库组织架构（粗读/精读分层）
  paperLibraryDir: "PaperSearch/文献",
  // 精读收入：一篇一目录（笔记 + PDF）
  conceptCandidateDir: "PaperSearch/概念/_候选",
  // AI 抽出但未升格的候选概念
  pdfSelectionToolbar: true,
  // PDF 划词浮动工具条
  // PDF 颜色标注：颜色即语义（label 可在设置里改，例如 观点/方法/引用…）
  annotationRoles: [
    { id: "claim", color: "#f6d55c", label: "观点" },
    { id: "method", color: "#3caea3", label: "方法" },
    { id: "quotation", color: "#5b9cf8", label: "引用" },
    { id: "challenge", color: "#ed6a5a", label: "质疑" },
    { id: "term", color: "#b98ef0", label: "术语" },
    { id: "todo", color: "#f0a04b", label: "待查" }
  ],
  // 悬浮标注索引面板（Floating TOC 式）
  annoPanelEnabled: true,
  annoPanelEdge: "right",
  // right | left | top | bottom
  annoPanelPinned: false,
  // 标注→文献笔记：笔记不存在时怎么办。'ask'=首次弹窗询问（可勾选记住）/ 'always'=静默自动创建 / 'never'=只存标注库不建笔记
  annoSilentFile: "ask",
  // 悬浮「文献收集栏」（原"文献收集栏"侧栏 → 改悬浮 Floating-TOC 式）
  citePanelEnabled: false,
  citePanelEdge: "right",
  // right | left | top | bottom
  citePanelPinned: false,
  bibStyle: "apa",
  // 内联格式化（fallback）风格：apa | mla | chicago
  citationForm: "pandoc",
  // 默认引用形态：pandoc(@citekey, .bib 真相源) | footnote | inline
  rewritePrompt: DEFAULT_REWRITE_PROMPT,
  // 行内改写的系统提示词（可编辑）
  aiAnswerPrompt: DEFAULT_AI_ANSWER_PROMPT,
  // AI 综合回答的系统提示词（可编辑，默认文献综述式）
  analysisCacheRetentionDays: 7,
  // 单篇分析本地缓存保留天数，0 = 永久
  // 元数据解析（CrossRef / S2 / arXiv / OpenAlex / BBT / Zotero / LLM 级联）
  metadataResolver: {
    enabled: true,
    resolvers: {
      crossref: true,
      arxiv: true,
      // Phase B 启用
      openalex: true,
      // Phase C 启用
      bbt: true,
      // Phase B 启用
      zotero: true,
      // Phase B 启用
      llm: false
      // 默认关，成本高
    },
    s2: { enabled: true, apiKey: "" },
    reranking: { enabled: false, boost: 0.1 }
  },
  contactEmail: "",
  // 礼貌头：CrossRef 建议附联系邮箱
  bbtBibPath: "",
  // Better BibTeX 自动导出的 .bib（只读真相源）
  paperbellBibPath: "",
  // PaperSearch 自己的可写 .bib（孤儿文献溢出区）；留空=BBT .bib 同目录 paperbell.bib
  // 当前写作项目（用于「论文 ↔ 我的初稿」关联分析）
  writingProjectPath: "",
  // vault 内相对路径
  // 数据源：每条 { libraryName, path, autoWatch, source: 'zotero'|'folder' }
  libSources: [],
  // 一体化 Core 配置
  onboardingDone: false,
  // 首次运行向导是否走完
  coreDownloadUrl: "",
  // 开发 / 离线直链；留空则走 PaperBell 授权下载
  coreDownloadSha256: "",
  // 期望 SHA-256
  coreInstalledVersion: "",
  // 最近安装核心的版本（下载 ticket 提供）
  coreInstalledSha256: "",
  // 最近安装核心的 SHA-256
  coreInstalledFilename: "",
  // 最近安装核心的文件名
  coreInstalledAt: 0,
  // 最近安装时间（毫秒时间戳）
  siteBaseUrl: "https://paperbell.cn",
  // 账号 / 授权 / 受保护下载 API 站点（开发态可指向本地 mock）
  // 自托管：用本地 Python 源自动拉起后端（开发者 / 有 Python 环境的用户；免打包免签名）
  localBackendEnabled: false,
  // 开启后插件自动 spawn 本地 Python 后端（复用同一套自重启/看护/随 OB 退出）
  localBackendDir: "",
  // PaperSearch 源码根目录（含 start_app.py 与 .venv）
  localBackendPython: "",
  // 可选：自定义 python 解释器（默认优先 <dir>/.venv）
  developerMode: false,
  // 显示"核心服务"标签页 / 手填后端地址
  hoverPopupMode: "click",
  // 原文悬停浮窗：off=关 / click=显原文+「中译」按钮 / auto=悬停自动中译
  enableAISummary: false,
  // 是否启用「AI 综合回答」整体功能（默认关）
  pdfLinkMode: "inline",
  // 文献笔记里的 PDF：inline（嵌入）/ obsidian-preview / link / none
  pdfCacheMax: 10,
  // PaperSearch缓存/ 最多保留多少个 PDF（LRU）
  promptTemplates: "改写为学术风格，保留核心论点\n精炼内容至100字以内，突出关键信息\n梳理论证关系，不补充原文未支持的因果关系\n转为间接引用形式，符合学术写作规范"
};
var CITATION_PALETTE_VIEW_TYPE = "paperbell-citation-palette";

// src/editor/cm-extensions.ts
var obsidian = __toESM(require("obsidian"));

// src/lib/format.ts
function pbEscapeHtml(s) {
  return String(s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function pbEscapeQuotes(s) {
  return String(s != null ? s : "").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function pbFormatMb(bytes) {
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
function pbDownloadProgress(got, total) {
  if (total) {
    const percent = Math.max(0, Math.min(100, Math.round(got / total * 100)));
    return { percent, text: `下载中 ${percent}%（${pbFormatMb(got)} / ${pbFormatMb(total)}）` };
  }
  return { percent: null, text: `下载中 ${pbFormatMb(got)}` };
}
function pbFormatEta(sec) {
  if (!isFinite(sec) || sec <= 0) return "";
  if (sec < 60) return `约 ${Math.ceil(sec)} 秒`;
  const m = Math.round(sec / 60);
  return m < 60 ? `约 ${m} 分钟` : `约 ${(m / 60).toFixed(1)} 小时`;
}
function pbMakeExtractTimer() {
  let firstAt = 0, firstDone = 0;
  let last = null, lastAt = Date.now();
  const n = (x) => Number(x).toLocaleString("zh-CN");
  function render(p, waited) {
    const { done = 0, total = 0, indeterminate = false } = p || {};
    const wait = waited ? `（已等待 ${waited} 秒）` : "";
    if (indeterminate || !total) {
      return { percent: null, text: `正在解压安装，文件较多需要几分钟${wait}，请保持 Obsidian 打开` };
    }
    if (!firstAt && done > 0) {
      firstAt = Date.now();
      firstDone = done;
    }
    if (done === 0) {
      return { percent: 0, text: `正在读取安装包，共 ${n(total)} 个文件${wait}…` };
    }
    const percent = Math.max(0, Math.min(100, Math.round(done / total * 100)));
    let eta = "";
    if (firstAt && done > firstDone && done < total) {
      const elapsed = (Date.now() - firstAt) / 1e3;
      const rate = (done - firstDone) / elapsed;
      if (elapsed > 3 && rate > 0) eta = pbFormatEta((total - done) / rate);
    }
    return {
      percent,
      text: `正在解压 ${percent}%（${n(done)} / ${n(total)} 个文件）${eta ? " · 剩余 " + eta : ""}${wait}`
    };
  }
  function note(p) {
    last = p;
    lastAt = Date.now();
    return render(p, 0);
  }
  note.stalled = () => render(last, Math.round((Date.now() - lastAt) / 1e3));
  return note;
}

// src/editor/cm-extensions.ts
var cmView = null;
try {
  cmView = require("@codemirror/view");
} catch (e) {
  console.warn("PaperSearch: @codemirror/view 不可用，行内工具条已禁用");
}
function createInlineBarExtension(plugin) {
  if (!cmView) return [];
  class InlineBarWidget extends cmView.WidgetType {
    constructor(selectedText, selFrom, selTo) {
      super();
      this.selectedText = selectedText;
      this.selFrom = selFrom;
      this.selTo = selTo;
    }
    eq(other) {
      return other instanceof InlineBarWidget && other.selectedText === this.selectedText && other.selFrom === this.selFrom && other.selTo === this.selTo;
    }
    // 让 CM6 不处理 widget 上的鼠标事件，防止点击按钮时选区被清除
    ignoreEvent(evt) {
      return ["mousedown", "mouseup", "click", "pointerdown"].includes(evt.type);
    }
    toDOM(view) {
      const bar = document.createElement("span");
      bar.className = "pb-inline-bar";
      bar.setAttribute("contenteditable", "false");
      const selFrom = this.selFrom;
      const selTo = this.selTo;
      bar.innerHTML = `
        <div class="pb-ib-btn pb-ib-push" title="推送至 PaperSearch" role="button">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 10l3 3" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round"/>
          </svg>
        </div>
        <span class="pb-ib-div"></span>
        <div class="pb-ib-btn pb-ib-ai-toggle" title="AI 修改此段" role="button">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M11 2.5l2.5 2.5-7.5 7.5-3 .5.5-3 7.5-7.5z"
                  stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="pb-ib-expand"></span>`;
      const expand = bar.querySelector(".pb-ib-expand");
      const selText = this.selectedText;
      const dismiss = (delay = 0) => {
        setTimeout(() => {
          view.dispatch({ selection: { anchor: view.state.selection.main.to } });
        }, delay);
      };
      bar.querySelector(".pb-ib-push").addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        plugin._pushSelectionToPanel(selText);
        expand.className = "pb-ib-expand pb-ib-expand--toast";
        expand.innerHTML = '<span class="pb-ib-toast">已推送至 PaperSearch ↗</span>';
        dismiss(1800);
      });
      bar.querySelector(".pb-ib-ai-toggle").addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (expand.classList.contains("pb-ib-expand--ai")) {
          expand.style.maxWidth = "";
          expand.className = "pb-ib-expand";
          expand.innerHTML = "";
          return;
        }
        expand.className = "pb-ib-expand pb-ib-expand--ai";
        expand.innerHTML = `
          <span class="pb-ib-ai-input" contenteditable="true"
                data-placeholder="输入指令或 / 选模板…"></span>
          <span class="pb-ib-ai-send">
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h9M9 4l4 4-4 4"
                    stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>`;
        const input = expand.querySelector(".pb-ib-ai-input");
        setTimeout(() => input == null ? void 0 : input.focus(), 60);
        const adjustExpandWidth = () => {
          expand.style.maxWidth = "none";
          const natural = expand.scrollWidth;
          if (natural > 380) {
            expand.style.maxWidth = Math.min(natural + 16, 580) + "px";
          } else {
            expand.style.maxWidth = "";
          }
        };
        let slashPopup = null;
        const closeSlash = () => {
          slashPopup == null ? void 0 : slashPopup.remove();
          slashPopup = null;
        };
        let closePanelRef = null;
        this._cleanup = () => {
          document.querySelectorAll(".pb-slash-popup").forEach((n) => n.remove());
          closePanelRef == null ? void 0 : closePanelRef();
        };
        const fillTemplate = (text) => {
          input.textContent = text;
          adjustExpandWidth();
          const range = document.createRange();
          range.selectNodeContents(input);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          closeSlash();
        };
        input.addEventListener("input", () => {
          var _a, _b;
          adjustExpandWidth();
          const val = input.textContent;
          if (!val.startsWith("/")) {
            closeSlash();
            return;
          }
          const query = val.slice(1).toLowerCase();
          const templates = ((_b = (_a = plugin.settings) == null ? void 0 : _a.promptTemplates) != null ? _b : "").split("\n").map((s) => s.trim()).filter(Boolean);
          const filtered = query ? templates.filter((t) => t.toLowerCase().includes(query)) : templates;
          if (!filtered.length) {
            closeSlash();
            return;
          }
          if (!slashPopup) {
            slashPopup = document.createElement("div");
            slashPopup.className = "pb-slash-popup";
            document.body.appendChild(slashPopup);
          }
          slashPopup.innerHTML = filtered.map(
            (t, i) => `<div class="pb-slash-item${i === 0 ? " pb-slash-active" : ""}"
                  data-text="${pbEscapeHtml(t)}">${pbEscapeHtml(t)}</div>`
          ).join("");
          const er = expand.getBoundingClientRect();
          slashPopup.style.left = `${Math.max(8, er.left)}px`;
          slashPopup.style.top = `${er.bottom + 4}px`;
          slashPopup.querySelectorAll(".pb-slash-item").forEach((item) => {
            item.addEventListener("mousedown", (e2) => {
              e2.preventDefault();
              e2.stopPropagation();
              fillTemplate(item.dataset.text);
            });
          });
        });
        input.addEventListener("blur", () => setTimeout(closeSlash, 150));
        const send = async () => {
          const val = input == null ? void 0 : input.textContent.trim();
          if (!val) return;
          expand.innerHTML = `<span class="pb-ib-toast pb-ib-generating">生成中…</span>`;
          let aiResult;
          try {
            aiResult = await plugin._aiRewrite(selText, val);
          } catch (e2) {
            expand.className = "pb-ib-expand";
            expand.innerHTML = `<span class="pb-ib-toast pb-ib-error">改写失败</span>`;
            new obsidian.Notice("AI 改写失败：" + (e2.message || "未知错误"));
            dismiss(2e3);
            return;
          }
          if (aiResult) {
            expand.className = "pb-ib-expand";
            expand.innerHTML = "";
            const cFrom = view.coordsAtPos(selFrom);
            const cTo = view.coordsAtPos(selTo);
            const edRect = view.scrollDOM.getBoundingClientRect();
            const panel = document.createElement("div");
            panel.className = "pb-ai-preview-panel";
            panel.innerHTML = `
              <div class="pb-ai-preview-hd">AI 改写预览 · 请核对</div>
              <div class="pb-ai-preview-body"></div>
              <div class="pb-ai-preview-actions">
                <span class="pb-ai-preview-reject">放弃</span>
                <span class="pb-ai-preview-accept">采用此改写</span>
              </div>`;
            panel.querySelector(".pb-ai-preview-body").textContent = aiResult;
            panel.style.left = `${cFrom ? Math.max(8, cFrom.left) : edRect.left + 16}px`;
            panel.style.top = `${cTo ? cTo.bottom + 8 : edRect.top + 40}px`;
            document.body.appendChild(panel);
            const pr = panel.getBoundingClientRect();
            if (pr.right > window.innerWidth - 8) panel.style.left = `${window.innerWidth - pr.width - 8}px`;
            if (pr.bottom > window.innerHeight - 8) panel.style.top = `${(cFrom ? cFrom.top : edRect.top + 40) - pr.height - 8}px`;
            let onOut = null;
            const closePanel = () => {
              panel.remove();
              if (onOut) {
                document.removeEventListener("mousedown", onOut);
                onOut = null;
              }
              closePanelRef = null;
            };
            closePanelRef = closePanel;
            panel.querySelector(".pb-ai-preview-accept").addEventListener("mousedown", (e2) => {
              e2.preventDefault();
              e2.stopPropagation();
              view.dispatch({
                changes: { from: selFrom, to: selTo, insert: aiResult },
                selection: { anchor: selFrom + aiResult.length }
              });
              new obsidian.Notice("已采用 AI 改写；如包含事实性论断，请核对原文并补充来源");
              view.focus();
              closePanel();
              dismiss(0);
            });
            panel.querySelector(".pb-ai-preview-reject").addEventListener("mousedown", (e2) => {
              e2.preventDefault();
              e2.stopPropagation();
              closePanel();
              dismiss(0);
            });
            setTimeout(() => {
              if (!panel.isConnected) return;
              onOut = (ev) => {
                if (!panel.contains(ev.target)) closePanel();
              };
              document.addEventListener("mousedown", onOut);
            }, 80);
          }
        };
        expand.querySelector(".pb-ib-ai-send").addEventListener("mousedown", (e2) => {
          e2.preventDefault();
          e2.stopPropagation();
          send();
        });
        input.addEventListener("keydown", (e2) => {
          var _a, _b, _c, _d;
          e2.stopPropagation();
          if (slashPopup) {
            const items = [...slashPopup.querySelectorAll(".pb-slash-item")];
            const idx = items.findIndex((i) => i.classList.contains("pb-slash-active"));
            if (e2.key === "ArrowDown") {
              e2.preventDefault();
              (_a = items[idx]) == null ? void 0 : _a.classList.remove("pb-slash-active");
              (_b = items[(idx + 1) % items.length]) == null ? void 0 : _b.classList.add("pb-slash-active");
              return;
            }
            if (e2.key === "ArrowUp") {
              e2.preventDefault();
              (_c = items[idx]) == null ? void 0 : _c.classList.remove("pb-slash-active");
              (_d = items[(idx - 1 + items.length) % items.length]) == null ? void 0 : _d.classList.add("pb-slash-active");
              return;
            }
            if (e2.key === "Enter") {
              e2.preventDefault();
              const active = slashPopup.querySelector(".pb-slash-active");
              if (active) fillTemplate(active.dataset.text);
              return;
            }
            if (e2.key === "Escape") {
              e2.preventDefault();
              closeSlash();
              return;
            }
            return;
          }
          if (e2.key === "Enter") {
            e2.preventDefault();
            send();
          }
          if (e2.key === "Escape") {
            e2.preventDefault();
            dismiss();
          }
        });
      });
      return bar;
    }
    // CM6 拆 widget 时清理：移除遗留的 AI 预览面板 + slash 弹窗 + document 监听器
    destroy(dom) {
      var _a;
      try {
        (_a = this._cleanup) == null ? void 0 : _a.call(this);
      } catch (e) {
      }
    }
  }
  return cmView.ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = cmView.Decoration.none;
        this.isMouseDown = false;
        this.needsUpdate = false;
        this._onMouseDown = () => {
          this.isMouseDown = true;
          this.decorations = cmView.Decoration.none;
        };
        this._onMouseUp = () => {
          this.isMouseDown = false;
          this.needsUpdate = true;
          view.dispatch({});
        };
        view.dom.addEventListener("mousedown", this._onMouseDown);
        view.dom.addEventListener("mouseup", this._onMouseUp);
      }
      destroy(view) {
        view.dom.removeEventListener("mousedown", this._onMouseDown);
        view.dom.removeEventListener("mouseup", this._onMouseUp);
      }
      update(update) {
        if (this.isMouseDown) {
          this.decorations = cmView.Decoration.none;
          return;
        }
        if (!update.selectionSet && !update.docChanged && !this.needsUpdate) return;
        this.needsUpdate = false;
        const sel = update.state.selection.main;
        if (sel.empty) {
          this.decorations = cmView.Decoration.none;
          return;
        }
        const text = update.state.sliceDoc(sel.from, sel.to).trim();
        if (text.length < 2) {
          this.decorations = cmView.Decoration.none;
          return;
        }
        this.decorations = cmView.Decoration.set([
          cmView.Decoration.widget({
            widget: new InlineBarWidget(text, sel.from, sel.to),
            side: 1
          }).range(sel.to)
        ]);
      }
    },
    { decorations: (v) => v.decorations }
  );
}
function createDragExtension(plugin) {
  if (!cmView) return [];
  return cmView.EditorView.domEventHandlers({
    dragover(e) {
      var _a;
      if ((_a = e.dataTransfer) == null ? void 0 : _a.types.includes("application/paperbell-cards")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }
    },
    drop(e, view) {
      var _a, _b;
      const cardsJson = (_a = e.dataTransfer) == null ? void 0 : _a.getData("application/paperbell-cards");
      if (!cardsJson) return;
      e.preventDefault();
      e.stopPropagation();
      let cards;
      try {
        cards = JSON.parse(cardsJson);
      } catch (e2) {
        return;
      }
      if (!Array.isArray(cards) || !cards.length) return;
      const pos = (_b = view.posAtCoords({ x: e.clientX, y: e.clientY }, false)) != null ? _b : view.state.doc.length;
      plugin._showCitationPicker(e.clientX, e.clientY, cards, view, pos);
    }
  });
}

// src/lib/bibtex.ts
function parseBibTeX(text) {
  const entries = [];
  let i = 0;
  const findMatch = (s, open) => {
    let depth = 1;
    for (let k = open + 1; k < s.length; k++) {
      if (s[k] === "\\") {
        k++;
        continue;
      }
      if (s[k] === "{") depth++;
      else if (s[k] === "}" && --depth === 0) return k;
    }
    return s.length;
  };
  while (i < text.length) {
    const at = text.indexOf("@", i);
    if (at < 0) break;
    const braceStart = text.indexOf("{", at);
    if (braceStart < 0 || braceStart - at > 30) {
      i = at + 1;
      continue;
    }
    const type = text.slice(at + 1, braceStart).trim().toLowerCase();
    const close = findMatch(text, braceStart);
    if (["comment", "preamble", "string"].includes(type)) {
      i = close + 1;
      continue;
    }
    const body = text.slice(braceStart + 1, close);
    const firstComma = body.indexOf(",");
    if (firstComma < 0) {
      i = close + 1;
      continue;
    }
    const citekey = body.slice(0, firstComma).trim();
    const entry = { citekey, type };
    let s = firstComma + 1;
    while (s < body.length) {
      const eq = body.indexOf("=", s);
      if (eq < 0) break;
      const name = body.slice(s, eq).trim().toLowerCase();
      let p = eq + 1;
      while (p < body.length && /\s/.test(body[p])) p++;
      let value = "", endPos = p;
      if (body[p] === "{") {
        const ve = findMatch(body, p);
        value = body.slice(p + 1, ve);
        endPos = ve + 1;
      } else if (body[p] === '"') {
        let ve = p + 1;
        while (ve < body.length) {
          if (body[ve] === "\\") {
            ve += 2;
            continue;
          }
          if (body[ve] === '"') break;
          ve++;
        }
        value = body.slice(p + 1, ve);
        endPos = ve + 1;
      } else {
        const comma = body.indexOf(",", p);
        endPos = comma < 0 ? body.length : comma;
        value = body.slice(p, endPos);
      }
      if (name) entry[name] = value.trim().replace(/\s+/g, " ");
      s = endPos;
      while (s < body.length && (body[s] === "," || /\s/.test(body[s]))) s++;
    }
    entries.push(entry);
    i = close + 1;
  }
  return entries;
}
function bibAuthorsToCSL(authorField) {
  if (!authorField) return [];
  return authorField.split(/\s+and\s+/i).map((a) => {
    const parts = a.split(",").map((s) => s.trim());
    if (parts.length >= 2) return { family: parts[0], given: parts.slice(1).join(" ") };
    return { family: a.trim() };
  });
}
function bibExtractFilename(fileField) {
  if (!fileField) return "";
  const first = fileField.split(/[;]/)[0];
  const parts = first.split(":");
  const pdf = parts.find((p) => /\.pdf$/i.test(p.trim()));
  const raw = (pdf || first).trim();
  return raw.split(/[/\\]/).pop();
}
function bibExtractPath(fileField) {
  if (!fileField) return "";
  const first = String(fileField).split(";")[0];
  const parts = first.split(/(?<!\\):/);
  const pick = parts.find((p) => /\.pdf\s*$/i.test(p) && /[\\/]/.test(p));
  if (!pick) return "";
  return pick.replace(/\\:/g, ":").replace(/\\\\/g, "\\").trim();
}

// src/lib/file-picker.ts
var nodePath = __toESM(require("path"));
function pbPickFile({ accept = "", directory = false } = {}) {
  return new Promise((resolve) => {
    const inp = document.createElement("input");
    inp.type = "file";
    if (accept) inp.accept = accept;
    if (directory) inp.webkitdirectory = true;
    inp.style.display = "none";
    const done = (f) => {
      try {
        inp.remove();
      } catch (_) {
      }
      resolve(f || null);
    };
    inp.onchange = () => done(inp.files && inp.files[0]);
    inp.oncancel = () => done(null);
    document.body.appendChild(inp);
    inp.click();
  });
}
function pbPickedDirPath(file) {
  const abs = pbFilePath(file);
  if (!abs) return "";
  const relRaw = file.webkitRelativePath || "";
  const rel = relRaw.replace(/\//g, nodePath.sep);
  const top = relRaw.split("/")[0];
  let dir;
  if (top && rel && abs.endsWith(rel)) {
    dir = nodePath.join(abs.slice(0, abs.length - rel.length), top);
  } else {
    dir = nodePath.dirname(abs);
  }
  return dir.replace(/[\\/]+$/, "");
}
function pbFilePath(file) {
  var _a, _b;
  if (!file) return "";
  try {
    const p = (_b = (_a = require("electron").webUtils) == null ? void 0 : _a.getPathForFile) == null ? void 0 : _b.call(_a, file);
    if (p) return p;
  } catch (_) {
  }
  return file.path || "";
}

// src/services/api.ts
var obsidian2 = __toESM(require("obsidian"));
var PBApi = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  _base() {
    var _a, _b;
    const u = (((_b = (_a = this.plugin) == null ? void 0 : _a.settings) == null ? void 0 : _b.backendUrl) || "http://127.0.0.1:8000").trim();
    return u.replace(/\/+$/, "");
  }
  async _req(path, opts = {}) {
    const r = await obsidian2.requestUrl({
      url: this._base() + path,
      method: opts.method || "GET",
      headers: opts.headers,
      body: opts.body,
      contentType: opts.contentType,
      throw: false
    });
    if (r.status < 200 || r.status >= 300) {
      throw new Error(`HTTP ${r.status} · ${path}`);
    }
    return r;
  }
  _parseJson(r) {
    try {
      return r.json;
    } catch (_) {
    }
    try {
      return JSON.parse(r.text);
    } catch (_) {
      return {};
    }
  }
  // GET → JSON
  async get(path) {
    return this._parseJson(await this._req(path));
  }
  // POST JSON → JSON
  async postJson(path, body) {
    return this._parseJson(await this._req(path, {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(body != null ? body : {})
    }));
  }
  // DELETE → JSON
  async del(path) {
    return this._parseJson(await this._req(path, { method: "DELETE" }));
  }
  // 真流式：fetch + ReadableStream，逐行 NDJSON 实时回调
  // （后端已加 CORS；支持 AbortController 真正中断）
  async _streamFetch(path, init, onEvent) {
    const resp = await fetch(this._base() + path, init);
    if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status} · ${path}`);
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith("data:")) line = line.slice(5).trim();
        if (!line || line === "[DONE]") continue;
        try {
          onEvent(JSON.parse(line));
        } catch (_) {
        }
      }
    }
    const tail = buf.trim();
    if (tail && tail !== "[DONE]") {
      try {
        onEvent(JSON.parse(tail.replace(/^data:\s*/, "")));
      } catch (_) {
      }
    }
  }
  // ── CORS 能力探测（缓存）────────────────────────────────
  // 核心不带 CORS 头时，浏览器 fetch 会被拦（/analyze-stream 出 OPTIONS 405）。
  // 用 GET /health（simple request，无 preflight）探一次：fetch 通 → 真流式；
  // fetch 不通但 requestUrl 通 → 核心活着但没 CORS → 走 requestUrl 收完回放。
  async _corsOk() {
    var _a;
    const base = this._base();
    if (((_a = this._corsCache) == null ? void 0 : _a.base) === base && typeof this._corsCache.ok === "boolean") {
      return this._corsCache.ok;
    }
    try {
      const r = await fetch(base + "/health", { method: "GET" });
      if (r.ok) {
        this._corsCache = { base, ok: true };
        return true;
      }
    } catch (_) {
    }
    try {
      const r2 = await obsidian2.requestUrl({ url: base + "/health", method: "GET", throw: false });
      if (r2.status >= 200 && r2.status < 300) {
        this._corsCache = { base, ok: false };
        return false;
      }
    } catch (_) {
    }
    return true;
  }
  // requestUrl 版「流式」：不受 CORS 限制，但不支持真流式 → 一次性收完后逐条回放
  async _streamRequest(path, opts, onEvent) {
    var _a, _b;
    if ((_a = opts.signal) == null ? void 0 : _a.aborted) throw new DOMException("Aborted", "AbortError");
    const r = await obsidian2.requestUrl({
      url: this._base() + path,
      method: opts.method || "POST",
      headers: opts.headers,
      body: opts.body,
      contentType: opts.contentType,
      throw: false
    });
    if ((_b = opts.signal) == null ? void 0 : _b.aborted) throw new DOMException("Aborted", "AbortError");
    if (r.status < 200 || r.status >= 300) throw new Error(`HTTP ${r.status} · ${path}`);
    this._replayNdjson(r.text || "", onEvent);
  }
  _replayNdjson(text, onEvent) {
    for (let line of String(text || "").split("\n")) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith("data:")) line = line.slice(5).trim();
      if (!line || line === "[DONE]") continue;
      try {
        onEvent(JSON.parse(line));
      } catch (_) {
      }
    }
  }
  // FormData → multipart/form-data 字节体（requestUrl 不能直接收浏览器 FormData）
  async _formDataToMultipart(formData) {
    const boundary = "----pbform" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    const enc = new TextEncoder();
    const chunks = [];
    for (const [name, value] of formData.entries()) {
      chunks.push(enc.encode(`--${boundary}\r
`));
      if (value instanceof Blob) {
        const fname = (value.name || "blob").replace(/"/g, "");
        chunks.push(enc.encode(
          `Content-Disposition: form-data; name="${name}"; filename="${fname}"\r
Content-Type: ${value.type || "application/octet-stream"}\r
\r
`
        ));
        chunks.push(new Uint8Array(await value.arrayBuffer()));
      } else {
        chunks.push(enc.encode(`Content-Disposition: form-data; name="${name}"\r
\r
`));
        chunks.push(enc.encode(String(value)));
      }
      chunks.push(enc.encode("\r\n"));
    }
    chunks.push(enc.encode(`--${boundary}--\r
`));
    let size = 0;
    for (const c of chunks) size += c.length;
    const buf = new Uint8Array(size);
    let off = 0;
    for (const c of chunks) {
      buf.set(c, off);
      off += c.length;
    }
    return { body: buf.buffer, contentType: `multipart/form-data; boundary=${boundary}` };
  }
  // POST JSON → NDJSON（CORS 可用走真流式；否则 requestUrl 收完回放；opts.signal 支持中断）
  async streamJson(path, body, onEvent, opts = {}) {
    var _a;
    const payload = JSON.stringify(body != null ? body : {});
    if (await this._corsOk()) {
      let delivered = false;
      const tap = (evt) => {
        delivered = true;
        onEvent(evt);
      };
      try {
        return await this._streamFetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          signal: opts.signal
        }, tap);
      } catch (e) {
        if ((e == null ? void 0 : e.name) !== "TypeError" || delivered || ((_a = opts.signal) == null ? void 0 : _a.aborted)) throw e;
        this._corsCache = { base: this._base(), ok: false };
      }
    }
    return this._streamRequest(path, {
      method: "POST",
      contentType: "application/json",
      body: payload,
      signal: opts.signal
    }, onEvent);
  }
  // POST multipart → NDJSON（同上；无 CORS 时序列化 multipart 走 requestUrl，opts.signal 支持取消建库）
  async streamForm(path, formData, onEvent, opts = {}) {
    var _a;
    if (await this._corsOk()) {
      let delivered = false;
      const tap = (evt) => {
        delivered = true;
        onEvent(evt);
      };
      try {
        return await this._streamFetch(
          path,
          { method: "POST", body: formData, signal: opts.signal },
          tap
        );
      } catch (e) {
        if ((e == null ? void 0 : e.name) !== "TypeError" || delivered || ((_a = opts.signal) == null ? void 0 : _a.aborted)) throw e;
        this._corsCache = { base: this._base(), ok: false };
      }
    }
    const mp = await this._formDataToMultipart(formData);
    return this._streamRequest(path, {
      method: "POST",
      contentType: mp.contentType,
      body: mp.body,
      signal: opts.signal
    }, onEvent);
  }
  // 文档 PDF 直链（供下载用）
  pdfUrl(library, documentId, sourceFile, opts = {}) {
    const q = new URLSearchParams({ library: library || "default" });
    if (documentId) q.set("document_id", documentId);
    if (sourceFile) q.set("source_file", sourceFile);
    if (opts.raw) q.set("raw", "true");
    if (opts.download) q.set("download", "true");
    return `${this._base()}/documents/pdf?${q.toString()}`;
  }
  // 取 PDF 原始字节（requestUrl，绕过 CORS）
  async pdfBytes(library, documentId, sourceFile) {
    const r = await this._req(
      this.pdfUrl(library, documentId, sourceFile, { raw: true }).slice(this._base().length)
    );
    return r.arrayBuffer;
  }
  // 连接失败分诊：fetch 抛的「Failed to fetch」无法区分"没起/正在起/缺CORS/端口错"。
  // 用 requestUrl（不受 CORS 限）补打 /health，把不可辨识的失败翻成 C 端能懂、能自愈的人话。
  async diagnose() {
    var _a, _b;
    let status = 0;
    try {
      const r = await obsidian2.requestUrl({ url: this._base() + "/health", method: "GET", throw: false });
      status = r.status;
    } catch (_) {
    }
    const coreStatus = (_b = (_a = this.plugin) == null ? void 0 : _a.coreManager) == null ? void 0 : _b.status;
    if (status >= 200 && status < 300) {
      return { code: "transient", title: "本地服务正在准备", hint: "本地服务刚启动或连接暂时中断，请稍候重试。", retry: true };
    }
    if (status >= 400) {
      return { code: "backend_error", title: "本地服务返回错误", hint: `本地服务返回 HTTP ${status}。可在状态栏选择「重新安装或配置」。`, repair: true };
    }
    if (coreStatus === "starting" || coreStatus === "downloading") {
      return { code: "starting", title: "本地服务正在启动", hint: "首次启动需要解包并加载模型，请稍候再试。", retry: true };
    }
    return { code: "core_down", title: "本地服务未运行", hint: "本地服务尚未安装或启动。", repair: true };
  }
};

// src/services/build-manager.ts
var obsidian3 = __toESM(require("obsidian"));
function pbFormatBuildDuration(valueMs) {
  const ms = Math.max(0, Number(valueMs) || 0);
  if (ms < 1e3) return `${Math.round(ms)} 毫秒`;
  const totalSeconds = Math.round(ms / 1e3);
  if (totalSeconds < 60) return `${totalSeconds} 秒`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds ? `${minutes} 分 ${seconds} 秒` : `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return restMinutes ? `${hours} 小时 ${restMinutes} 分` : `${hours} 小时`;
}
function pbFormatSearchDuration(valueMs) {
  const ms = Math.max(0, Number(valueMs) || 0);
  if (ms < 6e4) return `${(ms / 1e3).toFixed(ms < 1e4 ? 1 : 0)} 秒`;
  const minutes = Math.floor(ms / 6e4);
  const seconds = Math.round(ms % 6e4 / 1e3);
  return seconds ? `${minutes} 分 ${seconds} 秒` : `${minutes} 分钟`;
}
function pbBuildStageLabel(stage, fallback = "") {
  const labels = {
    preparing: "准备任务",
    uploading: "接收并保存 PDF",
    queued: "等待处理",
    initializing: "加载本地向量模型与索引环境",
    initialization_complete: "本地模型与索引环境已就绪",
    extracting: "准备解析 PDF",
    pdf_text_extraction: "提取 PDF 文本与 OCR",
    ai_processing: "AI 全文处理",
    chunking: "整理章节并生成切片",
    enriching: "AI 补充摘要与索引信息",
    indexing: "生成向量并写入索引",
    indexed: "已完成入库",
    skipped_duplicate: "检测到重复文件",
    failed: "处理失败",
    complete: "全部完成"
  };
  return fallback || labels[stage] || stage || "处理中";
}
function pbBuildTimingRows(timings = {}) {
  return [
    ["接收请求与文件准备", Number(timings.request_preparation_ms || 0) + Number(timings.file_staging_ms || 0)],
    ["加载本地模型与索引环境", Number(timings.pipeline_initialization_ms || 0)],
    ["PDF 文本提取与 OCR", Number(timings.pdf_text_extraction_ms || 0)],
    ["AI 全文处理", Number(timings.ai_processing_ms || 0)],
    ["章节整理与切片", Number(timings.chunking_ms || 0)],
    ["AI 补充增强", Number(timings.enrichment_ms || 0)],
    ["向量化与索引写入", Number(timings.indexing_ms || 0)]
  ].filter(([, value]) => value > 0);
}
var BuildSummaryModal = class extends obsidian3.Modal {
  constructor(app, job) {
    super(app);
    this.job = job;
  }
  onOpen() {
    const job = this.job || {};
    const result = job.result || {};
    const timings = result.timings || {};
    const files = Array.isArray(result.fileTimings) ? result.fileTimings : [];
    const totalElapsedMs = Math.max(0, Number(job.finishedAt || Date.now()) - Number(job.startedAt || Date.now()));
    const backendWallMs = Number(timings.total_backend_wall_ms || timings.pipeline_wall_ms || 0);
    const skipped = Number(result.skipped || 0);
    const failed = Number(result.fails || 0);
    this.modalEl.addClass("pb-build-summary-modal");
    const content = this.contentEl;
    content.empty();
    content.createEl("h2", { text: failed ? "建库完成（部分文件失败）" : "建库成功" });
    content.createEl("p", {
      cls: "pb-build-summary-lead",
      text: `文献库「${job.libName || "未命名"}」已处理完成。`
    });
    const metrics = content.createDiv({ cls: "pb-build-summary-metrics" });
    [
      ["总耗时", pbFormatBuildDuration(totalElapsedMs)],
      ["成功入库", `${Number(result.docs || job.done || 0)} 篇`],
      ["生成片段", `${Number(result.chunks || 0)} 个`],
      ["失败 / 跳过", `${failed} / ${skipped} 篇`]
    ].forEach(([label, value]) => {
      const item = metrics.createDiv({ cls: "pb-build-summary-metric" });
      item.createDiv({ cls: "pb-build-summary-metric-value", text: value });
      item.createDiv({ cls: "pb-build-summary-metric-label", text: label });
    });
    if (backendWallMs > 0) {
      content.createEl("p", {
        cls: "pb-build-summary-note",
        text: `后端从接收任务到完成共用时 ${pbFormatBuildDuration(backendWallMs)}。插件显示的总耗时还包含请求传输和界面等待。`
      });
    }
    const rows = pbBuildTimingRows(timings);
    if (rows.length) {
      content.createEl("h3", { text: "时间花在哪里" });
      content.createEl("p", {
        cls: "pb-build-summary-note",
        text: Number(job.conc || 1) > 1 ? `本次同时处理 ${job.conc} 篇。下列是所有论文在各环节的累计工作时间，阶段会并行重叠，所以相加可能大于总耗时。` : "下列为各处理环节累计耗时。"
      });
      const workTotal = rows.reduce((sum, [, value]) => sum + value, 0) || 1;
      const timingList = content.createDiv({ cls: "pb-build-timing-list" });
      rows.forEach(([label, value]) => {
        const row = timingList.createDiv({ cls: "pb-build-timing-row" });
        const top = row.createDiv({ cls: "pb-build-timing-top" });
        top.createSpan({ text: label });
        top.createSpan({ text: `${pbFormatBuildDuration(value)} · ${Math.round(value / workTotal * 100)}%` });
        const bar = row.createDiv({ cls: "pb-build-timing-bar" });
        bar.createDiv({ cls: "pb-build-timing-fill" }).style.width = `${Math.max(1, value / workTotal * 100)}%`;
      });
    }
    if (files.length) {
      content.createEl("h3", { text: "逐篇耗时" });
      const fileList = content.createDiv({ cls: "pb-build-file-timings" });
      files.forEach((item) => {
        const fileTiming = item.timings_ms || {};
        const detail = fileList.createEl("details", { cls: "pb-build-file-timing" });
        detail.createEl("summary", {
          text: `${item.file || "未命名 PDF"} · ${pbFormatBuildDuration(fileTiming.total_ms || 0)}${item.status === "failed" ? " · 失败" : ""}`
        });
        const inner = detail.createDiv({ cls: "pb-build-file-timing-body" });
        pbBuildTimingRows(fileTiming).filter(([label]) => label !== "接收请求与文件准备").forEach(([label, value]) => {
          const line = inner.createDiv({ cls: "pb-build-file-timing-line" });
          line.createSpan({ text: label });
          line.createSpan({ text: pbFormatBuildDuration(value) });
        });
      });
    }
    const actions = content.createDiv({ cls: "pb-build-summary-actions" });
    const closeButton = actions.createEl("button", { text: "关闭" });
    closeButton.addClass("mod-cta");
    closeButton.onclick = () => this.close();
  }
};
var BuildManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.jobs = /* @__PURE__ */ new Map();
    this._seq = 0;
    this._listeners = /* @__PURE__ */ new Set();
  }
  onChange(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }
  _emit(job) {
    var _a;
    for (const cb of [...this._listeners]) {
      try {
        cb(job);
      } catch (_) {
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("paperbell:build", { detail: { id: (_a = job == null ? void 0 : job.id) != null ? _a : null } }));
    } catch (_) {
    }
  }
  get(id) {
    return this.jobs.get(id);
  }
  active() {
    return [...this.jobs.values()].filter((j) => j.status === "running");
  }
  // 运行中优先、其次按启动时间倒序（含刚结束、待清理的）
  list() {
    return [...this.jobs.values()].sort((a, b) => (a.status === "running" ? 0 : 1) - (b.status === "running" ? 0 : 1) || b.startedAt - a.startedAt);
  }
  // 事件 → job 状态（与旧提交闭包里的 switch 等价，只是写到 job 而非 DOM）
  _apply(job, evt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const t = evt.type;
    const now = Date.now();
    const setFileStage = (fileName, stage, label, cls = "ing") => {
      const previous = job.files.get(fileName) || {};
      const isProcessingStart = ["extracting", "pdf_text_extraction"].includes(stage) && !previous.processingStartedAt;
      const stageStartedAt = previous.stage === stage && previous.stageStartedAt ? previous.stageStartedAt : now;
      const next = {
        ...previous,
        cls,
        stage,
        stageLabel: pbBuildStageLabel(stage, label),
        statusText: pbBuildStageLabel(stage, label),
        index: Number(evt.current_index || previous.index || 0),
        stageStartedAt,
        processingStartedAt: isProcessingStart ? now : previous.processingStartedAt || 0,
        timings: evt.timings_ms || previous.timings || null
      };
      job.files.set(fileName, next);
      job.currentFile = fileName;
      job.currentIndex = next.index;
      job.stage = stage;
      job.stageLabel = next.stageLabel;
      job.stageStartedAt = stageStartedAt;
      return next;
    };
    if (t === "start") {
      job.total = (_a = evt.total_files) != null ? _a : job.total;
      job.conc = (_b = evt.effective_preprocess_concurrency) != null ? _b : 1;
      job.serverStartedAt = now;
      job.submitElapsedMs = Math.max(0, now - job.startedAt);
      job.stage = evt.source_folder ? "preparing" : "uploading";
      job.stageLabel = pbBuildStageLabel(job.stage);
      job.stageStartedAt = now;
      job.stat = `共 ${job.total || "?"} 篇 · 同时处理 ${job.conc} 篇 · ${job.stageLabel}`;
    } else if (t === "upload_progress") {
      job.total = (_c = evt.total_files) != null ? _c : job.total;
      setFileStage(evt.current_file, "uploading", "保存 PDF 文件");
      job.stat = `正在保存第 ${evt.current_index || evt.processed_files || "?"}/${job.total || "?"} 篇：${evt.current_file}`;
    } else if (t === "upload_complete") {
      job.stage = "queued";
      job.stageLabel = pbBuildStageLabel("queued");
      job.stageStartedAt = now;
      job.stat = `PDF 已准备完成，开始逐篇处理 ${(_d = evt.total_files) != null ? _d : job.total} 篇`;
    } else if (t === "initializing") {
      job.stage = "initializing";
      job.stageLabel = pbBuildStageLabel("initializing", evt.stage_label || "");
      job.stageStartedAt = now;
      job.stat = job.stageLabel;
    } else if (t === "initialization_complete") {
      job.initializationElapsedMs = Number(evt.elapsed_ms || 0);
      job.stage = "initialization_complete";
      job.stageLabel = pbBuildStageLabel("initialization_complete", evt.stage_label || "");
      job.stageStartedAt = now;
      job.stat = `${job.stageLabel} · ${pbFormatBuildDuration(job.initializationElapsedMs)}`;
    } else if (t === "progress") {
      job.total = (_e = evt.total_files) != null ? _e : job.total;
      const f = (_f = evt.current_file) != null ? _f : "文件";
      const stage = evt.stage || "extracting";
      const stageLabel = pbBuildStageLabel(stage, evt.stage_label || "");
      if (["extracting", "pdf_text_extraction", "ai_processing", "chunking", "enriching", "indexing"].includes(stage)) {
        setFileStage(f, stage, stageLabel);
        job.stat = `第 ${evt.current_index || "?"}/${job.total || "?"} 篇 · ${f} · ${stageLabel}`;
      } else if (evt.stage === "indexed") {
        const previous = job.files.get(f) || {};
        if (previous.cls !== "ok") job.done++;
        job.completed = Math.max(job.completed, Number(evt.processed_files || 0));
        const elapsedText = evt.file_elapsed_ms ? ` · ${pbFormatBuildDuration(evt.file_elapsed_ms)}` : "";
        job.files.set(f, {
          ...previous,
          cls: "ok",
          stage: "indexed",
          stageLabel: pbBuildStageLabel("indexed"),
          statusText: `已入库 · ${(_g = evt.file_chunks) != null ? _g : 0} 片段${elapsedText}`,
          timings: evt.timings_ms || previous.timings || null,
          completedAt: now
        });
        job.currentFile = f;
        job.currentIndex = Number(evt.current_index || job.completed);
        job.stage = "indexed";
        job.stageLabel = pbBuildStageLabel("indexed");
        job.stageStartedAt = now;
      } else if (evt.stage === "skipped_duplicate") {
        const previous = job.files.get(f) || {};
        if (previous.stage !== "skipped_duplicate") job.skipped++;
        job.completed = Math.max(job.completed, Number(evt.processed_files || 0));
        job.files.set(f, { ...previous, cls: "ok", stage: "skipped_duplicate", stageLabel, statusText: "已存在，跳过", completedAt: now });
      } else if (evt.stage === "failed") {
        const previous = job.files.get(f) || {};
        if (previous.cls !== "fail") job.failed++;
        job.completed = Math.max(job.completed, Number(evt.processed_files || 0));
        job.files.set(f, { ...previous, cls: "fail", stage: "failed", stageLabel, statusText: `失败：${evt.message || "未知错误"}`, timings: evt.timings_ms || previous.timings || null, completedAt: now });
      }
      if (["indexed", "skipped_duplicate", "failed"].includes(stage)) {
        job.stat = `${job.completed || job.done + job.failed + job.skipped}/${job.total || "?"} 已处理 · 成功 ${job.done}${job.failed ? ` · 失败 ${job.failed}` : ""}${job.skipped ? ` · 跳过 ${job.skipped}` : ""}`;
      }
    } else if (t === "complete") {
      const r = (_h = evt.result) != null ? _h : {};
      job.result = {
        docs: (_i = r.documents) != null ? _i : job.done,
        chunks: (_j = r.chunks) != null ? _j : 0,
        fails: ((_k = r.failed_files) != null ? _k : []).length,
        skipped: Number(r.skipped_duplicate_files || 0),
        totalFiles: Number(r.total_files || job.total || 0),
        timings: (_l = r.timings_ms) != null ? _l : {},
        fileTimings: (_m = r.file_timings) != null ? _m : [],
        raw: r
      };
      job.total = job.result.totalFiles || job.total;
      job.completed = job.total;
      job.stage = "complete";
      job.stageLabel = pbBuildStageLabel("complete");
      job.stageStartedAt = now;
      job.stat = `完成 · ${job.result.docs} 篇 · ${job.result.chunks} 片段` + (job.result.fails ? ` · ${job.result.fails} 失败` : "") + (job.result.skipped ? ` · ${job.result.skipped} 跳过` : "");
    } else if (t === "error") {
      job.status = "error";
      job.error = (_n = evt.detail) != null ? _n : "本地服务返回错误";
      job.stage = "failed";
      job.stageLabel = "建库失败";
      job.stageStartedAt = now;
      job.stat = `失败：${job.error}`;
    }
  }
  // 起一个建库任务。fd 已拼好；meta: {label, libName, mode}
  start(fd, meta = {}) {
    const id = `b${++this._seq}`;
    const ctl = new AbortController();
    const job = {
      id,
      label: meta.label || "建库",
      libName: meta.libName || "",
      mode: meta.mode || "create",
      status: "running",
      total: 0,
      done: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      conc: 1,
      files: /* @__PURE__ */ new Map(),
      stat: "准备中…",
      stage: "preparing",
      stageLabel: pbBuildStageLabel("preparing"),
      stageStartedAt: Date.now(),
      currentFile: "",
      currentIndex: 0,
      result: null,
      error: "",
      startedAt: Date.now(),
      finishedAt: 0,
      ctl
    };
    this.jobs.set(id, job);
    this._emit(job);
    job.promise = this.plugin.api.streamForm("/library-manager/ingest-stream", fd, (evt) => {
      this._apply(job, evt);
      this._emit(job);
    }, { signal: ctl.signal }).then(() => {
      if (job.status === "running") job.status = "done";
    }).catch((err) => {
      if (ctl.signal.aborted || (err == null ? void 0 : err.name) === "AbortError") {
        job.status = "cancelled";
        job.stat = `已取消（已入库 ${job.done} 篇）`;
      } else {
        job.status = "error";
        job.error = err.message;
        job.stat = `连接失败：${err.message}`;
      }
    }).finally(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      job.finishedAt = Date.now();
      const importedDocs = Number((_c = (_b = (_a = job.result) == null ? void 0 : _a.docs) != null ? _b : job.done) != null ? _c : 0);
      let selectedReadyLibrary = false;
      for (const leaf of this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE)) {
        (_e = (_d = leaf.view) == null ? void 0 : _d._libStats) == null ? void 0 : _e.delete(job.libName);
        if (leaf.view) {
          leaf.view._libs = null;
          const root = leaf.view.containerEl;
          const widget = (_f = root == null ? void 0 : root.querySelector) == null ? void 0 : _f.call(root, ".pb-lib-widget");
          const shouldSelect = job.mode === "create" && (!leaf.view._hasLibraries || !(widget == null ? void 0 : widget.dataset.lib));
          if (job.status === "done" && importedDocs > 0 && job.libName && shouldSelect) {
            selectedReadyLibrary = true;
            leaf.view._hasLibraries = true;
            leaf.view._librariesReady = true;
            const current = (_g = widget == null ? void 0 : widget.querySelector) == null ? void 0 : _g.call(widget, ".pb-lib-cur");
            const searchButton = (_h = root == null ? void 0 : root.querySelector) == null ? void 0 : _h.call(root, ".pb-btn-search");
            if (widget) widget.dataset.lib = job.libName;
            if (current) current.textContent = job.libName;
            if (searchButton) {
              searchButton.disabled = false;
              searchButton.textContent = "检索";
              searchButton.removeAttribute("aria-busy");
            }
            (_j = (_i = leaf.view)._warmup) == null ? void 0 : _j.call(_i, job.libName);
          }
        }
      }
      if (job.status === "done" && importedDocs > 0 && job.libName && (selectedReadyLibrary || !this.plugin.settings.lastLibrary)) {
        this.plugin.settings.lastLibrary = job.libName;
        this.plugin.saveSettings();
      }
      this._emit(job);
      if (job.status === "done") {
        new obsidian3.Notice(`${job.label} 完成：${(_l = (_k = job.result) == null ? void 0 : _k.docs) != null ? _l : job.done} 篇入库`, 6e3);
        new BuildSummaryModal(this.plugin.app, job).open();
      } else if (job.status === "cancelled") {
        new obsidian3.Notice(`${job.label} 已取消`);
      } else if (job.status === "error") {
        new obsidian3.Notice(`${job.label} 失败：${job.error}`);
      }
      setTimeout(() => {
        this.jobs.delete(id);
        this._emit(null);
      }, 12e4);
    });
    return job;
  }
  cancel(id) {
    const j = this.jobs.get(id);
    if (j && j.status === "running") {
      try {
        j.ctl.abort();
      } catch (_) {
      }
    }
  }
};

// src/services/core-manager.ts
var obsidian4 = __toESM(require("obsidian"));
var nodeFs = __toESM(require("fs"));
var nodePath2 = __toESM(require("path"));
var CoreManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.proc = null;
    this.port = 8e3;
    this._spawning = false;
    this.status = "idle";
    this.statusDetail = "";
    this._listeners = /* @__PURE__ */ new Set();
    this._restartAttempts = 0;
    this._intentionalKill = false;
    this._watchdog = null;
  }
  // ── 状态机：广播给 UI（状态栏 / 检索视图）──────────────
  onStatus(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }
  _setStatus(s, detail = "") {
    this.status = s;
    this.statusDetail = detail;
    for (const cb of [...this._listeners]) {
      try {
        cb(s, detail);
      } catch (_) {
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("paperbell:core-status", { detail: { status: s, detail } }));
    } catch (_) {
    }
  }
  // 平台与 arch 标识
  platform() {
    const p = process.platform;
    if (p === "win32") return "win";
    if (p === "darwin") return "mac";
    return "linux";
  }
  arch() {
    return process.arch === "arm64" ? "arm64" : "x64";
  }
  binName() {
    return this.platform() === "win" ? "PaperRAGStudio.exe" : "PaperRAGStudio";
  }
  // 插件目录 / Core 安装根目录
  pluginDir() {
    const adapter = this.plugin.app.vault.adapter;
    const basePath = adapter.getBasePath ? adapter.getBasePath() : adapter.basePath || "";
    const dir = this.plugin.manifest.dir || nodePath2.join(".obsidian", "plugins", this.plugin.manifest.id);
    return nodePath2.join(basePath, dir);
  }
  coreRoot() {
    return nodePath2.join(this.pluginDir(), "core");
  }
  corePath() {
    return nodePath2.join(this.coreRoot(), this.binName());
  }
  // ── 核心包双形态：打包二进制（PaperRAGStudio.exe）or 源码 portable 包（start_app.py + python_runtime）──
  _pathExists(p) {
    try {
      return !!p && nodeFs.existsSync(p);
    } catch (_) {
      return false;
    }
  }
  hasBinaryCore() {
    try {
      const p = this.corePath();
      return nodeFs.existsSync(p) && nodeFs.statSync(p).isFile();
    } catch (_) {
      return false;
    }
  }
  _clearMacQuarantine(target = this.coreRoot()) {
    if (process.platform !== "darwin") return;
    try {
      const { spawnSync } = require("child_process");
      spawnSync("/usr/bin/xattr", ["-dr", "com.apple.quarantine", target], { stdio: "ignore" });
    } catch (_) {
    }
  }
  _isSourceCoreDir(dir) {
    try {
      if (!dir || !nodeFs.existsSync(nodePath2.join(dir, "start_app.py"))) return false;
      const rt = nodePath2.join(dir, "python_runtime");
      if (!nodeFs.existsSync(rt)) return true;
      return this._isRuntimeComplete(rt);
    } catch (_) {
      return false;
    }
  }
  // python_runtime 是否解压完整：查末尾字母序的标准库包 + 解释器本体。
  // Expand-Archive 按包内顺序落盘，urllib/xml/zoneinfo 这些排在 site-packages 之后，
  // 它们到位基本代表整个 runtime 落全了。
  _isRuntimeComplete(runtimeRoot) {
    try {
      const py = this.platform() === "win" ? nodePath2.join(runtimeRoot, "python.exe") : nodePath2.join(runtimeRoot, "bin", "python3");
      if (!nodeFs.existsSync(py)) return false;
      const lib = nodePath2.join(runtimeRoot, "Lib");
      if (!nodeFs.existsSync(lib)) return true;
      for (const pkg of ["urllib", "xml", "unittest", "sqlite3"]) {
        if (!nodeFs.existsSync(nodePath2.join(lib, pkg))) return false;
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  // 安装标记：解压期间置位，装完清除。挡住「解压途中重启 Obsidian / 点启动」导致的抢跑。
  _installingFlagPath() {
    return nodePath2.join(this.coreRoot(), ".installing");
  }
  _isInstalling() {
    try {
      const f = this._installingFlagPath();
      if (!nodeFs.existsSync(f)) return false;
      const age = Date.now() - nodeFs.statSync(f).mtimeMs;
      if (age > 3 * 3600 * 1e3) {
        try {
          nodeFs.unlinkSync(f);
        } catch (_) {
        }
        return false;
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  // core/ 根 or core/<单层目录> 里装的源码 portable 包目录
  _installedSourceDir() {
    const root = this.coreRoot();
    if (this._isSourceCoreDir(root)) return root;
    try {
      if (!nodeFs.existsSync(root)) return "";
      for (const e of nodeFs.readdirSync(root, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const sub = nodePath2.join(root, e.name);
        if (this._isSourceCoreDir(sub)) return sub;
      }
    } catch (_) {
    }
    return "";
  }
  isInstalled() {
    if (this._isInstalling()) return false;
    return this.hasBinaryCore() || !!this._installedSourceDir();
  }
  // <dir>/.venv 下的 python（开发源码目录常见）
  _localVenvPython(dir) {
    const venvPy = this.platform() === "win" ? nodePath2.join(dir, ".venv", "Scripts", "python.exe") : nodePath2.join(dir, ".venv", "bin", "python");
    return this._pathExists(venvPy) ? venvPy : "";
  }
  // <dir>/python_runtime 下的 python（源码 portable 包自带运行时）
  _localRuntimePython(dir) {
    const runtimePy = this.platform() === "win" ? nodePath2.join(dir, "python_runtime", "python.exe") : nodePath2.join(dir, "python_runtime", "bin", "python3");
    return this._pathExists(runtimePy) ? runtimePy : "";
  }
  // 把「源码目录」统一转成 Python 启动配置（本地开发目录 / 下载安装的 portable 包共用）
  _sourceBackend(dir, customPython = "") {
    if (!this._isSourceCoreDir(dir)) return null;
    const venvPy = this._localVenvPython(dir);
    const runtimePy = this._localRuntimePython(dir);
    const bootstrapScript = nodePath2.join(dir, "scripts", "bootstrap_source_core.ps1");
    const python = venvPy || runtimePy || customPython || (this.platform() === "win" ? "python" : "python3");
    return {
      python,
      script: nodePath2.join(dir, "start_app.py"),
      cwd: dir,
      hasVenv: !!venvPy,
      hasRuntime: !!runtimePy,
      runtimePython: runtimePy,
      runtimeRoot: runtimePy ? nodePath2.dirname(runtimePy) : "",
      customPython,
      bootstrapScript,
      canBootstrap: this.platform() === "win" && !venvPy && !runtimePy && !customPython && this._pathExists(bootstrapScript)
    };
  }
  // 用户手动指定的本地源码目录（开发者 / 自托管）
  _localBackend() {
    const s = this.plugin.settings;
    if (!s.localBackendEnabled) return null;
    const dir = (s.localBackendDir || "").trim();
    if (!dir) return null;
    return this._sourceBackend(dir, (s.localBackendPython || "").trim());
  }
  // 下载 / 导入安装到 core/ 的源码 portable 包
  _installedSourceBackend() {
    const dir = this._installedSourceDir();
    return dir ? this._sourceBackend(dir) : null;
  }
  // 是否有任何可拉起的核心来源
  _canLaunch() {
    // 兼容旧版/手动解压留下的 core/PaperRAGStudio/PaperRAGStudio 目录层级。
    if (!this.hasBinaryCore()) this._flattenCoreDir();
    return this.hasBinaryCore() || !!this._localBackend() || !!this._installedSourceBackend();
  }
  // Python 启动配置：portable 运行时需注入 PATH（含 torch/lib 等 DLL 搜索路径）
  _pythonLaunchConfig(local, env) {
    if (local.runtimeRoot) {
      const sep2 = process.platform === "win32" ? ";" : ":";
      const runtimePaths = [
        local.runtimeRoot,
        nodePath2.join(local.runtimeRoot, "Library", "bin"),
        nodePath2.join(local.runtimeRoot, "Scripts"),
        nodePath2.join(local.runtimeRoot, "Lib", "site-packages", "torch", "lib"),
        env.PATH || ""
      ].filter(Boolean);
      env.PATH = runtimePaths.join(sep2);
      env.PYTHONNOUSERSITE = "1";
      env.PYTHONUTF8 = "1";
    }
    return {
      mode: "python",
      cmd: local.python,
      args: [local.script, "--host", "127.0.0.1", "--port", String(this.port), "--no-browser"],
      cwd: local.cwd,
      env,
      localBackend: local
    };
  }
  // 决定怎么拉起核心。优先级：① 手动指定的本地源码目录 ② 打包二进制 ③ 安装的源码 portable 包
  _resolveLaunch() {
    const env = {
      ...process.env,
      PAPER_RAG_PORT: String(this.port),
      API_PORT: String(this.port),
      API_HOST: "127.0.0.1"
    };
    const local = this._localBackend();
    if (local) return this._pythonLaunchConfig(local, env);
    if (this.hasBinaryCore()) {
      if (this.platform() !== "win") {
        try {
          nodeFs.chmodSync(this.corePath(), 493);
        } catch (_) {
        }
      }
      this._clearMacQuarantine();
      return {
        mode: "binary",
        cmd: this.corePath(),
        args: ["--host", "127.0.0.1", "--port", String(this.port), "--no-browser"],
        cwd: this.coreRoot(),
        env
      };
    }
    const installedSource = this._installedSourceBackend();
    if (installedSource) return this._pythonLaunchConfig(installedSource, env);
    return null;
  }
  // 端口探测：从 8000 试到 8020
  async _findFreePort(start = 8e3, end = 8020) {
    const net = require("net");
    for (let p = start; p <= end; p++) {
      const free = await new Promise((res) => {
        const srv = net.createServer();
        srv.once("error", () => res(false));
        srv.once("listening", () => srv.close(() => res(true)));
        srv.listen(p, "127.0.0.1");
      });
      if (free) return p;
    }
    throw new Error(`8000-8020 端口都被占用`);
  }
  // 下载 zip（真实 chunk 进度 + 重定向 ≤5 + 状态机播报）
  async _downloadZip(url, zipPath, onProgress, redirects = 0) {
    if (redirects > 5) throw new Error("下载重定向过多");
    this._setStatus("downloading", redirects ? "跟随下载重定向…" : "准备下载…");
    const https = require("https");
    const http = require("http");
    const lib = /^https:/i.test(url) ? https : http;
    await new Promise((resolve, reject) => {
      const req = lib.get(url, (resp) => {
        const statusCode = resp.statusCode || 0;
        if ([301, 302, 303, 307, 308].includes(statusCode)) {
          resp.resume();
          const loc = resp.headers.location;
          if (!loc) {
            reject(new Error(`HTTP ${statusCode} 重定向缺少 Location`));
            return;
          }
          this._downloadZip(new URL(loc, url).href, zipPath, onProgress, redirects + 1).then(resolve, reject);
          return;
        }
        if (statusCode !== 200) {
          resp.resume();
          reject(new Error(`HTTP ${statusCode}`));
          return;
        }
        const total = parseInt(resp.headers["content-length"] || "0", 10) || 0;
        let got = 0;
        const out = nodeFs.createWriteStream(zipPath);
        const fail = (err) => {
          try {
            out.destroy();
          } catch (_) {
          }
          reject(err);
        };
        resp.on("data", (chunk) => {
          got += chunk.length;
          const progress = pbDownloadProgress(got, total);
          this._setStatus("downloading", progress.text);
          onProgress == null ? void 0 : onProgress(got, total, progress);
        });
        resp.on("error", fail);
        out.on("finish", () => out.close(resolve));
        out.on("error", fail);
        resp.pipe(out);
      });
      req.on("error", reject);
    });
  }
  // 下载 zip → 校验 SHA-256 → 解压到 coreRoot（与「本地导入」共用 installFromZip 单一路径）
  async download(url, sha256, onProgress) {
    const zipPath = nodePath2.join(this.coreRoot(), "_download.zip");
    try {
      nodeFs.mkdirSync(this.coreRoot(), { recursive: true });
    } catch (_) {
    }
    await this._downloadZip(url, zipPath, onProgress);
    const tick = pbMakeExtractTimer();
    let beat = null;
    const stopBeat = () => {
      if (beat) {
        clearInterval(beat);
        beat = null;
      }
    };
    try {
      await this.installFromZip(zipPath, sha256, {
        deleteZipAfter: true,
        onPhase: (phase, p) => {
          if (phase === "verify") {
            stopBeat();
            this._setStatus("downloading", "正在校验下载包…");
            return;
          }
          this._setStatus("downloading", tick(p).text);
          if (!beat) beat = setInterval(() => this._setStatus("downloading", tick.stalled().text), 3e3);
        }
      });
    } finally {
      stopBeat();
    }
  }
  // 从本地 zip 安装核心：手动导入（用户已自备压缩包 / 离线 / 内网无法在线下载）与在线下载共用此路径。
  // opts.deleteZipAfter：在线下载的临时包用完即删；用户手选的原始文件保留不动。
  // opts.onPhase：'verify' | 'extract' 阶段回调（给 UI 显示文案）。
  async installFromZip(zipPath, sha256, opts = {}) {
    const { deleteZipAfter = false, onPhase } = opts;
    if (!zipPath || !nodeFs.existsSync(zipPath)) {
      throw new Error(`找不到压缩包：${zipPath || "(空)"}`);
    }
    try {
      nodeFs.mkdirSync(this.coreRoot(), { recursive: true });
    } catch (_) {
    }
    if (sha256) {
      onPhase == null ? void 0 : onPhase("verify");
      const crypto = require("crypto");
      const hash = crypto.createHash("sha256");
      hash.update(nodeFs.readFileSync(zipPath));
      const got = hash.digest("hex");
      if (got.toLowerCase() !== sha256.toLowerCase()) {
        if (deleteZipAfter) {
          try {
            nodeFs.unlinkSync(zipPath);
          } catch (_) {
          }
        }
        throw new Error(`SHA-256 校验失败：期望 ${sha256.slice(0, 12)}…，实际 ${got.slice(0, 12)}…`);
      }
    }
    onPhase == null ? void 0 : onPhase("extract");
    try {
      nodeFs.writeFileSync(this._installingFlagPath(), String(Date.now()));
    } catch (_) {
    }
    try {
      let lastTouch = 0;
      await this._extractZip(zipPath, this.coreRoot(), (p) => {
        onPhase == null ? void 0 : onPhase("extract", p);
        const now = Date.now();
        if (now - lastTouch > 3e4) {
          lastTouch = now;
          try {
            nodeFs.utimesSync(this._installingFlagPath(), /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
          } catch (_) {
          }
        }
      });
    } catch (e) {
      try {
        nodeFs.unlinkSync(this._installingFlagPath());
      } catch (_) {
      }
      throw e;
    }
    if (deleteZipAfter) {
      try {
        nodeFs.unlinkSync(zipPath);
      } catch (_) {
      }
    }
    try {
      nodeFs.unlinkSync(this._installingFlagPath());
    } catch (_) {
    }
    if (!this.isInstalled()) this._flattenCoreDir();
    if (!this.isInstalled()) {
      const srcDir = this._installedSourceDir() || "";
      const rt = srcDir && nodePath2.join(srcDir, "python_runtime");
      if (rt && nodeFs.existsSync(rt) && !this._isRuntimeComplete(rt)) {
        throw new Error("安装包解压不完整（内置 Python 运行时缺少文件），常见原因是磁盘空间不足或解压被中断。请清理磁盘空间后重新安装。");
      }
      throw new Error(`解压完成，但没有找到可启动的 PaperSearch 本地服务。请确认安装包完整且与当前系统匹配。`);
    }
    if (this.platform() !== "win" && this.hasBinaryCore()) {
      try {
        nodeFs.chmodSync(this.corePath(), 493);
      } catch (_) {
      }
      this._clearMacQuarantine();
    }
  }
  // 解压后核心若躲在单层子目录里（自打包多套了一层），把那层内容提到 coreRoot
  // 二进制目录（含 binName）与源码目录（含 start_app.py）都识别
  _flattenCoreDir() {
    try {
      const root = this.coreRoot();
      for (const e of nodeFs.readdirSync(root, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const sub = nodePath2.join(root, e.name);
        const hasBinary = nodeFs.existsSync(nodePath2.join(sub, this.binName()));
        const hasSource = nodeFs.existsSync(nodePath2.join(sub, "start_app.py"));
        if (!hasBinary && !hasSource) continue;
        for (const item of nodeFs.readdirSync(sub)) {
          const dst = nodePath2.join(root, item);
          try {
            nodeFs.rmSync(dst, { recursive: true, force: true });
          } catch (_) {
          }
          nodeFs.renameSync(nodePath2.join(sub, item), dst);
        }
        try {
          nodeFs.rmdirSync(sub);
        } catch (_) {
        }
        return true;
      }
    } catch (_) {
    }
    return false;
  }
  // 解压 zip。安全要求：路径一律以参数/环境变量传递，绝不拼进命令行字符串——
  // zipPath 来自用户选择的文件（文件名完全可控），拼字符串会被单引号闭合注入命令；
  // 且 vault 路径含撇号（如 "John's Vault"）时拼接同样会解析失败。
  // 解压前先看盘。核心包解压后约是 zip 的 2.5 倍（1.79 GB → 3.97 GB 实测），
  // 空间不够时解压器会在跑了几分钟之后才失败，抛的还是一句系统原文；
  // 而且失败后回退另一个解压器同样会因为空间不足再失败一次，白等一遍。
  // 提前算一次，把话说清楚，比事后翻译错误信息有用得多。
  _assertDiskSpace(zipPath, targetDir) {
    let need = 0, free = 0;
    try {
      need = nodeFs.statSync(zipPath).size * 3;
      const st = nodeFs.statfsSync(targetDir);
      free = st.bavail * st.bsize;
    } catch (_) {
      return;
    }
    if (!need || !free || free >= need) return;
    const gb = (n) => (n / 1024 ** 3).toFixed(1) + " GB";
    throw new Error(
      `磁盘空间不足：安装需要约 ${gb(need)} 可用空间，当前所在磁盘只剩 ${gb(free)}。请清理空间后重试，或把 vault 放到空间更充足的磁盘。`
    );
  }
  // onProgress({ done, total }) —— 解压几万个条目要好几分钟，不报进度的话
  // 界面就是一动不动，用户分不清是在干活还是卡死了。
  async _extractZip(zipPath, targetDir, onProgress) {
    const { spawn } = require("child_process");
    const run = (cmd, args, opts = {}) => new Promise((resolve, reject) => {
      const p = spawn(cmd, args, { windowsHide: true, ...opts });
      let err = "", tail = "";
      p.stdout.setEncoding("utf8");
      p.stdout.on("data", (chunk) => {
        var _a;
        tail += chunk;
        const lines = tail.split(/\r?\n/);
        tail = lines.pop() || "";
        for (const l of lines) (_a = opts.onLine) == null ? void 0 : _a.call(opts, l);
      });
      p.stderr.setEncoding("utf8");
      p.stderr.on("data", (d) => {
        err += d;
      });
      p.on("error", (e) => reject(new Error(e.message)));
      p.on("close", (code) => {
        var _a;
        if (tail) (_a = opts.onLine) == null ? void 0 : _a.call(opts, tail);
        code === 0 ? resolve() : reject(new Error((err || `退出码 ${code}`).slice(0, 300)));
      });
    });
    try {
      nodeFs.mkdirSync(targetDir, { recursive: true });
    } catch (_) {
    }
    this._assertDiskSpace(zipPath, targetDir);
    if (this.platform() === "win") {
      const psEnv = { ...process.env, PB_ZIP_SRC: zipPath, PB_ZIP_DEST: targetDir };
      const psExtract = [
        '$ErrorActionPreference = "Stop"',
        "Add-Type -AssemblyName System.IO.Compression.FileSystem",
        "$dest = [System.IO.Path]::GetFullPath($env:PB_ZIP_DEST)",
        "$zip  = [System.IO.Compression.ZipFile]::OpenRead($env:PB_ZIP_SRC)",
        // 总数先报一次，UI 立刻就能显示分母，不用等第一批完成
        "$total = $zip.Entries.Count",
        "$i = 0",
        'Write-Output "PBPROG 0 $total"',
        "try {",
        "  foreach ($e in $zip.Entries) {",
        "    $to = [System.IO.Path]::GetFullPath((Join-Path $dest $e.FullName))",
        // 防 Zip Slip：条目名若用 ../ 逃出目标目录，直接拒绝
        '    if (-not $to.StartsWith($dest, [System.StringComparison]::OrdinalIgnoreCase)) { throw "压缩包中存在非法路径：" + $e.FullName }',
        "    if ([string]::IsNullOrEmpty($e.Name)) { [void][System.IO.Directory]::CreateDirectory($to); continue }",
        "    [void][System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($to))",
        "    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($e, $to, $true)",
        // 每 100 条报一次：再密就是刷屏，再疏就显得又不动了
        '    $i++; if ($i % 100 -eq 0) { Write-Output "PBPROG $i $total" }',
        "  }",
        "} finally { $zip.Dispose() }",
        'Write-Output "PBPROG $total $total"'
      ].join("; ");
      const onLine = (line) => {
        const m = /^PBPROG (\d+) (\d+)$/.exec(line.trim());
        if (m) onProgress == null ? void 0 : onProgress({ done: Number(m[1]), total: Number(m[2]) });
      };
      try {
        await run("powershell.exe", [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          psExtract
        ], { env: psEnv, onLine });
        return;
      } catch (e) {
        const msg = e.message || "";
        if (/非法路径/.test(msg)) {
          throw new Error("安装包内含非法文件路径，可能已被篡改，已中止安装。");
        }
        if (/磁盘空间不足|not enough space|ENOSPC|disk full/i.test(msg)) {
          throw new Error(
            "磁盘空间不足，安装中断。核心包解压后约需 4 GB，请清理该磁盘后重试，或把 vault 放到空间更充足的磁盘。"
          );
        }
        console.warn("PaperSearch: .NET 解压失败，回退 Expand-Archive", msg);
      }
      onProgress == null ? void 0 : onProgress({ done: 0, total: 0, indeterminate: true });
      await run("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        '$ErrorActionPreference = "Stop"; Expand-Archive -Force -LiteralPath $env:PB_ZIP_SRC -DestinationPath $env:PB_ZIP_DEST'
      ], { env: psEnv });
      return;
    }
    let total = 0;
    try {
      let n = 0;
      await run("unzip", ["-Z", "-1", zipPath], { onLine: (l) => {
        if (l.trim()) n++;
      } });
      total = n;
    } catch (_) {
    }
    let done = 0;
    const countLine = (l) => {
      if (/^\s*(inflating|extracting|creating|linking):/.test(l)) {
        done++;
        if (done % 100 === 0) onProgress == null ? void 0 : onProgress({ done, total });
      }
    };
    try {
      onProgress == null ? void 0 : onProgress({ done: 0, total });
      await run("unzip", ["-o", zipPath, "-d", targetDir], { onLine: countLine });
      onProgress == null ? void 0 : onProgress({ done: total || done, total: total || done });
    } catch (e) {
      onProgress == null ? void 0 : onProgress({ done: 0, total: 0, indeterminate: true });
      await run("tar", ["-x", "-f", zipPath, "-C", targetDir]);
    }
  }
  // ── 锁文件：记录当前核心 pid+port，支持跨重启复用 + 残留清理 ──
  _lockPath() {
    return nodePath2.join(this.coreRoot(), "core.lock");
  }
  _readLock() {
    try {
      return JSON.parse(nodeFs.readFileSync(this._lockPath(), "utf8"));
    } catch (_) {
      return null;
    }
  }
  _writeLock() {
    var _a;
    try {
      nodeFs.writeFileSync(this._lockPath(), JSON.stringify({ pid: ((_a = this.proc) == null ? void 0 : _a.pid) || 0, port: this.port, ts: Date.now() }));
    } catch (_) {
    }
  }
  _clearLock() {
    try {
      nodeFs.unlinkSync(this._lockPath());
    } catch (_) {
    }
  }
  // 核心进程日志落盘（便于排查"核心起来了但模型没加载/降级"这类问题）
  _logPath() {
    return nodePath2.join(this.coreRoot(), "core.log");
  }
  _appendLog(s) {
    try {
      nodeFs.mkdirSync(this.coreRoot(), { recursive: true });
      const p = this._logPath();
      try {
        if (nodeFs.statSync(p).size > 524288) nodeFs.writeFileSync(p, "");
      } catch (_) {
      }
      nodeFs.appendFileSync(p, s.endsWith("\n") ? s : s + "\n");
    } catch (_) {
    }
  }
  // 整树杀（Windows：SIGTERM/SIGKILL 不杀进程树，embed_worker 等孙进程会泄漏；用 taskkill /T）
  _killProcTree(proc) {
    if (!proc) return;
    const pid = proc.pid;
    try {
      if (process.platform === "win32" && pid) {
        require("child_process").execFileSync("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        proc.kill("SIGKILL");
      }
    } catch (_) {
    }
  }
  // 复用：锁里的核心若仍存活且 /health OK，直接接管，不再 spawn（同 vault 重开 / 多窗口）
  async _tryReuse() {
    const lk = this._readLock();
    if (!lk || !lk.port) return false;
    try {
      const r = await obsidian4.requestUrl({ url: `http://127.0.0.1:${lk.port}/health`, method: "GET", throw: false });
      if (r.status >= 200 && r.status < 300) {
        this.port = lk.port;
        this.plugin.settings.backendUrl = `http://127.0.0.1:${lk.port}`;
        await this.plugin.saveSettings();
        return true;
      }
    } catch (_) {
    }
    return false;
  }
  // 清理：锁里指向的旧 pid 若还在但 health 不通（上次崩溃残留），按 pid 精确杀（跨 vault 安全，不误伤别的核心）
  _cleanupStaleByLock() {
    const lk = this._readLock();
    if (lk && lk.pid) {
      try {
        process.kill(lk.pid, "SIGKILL");
      } catch (_) {
      }
    }
    this._clearLock();
  }
  // 启动 Core 进程并等到 /health OK（含复用 / 残留清理 / 状态广播 / 自愈）
  async spawn() {
    if (this.proc && this.status === "healthy") return this.port;
    if (this.proc) {
      try {
        this._killProcTree(this.proc);
      } catch (_) {
      }
      this.proc = null;
    }
    if (this._spawning) {
      while (this._spawning) await new Promise((r) => setTimeout(r, 200));
      if (this.proc && this.status === "healthy") return this.port;
      throw new Error("本地服务启动失败");
    }
    this._spawning = true;
    this._intentionalKill = false;
    try {
      if (!this._canLaunch()) {
        this._setStatus("idle", "本地服务未安装");
        throw new Error("本地服务未安装");
      }
      if (await this._tryReuse()) {
        this._restartAttempts = 0;
        this._setStatus("healthy", "已连接运行中的本地服务");
        this._startWatchdog();
        return this.port;
      }
      this._cleanupStaleByLock();
      this._setStatus("starting", "正在启动本地服务…");
      this.port = await this._findFreePort();
      const launch = this._resolveLaunch();
      if (!launch) {
        this._setStatus("idle", "本地服务未安装");
        throw new Error("本地服务未安装");
      }
      this._setStatus("starting", launch.mode === "python" ? "正在启动本地服务（Python）…" : "正在启动本地服务…");
      const { spawn } = require("child_process");
      this.proc = spawn(launch.cmd, launch.args, {
        cwd: launch.cwd,
        env: launch.env,
        stdio: ["ignore", "pipe", "pipe"],
        detached: false
      });
      this._appendLog(`
===== spawn ${launch.mode} :${this.port} =====`);
      this.proc.stdout.on("data", (d) => {
        const t = d.toString();
        console.log("[PB Core]", t.trim());
        this._appendLog(t);
      });
      this.proc.stderr.on("data", (d) => {
        const t = d.toString();
        console.warn("[PB Core]", t.trim());
        this._appendLog(t);
      });
      this.proc.on("error", (err) => {
        this.proc = null;
        this._stopWatchdog();
        this._clearLock();
        const detail = err.code === "ENOENT" ? `找不到本地服务的可执行文件。请重新安装，或在设置里检查源码目录。` : err.code === "EPERM" || err.code === "EACCES" ? `本地服务被系统或安全软件阻止启动。请在杀毒软件中放行后重试。` : err.message || "启动失败";
        console.warn("[PB Core] spawn error", err);
        this._appendLog(`spawn error: ${err.code || ""} ${err.message || ""}`);
        this._setStatus("failed", detail);
      });
      this.proc.on("exit", async (code) => {
        console.log(`[PB Core] 退出，code=${code}`);
        const exitedPort = this.port;
        this.proc = null;
        this._stopWatchdog();
        if (this._intentionalKill) {
          this._clearLock();
          this._setStatus("stopped", "本地服务已停止");
          return;
        }
        if (await this._isHealthy(exitedPort)) {
          this.port = exitedPort;
          this.plugin.settings.backendUrl = `http://127.0.0.1:${this.port}`;
          try {
            await this.plugin.saveSettings();
          } catch (_) {
          }
          this._writeLock();
          this._restartAttempts = 0;
          this._setStatus("healthy", `本地服务已就绪（:${this.port}）`);
          this._startWatchdog();
          return;
        }
        this._clearLock();
        this._setStatus("crashed", `本地服务异常退出（代码 ${code}）`);
        this._scheduleRestart();
      });
      this.plugin.settings.backendUrl = `http://127.0.0.1:${this.port}`;
      await this.plugin.saveSettings();
      await this.waitHealthy();
      this._writeLock();
      this._restartAttempts = 0;
      this._setStatus("healthy", `本地服务已就绪（:${this.port}）`);
      this._startWatchdog();
      return this.port;
    } catch (e) {
      if (this.status !== "crashed") {
        this._setStatus(this._canLaunch() ? "failed" : "idle", e.message);
      }
      throw e;
    } finally {
      this._spawning = false;
    }
  }
  // 指定端口的 /health 是否健康
  async _isHealthy(port = this.port) {
    try {
      const r = await obsidian4.requestUrl({ url: `http://127.0.0.1:${port}/health`, method: "GET", throw: false });
      return r.status >= 200 && r.status < 300;
    } catch (_) {
      return false;
    }
  }
  // 冷启动超时放宽（PyInstaller 解包 + 载模型可能数十秒）；轮询期间播报进度，进程退出即判失败不空等
  async waitHealthy(timeoutMs = 12e4) {
    const deadline = Date.now() + timeoutMs;
    let ticks = 0;
    while (Date.now() < deadline) {
      if (!this.proc) {
        if (await this._isHealthy(this.port)) return true;
        throw new Error("本地服务已退出");
      }
      if (await this._isHealthy(this.port)) return true;
      ticks++;
      if (ticks === 6) this._setStatus("starting", "正在准备本地服务…");
      if (ticks === 20) this._setStatus("starting", "正在加载检索模型，请稍候…");
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error("本地服务启动超时");
  }
  // 意外退出 → 退避自动重启（≤3 次）
  _scheduleRestart() {
    if (this._intentionalKill) return;
    if (this._restartAttempts >= 3) {
      this._setStatus("failed", "本地服务多次异常退出，已停止自动重启");
      return;
    }
    const n = ++this._restartAttempts;
    const delay = 1e3 * Math.pow(2, n - 1);
    this._restartTimer = setTimeout(() => {
      this._restartTimer = null;
      if (this.proc || this._intentionalKill || this._spawning) return;
      this._setStatus("starting", `正在自动重启本地服务（第 ${n} 次）…`);
      this.spawn().catch((e) => this._setStatus("failed", e.message));
    }, delay);
  }
  // health 看护：僵死（health 不通）→ 杀掉/重起。复用的外部核心（this.proc 为 null）也要看护。
  _startWatchdog() {
    this._stopWatchdog();
    this._watchdog = setInterval(async () => {
      if (this._intentionalKill || this._spawning) return;
      if (!this.proc && this.status !== "healthy") return;
      try {
        const r = await obsidian4.requestUrl({ url: `http://127.0.0.1:${this.port}/health`, method: "GET", throw: false });
        if (r.status >= 200 && r.status < 300) return;
      } catch (_) {
      }
      console.warn("[PB Core] health 看护失败，重启核心");
      if (this.proc) {
        this._killProcTree(this.proc);
      } else {
        this._setStatus("crashed", "本地服务无响应，正在重启…");
        this._scheduleRestart();
      }
    }, 45e3);
  }
  _stopWatchdog() {
    if (this._watchdog) {
      clearInterval(this._watchdog);
      this._watchdog = null;
    }
  }
  async kill() {
    this._intentionalKill = true;
    if (this._restartTimer) {
      clearTimeout(this._restartTimer);
      this._restartTimer = null;
    }
    this._stopWatchdog();
    if (this.proc) {
      try {
        if (process.platform === "win32") {
          this._killProcTree(this.proc);
        } else {
          this.proc.kill("SIGTERM");
          await new Promise((r) => setTimeout(r, 1500));
          if (this.proc && !this.proc.killed) this.proc.kill("SIGKILL");
        }
      } catch (_) {
      }
      this.proc = null;
    }
    this._clearLock();
    this._setStatus("stopped", "本地服务已停止");
  }
};

// src/services/metadata-resolver.ts
var obsidian5 = __toESM(require("obsidian"));

// src/lib/rate-limiter.ts
var RateLimiter = class {
  constructor({ rps, burst }) {
    this.capacity = burst;
    this.tokens = burst;
    this.rate = rps;
    this.last = Date.now();
    this.queue = [];
  }
  _refill() {
    const now = Date.now();
    const add = (now - this.last) / 1e3 * this.rate;
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.last = now;
  }
  async take() {
    return new Promise((resolve) => {
      const tryTake = () => {
        this._refill();
        if (this.tokens >= 1) {
          this.tokens -= 1;
          resolve();
        } else {
          const waitMs = (1 - this.tokens) / this.rate * 1e3;
          setTimeout(tryTake, Math.max(50, waitMs));
        }
      };
      tryTake();
    });
  }
};

// src/services/metadata-resolver.ts
var MetadataResolver = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.limiters = {
      crossref: new RateLimiter({ rps: 8, burst: 16 }),
      s2: new RateLimiter({ rps: 1, burst: 1 }),
      // no-key 配额
      arxiv: new RateLimiter({ rps: 3, burst: 3 }),
      openalex: new RateLimiter({ rps: 10, burst: 10 })
    };
    this._inFlight = /* @__PURE__ */ new Map();
  }
  // 标准入口：给定一篇文档的 chunk row（含 _docId / _sourceFile），
  // 异步返回该文档的 metadata entry（命中缓存即同步返回）
  async resolve(row, opts = {}) {
    const docId = row._docId || row._sourceFile || "";
    if (!docId) return null;
    const cached = this.plugin._readDocMeta(docId);
    if (cached && this._isFresh(cached) && !opts.force) return cached;
    if (this._inFlight.has(docId)) return this._inFlight.get(docId);
    const work = this._runCascade(row, docId).finally(() => {
      this._inFlight.delete(docId);
    });
    this._inFlight.set(docId, work);
    return work;
  }
  _isFresh(entry) {
    return entry.ttl_until && entry.ttl_until > Date.now();
  }
  // 主级联：L1 BBT → L3 CrossRef → L6 filename 兜底；S2 并行 enrich
  async _runCascade(row, docId) {
    var _a, _b, _c;
    const stem = (row._sourceFile || row.title || "").replace(/\.pdf$/i, "");
    const sources = [];
    let csl = null;
    let bbt = null;
    const settings = this.plugin.settings;
    const enabled = ((_a = settings.metadataResolver) == null ? void 0 : _a.resolvers) || {};
    if (enabled.bbt !== false) {
      const bbtMatch = this._resolveBbt(row, stem);
      if (bbtMatch) {
        csl = bbtMatch.csl;
        bbt = bbtMatch.bbt;
        sources.push("bbt");
      }
    }
    if (!csl && enabled.crossref !== false) {
      try {
        const out = await this._resolveCrossRef(stem);
        if (out) {
          csl = out;
          sources.push("crossref");
        }
      } catch (_) {
      }
    }
    if (!csl) {
      csl = this._resolveFilename(stem);
      sources.push("filename");
    }
    const entry = {
      doi: csl.DOI || null,
      arxiv_id: null,
      csl,
      bbt: bbt || void 0,
      meta_source: sources,
      confidence: sources.includes("bbt") ? 1 : sources.includes("crossref") ? 0.95 : 0.4,
      resolved_at: Date.now(),
      ttl_until: Date.now() + 90 * 864e5
      // 90 天
    };
    this.plugin._writeDocMeta(docId, entry);
    this._emit(docId, entry);
    if (((_c = (_b = settings.metadataResolver) == null ? void 0 : _b.s2) == null ? void 0 : _c.enabled) !== false) {
      this._enrichS2(docId, csl).then((s2) => {
        if (!s2) return;
        const cur = this.plugin._readDocMeta(docId) || entry;
        cur.s2 = s2;
        cur.meta_source = [...cur.meta_source || [], "s2"];
        this.plugin._writeDocMeta(docId, cur);
        this._emit(docId, cur);
      }).catch(() => {
      });
    }
    return entry;
  }
  // ── L1 BBT：在用户的 .bib 索引里查（同步，无网络）──
  _resolveBbt(row, stem) {
    const idx = this.plugin.bbtIndex;
    if (!(idx == null ? void 0 : idx.byFile)) return null;
    const sf = (row._sourceFile || "").toLowerCase();
    const stemLower = (stem || "").toLowerCase().replace(/[_-]+/g, " ").trim();
    let bib = sf ? idx.byFile.get(sf) : null;
    if (!bib) bib = idx.byFile.get(sf.replace(/\.pdf$/i, "") + ".pdf");
    if (!bib && stemLower) {
      for (const [t, e] of idx.byTitle) {
        if (t === stemLower || stemLower.includes(t) && t.length > 8 || t.includes(stemLower) && stemLower.length > 8) {
          bib = e;
          break;
        }
      }
    }
    if (!bib) return null;
    const csl = {
      type: bib.type === "article" ? "article-journal" : bib.type || "article-journal",
      title: (bib.title || "").replace(/[{}]/g, ""),
      author: bibAuthorsToCSL(bib.author),
      issued: bib.year ? { "date-parts": [[Number(bib.year)]] } : null,
      "container-title": (bib.journal || bib.booktitle || "").replace(/[{}]/g, ""),
      volume: bib.volume || "",
      issue: bib.number || bib.issue || "",
      page: bib.pages || "",
      DOI: bib.doi || "",
      URL: bib.url || ""
    };
    return {
      csl,
      bbt: {
        citekey: bib.citekey,
        zotero_key: bib["zotero.key"] || bib["zotero-key"] || ""
      }
    };
  }
  // ── L3 CrossRef title search ──────────────────────
  async _resolveCrossRef(title) {
    var _a, _b, _c, _d, _e, _f;
    if (!title || title.length < 6) return null;
    await this.limiters.crossref.take();
    const q = encodeURIComponent(title.replace(/[_-]+/g, " ").slice(0, 200));
    const url = `https://api.crossref.org/works?query.title=${q}&rows=1&select=DOI,title,author,issued,container-title,volume,issue,page,type,URL`;
    const r = await obsidian5.requestUrl({
      url,
      method: "GET",
      headers: {
        "User-Agent": `PaperSearch/0.2.0 (mailto:${this.plugin.settings.contactEmail || "noreply@paperbell.app"})`
      },
      throw: false
    });
    if (r.status < 200 || r.status >= 300) return null;
    let j;
    try {
      j = (_a = r.json) != null ? _a : JSON.parse(r.text);
    } catch (_) {
      return null;
    }
    const item = (_c = (_b = j.message) == null ? void 0 : _b.items) == null ? void 0 : _c[0];
    if (!item) return null;
    const t = (((_d = item.title) == null ? void 0 : _d[0]) || "").toLowerCase();
    const stem = title.toLowerCase().replace(/[_-]+/g, " ");
    const overlap = t.split(/\s+/).filter((w) => w.length > 3 && stem.includes(w)).length;
    if (overlap < 2) return null;
    return {
      type: item.type || "article-journal",
      title: ((_e = item.title) == null ? void 0 : _e[0]) || "",
      author: item.author || [],
      issued: item.issued || null,
      "container-title": ((_f = item["container-title"]) == null ? void 0 : _f[0]) || "",
      volume: item.volume || "",
      issue: item.issue || "",
      page: item.page || "",
      DOI: item.DOI || "",
      URL: item.URL || ""
    };
  }
  // ── L6 文件名兜底：Liu_Yang_2012_Water-Crisis ────
  _resolveFilename(stem) {
    const parts = (stem || "").split(/[_\s-]+/).filter(Boolean);
    const yIdx = parts.findIndex((p) => /^(19|20)\d{2}$/.test(p));
    const author = yIdx > 0 ? parts.slice(0, yIdx) : [];
    const year = yIdx >= 0 ? parts[yIdx] : "";
    const tailWords = yIdx >= 0 ? parts.slice(yIdx + 1) : parts;
    return {
      type: "article-journal",
      title: tailWords.join(" "),
      author: author.map((a) => ({ family: a })),
      issued: year ? { "date-parts": [[Number(year)]] } : null
    };
  }
  // ── S2 enrich：先用 DOI（精准），无 DOI 用 title 搜索 ──
  async _enrichS2(docId, csl) {
    var _a, _b, _c, _d, _e, _f, _g;
    const apiKey = ((_b = (_a = this.plugin.settings.metadataResolver) == null ? void 0 : _a.s2) == null ? void 0 : _b.apiKey) || "";
    await this.limiters.s2.take();
    const headers = apiKey ? { "x-api-key": apiKey } : {};
    const fields = "paperId,citationCount,influentialCitationCount,tldr,externalIds,references.title,references.year,references.externalIds";
    let url;
    if (csl.DOI) {
      url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(csl.DOI)}?fields=${fields}`;
    } else if (csl.title) {
      url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(csl.title.slice(0, 150))}&limit=1&fields=${fields}`;
    } else {
      return null;
    }
    const r = await obsidian5.requestUrl({ url, method: "GET", headers, throw: false });
    if (r.status < 200 || r.status >= 300) return null;
    let j;
    try {
      j = (_c = r.json) != null ? _c : JSON.parse(r.text);
    } catch (_) {
      return null;
    }
    const p = ((_d = j.data) == null ? void 0 : _d[0]) || j;
    if (!(p == null ? void 0 : p.paperId)) return null;
    return {
      paperId: p.paperId,
      citationCount: (_e = p.citationCount) != null ? _e : 0,
      influentialCitationCount: (_f = p.influentialCitationCount) != null ? _f : 0,
      tldr: ((_g = p.tldr) == null ? void 0 : _g.text) || "",
      references: (p.references || []).slice(0, 50).map((r2) => {
        var _a2;
        return {
          title: r2.title || "",
          year: r2.year || null,
          doi: ((_a2 = r2.externalIds) == null ? void 0 : _a2.DOI) || ""
        };
      }),
      s2_resolved_at: Date.now()
    };
  }
  // 事件总线：UI 订阅 'paperbell:meta-updated' 拿 docId + entry
  _emit(docId, entry) {
    window.dispatchEvent(new CustomEvent("paperbell:meta-updated", {
      detail: { docId, entry }
    }));
  }
  // 批量解析（搜索后 prefetch 顶部 N 篇 unique doc）
  async resolveBatch(rows, opts = {}) {
    if (!(rows == null ? void 0 : rows.length)) return;
    const seen = /* @__PURE__ */ new Set();
    const uniques = [];
    for (const r of rows) {
      const id = r._docId || r._sourceFile;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      uniques.push(r);
    }
    const N = 4;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(N, uniques.length) }, async () => {
      var _a;
      while (cursor < uniques.length) {
        const i = cursor++;
        if ((_a = opts.signal) == null ? void 0 : _a.aborted) return;
        try {
          await this.resolve(uniques[i]);
        } catch (_) {
        }
      }
    });
    await Promise.all(workers);
  }
};

// src/settings-tab.ts
var obsidian8 = __toESM(require("obsidian"));
var nodeFs2 = __toESM(require("fs"));
var nodePath3 = __toESM(require("path"));

// src/ui/confirm-modal.ts
var obsidian6 = __toESM(require("obsidian"));
var ConfirmModal = class extends obsidian6.Modal {
  constructor(app, { title, message, confirmText, cancelText, danger, checkboxLabel, onConfirm }) {
    super(app);
    this.opts = { title, message, confirmText, cancelText, danger, checkboxLabel, onConfirm };
    this._confirmed = false;
    this._checked = false;
  }
  onOpen() {
    const { contentEl, titleEl } = this;
    const o = this.opts;
    titleEl == null ? void 0 : titleEl.setText(o.title || "请确认");
    const msg = contentEl.createDiv({ cls: "pb-confirm-msg" });
    String(o.message || "").split("\n").forEach((line) => {
      msg.createDiv({ text: line });
    });
    if (o.checkboxLabel) {
      const ck = contentEl.createDiv({ cls: "pb-confirm-check" });
      const cb = ck.createEl("input", { type: "checkbox" });
      cb.id = "pb-confirm-cb";
      cb.onchange = () => {
        this._checked = cb.checked;
      };
      ck.createEl("label", { text: o.checkboxLabel, attr: { for: "pb-confirm-cb" } });
    }
    const nav = contentEl.createDiv({ cls: "pb-confirm-nav" });
    const cancel = nav.createEl("button", { text: o.cancelText || "取消" });
    cancel.onclick = () => this.close();
    const ok = nav.createEl("button", { text: o.confirmText || "确定" });
    ok.classList.add(o.danger ? "mod-warning" : "mod-cta");
    ok.onclick = () => {
      this._confirmed = true;
      this.close();
    };
    setTimeout(() => ok.focus(), 30);
  }
  onClose() {
    var _a, _b;
    this.contentEl.empty();
    (_b = (_a = this.opts).onConfirm) == null ? void 0 : _b.call(_a, this._confirmed, this._checked);
  }
};
function pbConfirm(app, opts) {
  return new Promise((resolve) => {
    new ConfirmModal(app, { ...opts, onConfirm: resolve }).open();
  });
}

// src/ui/onboarding-wizard.ts
var obsidian7 = __toESM(require("obsidian"));
var OnboardingWizard = class extends obsidian7.Modal {
  constructor(app, plugin, onDone) {
    super(app);
    this.plugin = plugin;
    this.onDone = onDone;
    this.step = 0;
  }
  onOpen() {
    this.modalEl.addClass("pb-onboarding");
    this.modalEl.style.maxWidth = "560px";
    this._render();
  }
  async onClose() {
    var _a, _b;
    this.contentEl.empty();
    if ((_b = (_a = this.plugin.coreManager) == null ? void 0 : _a.isInstalled) == null ? void 0 : _b.call(_a)) {
      if (!this.plugin.settings.onboardingDone) {
        this.plugin.settings.onboardingDone = true;
        await this.plugin.saveSettings();
      }
    } else {
      this.plugin._coreSetupDismissed = true;
    }
  }
  _render() {
    const { contentEl } = this;
    contentEl.empty();
    const STEPS = [
      () => this._stepWelcome(contentEl),
      () => this._stepLLM(contentEl),
      () => this._stepCore(contentEl),
      () => this._stepLibrary(contentEl),
      () => this._stepDone(contentEl)
    ];
    const dots = contentEl.createDiv({ cls: "pb-onb-dots" });
    for (let i = 0; i < STEPS.length; i++) {
      const d = dots.createSpan({ cls: "pb-onb-dot" + (i === this.step ? " active" : i < this.step ? " done" : "") });
    }
    STEPS[this.step]();
  }
  _stepWelcome(el) {
    el.createEl("h2", { text: "PaperSearch：在 Obsidian 中搜索、阅读和引用本地文献" });
    el.createEl("p", { text: "连接 PDF 文件夹或 Zotero 后，你可以：" });
    const ul = el.createEl("ul", { cls: "pb-onb-points" });
    ul.createEl("li", { text: "用自然语言提出研究问题，找到相关论文和可回查的原文片段；" });
    ul.createEl("li", { text: "在 Obsidian 里直接阅读、划词、彩色标注这些 PDF；" });
    ul.createEl("li", { text: "插入引用键、原文摘录或带出处的 AI 转述，写作时不用离开 Obsidian。" });
    el.createEl("p", {
      cls: "pb-onb-hint",
      text: "例如：问「这些文献对样本量的主流做法是什么」，PaperSearch 会列出相关论文和可回查的原文片段，并可据此生成综述草稿。"
    });
    const re = el.createDiv({ cls: "pb-onb-reassure" });
    re.createEl("div", { text: "PDF、笔记和本地索引默认保存在本机。启用 AI 或联网补全时，只发送完成当前任务所需的文本或书目信息；可在设置中查看和关闭。" });
    re.createEl("div", { text: "· AI 费用由你在 PaperBell 中配置的服务商按其规则收取。" });
    el.createEl("p", {
      cls: "pb-onb-hint",
      text: "接下来两步：① 连接 PaperBell AI（可稍后）；② 安装本地服务（约 1.6 GB）。"
    });
    const btn = el.createEl("button", { text: "开始配置 →" });
    btn.classList.add("mod-cta");
    btn.onclick = () => {
      this.step = 1;
      this._render();
    };
  }
  _stepLLM(el) {
    el.createEl("h2", { text: "连接 PaperBell AI" });
    el.createEl("p", {
      cls: "pb-onb-hint",
      text: "AI 功能沿用 PaperBell 中已配置的服务和模型。调用时，PaperSearch 会把当前任务所需的文本发送到你配置的 AI 服务。未连接时，综述、改写、翻译和 AI 证据核查等功能暂不可用。"
    });
    const status = el.createDiv({
      cls: "pb-onb-status",
      text: "点击下方按钮检查 PaperBell AI 是否已配置并可用。"
    });
    const nav = el.createDiv({ cls: "pb-onb-nav" });
    const back = nav.createEl("button", { text: "← 上一步" });
    back.onclick = () => {
      this.step = 0;
      this._render();
    };
    const next = nav.createEl("button", { text: "检查并连接 →" });
    next.classList.add("mod-cta");
    next.onclick = async () => {
      next.disabled = true;
      next.textContent = "检查中…";
      try {
        const cfg = await this.plugin._requestPaperbellLLMCredentials();
        if (!(cfg == null ? void 0 : cfg.apiKey) || !(cfg == null ? void 0 : cfg.model)) {
          throw new Error("请先在 PaperBell 中完成 AI 提供方、模型和密钥配置");
        }
        status.textContent = `已连接 PaperBell AI：${cfg.model}`;
        this.step = 2;
        this._render();
      } catch (e) {
        new obsidian7.Notice(`PaperBell AI 未就绪：${e.message}`, 8e3);
        status.textContent = `未就绪：${e.message}`;
      } finally {
        next.disabled = false;
        next.textContent = "检查并连接 →";
      }
    };
    const skip = nav.createEl("button", { text: "稍后连接 PaperBell AI" });
    skip.onclick = () => {
      this.step = 2;
      this._render();
    };
  }
  _stepCore(el) {
    el.createEl("h2", { text: "安装本地服务（约 1.6 GB）" });
    el.createEl("p", { cls: "pb-onb-hint", text: "本地服务用于搜索文献、解析 PDF 和建立索引；其中包含离线语义模型，因此安装包较大。关闭 Obsidian 时组件会自动停止。" });
    const cm = this.plugin.coreManager;
    if (cm.isInstalled()) {
      el.createEl("div", { cls: "pb-onb-status", text: "本地服务已安装，无需重复下载" });
      const nav2 = el.createDiv({ cls: "pb-onb-nav" });
      nav2.createEl("button", { text: "下一步 →" }).onclick = async () => {
        this.step = 3;
        this._render();
      };
      return;
    }
    const status = el.createEl("div", { cls: "pb-onb-status", text: "点击下方按钮开始下载" });
    const bar = el.createDiv({ cls: "pb-onb-bar" });
    const fill = bar.createDiv({ cls: "pb-onb-bar-fill" });
    const pct = el.createDiv({ cls: "pb-onb-pct", text: "0%" });
    const nav = el.createDiv({ cls: "pb-onb-nav" });
    const back = nav.createEl("button", { text: "← 上一步" });
    back.onclick = () => {
      this.step = 1;
      this._render();
    };
    const skip = nav.createEl("button", { text: "稍后安装" });
    skip.onclick = () => {
      this.step = 3;
      this._render();
    };
    const dl = nav.createEl("button", { text: "开始下载" });
    dl.classList.add("mod-cta");
    dl.onclick = async () => {
      dl.disabled = true;
      fill.style.width = "0%";
      pct.style.color = "";
      pct.style.whiteSpace = "";
      pct.textContent = "0%";
      status.textContent = "检查下载链接…";
      const onProg = (got, total, progress) => {
        const p = progress || pbDownloadProgress(got, total);
        if (typeof p.percent === "number") fill.style.width = p.percent + "%";
        pct.textContent = p.text;
        status.textContent = p.text;
      };
      try {
        const devUrl = (this.plugin.settings.coreDownloadUrl || "").trim();
        if (devUrl) {
          dl.textContent = "下载中…";
          status.textContent = "准备下载…";
          await cm.download(devUrl, this.plugin.settings.coreDownloadSha256, onProg);
        } else {
          dl.textContent = this.plugin.hasValidActivation() ? "准备下载…" : "检查 PaperBell 授权…";
          status.textContent = dl.textContent;
          const offStatus = cm.onStatus((s, detail) => {
            if (s === "downloading" && detail) status.textContent = detail;
          });
          try {
            await this.plugin._downloadCoreAuthorized((got, total, progress) => {
              dl.textContent = "下载中…";
              onProg(got, total, progress);
            });
          } finally {
            offStatus == null ? void 0 : offStatus();
          }
        }
        fill.style.width = "100%";
        pct.textContent = "下载完成，正在启动…";
        status.textContent = "下载完成，正在启动…";
        new obsidian7.Notice("本地服务安装完成");
        this.step = 3;
        this._render();
      } catch (e) {
        new obsidian7.Notice(`下载失败：${e.message}`, 1e4);
        pct.textContent = `失败：${e.message}`;
        pct.style.color = "var(--text-error, #e5534b)";
        pct.style.whiteSpace = "normal";
        status.textContent = `失败：${e.message}`;
        dl.disabled = false;
        dl.textContent = "重试下载";
      }
    };
    const imp = nav.createEl("button", { text: "从本地安装包导入" });
    imp.onclick = () => {
      this.plugin._importCoreZip(() => {
        this.step = 3;
        this._render();
      });
    };
  }
  _stepLibrary(el) {
    el.createEl("h2", { text: "建立你的文献库" });
    el.createEl("p", { cls: "pb-onb-hint", text: "选择 PDF 文件夹或连接 Zotero，建立索引后即可搜索、阅读和引用。下面每一步点「前往」会高亮对应位置。" });
    const list = el.createDiv({ cls: "pb-onb-guide" });
    const mk = (n, title, desc, onGo) => {
      const row = list.createDiv({ cls: "pb-onb-guide-row" });
      row.createSpan({ cls: "pb-onb-guide-num", text: String(n) });
      const m = row.createDiv({ cls: "pb-onb-guide-main" });
      m.createDiv({ cls: "pb-onb-guide-title", text: title });
      m.createDiv({ cls: "pb-onb-guide-desc", text: desc });
      if (onGo) {
        const go2 = m.createEl("button", { cls: "pb-onb-guide-go", text: "前往 →" });
        go2.onclick = onGo;
      }
      return m;
    };
    mk(
      1,
      "PaperSearch 面板",
      "搜索文献、查看结果和生成综述草稿都在这里。",
      async () => {
        await this.plugin.activateView();
        setTimeout(() => this.plugin._spotlight(".pb-search-input", "这里输入研究问题或关键词。建好文献库后，搜索结果会显示在下方。"), 400);
      }
    );
    mk(
      2,
      "连接 Zotero 或选择 PDF 文件夹",
      "在面板顶部进入「文献库管理」并新建文献库。使用 Zotero 时可自动匹配附件和引用键；也可以选择任意 PDF 文件夹。",
      () => this.plugin._guideCreateLibrary()
    );
    mk(3, "阅读、标注与引用", "找到论文后可保存到本地，在 PDF 中选中文本并分类标注；连接 .bib 后可插入引用键，由你的导出工具生成参考文献表。", null);
    const nav = el.createDiv({ cls: "pb-onb-nav" });
    nav.createEl("button", { text: "← 上一步" }).onclick = () => {
      this.step = 2;
      this._render();
    };
    const go = nav.createEl("button", { text: "创建第一个文献库 →" });
    go.classList.add("mod-cta");
    go.onclick = async () => {
      var _a;
      this._persistDraft();
      this.plugin.settings.onboardingDone = true;
      await this.plugin.saveSettings();
      this.close();
      (_a = this.onDone) == null ? void 0 : _a.call(this);
      this.plugin._guideCreateLibrary();
    };
    const later = nav.createEl("button", { text: "稍后创建" });
    later.onclick = () => {
      this.step = 4;
      this._render();
    };
  }
  _persistDraft() {
  }
  _stepDone(el) {
    el.createEl("h2", { text: "准备就绪" });
    el.createEl("p", { text: "基础设置已完成。你现在可以创建文献库，或先打开 PaperSearch 面板。" });
    const btn = el.createEl("button", { text: "打开 PaperSearch 面板" });
    btn.classList.add("mod-cta");
    btn.onclick = async () => {
      var _a;
      this._persistDraft();
      this.plugin.settings.onboardingDone = true;
      await this.plugin.saveSettings();
      this.close();
      (_a = this.onDone) == null ? void 0 : _a.call(this);
    };
  }
};

// src/settings-tab.ts
var PaperSearchSettingTab = class extends obsidian8.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("pb-settings");
    const renderToken = this._renderToken = (this._renderToken || 0) + 1;
    this._isStale = () => this._renderToken !== renderToken;
    const TABS = [
      { key: "start", label: "开始与状态" },
      { key: "sources", label: "文献库与 Zotero" },
      { key: "reading", label: "搜索与阅读" },
      { key: "network", label: "AI、联网与隐私" },
      { key: "cite", label: "引用与写作" },
      { key: "support", label: "存储、故障排查与高级" }
    ];
    const tabBar = containerEl.createDiv({ cls: "pb-st-tabs" });
    tabBar.setAttribute("role", "tablist");
    const content = containerEl.createDiv({ cls: "pb-st-content" });
    const renderers = {
      start: (el) => this._secStatus(el),
      sources: (el) => this._secSources(el),
      reading: (el) => this._secSearchReading(el),
      network: (el) => this._secAiNetworkPrivacy(el),
      cite: (el) => this._secCiteWrite(el),
      support: (el) => this._secSupport(el)
    };
    const visibleKeys = TABS.map((t) => t.key);
    const activeKey = this._activeTab && visibleKeys.includes(this._activeTab) ? this._activeTab : "start";
    this._activeTab = activeKey;
    TABS.forEach((t) => {
      const btn = tabBar.createEl("button", {
        cls: "pb-st-tab" + (t.key === activeKey ? " active" : ""),
        text: t.label,
        attr: { type: "button" }
      });
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", t.key === activeKey ? "true" : "false");
      btn.onclick = () => {
        if (this._activeTab === t.key) return;
        this._activeTab = t.key;
        this.display();
      };
    });
    content.empty();
    renderers[activeKey](content);
  }
  _secStatus(el) {
    this._secStart(el, false);
    el.createEl("hr", { cls: "pb-settings-divider" });
    el.createEl("h3", { text: "界面与引导" });
    this._secGeneral(el);
  }
  _secSearchReading(el) {
    el.createEl("p", {
      cls: "setting-item-description",
      text: "返回篇数、候选范围等参数可在检索页每次检索前直接调整；这里设置默认值。"
    });
    new obsidian8.Setting(el).setName("默认检索深度").setDesc("快速适合探索，平衡适合日常研究，深度适合系统综述或反例查找。").addDropdown((d) => d.addOptions({ quick: "快速", balanced: "平衡（推荐）", deep: "深度" }).setValue(this.plugin.settings.searchMode || "balanced").onChange(async (v) => {
      this.plugin.settings.searchMode = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("默认检索意图").setDesc("用于帮助系统理解你是在找支持、反例、方法还是定义，不会替代你输入的研究问题。").addDropdown((d) => d.addOptions({ support: "找支持", contrast: "找反例", method: "找方法", definition: "找定义" }).setValue(this.plugin.settings.searchIntent || "support").onChange(async (v) => {
      this.plugin.settings.searchIntent = v;
      await this.plugin.saveSettings();
    }));
    el.createEl("hr", { cls: "pb-settings-divider" });
    this._secReading(el);
  }
  _secAiNetworkPrivacy(el) {
    el.createEl("p", {
      cls: "setting-item-description",
      text: "PDF、笔记和索引默认保存在本机。检索页可分别开关「优化检索词」和「相关性说明」；联网元数据补全默认开启并在检索后自动运行，可在本页关闭。"
    });
    new obsidian8.Setting(el).setName("PaperBell AI 连接状态").setDesc("PaperSearch 沿用 PaperBell 中已配置的 AI 服务和模型，不再保存第二份密钥。").addButton((btn) => btn.setButtonText("检查 AI 连接").setCta().onClick(async () => {
      var _a, _b;
      btn.setDisabled(true);
      try {
        const cfg = await ((_b = (_a = this.plugin)._requestPaperbellLLMCredentials) == null ? void 0 : _b.call(_a));
        new obsidian8.Notice((cfg == null ? void 0 : cfg.apiKey) && (cfg == null ? void 0 : cfg.model) ? "PaperBell AI 连接正常" : "PaperBell AI 尚未配置");
      } catch (e) {
        new obsidian8.Notice(`检查失败：${(e == null ? void 0 : e.message) || e}`);
      } finally {
        btn.setDisabled(false);
      }
    })).addButton((btn) => btn.setButtonText("打开 PaperBell").onClick(() => {
      var _a, _b;
      return (_b = (_a = this.plugin)._openPaperbellSettings) == null ? void 0 : _b.call(_a, "ai");
    }));
    const privacy = el.createEl("details", { cls: "pb-settings-details" });
    privacy.createEl("summary", { text: "查看各功能的数据流" });
    const list = privacy.createEl("ul", { cls: "pb-set-intro" });
    list.createEl("li", { text: "本地：PDF 缓存、文献笔记，以及文献、标注、引用和论断来源记录。" });
    list.createEl("li", { text: "AI：优化检索词、生成相关性说明或综述草稿、改写、翻译、使用 AI 核查原文对论断的支持情况时，会发送完成当前任务所需的研究问题和原文片段；使用 AI 辅助建库时可能发送论文全文，具体以建库方案说明为准。" });
    list.createEl("li", { text: "联网解析：元数据补全默认开启，检索后自动向公开数据库发送 DOI、标题或作者；可在下方关闭。" });
    list.createEl("li", { text: "Zotero：按你绑定的本地 storage 与 Better BibTeX .bib 读取附件和书目信息。" });
    el.createEl("hr", { cls: "pb-settings-divider" });
    this._secMetadataNetwork(el);
  }
  _secSupport(el) {
    var _a, _b;
    new obsidian8.Setting(el).setName("PaperSearch 运行状态").setDesc(`当前：${((_a = this.plugin.coreManager) == null ? void 0 : _a.statusDetail) || ((_b = this.plugin.coreManager) == null ? void 0 : _b.status) || "未知"} · ${this.plugin.settings.backendUrl || "http://127.0.0.1:8000"}`).addButton((btn) => btn.setButtonText("测试连接").setCta().onClick(async () => {
      btn.setDisabled(true);
      try {
        await this.plugin.api.get("/health");
        new obsidian8.Notice("PaperSearch 本地服务连接正常");
      } catch (e) {
        new obsidian8.Notice(`连接失败：${(e == null ? void 0 : e.message) || e}`, 8e3);
      } finally {
        btn.setDisabled(false);
      }
    }));
    el.createEl("hr", { cls: "pb-settings-divider" });
    this._secStorage(el);
    const advanced = el.createEl("details", { cls: "pb-settings-details pb-settings-advanced" });
    advanced.createEl("summary", { text: "故障排查与高级参数" });
    const body = advanced.createDiv({ cls: "pb-settings-details-body" });
    body.createEl("p", {
      cls: "setting-item-description",
      text: "这里的参数会影响本地服务连接、超时、缓存与实验功能。除非正在排障，建议保留默认值。"
    });
    this._secAdvanced(body);
  }
  // ── Tab: 开始使用（AI 服务 + 本地服务）────────────────
  _secStart(el, showAI = true) {
    el.createEl("p", {
      cls: "setting-item-description",
      text: "PaperSearch 用于在 Obsidian 中检索、阅读和标注文献，并在写作时保留可追溯的来源。"
    });
    const intro = el.createEl("ul", { cls: "pb-set-intro" });
    intro.createEl("li", { text: "直接输入研究问题，找到相关论文和可回查的原文片段；" });
    intro.createEl("li", { text: "直接在 Obsidian 里阅读、划词、彩色标注这些 PDF；" });
    intro.createEl("li", { text: "写作时插入带出处的引用、原文摘录或 AI 转述，不用离开 Obsidian。" });
    el.createEl("p", {
      cls: "setting-item-description",
      text: "PDF、笔记和本地索引默认保存在本机。「平衡 / 深度」检索会使用 AI；联网元数据补全默认开启。AI 辅助建库可能发送论文全文。"
    });
    if (showAI) new obsidian8.Setting(el).setName("PaperBell AI").setDesc("AI 提供方、模型和密钥都在 PaperBell 中统一配置；PaperSearch 请求授权读取这些配置，不再二次填写。").addButton((btn) => btn.setButtonText("检查 PaperBell AI 连接").setCta().onClick(async () => {
      btn.setDisabled(true);
      btn.setButtonText("检查中…");
      try {
        const cfg = await this.plugin._requestPaperbellLLMCredentials();
        if (!(cfg == null ? void 0 : cfg.apiKey) || !(cfg == null ? void 0 : cfg.model)) {
          throw new Error("请先在 PaperBell 中完成 AI 提供方、模型和密钥配置");
        }
        new obsidian8.Notice(`PaperBell AI 已就绪：${cfg.providerName || cfg.model} / ${cfg.model}`);
      } catch (e) {
        new obsidian8.Notice(`PaperBell AI 未就绪：${e.message}`, 8e3);
      } finally {
        btn.setDisabled(false);
        btn.setButtonText("检查 PaperBell AI 连接");
      }
    })).addButton((btn) => btn.setButtonText("打开 PaperBell AI 设置").onClick(() => this.plugin._openPaperbellSettings("ai")));
    el.createEl("h4", { text: "本地服务" });
    el.createEl("p", {
      text: "PaperSearch 在本机完成文献检索、PDF 解析和索引。首次使用可在配置向导中下载，也可在此安装、更新或重启。开发版可在高级设置中指定源码目录。",
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("PaperBell 账号").setDesc(this.plugin.hasValidActivation() ? "已授权，可下载本地服务。" : "下载本地服务前，需先在 PaperBell 中完成账号授权。").addButton((btn) => btn.setButtonText("检查下载权限").onClick(async () => {
      btn.setDisabled(true);
      btn.setButtonText("检查中…");
      try {
        const info = await this.plugin._requestPaperbellActivationInfo();
        if (!(info == null ? void 0 : info.isActive)) throw new Error("PaperBell 账号尚未授权或授权已失效");
        new obsidian8.Notice("PaperBell 授权已就绪 ✓");
        this.display();
      } catch (e) {
        new obsidian8.Notice(`PaperBell 授权未就绪：${e.message}`, 8e3);
      } finally {
        btn.setDisabled(false);
        btn.setButtonText("检查下载权限");
      }
    }));
    new obsidian8.Setting(el).setName("启动 / 重启").setDesc("按当前配置立即启动；以后每次打开 Obsidian 会自动启动。").addButton((btn) => btn.setButtonText("启动或重启").setCta().onClick(async () => {
      const cm = this.plugin.coreManager;
      if (!cm._canLaunch()) {
        new obsidian8.Notice("没有可启动的本地服务。请先导入安装包；开发版请在高级设置中指定源码目录。", 9e3);
        return;
      }
      btn.setButtonText("启动中…");
      btn.setDisabled(true);
      try {
        await cm.kill();
        await this.plugin._bootCoreThenViews();
        if (cm.status === "healthy") new obsidian8.Notice("本地服务已就绪");
        else new obsidian8.Notice(`本地服务未就绪：${cm.statusDetail || cm.status}`, 8e3);
      } catch (e) {
        new obsidian8.Notice(`启动失败：${e.message}`);
      } finally {
        btn.setButtonText("启动或重启");
        btn.setDisabled(false);
      }
    }));
    new obsidian8.Setting(el).setName("从本地安装").setDesc("已经下载好安装包时，选择 zip 文件直接导入，无需联网；导入后自动启动。").addButton((btn) => btn.setButtonText("选择 zip 文件…").onClick(() => this.plugin._importCoreZip(async () => {
      this.plugin.coreManager._restartAttempts = 0;
      await this.plugin._bootCoreThenViews();
      this.display();
    })));
    let downloadProgressBox = null;
    let downloadProgressFill = null;
    let downloadProgressText = null;
    const showDownloadProgress = (text, percent) => {
      if (!downloadProgressBox || !downloadProgressFill || !downloadProgressText) return;
      downloadProgressBox.style.display = "";
      if (typeof percent === "number") downloadProgressFill.style.width = `${percent}%`;
      downloadProgressText.textContent = text;
    };
    const resetDownloadProgress = () => {
      if (!downloadProgressBox || !downloadProgressFill || !downloadProgressText) return;
      downloadProgressBox.style.display = "none";
      downloadProgressFill.style.width = "0%";
      downloadProgressText.textContent = "0%";
      downloadProgressText.style.color = "";
      downloadProgressText.style.whiteSpace = "";
    };
    new obsidian8.Setting(el).setName("安装 / 更新").setDesc("从 PaperBell 下载最新版本；已是最新时会先提示你。").addButton((btn) => {
      const label = this.plugin.coreManager.isInstalled() ? "检查并更新" : "下载";
      btn.setButtonText(label).setCta().onClick(async () => {
        const cm = this.plugin.coreManager;
        btn.setDisabled(true).setButtonText("检查下载链接…");
        resetDownloadProgress();
        showDownloadProgress("检查下载链接…", 0);
        let offStatus = null;
        try {
          offStatus = cm.onStatus((s, detail) => {
            if (s === "downloading" && detail) showDownloadProgress(detail);
          });
          const ticket = await this.plugin._fetchCoreDownloadTicket();
          const same = this.plugin._isInstalledCoreCurrent(ticket);
          const ticketLabel = this.plugin._coreTicketLabel(ticket);
          showDownloadProgress(`准备下载：${ticketLabel}`, 0);
          if (same) {
            const reinstall = await pbConfirm(this.app, {
              title: "已是最新版本",
              message: `当前已安装 ${ticketLabel}。
是否仍然重新下载并覆盖安装？`,
              confirmText: "重新下载",
              cancelText: "取消"
            });
            if (!reinstall) {
              showDownloadProgress("当前已是最新版本", 100);
              new obsidian8.Notice("当前已是最新版本");
              return;
            }
          }
          const wasUp = cm.status === "healthy" || !!cm.proc;
          if (wasUp) {
            btn.setButtonText("停止旧版本…");
            showDownloadProgress("正在停止旧版本…", 0);
            try {
              await cm.kill();
            } catch (_) {
            }
          }
          btn.setButtonText("下载中…");
          await this.plugin._downloadCoreAuthorized((got, total, progress) => {
            const p = progress || pbDownloadProgress(got, total);
            showDownloadProgress(p.text, typeof p.percent === "number" ? p.percent : void 0);
            if (typeof p.percent === "number") {
              btn.setButtonText(`下载中 ${p.percent}%`);
            } else {
              btn.setButtonText(`下载中 ${pbFormatMb(got)}`);
            }
          }, ticket);
          showDownloadProgress("下载完成，正在启动…", 100);
          new obsidian8.Notice(`本地服务已安装：${ticketLabel}`);
          cm._restartAttempts = 0;
          await this.plugin._bootCoreThenViews();
          this.display();
        } catch (e) {
          new obsidian8.Notice(`下载 / 更新失败：${e.message}`, 1e4);
          showDownloadProgress(`失败：${e.message}`);
          if (downloadProgressText) {
            downloadProgressText.style.color = "var(--text-error, #e5534b)";
            downloadProgressText.style.whiteSpace = "normal";
          }
        } finally {
          offStatus == null ? void 0 : offStatus();
          btn.setDisabled(false).setButtonText(label);
        }
      });
    });
    downloadProgressBox = el.createDiv({ cls: "pb-core-download-progress" });
    downloadProgressBox.style.display = "none";
    const downloadProgressBar = downloadProgressBox.createDiv({ cls: "pb-onb-bar" });
    downloadProgressFill = downloadProgressBar.createDiv({ cls: "pb-onb-bar-fill" });
    downloadProgressText = downloadProgressBox.createDiv({ cls: "pb-onb-pct", text: "0%" });
  }
  // ── Tab: 文献来源（Zotero 检测 + 手动路径绑定）───────────
  async _secSources(el) {
    var _a, _b, _c, _d;
    el.createEl("p", {
      text: "把本地 PDF 文件夹或 Zotero 库绑定到 PaperSearch 文献库；启用自动监听后，新文献会被检测并提示你增量加入。",
      cls: "setting-item-description"
    });
    let libs = [];
    try {
      const d = await this.plugin.api.get("/libraries");
      libs = (_a = d.libraries) != null ? _a : [];
    } catch (_) {
    }
    if ((_b = this._isStale) == null ? void 0 : _b.call(this)) return;
    el.createEl("h4", { text: "Zotero 自动接入" });
    const zoteroBox = el.createDiv({ cls: "pb-st-effective" });
    const zPath = this.plugin._detectZoteroSync();
    if (zPath) {
      zoteroBox.createEl("div", { text: `已检测到 Zotero：${zPath}`, cls: "pb-st-effective-row" });
      const already = ((_c = this.plugin.settings.libSources) != null ? _c : []).some((s) => s.source === "zotero" && s.path === zPath);
      if (already) {
        zoteroBox.createEl("div", { text: "已绑定到下方列表中", cls: "pb-st-effective-hint" });
      } else {
        new obsidian8.Setting(el).setName("一键绑定 Zotero").setDesc("把 Zotero storage 路径加入下方监听列表，关联到一个 PaperSearch 文献库").addDropdown((d) => {
          this._zoteroPickLib = libs[0] || "default";
          (libs.length ? libs : ["default"]).forEach((name) => d.addOption(name, name));
          d.setValue(this._zoteroPickLib);
          d.onChange((v) => {
            this._zoteroPickLib = v;
          });
        }).addButton((b) => b.setButtonText("绑定").setCta().onClick(async () => {
          var _a2;
          this.plugin.settings.libSources = [
            ...(_a2 = this.plugin.settings.libSources) != null ? _a2 : [],
            {
              libraryName: this._zoteroPickLib || "default",
              path: zPath,
              autoWatch: true,
              source: "zotero"
            }
          ];
          await this.plugin.saveSettings();
          this.plugin._bootSourceWatchers();
          new obsidian8.Notice("Zotero 已绑定，监听已启动");
          this.display();
        }));
      }
    } else {
      zoteroBox.createEl("div", { text: "未检测到 Zotero（默认路径 ~/Zotero/storage 不存在）", cls: "pb-st-effective-hint" });
      zoteroBox.createEl("div", { text: "如果你的 Zotero 库在自定义路径，请用下方「添加手动路径」绑定", cls: "pb-st-effective-hint" });
    }
    el.createEl("h4", { text: "已绑定数据源" });
    const list = el.createDiv({ cls: "pb-ds-list" });
    const renderRow = (src, idx) => {
      const row = list.createDiv({ cls: "pb-ds-row" });
      const tag = row.createSpan({ cls: "pb-ds-tag", text: src.source === "zotero" ? "Z" : "夹" });
      tag.style.cssText = `display:inline-block;min-width:22px;padding:1px 6px;border-radius:3px;margin-right:6px;background:${src.source === "zotero" ? "color-mix(in srgb, var(--interactive-accent) 18%, transparent)" : "var(--background-modifier-border)"};font-size:10px;text-align:center;`;
      const info = row.createDiv({ cls: "pb-ds-info" });
      info.style.cssText = "flex:1;min-width:0;";
      info.createDiv({ text: src.path, cls: "pb-ds-path" }).style.cssText = "font-size:11px;color:var(--text-normal);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
      info.createDiv({ text: `→ ${src.libraryName}`, cls: "pb-ds-lib" }).style.cssText = "font-size:10px;color:var(--text-muted);";
      const libSel = row.createEl("select");
      libSel.style.cssText = "font-size:10px;margin:0 6px;";
      (libs.length ? libs : [src.libraryName]).forEach((name) => {
        const o = libSel.createEl("option", { text: name, value: name });
        if (name === src.libraryName) o.selected = true;
      });
      libSel.onchange = async () => {
        this.plugin.settings.libSources[idx].libraryName = libSel.value;
        await this.plugin.saveSettings();
        this.plugin._bootSourceWatchers();
      };
      const tg = row.createEl("label", { cls: "pb-ds-auto" });
      tg.style.cssText = "display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--text-muted);";
      const cb = tg.createEl("input", { type: "checkbox" });
      cb.checked = !!src.autoWatch;
      tg.createSpan({ text: "自动" });
      cb.onchange = async () => {
        this.plugin.settings.libSources[idx].autoWatch = cb.checked;
        await this.plugin.saveSettings();
        this.plugin._bootSourceWatchers();
      };
      const del = row.createEl("div", { cls: "pb-ds-del", text: "✕" });
      del.style.cssText = "cursor:pointer;color:var(--text-faint);padding:0 6px;";
      del.onclick = async () => {
        this.plugin.settings.libSources.splice(idx, 1);
        await this.plugin.saveSettings();
        this.plugin._bootSourceWatchers();
        this.display();
      };
      row.style.cssText = "display:flex;align-items:center;gap:4px;padding:6px 0;border-bottom:1px solid var(--background-modifier-border);";
    };
    const sources = (_d = this.plugin.settings.libSources) != null ? _d : [];
    if (sources.length === 0) {
      list.createEl("div", { text: "（尚未绑定任何路径）", cls: "pb-st-effective-hint" });
    } else {
      sources.forEach((s, i) => renderRow(s, i));
    }
    el.createEl("h4", { text: "添加手动路径" });
    new obsidian8.Setting(el).setName("选择本地 PDF 文件夹").setDesc("该文件夹内的 PDF 会加入下方列表；绑定到哪个文献库可在列表中调整。").addButton((b) => b.setButtonText("选择文件夹…").onClick(async () => {
      var _a2;
      const f = await pbPickFile({ directory: true });
      if (!f) return;
      const dir = pbPickedDirPath(f);
      if (!dir) {
        new obsidian8.Notice("未能获取文件夹路径，请用其他方式");
        return;
      }
      this.plugin.settings.libSources = [
        ...(_a2 = this.plugin.settings.libSources) != null ? _a2 : [],
        { libraryName: libs[0] || "default", path: dir, autoWatch: false, source: "folder" }
      ];
      await this.plugin.saveSettings();
      this.plugin._bootSourceWatchers();
      new obsidian8.Notice(`已添加：${dir}`);
      this.display();
    }));
    const bbtStatBox = el.createDiv({ cls: "pb-st-effective" });
    const renderBbtStat = () => {
      var _a2, _b2;
      bbtStatBox.empty();
      const idx = this.plugin.bbtIndex;
      if (!this.plugin.settings.bbtBibPath) {
        bbtStatBox.createEl("div", { text: "未配置 .bib 路径（可选）", cls: "pb-st-effective-hint" });
        return;
      }
      const n = (_b2 = (_a2 = idx == null ? void 0 : idx.byCitekey) == null ? void 0 : _a2.size) != null ? _b2 : 0;
      bbtStatBox.createEl("div", {
        text: n > 0 ? `已加载 ${n} 条 BBT 条目（含 ${idx.byFile.size} 条带文件路径）` : "文件存在但未解析出条目",
        cls: "pb-st-effective-hint"
      });
    };
    new obsidian8.Setting(el).setName("Zotero 的 .bib 文件路径（可选）").setDesc("若你用 Zotero 的 Better BibTeX 导出了 .bib，填它的完整路径，作为最准确的论文信息来源优先采用；修改后自动跟踪变化。").addText((t) => t.setPlaceholder("例如 D:/zotero/library.bib").setValue(this.plugin.settings.bbtBibPath || "").onChange((v) => {
      this.plugin.settings.bbtBibPath = v.trim();
      clearTimeout(this._bbtPathTimer);
      this._bbtPathTimer = setTimeout(async () => {
        await this.plugin.saveSettings();
        this.plugin._loadBbtBib();
        this.plugin._watchBbtBib();
        renderBbtStat();
      }, 600);
    })).addButton((b) => b.setButtonText("选择…").onClick(async () => {
      const f = await pbPickFile({ accept: ".bib" });
      if (!f) return;
      const bp = pbFilePath(f);
      if (!bp) {
        new obsidian8.Notice("未能获取路径");
        return;
      }
      this.plugin.settings.bbtBibPath = bp;
      await this.plugin.saveSettings();
      this.plugin._loadBbtBib();
      this.plugin._watchBbtBib();
      new obsidian8.Notice(`已设：${bp}`);
      this.display();
    }));
    renderBbtStat();
  }
  _secMetadataNetwork(el) {
    el.createEl("h4", { text: "联网补全文献元数据" });
    el.createEl("p", {
      text: "默认开启：每次检索后自动从公开数据库补全标题、作者、期刊与被引数。请求会发送 DOI、标题或作者，结果缓存在本地；可在下方关闭。",
      cls: "setting-item-description"
    });
    const mr = this.plugin.settings.metadataResolver || DEFAULT_SETTINGS.metadataResolver;
    new obsidian8.Setting(el).setName("允许联网补全文献信息").setDesc("关闭后不再请求公开元数据服务，搜索结果仍可使用本地文件名与已有缓存。").addToggle((t) => t.setValue(mr.enabled !== false).onChange(async (v) => {
      this.plugin.settings.metadataResolver.enabled = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("Semantic Scholar 密钥（可选）").setDesc("提高 Semantic Scholar 的查询速率上限。").addText((t) => {
      var _a;
      t.inputEl.type = "password";
      t.setPlaceholder("留空则使用无密钥速率").setValue(((_a = mr.s2) == null ? void 0 : _a.apiKey) || "").onChange(async (v) => {
        if (!this.plugin.settings.metadataResolver.s2) this.plugin.settings.metadataResolver.s2 = { enabled: true };
        this.plugin.settings.metadataResolver.s2.apiKey = v.trim();
        await this.plugin.saveSettings();
      });
    });
    new obsidian8.Setting(el).setName("公开数据库联系邮箱（可选）").setDesc("Crossref 等服务可用它识别礼貌请求通道。不填也能使用。").addText((t) => t.setPlaceholder("your@email.com").setValue(this.plugin.settings.contactEmail || "").onChange(async (v) => {
      this.plugin.settings.contactEmail = v.trim();
      await this.plugin.saveSettings();
    }));
    const statBox = el.createDiv({ cls: "pb-st-effective" });
    const renderStats = () => {
      statBox.empty();
      const s = this.plugin._docMetaStats();
      const rows = [
        ["已解析文献", `${s.total} 篇`],
        ["含 S2 增强", `${s.enriched} 篇`],
        ["BBT 命中", `${s.sources.bbt || 0} 篇`],
        ["Crossref 命中", `${s.sources.crossref || 0} 篇`],
        ["仅文件名兜底", `${s.sources.filename || 0} 篇`]
      ];
      rows.forEach(([k, v]) => {
        const row = statBox.createDiv({ cls: "pb-st-effective-row" });
        row.createSpan({ text: k, cls: "pb-st-effective-k" });
        row.createSpan({ text: v, cls: "pb-st-effective-v" });
      });
    };
    renderStats();
    new obsidian8.Setting(el).setName("清空元数据缓存").setDesc("清除后，下次搜索会重新解析。").addButton((b) => b.setButtonText("清空").setWarning().onClick(async () => {
      const ok = await pbConfirm(this.plugin.app, {
        title: "清空元数据缓存",
        message: "确定清空所有元数据缓存？\n下次搜索会重新解析。",
        confirmText: "清空",
        danger: true
      });
      if (!ok) return;
      this.plugin._clearDocMetaCache();
      renderStats();
      new obsidian8.Notice("已清空元数据缓存");
    }));
  }
  // ── Tab: 高级 / 开发者 ───────────────────────────────────
  _secAdvanced(el) {
    el.createEl("p", {
      text: "以下为高级 / 调试项，多数用户无需改动。",
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("开发者模式").setDesc("显示运行状态等更底层信息，便于排查问题或使用源码版。").addToggle((t) => t.setValue(!!this.plugin.settings.developerMode).onChange(async (v) => {
      this.plugin.settings.developerMode = v;
      await this.plugin.saveSettings();
      this.display();
    }));
    new obsidian8.Setting(el).setName("服务地址").setDesc("本地服务的监听地址，例如 http://127.0.0.1:8000。一般无需改动。").addText((text) => text.setPlaceholder("http://127.0.0.1:8000").setValue(this.plugin.settings.backendUrl).onChange(async (val) => {
      this.plugin.settings.backendUrl = val.trim().replace(/\/+$/, "");
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("账号 / 下载站点").setDesc("受保护下载所用的站点（默认 https://paperbell.cn），仅对接本地 / 预发环境时才改。").addText((text) => text.setPlaceholder("https://paperbell.cn").setValue(this.plugin.settings.siteBaseUrl || "").onChange(async (val) => {
      this.plugin.settings.siteBaseUrl = val.trim().replace(/\/+$/, "");
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("自检").setDesc("检查本地服务是否在线。").addButton((btn) => btn.setButtonText("测试连接").onClick(async () => {
      var _a;
      btn.setButtonText("测试中…");
      btn.setDisabled(true);
      try {
        const h = await this.plugin.api.get("/health");
        new obsidian8.Notice(`本地服务在线 · 当前文献库：${(_a = h.library) != null ? _a : "—"}`);
      } catch (e) {
        new obsidian8.Notice(`连接失败：${e.message}`);
      } finally {
        btn.setButtonText("测试连接");
        btn.setDisabled(false);
      }
    }));
    el.createEl("h4", { text: "源码运行（开发者）" });
    el.createEl("p", {
      text: "仅在使用源码版（自带 Python）时需要配置；安装包用户请忽略本节。",
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("用本机源码运行").setDesc("开启后自动启动并守护本机源码运行的服务，随 Obsidian 退出。仅安装了源码版时需要。").addToggle((t) => t.setValue(!!this.plugin.settings.localBackendEnabled).onChange(async (v) => {
      this.plugin.settings.localBackendEnabled = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("源码目录").setDesc("PaperSearch 源码所在文件夹（里面应有 start_app.py）。点「选择…」直接指定。").addText((text) => text.setPlaceholder("C:\\path\\to\\PaperSearch_...").setValue(this.plugin.settings.localBackendDir || "").onChange(async (val) => {
      this.plugin.settings.localBackendDir = val.trim().replace(/[\\/]+$/, "");
      await this.plugin.saveSettings();
    })).addButton((btn) => btn.setButtonText("选择…").onClick(async () => {
      const f = await pbPickFile({ directory: true });
      if (!f) return;
      const dir = pbPickedDirPath(f);
      if (dir) {
        if (nodeFs2.existsSync(nodePath3.join(dir, "start_app.py"))) {
          this.plugin.settings.localBackendDir = dir;
          await this.plugin.saveSettings();
          this.display();
        } else {
          new obsidian8.Notice(`所选目录里没有 start_app.py：${dir}。请选 PaperSearch 源码根目录。`);
        }
      }
    }));
    new obsidian8.Setting(el).setName("Python 解释器路径（可选）").setDesc("自定义启动本地服务所用的 Python。留空则优先使用源码目录下的 .venv。").addText((t) => t.setPlaceholder("留空＝用 .venv").setValue(this.plugin.settings.localBackendPython || "").onChange(async (v) => {
      this.plugin.settings.localBackendPython = v.trim();
      await this.plugin.saveSettings();
    }));
    el.createEl("h4", { text: "本机检索 / 嵌入服务（高级）" });
    el.createEl("p", {
      text: "以下配置用于本地检索和语义匹配，保存在本地服务中，与「开始与状态」里的 AI 写作服务相互独立。",
      cls: "setting-item-description"
    });
    const rt = {
      api_mode: "default",
      custom_openai_api_key: "",
      custom_openai_base_url: "",
      custom_openai_chat_model: "",
      custom_openai_wire_api: "",
      embedding_model_override: "",
      use_bundled_embedding: true
    };
    let modeDD, keyT, baseT, modelT, embT, bundleTG;
    const effectiveBox = el.createDiv({ cls: "pb-st-effective" });
    const renderEffective = (s) => {
      effectiveBox.empty();
      if (!s) {
        effectiveBox.createEl("div", {
          text: "点击「读取」可查看当前实际生效的模型。",
          cls: "pb-st-effective-hint"
        });
        return;
      }
      const rows = [
        ["当前模式", s.api_mode === "custom" ? "自定义接口" : "内置接入"],
        ["对话模型", s.effective_openai_chat_model || "—"],
        ["接入地址", s.effective_openai_base_url || "—"],
        ["Embedding 模型", s.effective_embedding_model || "—"],
        ["内置 Embedding", s.bundled_embedding_available ? `可用（${s.bundled_embedding_path || "—"}）` : "不可用"]
      ];
      rows.forEach(([k, v]) => {
        const row = effectiveBox.createDiv({ cls: "pb-st-effective-row" });
        row.createSpan({ text: k, cls: "pb-st-effective-k" });
        row.createSpan({ text: v, cls: "pb-st-effective-v" });
      });
    };
    renderEffective(null);
    new obsidian8.Setting(el).setName("API 模式").setDesc("内置 = 使用本地服务自带的接入；自定义 = 填入你自己的 OpenAI 兼容接口。").addDropdown((d) => {
      modeDD = d;
      d.addOption("default", "内置接入").addOption("custom", "自定义接口").setValue(rt.api_mode).onChange((v) => {
        rt.api_mode = v;
      });
    });
    new obsidian8.Setting(el).setName("自定义 API Key").setDesc("仅「自定义接口」模式生效。密钥明文保存在本机，并仅随请求发送给你配置的服务端。").addText((t) => {
      keyT = t;
      t.inputEl.type = "password";
      t.setPlaceholder("sk-…").onChange((v) => {
        rt.custom_openai_api_key = v.trim();
      });
    });
    new obsidian8.Setting(el).setName("自定义接入地址").setDesc("OpenAI 兼容接口的 Base URL，例如 https://api.openai.com/v1").addText((t) => {
      baseT = t;
      t.setPlaceholder("https://api.openai.com/v1").onChange((v) => {
        rt.custom_openai_base_url = v.trim();
      });
    });
    new obsidian8.Setting(el).setName("自定义对话模型").setDesc("用于优化检索词、生成相关性说明和综述草稿等 AI 任务的模型名。").addText((t) => {
      modelT = t;
      t.setPlaceholder("例如 gpt-4o-mini / deepseek-chat").onChange((v) => {
        rt.custom_openai_chat_model = v.trim();
      });
    });
    new obsidian8.Setting(el).setName("使用内置 Embedding").setDesc('开启 = 使用本地服务自带的 bge-m3 向量模型（推荐，离线可用）；关闭 = 改用下方"自定义 Embedding"。').addToggle((tg) => {
      bundleTG = tg;
      tg.setValue(rt.use_bundled_embedding).onChange((v) => {
        rt.use_bundled_embedding = v;
      });
    });
    new obsidian8.Setting(el).setName("自定义 Embedding 模型").setDesc("留空 = 由本地服务按需选择。仅在关闭「使用内置 Embedding」时生效。").addText((t) => {
      embT = t;
      t.setPlaceholder("（留空＝默认）").onChange((v) => {
        rt.embedding_model_override = v.trim();
      });
    });
    new obsidian8.Setting(el).setName("与本地服务同步配置").setDesc("「读取」拉取本地服务当前配置；「保存」写回；「测试」检查接口连通性。").addButton((b) => b.setButtonText("读取").onClick(async () => {
      var _a, _b, _c, _d, _e;
      b.setButtonText("读取中…");
      b.setDisabled(true);
      try {
        const s = await this.plugin.api.get("/runtime-settings");
        rt.api_mode = (_a = s.api_mode) != null ? _a : "default";
        rt.custom_openai_base_url = (_b = s.custom_openai_base_url) != null ? _b : "";
        rt.custom_openai_chat_model = (_c = s.custom_openai_chat_model) != null ? _c : "";
        rt.embedding_model_override = (_d = s.embedding_model_override) != null ? _d : "";
        rt.use_bundled_embedding = (_e = s.use_bundled_embedding) != null ? _e : true;
        modeDD == null ? void 0 : modeDD.setValue(rt.api_mode);
        baseT == null ? void 0 : baseT.setValue(rt.custom_openai_base_url);
        modelT == null ? void 0 : modelT.setValue(rt.custom_openai_chat_model);
        embT == null ? void 0 : embT.setValue(rt.embedding_model_override);
        bundleTG == null ? void 0 : bundleTG.setValue(rt.use_bundled_embedding);
        renderEffective(s);
        new obsidian8.Notice("已读取本地服务配置");
      } catch (e) {
        new obsidian8.Notice(`读取失败：${e.message}`);
      } finally {
        b.setButtonText("读取");
        b.setDisabled(false);
      }
    })).addButton((b) => b.setButtonText("保存").setCta().onClick(async () => {
      b.setButtonText("保存中…");
      b.setDisabled(true);
      try {
        await this.plugin.api.postJson("/runtime-settings", rt);
        const s = await this.plugin.api.get("/runtime-settings");
        renderEffective(s);
        new obsidian8.Notice("已保存到本地服务");
      } catch (e) {
        new obsidian8.Notice(`保存失败：${e.message}`);
      } finally {
        b.setButtonText("保存");
        b.setDisabled(false);
      }
    })).addButton((b) => b.setButtonText("测试").onClick(async () => {
      var _a;
      b.setButtonText("测试中…");
      b.setDisabled(true);
      try {
        const r = await this.plugin.api.postJson("/runtime-settings/test", {
          api_mode: rt.api_mode,
          custom_openai_api_key: rt.custom_openai_api_key,
          custom_openai_base_url: rt.custom_openai_base_url,
          custom_openai_chat_model: rt.custom_openai_chat_model,
          custom_openai_wire_api: rt.custom_openai_wire_api
        });
        new obsidian8.Notice(r.chat_ok ? `接口可用 · 模型：${(_a = r.chat_model) != null ? _a : "—"}` : `测试未通过：${r.chat_error || r.models_error || "未知错误"}`);
      } catch (e) {
        new obsidian8.Notice(`测试失败：${e.message}`);
      } finally {
        b.setButtonText("测试");
        b.setDisabled(false);
      }
    }));
    this.plugin.api.get("/runtime-settings").then((s) => {
      var _a, _b, _c, _d, _e, _f;
      if ((_a = this._isStale) == null ? void 0 : _a.call(this)) return;
      rt.api_mode = (_b = s.api_mode) != null ? _b : "default";
      rt.custom_openai_base_url = (_c = s.custom_openai_base_url) != null ? _c : "";
      rt.custom_openai_chat_model = (_d = s.custom_openai_chat_model) != null ? _d : "";
      rt.embedding_model_override = (_e = s.embedding_model_override) != null ? _e : "";
      rt.use_bundled_embedding = (_f = s.use_bundled_embedding) != null ? _f : true;
      modeDD == null ? void 0 : modeDD.setValue(rt.api_mode);
      baseT == null ? void 0 : baseT.setValue(rt.custom_openai_base_url);
      modelT == null ? void 0 : modelT.setValue(rt.custom_openai_chat_model);
      embT == null ? void 0 : embT.setValue(rt.embedding_model_override);
      bundleTG == null ? void 0 : bundleTG.setValue(rt.use_bundled_embedding);
      renderEffective(s);
    }).catch(() => {
    });
  }
  // ── Tab: 阅读与标注 ──────────────────────────────────────
  _secReading(el) {
    new obsidian8.Setting(el).setName("默认视图").setDesc("打开 PaperSearch 面板时默认使用的视图。").addDropdown((drop) => drop.addOption("list", "列表").addOption("grid", "网格").addOption("table", "表格").setValue(this.plugin.settings.defaultView).onChange(async (val) => {
      this.plugin.settings.defaultView = val;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("原文预览行数").setDesc("列表和网格视图中，每条结果的原文默认显示几行（1–8）；超出后可展开。").addSlider((slider) => slider.setLimits(1, 8, 1).setValue(this.plugin.settings.originalPreviewLines).setDynamicTooltip().onChange(async (val) => {
      this.plugin.settings.originalPreviewLines = val;
      await this.plugin.saveSettings();
      document.body.style.setProperty("--pb-abstract-lines", String(val));
      document.querySelectorAll(".pb-panel").forEach((panel) => panel.style.setProperty("--pb-abstract-lines", String(val)));
      requestAnimationFrame(() => {
        var _a, _b;
        for (const leaf of this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE)) {
          const view = leaf.view;
          const results = (_b = (_a = view == null ? void 0 : view.containerEl) == null ? void 0 : _a.querySelector) == null ? void 0 : _b.call(_a, ".pb-results");
          if (results && typeof view._refreshOrigDisclosures === "function") {
            view._refreshOrigDisclosures(results);
          }
        }
      });
    }));
    new obsidian8.Setting(el).setName("原文翻译浮窗").setDesc("鼠标停在外文上时可显示翻译浮窗。可选择关闭、点击翻译或自动翻译。").addDropdown((d) => d.addOptions({ off: "关闭", click: "点击翻译（推荐）", auto: "自动翻译" }).setValue(this.plugin.settings.hoverPopupMode || "click").onChange(async (v) => {
      this.plugin.settings.hoverPopupMode = v;
      await this.plugin.saveSettings();
      this.plugin._applyHoverPopupSetting();
    }));
    new obsidian8.Setting(el).setName("PDF 选中文本工具栏").setDesc("在 PDF 里选中文字时，旁边自动弹出「标注 / 摘录 / 找相似」浮条。").addToggle((t) => t.setValue(this.plugin.settings.pdfSelectionToolbar !== false).onChange(async (v) => {
      this.plugin.settings.pdfSelectionToolbar = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("标注分类与颜色").setDesc("在 PDF 里划选文字即可着色标注。给每种颜色起个名字（如 观点 / 方法 / 引用），便于之后按用途筛选、检索、转成引用。").setHeading();
    const rolesWrap = el.createDiv({ cls: "pb-anno-roles-settings" });
    const renderRoles = () => {
      rolesWrap.empty();
      const roles = this.plugin._annoRoles();
      roles.forEach((r, i) => {
        const row = rolesWrap.createDiv({ cls: "pb-anno-role-row" });
        const sw = row.createEl("input", { attr: { type: "color", value: r.color } });
        sw.addClass("pb-anno-role-color");
        sw.onchange = async () => {
          var _a, _b;
          const old = roles[i].color;
          roles[i].color = sw.value;
          for (const a of Object.values((_b = (_a = this.plugin.annotationIndex) == null ? void 0 : _a.items) != null ? _b : {})) {
            if (a.color === old) a.color = sw.value;
          }
          this.plugin.settings.annotationRoles = roles;
          await this.plugin.saveSettings();
        };
        const lab = row.createEl("input", { attr: { type: "text", value: r.label, placeholder: "分类名称" } });
        lab.addClass("pb-anno-role-label");
        lab.onchange = async () => {
          roles[i].label = lab.value.trim() || r.label;
          this.plugin.settings.annotationRoles = roles;
          await this.plugin.saveSettings();
        };
      });
      const reset = rolesWrap.createEl("button", { text: "恢复默认", cls: "pb-anno-role-reset" });
      reset.onclick = async () => {
        this.plugin.settings.annotationRoles = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.annotationRoles));
        await this.plugin.saveSettings();
        renderRoles();
      };
    };
    renderRoles();
    new obsidian8.Setting(el).setName("悬浮标注面板").setDesc("在 PDF 边缘浮出面板，列出本篇全部标注（按用途分组），点击跳回原文。").addToggle((t) => t.setValue(this.plugin.settings.annoPanelEnabled !== false).onChange(async (v) => {
      this.plugin.settings.annoPanelEnabled = v;
      await this.plugin.saveSettings();
      this.plugin._applyAnnoPanelSetting();
    }));
    new obsidian8.Setting(el).setName("标注面板停靠位置").setDesc("面板贴在窗口的哪一边。").addDropdown((d) => d.addOptions({ right: "右侧", left: "左侧", top: "顶部", bottom: "底部" }).setValue(this.plugin.settings.annoPanelEdge || "right").onChange(async (v) => {
      this.plugin.settings.annoPanelEdge = v;
      await this.plugin.saveSettings();
      this.plugin._applyAnnoPanelEdge();
    }));
    new obsidian8.Setting(el).setName("没有文献笔记时").setDesc("在 PDF 标注时，若这篇还没有文献笔记：首次询问 / 自动创建 / 只存标注不建笔记。标注本身始终保存。").addDropdown((d) => d.addOptions({ ask: "首次询问（可记住选择）", always: "自动创建文献笔记", never: "仅保存标注，不创建笔记" }).setValue(this.plugin.settings.annoSilentFile || "ask").onChange(async (v) => {
      this.plugin.settings.annoSilentFile = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("文献笔记中的 PDF").setDesc("原文定位到命中页，可直接在笔记中阅读。").addDropdown((d) => d.addOption("inline", "嵌入笔记").addOption("obsidian-preview", "在新标签页打开").addOption("link", "用系统阅读器打开").addOption("none", "不显示").setValue(this.plugin.settings.pdfLinkMode || "inline").onChange(async (v) => {
      this.plugin.settings.pdfLinkMode = v;
      await this.plugin.saveSettings();
    }));
  }
  // ── Tab: 引用与写作 ──────────────────────────────────────
  _secCiteWrite(el) {
    var _a;
    new obsidian8.Setting(el).setName("悬浮文献收集栏").setDesc("文献收集内容现在主要在面板顶部的「文献收集」标签页里。这里可额外开一个贴边的悬浮收集栏（默认关闭）。").addToggle((t) => t.setValue(this.plugin.settings.citePanelEnabled !== false).onChange(async (v) => {
      this.plugin.settings.citePanelEnabled = v;
      await this.plugin.saveSettings();
      this.plugin._applyCitePanelSetting();
    }));
    new obsidian8.Setting(el).setName("收集栏停靠位置").setDesc("收集栏贴在窗口的哪一边（默认右侧，与标注面板错开）。").addDropdown((d) => d.addOptions({ right: "右侧", left: "左侧", top: "顶部", bottom: "底部" }).setValue(this.plugin.settings.citePanelEdge || "right").onChange(async (v) => {
      this.plugin.settings.citePanelEdge = v;
      await this.plugin.saveSettings();
      this.plugin._applyCitePanelEdge();
    }));
    new obsidian8.Setting(el).setName("引用插入格式").setDesc("插入引用时的默认写法：标准引用键（推荐，以 .bib 为准、导出时统一生成参考文献表）/ 脚注 / 行内著者-年。").addDropdown((d) => d.addOptions({ pandoc: "标准引用键（推荐）", footnote: "脚注 [^id]", inline: "行内 著者-年" }).setValue(this.plugin.settings.citationForm || "pandoc").onChange(async (v) => {
      this.plugin.settings.citationForm = v;
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("参考文献样式").setDesc("使用脚注、行内或生成参考文献表时的学术格式（APA / MLA / Chicago）。").addDropdown((d) => d.addOptions({ apa: "APA", mla: "MLA", chicago: "Chicago" }).setValue(this.plugin.settings.bibStyle || "apa").onChange(async (v) => {
      this.plugin.settings.bibStyle = v;
      await this.plugin.saveSettings();
    }));
    el.createEl("h4", { text: "Pandoc 导出设置" });
    const _bbt = (this.plugin.settings.bbtBibPath || "").trim();
    if (!_bbt) {
      el.createEl("p", { cls: "setting-item-description", text: "未配置 BBT .bib（请到「文献库与 Zotero」中设置）。没有 .bib 时，标准引用键会退化为脚注，无法使用 @citekey 导出。" });
    } else {
      const _pbib = this.plugin._paperbellBibPath();
      let _orphan = 0;
      try {
        if (_pbib && nodeFs2.existsSync(_pbib)) _orphan = (parseBibTeX(nodeFs2.readFileSync(_pbib, "utf8")) || []).length;
      } catch (_) {
      }
      const _bibs = [_bbt];
      if (_orphan > 0 && _pbib) _bibs.push(_pbib);
      el.createEl("p", {
        cls: "setting-item-description",
        text: _orphan > 0 ? `注意：有 ${_orphan} 篇文献不在 Zotero/BBT、写在了 paperbell.bib。导出时这个文件也必须加入 pandoc 的 bibliography，否则这些 @key 将无法解析。` : "当前可引用文献都来自你的 BBT 库。只要 pandoc 的 --bibliography 指向同一个 .bib，所有 @key 都能解析。"
      });
      new obsidian8.Setting(el).setName("导出时 pandoc 需要的文献库").setDesc(_bibs.join("  +  ")).addButton((b) => b.setButtonText("复制 --bibliography 参数").onClick(() => {
        const arg = _bibs.map((p) => `--bibliography "${p}"`).join(" ") + " --citeproc";
        navigator.clipboard.writeText(arg);
        new obsidian8.Notice("已复制 pandoc 参数；粘进你的导出命令即可");
      }));
    }
    new obsidian8.Setting(el).setName("显示「AI 综述草稿」按钮").setDesc("开启后，可基于当前结果生成 200–300 字综述草稿；使用前请核对内容和引用。默认关闭。").addToggle((t) => t.setValue(!!this.plugin.settings.enableAISummary).onChange(async (v) => {
      this.plugin.settings.enableAISummary = v;
      await this.plugin.saveSettings();
      for (const leaf of this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE)) {
        const view = leaf.view;
        if (view == null ? void 0 : view._hasSearched) {
          try {
            view._applyAnswerAndRewrite(view.containerEl, view._lastResult || {}, "");
          } catch (_) {
          }
        }
      }
    }));
    const aaSetting = new obsidian8.Setting(el).setName("AI 综述草稿指令").setDesc("生成 AI 综述草稿时使用的指令。可按学科或期刊习惯自定义。");
    let aaTa;
    aaSetting.addTextArea((ta) => {
      var _a2;
      aaTa = ta;
      ta.setValue((_a2 = this.plugin.settings.aiAnswerPrompt) != null ? _a2 : DEFAULT_AI_ANSWER_PROMPT).onChange(async (val) => {
        this.plugin.settings.aiAnswerPrompt = val;
        await this.plugin.saveSettings();
      });
      ta.inputEl.rows = 6;
      ta.inputEl.style.width = "100%";
      ta.inputEl.style.fontSize = "12px";
      ta.inputEl.style.lineHeight = "1.5";
    });
    aaSetting.addExtraButton((b) => b.setIcon("rotate-ccw").setTooltip("恢复默认提示词").onClick(async () => {
      this.plugin.settings.aiAnswerPrompt = DEFAULT_AI_ANSWER_PROMPT;
      await this.plugin.saveSettings();
      aaTa == null ? void 0 : aaTa.setValue(DEFAULT_AI_ANSWER_PROMPT);
    }));
    const rwSetting = new obsidian8.Setting(el).setName("AI 改写指令").setDesc("行内 AI 改写使用的指令。生成结果会先预览，采用前请核对事实、限定条件与引用。");
    let rwTa;
    rwSetting.addTextArea((ta) => {
      var _a2;
      rwTa = ta;
      ta.setValue((_a2 = this.plugin.settings.rewritePrompt) != null ? _a2 : DEFAULT_REWRITE_PROMPT).onChange(async (val) => {
        this.plugin.settings.rewritePrompt = val;
        await this.plugin.saveSettings();
      });
      ta.inputEl.rows = 6;
      ta.inputEl.style.width = "100%";
      ta.inputEl.style.fontSize = "12px";
      ta.inputEl.style.lineHeight = "1.5";
    });
    rwSetting.addExtraButton((b) => b.setIcon("rotate-ccw").setTooltip("恢复默认提示词").onClick(async () => {
      this.plugin.settings.rewritePrompt = DEFAULT_REWRITE_PROMPT;
      await this.plugin.saveSettings();
      rwTa == null ? void 0 : rwTa.setValue(DEFAULT_REWRITE_PROMPT);
    }));
    new obsidian8.Setting(el).setName("常用改写指令").setDesc("每行写一条常用指令（如「精炼至 100 字」「改写为学术风格」）。改写框输入「/」即可快速调用。").addTextArea((ta) => {
      var _a2;
      ta.setPlaceholder("改写为学术风格\n精炼内容至100字").setValue((_a2 = this.plugin.settings.promptTemplates) != null ? _a2 : "").onChange(async (val) => {
        this.plugin.settings.promptTemplates = val;
        await this.plugin.saveSettings();
      });
      ta.inputEl.rows = 5;
      ta.inputEl.style.width = "100%";
      ta.inputEl.style.fontFamily = "var(--font-monospace)";
      ta.inputEl.style.fontSize = "12px";
    });
    el.createEl("h4", { text: "当前写作项目" });
    el.createEl("p", {
      text: "PaperSearch 可根据当前章节生成文献关联摘要、适合位置和引用风险提示；结果仅供整理思路。",
      cls: "setting-item-description"
    });
    const wpBox = el.createDiv({ cls: "pb-st-effective" });
    const renderWP = () => {
      var _a2, _b, _c, _d;
      wpBox.empty();
      const p = this.plugin.settings.writingProjectPath;
      if (!p) {
        wpBox.createEl("div", {
          text: "未设置。可从下方项目列表选择，或打开任意文件后运行「设为当前写作项目」。",
          cls: "pb-st-effective-hint"
        });
        return;
      }
      const row1 = wpBox.createDiv({ cls: "pb-st-effective-row" });
      row1.createSpan({ text: "当前项目", cls: "pb-st-effective-k" });
      row1.createSpan({ text: p, cls: "pb-st-effective-v" });
      const file = this.app.vault.getAbstractFileByPath(p);
      if (file) {
        const fm = (_a2 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.frontmatter;
        if (((_b = fm == null ? void 0 : fm.longform) == null ? void 0 : _b.format) === "scenes") {
          const sceneFile = this.plugin._resolveActiveScene({
            path: p,
            folder: ((_c = file.parent) == null ? void 0 : _c.path) || "",
            format: "scenes"
          });
          const row2 = wpBox.createDiv({ cls: "pb-st-effective-row" });
          row2.createSpan({ text: "当前章节", cls: "pb-st-effective-k" });
          row2.createSpan({
            text: sceneFile ? sceneFile.replace(((_d = file.parent) == null ? void 0 : _d.path) + "/", "") : "（打开本项目中的某个章节文件即可）",
            cls: "pb-st-effective-v"
          });
        }
      }
    };
    renderWP();
    const lf = this.plugin._detectLongformProjects();
    if (lf.length) {
      el.createEl("h5", { text: `检测到 ${lf.length} 个 Longform 项目` });
      const list = el.createDiv({ cls: "pb-lf-list" });
      for (const proj of lf) {
        const item = list.createDiv({ cls: "pb-lf-item" });
        item.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--background-modifier-border);";
        const isCurrent = this.plugin.settings.writingProjectPath === proj.path;
        const info = item.createDiv();
        info.style.cssText = "flex:1;min-width:0;";
        info.createDiv({
          text: `${isCurrent ? "★ " : ""}${proj.title}`,
          cls: "pb-lf-title"
        }).style.cssText = `font-size:12px;font-weight:${isCurrent ? "600" : "500"};color:var(--text-normal);`;
        info.createDiv({
          text: `${proj.format === "scenes" ? "多章节 · " + (((_a = proj.scenes) == null ? void 0 : _a.length) || 0) + " 章" : "单文件"} · ${proj.path}`,
          cls: "pb-lf-meta"
        }).style.cssText = "font-size:10px;color:var(--text-faint);";
        const btn = item.createEl("button", { text: isCurrent ? "当前" : "设为项目" });
        btn.disabled = isCurrent;
        btn.onclick = async () => {
          this.plugin.settings.writingProjectPath = proj.path;
          await this.plugin.saveSettings();
          new obsidian8.Notice(`已切换写作项目：${proj.title}`);
          this.display();
        };
      }
    } else {
      el.createEl("p", {
        text: "未检测到 Longform 项目（当前 Obsidian 库中没有包含 longform 配置的文件）。",
        cls: "pb-st-effective-hint"
      });
    }
    new obsidian8.Setting(el).setName("手动指定路径").setDesc("直接填入主文档路径（当前 Obsidian 库内的相对路径）。").addText((t) => t.setPlaceholder("Research/我的论文.md").setValue(this.plugin.settings.writingProjectPath || "").onChange(async (v) => {
      this.plugin.settings.writingProjectPath = v.trim();
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("清除当前项目").addButton((b) => b.setButtonText("清除").onClick(async () => {
      this.plugin.settings.writingProjectPath = "";
      await this.plugin.saveSettings();
      renderWP();
      this.display();
    }));
  }
  // ── Tab: 存储与目录 ──────────────────────────────────────
  _secStorage(el) {
    el.createEl("h4", { text: "文献库组织" });
    el.createEl("p", {
      text: "保存的论文按「一篇一个文件夹」存放（含笔记与 PDF）；AI 提取的概念先存为候选，是否转为正式概念由你确认。",
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("文献库目录").setDesc("保存的论文存放处，每篇一个子文件夹（含笔记与 PDF）。").addText((t) => t.setPlaceholder("PaperSearch/文献").setValue(this.plugin.settings.paperLibraryDir).onChange(async (val) => {
      this.plugin.settings.paperLibraryDir = val.trim().replace(/\/+$/, "") || "PaperSearch/文献";
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("正式概念目录").setDesc("反复出现、已确立的概念笔记存放处。").addText((t) => t.setPlaceholder("PaperSearch/概念").setValue(this.plugin.settings.conceptDir).onChange(async (val) => {
      this.plugin.settings.conceptDir = val.trim().replace(/\/+$/, "") || "PaperSearch/概念";
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("候选概念目录").setDesc("AI 提取出、但还未确立的概念草稿存放处。").addText((t) => t.setPlaceholder("PaperSearch/概念/_候选").setValue(this.plugin.settings.conceptCandidateDir).onChange(async (val) => {
      this.plugin.settings.conceptCandidateDir = val.trim().replace(/\/+$/, "") || "PaperSearch/概念/_候选";
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("文献笔记目录（旧版兼容）").setDesc("未按「每篇一个文件夹」存放时，文献笔记的存放处。一般保持默认即可。").addText((t) => t.setPlaceholder("PaperSearch笔记").setValue(this.plugin.settings.litNoteDir || "PaperSearch笔记").onChange(async (v) => {
      this.plugin.settings.litNoteDir = v.trim().replace(/\/+$/, "") || "PaperSearch笔记";
      await this.plugin.saveSettings();
    }));
    new obsidian8.Setting(el).setName("PDF 缓存上限").setDesc("本地缓存最多保留多少个 PDF，超出时自动删除最久未用的。0 = 不限制。仅对「在 Obsidian 标签页打开」和「复制进笔记并嵌入」两种方式有效。").addSlider((s) => {
      var _a;
      return s.setLimits(0, 30, 1).setValue((_a = this.plugin.settings.pdfCacheMax) != null ? _a : 10).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.pdfCacheMax = v;
        await this.plugin.saveSettings();
      });
    });
    new obsidian8.Setting(el).setName("清理 PaperSearch 缓存（本地 PDF 副本）").setDesc("PDF 预览/跳转用的本地缓存（PaperSearch缓存/）。打开文献库里的 PDF 会拷一份到这里以保证稳定加载；清理后下次打开会重新拉取一次。").addButton((b) => b.setButtonText("清理").onClick(async () => {
      const folder = this.app.vault.getAbstractFileByPath("PaperSearch缓存");
      if (!folder) {
        new obsidian8.Notice("没有 PaperSearch缓存 文件夹");
        return;
      }
      const ok = await pbConfirm(this.app, {
        title: "清理 PDF 缓存",
        message: "确定删除 PaperSearch缓存/ 文件夹及其中所有文件？\n（如果你的笔记还在用「嵌入」模式引用这些 PDF，删除后会变成虚链接。）",
        confirmText: "删除",
        danger: true
      });
      if (!ok) return;
      try {
        await this.app.vault.delete(folder, true);
        new obsidian8.Notice("已清理 PDF 缓存");
      } catch (e) {
        new obsidian8.Notice(`清理失败：${e.message}`);
      }
    }));
    el.createEl("h4", { text: "单篇分析缓存" });
    el.createEl("p", {
      text: "回到单篇分析时无需重新调用 AI。已保存为文献笔记的分析结果会长期保留。",
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("单篇分析缓存保留天数").setDesc("单篇分析结果的保留天数，过期自动清理。0 = 永久保留。").addSlider((slider) => {
      var _a;
      return slider.setLimits(0, 30, 1).setValue((_a = this.plugin.settings.analysisCacheRetentionDays) != null ? _a : 7).setDynamicTooltip().onChange(async (val) => {
        this.plugin.settings.analysisCacheRetentionDays = val;
        await this.plugin.saveSettings();
      });
    });
    const stats = this.plugin._analysisCacheStats();
    const statHint = el.createEl("div", {
      text: `当前已缓存 ${stats.total} 条（其中 ${stats.pinned} 条长期保留）`,
      cls: "setting-item-description"
    });
    new obsidian8.Setting(el).setName("清理可过期缓存").setDesc("保留已存为文献笔记的分析结果，其余缓存全部删除。").addButton((b) => b.setButtonText("清理").onClick(async () => {
      var _a;
      const entries = (_a = this.plugin.analysisCache) == null ? void 0 : _a.entries;
      if (!entries) {
        new obsidian8.Notice("已清理 0 条");
        return;
      }
      let n = 0;
      for (const k of Object.keys(entries)) {
        if (!entries[k].pinned) {
          delete entries[k];
          n++;
        }
      }
      await this.plugin.saveSettings();
      const s = this.plugin._analysisCacheStats();
      statHint.textContent = `当前已缓存 ${s.total} 条（其中 ${s.pinned} 条长期保留）`;
      new obsidian8.Notice(`已清理 ${n} 条`);
    })).addButton((b) => b.setButtonText("全部清空").setWarning().onClick(async () => {
      const ok = await pbConfirm(this.plugin.app, {
        title: "全部清空缓存",
        message: "是否连同长期保留的分析结果一并删除？\n此操作不可撤销。",
        confirmText: "全部删除",
        danger: true
      });
      if (!ok) return;
      this.plugin._clearAnalysisCache();
      const s = this.plugin._analysisCacheStats();
      statHint.textContent = `当前已缓存 ${s.total} 条（其中 ${s.pinned} 条长期保留）`;
      new obsidian8.Notice("已全部清空");
    }));
    new obsidian8.Setting(el).setName("导出诊断日志").setDesc("导出检索、建库和反馈日志，用于故障排查或提交给技术支持。").addButton((b) => b.setButtonText("导出 ZIP").onClick(async () => {
      b.setButtonText("导出中…");
      b.setDisabled(true);
      try {
        const r = await this.plugin.api._req("/usage-logs/export");
        const blob = new Blob([r.arrayBuffer], { type: "application/zip" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `papersearch-logs-${Date.now()}.zip`;
        a.click();
        URL.revokeObjectURL(a.href);
        new obsidian8.Notice("日志已开始下载");
      } catch (e) {
        new obsidian8.Notice(`导出失败：${e.message}`);
      } finally {
        b.setButtonText("导出 ZIP");
        b.setDisabled(false);
      }
    }));
  }
  // ── Tab: 通用 ────────────────────────────────────────────
  _secGeneral(el) {
    new obsidian8.Setting(el).setName("重新运行配置向导").setDesc("重新检查 PaperBell AI 连接并安装本地服务。").addButton((b) => b.setButtonText("打开向导").onClick(() => {
      new OnboardingWizard(this.app, this.plugin, () => {
        this.plugin._bootCoreThenViews();
      }).open();
    }));
  }
};

// src/views/citation-palette-view.ts
var obsidian9 = __toESM(require("obsidian"));
var CitationPaletteView = class extends obsidian9.ItemView {
  // 旧「文献收集栏」侧栏已废弃：功能搬到悬浮「文献收集栏」(_ensureCitePanel)。
  // 仍注册本视图，仅为把用户工作区里残留的旧侧栏 leaf 一打开就自动关掉。
  getViewType() {
    return CITATION_PALETTE_VIEW_TYPE;
  }
  getDisplayText() {
    return "文献收集栏";
  }
  getIcon() {
    return "quote";
  }
  async onOpen() {
    setTimeout(() => {
      try {
        this.leaf.detach();
      } catch (_) {
      }
    }, 0);
  }
};

// src/views/companion-view.ts
var obsidian10 = __toESM(require("obsidian"));
var WritingCompanionView = class extends obsidian10.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return COMPANION_VIEW_TYPE;
  }
  getDisplayText() {
    return "PaperSearch · 写作伴侣";
  }
  getIcon() {
    return "book-open";
  }
  async onOpen() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("pb-companion");
    this._evt = this.app.workspace.on("active-leaf-change", () => this._render());
    this.registerEvent(this._evt);
    this._mcEvt = this.app.metadataCache.on("changed", (file) => {
      if (!this.plugin._isPaperNoteFile(file)) return;
      if (this._renderTimer) clearTimeout(this._renderTimer);
      this._renderTimer = setTimeout(() => this._render(), 800);
    });
    this.registerEvent(this._mcEvt);
    this._render();
  }
  async onClose() {
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
  }
  async _render() {
    var _a, _b, _c;
    const root = (_b = (_a = this.containerEl) == null ? void 0 : _a.children) == null ? void 0 : _b[1];
    if (!root) return;
    root.empty();
    const project = this._resolveCurrentProject();
    if (!project) {
      this._renderEmpty(
        root,
        "请先在设置中指定当前写作项目",
        "设置 → 引用与写作 → 当前写作项目"
      );
      return;
    }
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this._renderEmpty(root, "请打开项目中的某一节");
      return;
    }
    const inProject = activeFile.path.startsWith(project.folder + "/") || activeFile.path === project.path;
    if (!inProject) {
      this._renderEmpty(
        root,
        "当前文件不在写作项目内",
        `项目：${project.title}
打开本项目中的任意章节文件，即可看到对应文献`
      );
      return;
    }
    const sceneRel = activeFile.path === project.path ? "__main__" : activeFile.path.replace(project.folder + "/", "");
    const matches = [];
    for (const f of this.plugin._listPaperNotes()) {
      const fm = (_c = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _c.frontmatter;
      if (!fm) continue;
      const arr = fm.analyzed_for_scenes;
      if (Array.isArray(arr) && arr.includes(sceneRel)) {
        matches.push({ file: f, fm });
      }
    }
    const head = root.createDiv({ cls: "pb-comp-head" });
    head.createDiv({ text: "本节相关文献", cls: "pb-comp-title" });
    head.createDiv({
      text: activeFile.basename,
      cls: "pb-comp-subtitle"
    });
    if (matches.length === 0) {
      this._renderEmpty(
        root,
        "本节还没有关联文献",
        "打开任意文献笔记 → 命令面板 →「分析当前文献与写作项目的关联」\n或：从本节内容直接搜索文献"
      );
      return;
    }
    const list = root.createDiv({ cls: "pb-comp-list" });
    matches.sort((a, b) => (b.fm.citation_count || 0) - (a.fm.citation_count || 0)).forEach(({ file, fm }) => {
      const card = list.createDiv({ cls: "pb-comp-card" });
      card.onclick = () => this.app.workspace.getLeaf(true).openFile(file);
      const title = fm.csl_title || fm.paper_title || file.basename;
      card.createDiv({ text: title, cls: "pb-comp-card-title" });
      const meta = [];
      if (fm.year) meta.push(fm.year);
      if (fm.citation_count) meta.push(`被引 ${fm.citation_count}`);
      if (fm.role) meta.push(fm.role);
      if (meta.length) {
        card.createDiv({ text: meta.join(" · "), cls: "pb-comp-card-meta" });
      }
      if (fm.tldr) {
        card.createDiv({ text: fm.tldr.slice(0, 120) + (fm.tldr.length > 120 ? "…" : ""), cls: "pb-comp-card-tldr" });
      }
    });
    const foot = root.createDiv({ cls: "pb-comp-foot" });
    const draftBtn = foot.createEl(
      "button",
      { text: "生成本节开篇草稿" }
    );
    draftBtn.classList.add("mod-cta");
    draftBtn.onclick = () => {
      this.app.commands.executeCommandById(`${this.plugin.manifest.id}:draft-scene-opening`);
    };
  }
  _renderEmpty(root, title, hint) {
    const box = root.createDiv({ cls: "pb-comp-empty" });
    box.createDiv({ text: title, cls: "pb-comp-empty-title" });
    if (hint) {
      hint.split("\n").forEach((line) => {
        box.createDiv({ text: line, cls: "pb-comp-empty-hint" });
      });
    }
  }
  _resolveCurrentProject() {
    var _a, _b, _c, _d;
    const path = this.plugin.settings.writingProjectPath;
    if (!path) return null;
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) return null;
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    return {
      path,
      folder: ((_b = file.parent) == null ? void 0 : _b.path) || "",
      title: (fm == null ? void 0 : fm.title) || ((_c = fm == null ? void 0 : fm.longform) == null ? void 0 : _c.title) || file.basename,
      format: ((_d = fm == null ? void 0 : fm.longform) == null ? void 0 : _d.format) || "single"
    };
  }
};

// src/views/search-view.ts
var obsidian11 = __toESM(require("obsidian"));
var nodePath4 = __toESM(require("path"));
var nodeCrypto = __toESM(require("crypto"));

// src/ui/row-html.ts
function rowHTML(r) {
  var _a, _b, _c, _d, _e, _f;
  const tm = TAG_META[r.tag];
  const RELATION_HINT = {
    "同一问题": "关注同一研究问题",
    "同一机制": "讨论相同机制 / 因果链",
    "同一对象/场景": "研究同一对象或情境",
    "同一对象·场景": "研究同一对象或情境",
    "对照/补充": "提供反例、适用边界或补充视角",
    "对照·补充": "提供反例、适用边界或补充视角",
    "同一方法": "使用相同方法 / 实证策略",
    "背景/间接": "提供背景或间接相关",
    "背景·间接": "提供背景或间接相关"
  };
  const relText = pbEscapeHtml((_a = r.relation_type) != null ? _a : "");
  const relHint = (_c = RELATION_HINT[(_b = r.relation_type) != null ? _b : ""]) != null ? _c : "由 AI 在生成相关说明时判断";
  const tagTitle = `判定依据：${relText || "（待判定）"}
${relHint}`;
  const hasCites = r.cites !== void 0 && r.cites !== null && r.cites !== "";
  const citeFmt = typeof r.cites === "number" ? r.cites.toLocaleString() : r.cites;
  const hasPage = r.page !== null && r.page !== void 0 && r.page !== "";
  const page = pbEscapeHtml((_d = r.page) != null ? _d : "");
  return `
<div class="pb-result-card" data-id="${pbEscapeHtml(r.id)}" data-tag="${pbEscapeHtml(r.tag)}" data-cites="${pbEscapeHtml(r.cites)}" data-rel="${pbEscapeQuotes(relText)}" data-doc="${(_e = r.docScore) != null ? _e : 0}" data-doc-id="${pbEscapeHtml(r._docId || "")}" data-source-file="${pbEscapeHtml(r._sourceFile || "")}">
  <div class="pb-card-top">
    <label class="pb-cb-label">
      <input type="checkbox" class="pb-cb" data-id="${pbEscapeHtml(r.id)}">
    </label>
    <span class="pb-meta-paper" title="${pbEscapeQuotes(r.paperTitle)}">${r.paperTitle}</span>
    <span class="pb-rtag ${tm.cls}" data-tag="${pbEscapeHtml(r.tag)}" title="${pbEscapeQuotes(tagTitle)}">${tm.label}</span>
  </div>
  <span class="pb-rtag-tbl ${tm.cls}" data-tag="${pbEscapeHtml(r.tag)}">${tm.label}</span>

  <div class="pb-orig-wrap" role="group" data-page="${page}" aria-label="原文节选">
    <div class="pb-orig-open" role="button" tabindex="0"
         aria-label="查看原文 PDF${hasPage ? `，第 ${page} 页` : ""}"
         title="点击查看原文 PDF（跳转到第 ${page || "?"} 页核对）">
      <div class="pb-orig-txt pb-txt-short">${r.origShort}</div>
      <div class="pb-orig-txt pb-txt-full" hidden>${r.origFull}</div>
      <span class="pb-orig-pdf-hint">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M6 5.5h4M6 8h4M6 10.5h2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        查看原文${hasPage ? ` · 第 ${page} 页` : ""}
      </span>
    </div>
    <button class="pb-orig-toggle" type="button" aria-expanded="false" hidden>
      <span class="pb-orig-toggle-label">展开原文</span>${CHEV}
    </button>
    <div class="pb-orig-popup"><div class="pb-orig-popup-body">${r.origFull}</div></div>
  </div>

  <div class="pb-reason-wrap">
    <div class="pb-reason-short">${r.reasonShort}</div>
    <span class="pb-expand-hint" title="悬停查看完整相关说明">${CHEV}</span>
    <div class="pb-reason-popup">${r.reasonFull}</div>
  </div>
  ${((_f = r.keywords) == null ? void 0 : _f.length) ? `<div class="pb-keywords-row">${r.keywords.map((k) => `<span class="pb-kw-chip">${k}</span>`).join("")}</div>` : ""}
  <div class="pb-card-meta">
    <!-- author / journal 在 _chunkToRow 里初值为空，真正的值由 _patchCardMeta
         从 CrossRef / Semantic Scholar 回填，没走过 _chunkToRow 的转义 -->
    <span class="pb-meta-title" title="作者">${pbEscapeHtml(r.author) || "—"}</span>
    ${r.journal || r.section ? `<span class="pb-meta-sub" title="${r.journal ? "期刊" : "出自章节"}">${r.journal ? pbEscapeHtml(r.journal) : "§ " + r.section}</span>` : ""}
    ${hasPage ? `<span class="pb-meta-page">第 ${page} 页</span>` : ""}
    <span class="pb-meta-right">
      ${hasCites ? `<span class="pb-meta-cites">被引 ${citeFmt}</span>` : ""}
      ${r.sim ? `<span class="pb-sim">${r.sim}</span>` : ""}
      <span class="pb-fb" data-id="${pbEscapeHtml(r.id)}">
        <span class="pb-fb-btn pb-fb-up" data-v="upvote" role="button" title="标记为相关">▲</span>
        <span class="pb-fb-btn pb-fb-down" data-v="downvote" role="button" title="标记为不相关">▼</span>
      </span>
      <span class="pb-focus-btn" data-id="${pbEscapeHtml(r.id)}" role="button" title="分析这篇文献">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6L8 1z"
                fill="currentColor"/>
        </svg>
        单篇分析
      </span>
      <span class="pb-collect-btn" data-id="${pbEscapeHtml(r.id)}" role="button"
            title="保存 PDF 与文献笔记，并跳到命中页">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M3 2.5h7l3 3v8H3z" stroke="currentColor" stroke-width="1.3"
                stroke-linejoin="round"/>
          <path d="M6 8.5l1.6 1.6L11 6.5" stroke="currentColor" stroke-width="1.3"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        保存
      </span>
    </span>
  </div>
  <div class="pb-drag-hint">⠿ 拖到笔记中选择插入方式</div>
</div>`;
}

// src/views/search-view.ts
var PaperSearchView = class extends obsidian11.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "PaperSearch";
  }
  getIcon() {
    return "search";
  }
  async onOpen() {
    var _a, _b, _c, _d;
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("pb-panel");
    root.innerHTML = this._panelHTML();
    this._bindEvents(root);
    this._hasSearched = false;
    this._currentView = "list";
    this._rows = [];
    this.containerEl.querySelectorAll(".pb-brand").forEach((el) => el.remove());
    const brand = this.containerEl.createEl("div", { cls: "pb-brand", text: "PaperSearch" });
    this.containerEl.appendChild(brand);
    const view = (_b = (_a = this.plugin.settings) == null ? void 0 : _a.defaultView) != null ? _b : "list";
    if (view !== "list") {
      const btn = root.querySelector(`.pb-vt-btn[data-view="${view}"]`);
      if (btn) btn.click();
    }
    const lines = (_d = (_c = this.plugin.settings) == null ? void 0 : _c.originalPreviewLines) != null ? _d : 5;
    root.style.setProperty("--pb-abstract-lines", String(lines));
  }
  async onClose() {
    var _a;
    if (this._searchTimer) window.clearInterval(this._searchTimer);
    this._searchTimer = null;
    (_a = this._origDisclosureObserver) == null ? void 0 : _a.disconnect();
    this._origDisclosureObserver = null;
    if (this._origDisclosureFrame) cancelAnimationFrame(this._origDisclosureFrame);
    this._origDisclosureFrame = null;
    if (this.plugin._collectTabListEl) this.plugin._collectTabListEl = null;
    if (this._buildUnsub) {
      this._buildUnsub();
      this._buildUnsub = null;
    }
    if (this._formBuildUnsub) {
      this._formBuildUnsub();
      this._formBuildUnsub = null;
    }
  }
  // 由编辑器命令调用 —— 将选中文本推入搜索框
  pushQuery(text) {
    const root = this.containerEl.children[1];
    const input = root.querySelector(".pb-search-input");
    const src = root.querySelector(".pb-src-label");
    if (!input) return;
    input.value = text;
    input.classList.add("pushed");
    src.textContent = "来自正文选中内容 · 自动语义匹配";
    src.classList.add("from-editor");
    setTimeout(() => input.classList.remove("pushed"), 2e3);
    this._runSearch(root);
  }
  // ── HTML 模板 ────────────────────────────────────────
  _panelHTML() {
    return `
<!-- 顶层模块切换 Tab bar -->
<div class="pb-module-tabs" role="tablist" aria-label="PaperSearch 主要模块">
  <div class="pb-mod-btn active" data-mod="search" role="tab" tabindex="0" aria-selected="true">文献检索</div>
  <div class="pb-mod-btn" data-mod="lib" role="tab" tabindex="-1" aria-selected="false">文献库管理</div>
  <div class="pb-mod-btn" data-mod="collect" role="tab" tabindex="-1" aria-selected="false">文献收集</div>
</div>

<div class="pb-section pb-search-area">
  <div class="pb-search-hd">
    <span class="pb-src-label">检索条件</span>
    <div class="pb-view-toggle" title="切换视图">
      <div class="pb-vt-btn active" data-view="list" title="列表视图" role="button">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2"  width="14" height="2" rx="1" fill="currentColor"/>
          <rect x="1" y="7"  width="14" height="2" rx="1" fill="currentColor"/>
          <rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor"/>
        </svg>
      </div>
      <div class="pb-vt-btn" data-view="grid" title="网格视图" role="button">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
        </svg>
      </div>
      <div class="pb-vt-btn" data-view="table" title="表格视图" role="button">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M1 5.5h14M1 10h14M6 5.5v9.5" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </div>
    </div>
  </div>
  <div class="pb-search-row">
    <input class="pb-search-input" type="text" aria-label="研究问题"
      placeholder="输入研究问题或关键词…">
    <button class="pb-btn-search">检索</button>
  </div>

  <!-- 智能改写检索词提示（检索后若后端改写了 query 才出现）-->
  <div class="pb-qrewrite" style="display:none">
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="pb-qrewrite-label">建议检索式：</span>
    <span class="pb-qrewrite-text"></span>
    <span class="pb-qrewrite-apply" role="button">使用此检索式</span>
    <span class="pb-qrewrite-close" role="button" title="保留原输入">✕</span>
  </div>

  <!-- 旧版紧凑参数行：保留新版预设与默认库逻辑，只恢复原有呈现方式 -->
  <div class="pb-scope-row pb-lib-row">
    <span class="pb-scope-label">文献库</span>
    <span class="pb-lib-widget" data-lib="default" role="button" tabindex="0"
          aria-haspopup="listbox" aria-label="选择检索文献库">
      <span class="pb-lib-cur">default</span>
      <svg class="pb-chevron" width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 4L4 1.2L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="pb-scope-label pb-scope-sep">显示</span>
    <input class="pb-topk-input" data-field="top_k" type="number" value="5" min="1" max="20"
           title="最多显示的文献数（1–20）">
    <span class="pb-scope-label">篇 · 候选范围</span>
    <input class="pb-topk-input" data-field="recall_top_k" type="number" value="20" min="5" max="200"
           title="搜索的候选范围（5–200）；范围越大，可能找到更多相关文献，但搜索更慢">
    <span class="pb-scope-label">篇</span>
    <span class="pb-scope-label pb-scope-sep">每篇最多</span>
    <input class="pb-topk-input" data-field="max_chunks_per_document" type="number"
           value="2" min="0" max="20"
           title="每篇文献最多展示几个相关片段，0=不限">
    <span class="pb-scope-label">段</span>
  </div>

  <div class="pb-scope-row pb-cond-row">
    <span class="pb-scope-label">AI 优化</span>
    <span class="pb-ai-toggle active" data-key="optimize" role="switch" aria-checked="true" tabindex="0"
          title="搜索前优化问题表述，帮助找到更多相关片段">优化检索词</span>
    <span class="pb-ai-toggle active" data-key="annotate" role="switch" aria-checked="true" tabindex="0"
          title="为每条结果生成相关性说明">相关性说明</span>
  </div>

  <!-- 新版意图和深度状态仍由设置与历史记录维护，不占用旧版主界面空间 -->
  <div class="pb-search-state-controls" hidden aria-hidden="true">
    <button data-intent="support" type="button"></button>
    <button data-intent="contrast" type="button"></button>
    <button data-intent="method" type="button"></button>
    <button data-intent="definition" type="button"></button>
    <button data-preset="quick" type="button"></button>
    <button data-preset="balanced" type="button"></button>
    <button data-preset="deep" type="button"></button>
  </div>

  <div class="pb-search-progress" style="display:none" aria-live="polite">
    <div class="pb-search-progress-main">
      <span class="pb-search-progress-state">
        <span class="pb-search-progress-dot"></span>
        <span class="pb-search-progress-label">准备检索…</span>
      </span>
      <span class="pb-search-elapsed">0.0 秒</span>
    </div>
    <div class="pb-search-progress-detail"></div>
  </div>
</div>

<div class="pb-expand-divider">
  <div class="pb-expand-btn" title="展开 / 收起标签筛选" role="button">
    <svg class="pb-expand-icon" width="8" height="5" viewBox="0 0 8 5" fill="none">
      <path d="M1 1L4 3.8L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>

<div class="pb-section pb-filter-row" style="display:none">
  <span class="pb-label">标签：</span>
  <span class="pb-fc pb-fc-all active" data-tag="all">全部</span>
  <span class="pb-fc pb-fc-unclassified" data-tag="unclassified">未分类</span>
  <span class="pb-fc pb-fc-support"  data-tag="support">核心支撑</span>
  <span class="pb-fc pb-fc-method"   data-tag="method">方法参考</span>
  <span class="pb-fc pb-fc-contrast" data-tag="contrast">反例与边界</span>
  <span class="pb-fc pb-fc-bg"       data-tag="bg">背景信息</span>
  <span class="pb-fc pb-fc-data"     data-tag="data">数据来源</span>
  <span class="pb-fc pb-fc-theory"   data-tag="theory">理论框架</span>
</div>

<!-- 表格视图列标题（仅 table 模式显示）-->
<div class="pb-table-header" style="display:none">
  <span class="pb-th pb-th-left">文献内容</span>
  <span class="pb-th pb-th-content">相关性说明</span>
  <span class="pb-th pb-th-meta">
    <span class="pb-th-sort" data-key="cites" data-dir="none">引用数<svg class="pb-sort-icon" width="7" height="9" viewBox="0 0 7 9" fill="none"><path class="pb-si-up" d="M3.5 1L1 3.8h5L3.5 1z" fill="currentColor" opacity=".3"/><path class="pb-si-dn" d="M3.5 8L1 5.2h5L3.5 8z" fill="currentColor" opacity=".3"/></svg></span>
    <span class="pb-th-sort" data-key="sim"   data-dir="none">相关度<svg class="pb-sort-icon" width="7" height="9" viewBox="0 0 7 9" fill="none"><path class="pb-si-up" d="M3.5 1L1 3.8h5L3.5 1z" fill="currentColor" opacity=".3"/><path class="pb-si-dn" d="M3.5 8L1 5.2h5L3.5 8z" fill="currentColor" opacity=".3"/></svg></span>
  </span>
</div>

<!-- 结果区：排序控制 -->
<div class="pb-results-hd">
  <div class="pb-sort-widget" data-val="sim">
    <span class="pb-sort-trigger">排序：<span class="pb-sort-cur">相关度</span>${CHEV}</span>
  </div>
</div>

<div class="pb-results pb-results-list pb-results-idle">
  <div class="pb-empty-state">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <p>输入研究问题或关键词后点击「检索」</p>
    <p>也可选中文本，右键「推送到 PaperSearch」</p>
  </div>
</div>

<!-- LLM 整合答案：默认关，开启后在结果下方按需生成（流式）-->
<div class="pb-answer-panel" style="display:none">
  <div class="pb-answer-hd">
    <span class="pb-answer-title">✦ AI 综述草稿</span>
    <span class="pb-answer-toggle" role="button">收起</span>
  </div>
  <div class="pb-answer-bd"></div>
</div>

<div class="pb-section pb-batch" style="display:none">
  <div class="pb-batch-input-row">
    <textarea class="pb-inst" rows="1" disabled
      placeholder="先勾选文献，输入指令或 / 选模板…"></textarea>
    <button class="pb-btn-gen off" disabled>AI 生成</button>
  </div>
</div>

<div class="pb-preview" style="display:none">
  <div class="pb-preview-hd">
    <span class="pb-preview-title">生成预览</span>
    <span class="pb-preview-meta"></span>
    <button class="pb-btn-regen">重新生成</button>
  </div>
  <div class="pb-preview-bd"></div>
  <button class="pb-btn-insert">插入 AI 草稿（未关联来源）</button>
</div>

<div class="pb-footer" style="display:none">
  <span>共 <strong>0</strong> 条结果<span class="pb-footer-sel"></span></span>
  <div class="pb-footer-actions">
    <span class="pb-batch-litnote" role="button" title="将全部或选中的结果保存为文献笔记">保存为文献笔记</span>
    <span class="pb-batch-collect" role="button" title="将当前检索结果加入文献收集">加入文献收集</span>
  </div>
</div>

<!-- 文献库管理全窗口视图（位于 tab bar 以下） -->
<div class="pb-mod-lib" style="display:none">
  <!-- 层1：库列表 + 新建 -->
  <div class="pb-ls-lib-layer">
    <div class="pb-ls-lib-body"><!-- JS 渲染 --></div>
  </div>
  <!-- 层2：某库的文件详情 -->
  <div class="pb-ls-file-layer" style="display:none">
    <div class="pb-ls-file-nav">
      <div class="pb-ls-file-back" role="button">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        返回
      </div>
      <span class="pb-ls-file-title"></span>
    </div>
    <div class="pb-ls-file-body"><!-- JS 渲染 --></div>
  </div>
  <!-- 层3：新建文献库表单 -->
  <div class="pb-ls-create-layer" style="display:none">
    <div class="pb-ls-file-nav">
      <div class="pb-ls-create-back" role="button">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        返回
      </div>
      <span class="pb-ls-file-title">新建文献库</span>
    </div>
    <div class="pb-ls-create-body"><!-- JS 渲染 --></div>
  </div>
</div>

<!-- 文献收集全窗口视图（位于 tab bar 以下）—— JS 渲染 -->
<div class="pb-mod-collect" style="display:none"></div>

<!-- Paper Focus 全窗口分析视图 -->
<div class="pb-focus-screen">
  <div class="pb-fs-nav">
    <div class="pb-fs-back" role="button">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      返回
    </div>
    <div class="pb-fs-note-btn" role="button">
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="1" width="10" height="14" rx="1.5"
              stroke="currentColor" stroke-width="1.4"/>
        <path d="M5 5h6M5 8h6M5 11h4"
              stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      添加为文献笔记
    </div>
  </div>
  <div class="pb-fs-body"></div>
</div>`;
  }
  // ── 事件绑定 ─────────────────────────────────────────
  _bindEvents(root) {
    var _a, _b, _c, _d;
    const onMetaUpdate = (e) => {
      const { docId, entry } = e.detail || {};
      if (docId && entry) this._patchCardMeta(root, docId, entry);
    };
    window.addEventListener("paperbell:meta-updated", onMetaUpdate);
    (_a = this.register) == null ? void 0 : _a.call(this, () => window.removeEventListener("paperbell:meta-updated", onMetaUpdate));
    const moduleTabs = [...root.querySelectorAll(".pb-mod-btn")];
    moduleTabs.forEach((btn, index) => {
      const activate = () => {
        moduleTabs.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
          b.tabIndex = -1;
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        btn.tabIndex = 0;
        const mod = btn.dataset.mod;
        const libLayer = root.querySelector(".pb-mod-lib");
        libLayer.style.display = mod === "lib" ? "flex" : "none";
        if (mod === "lib" && !this._libRendered) {
          this._renderLibModule(root);
          this._libRendered = true;
        }
        const collectLayer = root.querySelector(".pb-mod-collect");
        collectLayer.style.display = mod === "collect" ? "flex" : "none";
        if (mod === "collect") this._renderCollectModule(root);
      };
      btn.addEventListener("click", activate);
      btn.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
          return;
        }
        const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!direction && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? moduleTabs.length - 1 : (index + direction + moduleTabs.length) % moduleTabs.length;
        moduleTabs[nextIndex].focus();
        moduleTabs[nextIndex].click();
      });
    });
    root.querySelectorAll(".pb-vt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a2;
        root.querySelectorAll(".pb-vt-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const view = btn.dataset.view;
        const prevView = (_a2 = this._currentView) != null ? _a2 : "list";
        this._currentView = view;
        const results = root.querySelector(".pb-results");
        const tableHd = root.querySelector(".pb-table-header");
        results.querySelectorAll('.pb-orig-toggle[aria-expanded="true"]').forEach((toggle) => toggle.click());
        results.classList.toggle("pb-results-grid", view === "grid");
        results.classList.toggle("pb-results-table", view === "table");
        results.classList.toggle("pb-results-list", view === "list");
        if (tableHd) tableHd.style.display = view === "table" ? "" : "none";
        root.querySelector(".pb-sort-widget").style.display = view === "table" ? "none" : "";
        if (view === "grid") {
          if (this._hasSearched) {
            results.innerHTML = this._gridGroupedHTML();
            this._bindGridGroupToggles(results);
            this._bindCardEvents(results, root);
          }
        } else if (prevView === "grid") {
          if (this._hasSearched) {
            results.innerHTML = this._rows.map(rowHTML).join("");
            this._bindCardEvents(results, root);
          }
        }
        requestAnimationFrame(() => this._refreshOrigDisclosures(results));
      });
    });
    root.querySelector(".pb-btn-search").addEventListener("click", () => this._runSearch(root));
    root.querySelector(".pb-search-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this._runSearch(root);
    });
    const renderProject = () => {
      var _a2;
      const el = root.querySelector(".pb-current-project");
      const path = this.plugin.settings.writingProjectPath || "";
      if (el) el.textContent = path ? ((_a2 = path.split("/").pop()) == null ? void 0 : _a2.replace(/\.md$/i, "")) || path : "未设置";
      if (el) el.title = path || "尚未设置当前写作项目";
    };
    renderProject();
    (_b = root.querySelector(".pb-set-project")) == null ? void 0 : _b.addEventListener("click", async () => {
      var _a2, _b2, _c2;
      const file = this.app.workspace.getActiveFile();
      if (!((_a2 = file == null ? void 0 : file.path) == null ? void 0 : _a2.endsWith(".md"))) {
        new obsidian11.Notice("请先打开一篇作为当前项目的 Markdown 文档");
        return;
      }
      if ((_c2 = (_b2 = this.plugin)._isPaperNoteFile) == null ? void 0 : _c2.call(_b2, file)) {
        new obsidian11.Notice("当前打开的是文献笔记，请打开论文主文档后再设为当前项目");
        return;
      }
      this.plugin.settings.writingProjectPath = file.path;
      await this.plugin.saveSettings();
      renderProject();
      new obsidian11.Notice(`当前项目：${file.basename}`);
    });
    const PRESETS = {
      quick: { top: 5, recall: 20, chunks: 1, optimize: false, annotate: false },
      balanced: { top: 8, recall: 40, chunks: 2, optimize: true, annotate: true },
      deep: { top: 12, recall: 80, chunks: 4, optimize: true, annotate: true }
    };
    const setPreset = (name, persist = true) => {
      var _a2, _b2;
      const preset = PRESETS[name] || PRESETS.balanced;
      root.querySelectorAll("[data-preset]").forEach((el) => {
        const active = el.dataset.preset === name;
        el.classList.toggle("active", active);
        el.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const setValue = (field, value) => {
        const el = root.querySelector(`[data-field="${field}"]`);
        if (el) el.value = String(value);
      };
      setValue("top_k", preset.top);
      setValue("recall_top_k", preset.recall);
      setValue("max_chunks_per_document", preset.chunks);
      (_a2 = root.querySelector('.pb-ai-toggle[data-key="optimize"]')) == null ? void 0 : _a2.classList.toggle("active", preset.optimize);
      (_b2 = root.querySelector('.pb-ai-toggle[data-key="annotate"]')) == null ? void 0 : _b2.classList.toggle("active", preset.annotate);
      root.querySelectorAll(".pb-ai-toggle").forEach((el) => el.setAttribute("aria-checked", el.classList.contains("active") ? "true" : "false"));
      this._searchModeScope = "preset";
      const summary = root.querySelector(".pb-search-expert > summary");
      if (summary) summary.textContent = "专家模式";
      this.plugin.settings.searchMode = name;
      if (persist) this.plugin.saveSettings();
    };
    root.querySelectorAll("[data-preset]").forEach((el) => el.addEventListener("click", () => setPreset(el.dataset.preset)));
    setPreset(this.plugin.settings.searchMode || "balanced", false);
    const setIntent = (name, persist = true) => {
      root.querySelectorAll("[data-intent]").forEach((el) => {
        const active = el.dataset.intent === name;
        el.classList.toggle("active", active);
        el.setAttribute("aria-pressed", active ? "true" : "false");
      });
      this.plugin.settings.searchIntent = name;
      if (persist) this.plugin.saveSettings();
    };
    root.querySelectorAll("[data-intent]").forEach((el) => el.addEventListener("click", () => setIntent(el.dataset.intent)));
    setIntent(this.plugin.settings.searchIntent || "support", false);
    const expert = root.querySelector(".pb-search-expert");
    if (expert) {
      expert.open = !!this.plugin.settings.searchExpertMode;
      expert.addEventListener("toggle", () => {
        this.plugin.settings.searchExpertMode = expert.open;
        this.plugin.saveSettings();
      });
    }
    const markSearchCustom = () => {
      this._searchModeScope = "custom";
      root.querySelectorAll("[data-preset]").forEach((el) => {
        el.classList.remove("active");
        el.setAttribute("aria-pressed", "false");
      });
      const summary = root.querySelector(".pb-search-expert > summary");
      if (summary) summary.textContent = "专家模式 · 本次自定义";
    };
    root.querySelectorAll('[data-field="top_k"], [data-field="recall_top_k"], [data-field="max_chunks_per_document"]').forEach((input) => input.addEventListener("input", markSearchCustom));
    this._searchHistory = [];
    this._renderHistoryState(root);
    this.plugin.api.get("/usage-logs/query-history?limit=30").then((data) => {
      var _a2;
      const seen = /* @__PURE__ */ new Set();
      const items = ((_a2 = data.items) != null ? _a2 : []).filter((it) => {
        const parsed = this._parseIntentQuery(it.query || "");
        const q = parsed.query;
        const key = `${q}\0${parsed.intent || ""}\0${it.library || ""}`;
        if (!q || seen.has(key)) return false;
        seen.add(key);
        it._pbParsedQuery = parsed;
        return true;
      });
      this._searchHistory = items.slice(0, 20).map((it) => {
        var _a3, _b2;
        return {
          q: ((_a3 = it._pbParsedQuery) == null ? void 0 : _a3.query) || it.query.trim(),
          ts: Date.parse(it.logged_at) || Date.now(),
          requestId: it.request_id || "",
          library: it.library || "",
          intent: it.intent || ((_b2 = it._pbParsedQuery) == null ? void 0 : _b2.intent) || "support",
          preset: it.ui_preset_mode || "balanced"
        };
      });
      this._renderHistoryState(root);
    }).catch(() => {
    });
    const searchInput = root.querySelector(".pb-search-input");
    searchInput.addEventListener("focus", () => {
      var _a2;
      (_a2 = root.querySelector(".pb-results")) == null ? void 0 : _a2.classList.add("pb-history-focused");
    });
    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        var _a2;
        return (_a2 = root.querySelector(".pb-results")) == null ? void 0 : _a2.classList.remove("pb-history-focused");
      }, 150);
    });
    const libWidget = root.querySelector(".pb-lib-widget");
    const normalizeLibraries = (list) => (Array.isArray(list) ? list : []).map((item) => typeof item === "string" ? item : (item == null ? void 0 : item.name) || (item == null ? void 0 : item.library) || (item == null ? void 0 : item.id) || "").filter(Boolean);
    if (!this._libStats) this._libStats = /* @__PURE__ */ new Map();
    const fetchStat = async (name) => {
      var _a2, _b2;
      const cached = this._libStats.get(name);
      if (cached && Date.now() - (cached.at || 0) < 15e3) return cached;
      try {
        const d = await this.plugin.api.get(`/libraries/${encodeURIComponent(name)}/documents`);
        const s = { count: (_a2 = d.document_count) != null ? _a2 : 0, chunks: (_b2 = d.chunk_count) != null ? _b2 : 0, at: Date.now() };
        this._libStats.set(name, s);
        return s;
      } catch (_) {
        return { count: null, chunks: null };
      }
    };
    const setLib = (name, { persist = true } = {}) => {
      var _a2, _b2, _c2;
      libWidget.dataset.lib = name;
      libWidget.querySelector(".pb-lib-cur").textContent = name;
      if (persist) {
        this.plugin.settings.lastLibrary = name;
        this.plugin.saveSettings();
      }
      (_a2 = this._searchAbortCtl) == null ? void 0 : _a2.abort();
      (_b2 = this._answerAbortCtl) == null ? void 0 : _b2.abort();
      (_c2 = this._prefetchAbortCtl) == null ? void 0 : _c2.abort();
      this._warmup(name);
    };
    const searchButton = root.querySelector(".pb-btn-search");
    this._librariesReady = false;
    if (searchButton) {
      searchButton.disabled = true;
      searchButton.setAttribute("aria-busy", "true");
    }
    const rememberedLibrary = this.plugin.settings.lastLibrary || "";
    if (rememberedLibrary) setLib(rememberedLibrary, { persist: false });
    else {
      const current = libWidget == null ? void 0 : libWidget.querySelector(".pb-lib-cur");
      if (current) current.textContent = "正在选择…";
    }
    const openLibraryPicker = async (e) => {
      var _a2;
      e.stopPropagation();
      let libs = this._libs;
      if (!libs) {
        try {
          const data = await this.plugin.api.get("/libraries");
          libs = this._libs = normalizeLibraries(data.libraries);
        } catch (err) {
          new obsidian11.Notice(`无法获取文献库列表：${err.message}`);
          return;
        }
      }
      if (!libs.length) {
        new obsidian11.Notice("还没有文献库，点「新建文献库」导入你的 PDF");
        return;
      }
      (_a2 = root.querySelector(".pb-lib-dropdown")) == null ? void 0 : _a2.remove();
      const rect = libWidget.getBoundingClientRect();
      const containerRect = root.getBoundingClientRect();
      const dd = root.createDiv({ cls: "pb-lib-dropdown" });
      dd.style.left = `${rect.left - containerRect.left}px`;
      dd.style.top = `${rect.bottom - containerRect.top + 4}px`;
      const items = libs.map((name) => {
        const row = dd.createDiv({
          cls: "pb-lib-dd-item" + (libWidget.dataset.lib === name ? " active" : ""),
          attr: { role: "option", tabindex: "0", "aria-selected": String(libWidget.dataset.lib === name) }
        });
        const nameEl = row.createSpan({ cls: "pb-lib-dd-name", text: name });
        const statEl = row.createSpan({ cls: "pb-lib-dd-stat", text: "…" });
        row.onclick = () => {
          dd.remove();
          setLib(name);
        };
        row.onkeydown = (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          row.click();
        };
        return { name, row, statEl, nameEl };
      });
      items.forEach(async ({ name, row, statEl }) => {
        const s = await fetchStat(name);
        if (s.count == null) {
          statEl.textContent = "统计不可用";
          statEl.classList.add("pb-lib-dd-stat-warn");
        } else if (s.count === 0) {
          statEl.textContent = "空";
          row.classList.add("pb-lib-dd-empty");
        } else {
          statEl.textContent = `${s.count} 篇`;
        }
      });
      const closeDD = (evt) => {
        if (!dd.contains(evt.target) && evt.target !== libWidget) {
          dd.remove();
          document.removeEventListener("click", closeDD, true);
        }
      };
      setTimeout(() => document.addEventListener("click", closeDD, true), 0);
      this.register(() => document.removeEventListener("click", closeDD, true));
    };
    libWidget == null ? void 0 : libWidget.addEventListener("click", openLibraryPicker);
    libWidget == null ? void 0 : libWidget.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      openLibraryPicker(e);
    });
    this.plugin.api.get("/libraries").then(async (data) => {
      var _a2, _b2;
      this._libs = normalizeLibraries(data.libraries);
      this._hasLibraries = this._libs.length > 0;
      if (!this._libs.length) {
        const current = libWidget == null ? void 0 : libWidget.querySelector(".pb-lib-cur");
        if (current) current.textContent = "尚无文献库";
        if (searchButton) searchButton.textContent = "请先新建文献库";
        return;
      }
      const cur = libWidget.dataset.lib;
      const stats = await Promise.all(this._libs.map(async (name) => ({ name, ...await fetchStat(name) })));
      const nonEmpty = stats.filter((s) => {
        var _a3;
        return ((_a3 = s.count) != null ? _a3 : 0) > 0;
      }).sort((a, b) => {
        var _a3, _b3;
        return ((_a3 = b.count) != null ? _a3 : 0) - ((_b3 = a.count) != null ? _b3 : 0);
      });
      const last = this.plugin.settings.lastLibrary || "";
      const lastNonEmpty = (_a2 = nonEmpty.find((s) => s.name === last)) == null ? void 0 : _a2.name;
      const target = lastNonEmpty || ((_b2 = nonEmpty[0]) == null ? void 0 : _b2.name) || this._libs.find((name) => name !== "default") || this._libs[0];
      if (target !== cur) setLib(target);
      else this._warmup(target);
    }).catch(() => {
      const current = libWidget == null ? void 0 : libWidget.querySelector(".pb-lib-cur");
      if (current && current.textContent === "正在选择…") current.textContent = libWidget.dataset.lib || "default";
    }).finally(() => {
      this._librariesReady = true;
      if (searchButton) {
        searchButton.disabled = this._hasLibraries === false;
        searchButton.removeAttribute("aria-busy");
      }
    });
    root.querySelectorAll(".pb-ai-toggle").forEach((btn) => {
      const toggle = () => {
        btn.classList.toggle("active");
        btn.setAttribute("aria-checked", btn.classList.contains("active") ? "true" : "false");
        markSearchCustom();
      };
      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
    root.querySelectorAll(".pb-fc[data-tag]").forEach((el) => {
      el.addEventListener("click", () => {
        root.querySelectorAll(".pb-fc[data-tag]").forEach((f) => f.classList.remove("active"));
        el.classList.add("active");
        this._applyFilters(root);
      });
    });
    const SORT_OPTS = [
      { val: "sim", label: "相关度" },
      { val: "doc", label: "文档相关度" },
      { val: "tag", label: "标签分类" },
      { val: "rel", label: "关联类型" }
    ];
    const sortWidget = root.querySelector(".pb-sort-widget");
    sortWidget.querySelector(".pb-sort-trigger").addEventListener("click", (e) => {
      const menu = new obsidian11.Menu();
      SORT_OPTS.forEach((opt) => {
        menu.addItem((item) => {
          item.setTitle(opt.label).setChecked(sortWidget.dataset.val === opt.val).onClick(() => {
            sortWidget.dataset.val = opt.val;
            sortWidget.querySelector(".pb-sort-cur").textContent = opt.label;
            this._sortResults(root, opt.val);
          });
        });
      });
      menu.showAtMouseEvent(e);
    });
    root.querySelectorAll(".pb-th-sort").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key;
        const dirs = ["none", "desc", "asc"];
        const next = dirs[(dirs.indexOf(btn.dataset.dir) + 1) % dirs.length];
        root.querySelectorAll(".pb-th-sort").forEach((b) => {
          if (b !== btn) b.dataset.dir = "none";
        });
        btn.dataset.dir = next;
        if (next !== "none") this._sortResults(root, key, next);
      });
    });
    root.querySelector(".pb-expand-btn").addEventListener("click", () => {
      const btn = root.querySelector(".pb-expand-btn");
      const isOpen = btn.classList.toggle("open");
      root.querySelector(".pb-filter-row").style.display = isOpen ? "" : "none";
      btn.title = isOpen ? "收起标签筛选" : "展开标签筛选";
    });
    root.addEventListener("change", (e) => {
      if (e.target.classList.contains("pb-cb")) this._updateSelection(root);
    });
    this._bindCardEvents(root, root);
    const instEl = root.querySelector(".pb-inst");
    let instSlashPopup = null;
    const closeInstSlash = () => {
      instSlashPopup == null ? void 0 : instSlashPopup.remove();
      instSlashPopup = null;
    };
    this.register(closeInstSlash);
    instEl.addEventListener("input", () => {
      var _a2, _b2;
      this._checkGen(root);
      const val = instEl.value;
      if (!val.startsWith("/")) {
        closeInstSlash();
        return;
      }
      const query = val.slice(1).toLowerCase();
      const templates = ((_b2 = (_a2 = this.plugin.settings) == null ? void 0 : _a2.promptTemplates) != null ? _b2 : DEFAULT_SETTINGS.promptTemplates).split("\n").map((s) => s.trim()).filter(Boolean);
      const filtered = query ? templates.filter((t) => t.toLowerCase().includes(query)) : templates;
      if (!filtered.length) {
        closeInstSlash();
        return;
      }
      if (!instSlashPopup) {
        instSlashPopup = document.createElement("div");
        instSlashPopup.className = "pb-slash-popup";
        document.body.appendChild(instSlashPopup);
      }
      instSlashPopup.innerHTML = filtered.map(
        (t, i) => `<div class="pb-slash-item" data-idx="${i}" data-tpl="${pbEscapeHtml(t)}">${pbEscapeHtml(t)}</div>`
      ).join("");
      const rect = instEl.getBoundingClientRect();
      instSlashPopup.style.cssText = `position:fixed;bottom:${window.innerHeight - rect.top + 4}px;left:${rect.left}px;width:${rect.width}px;z-index:var(--layer-popover,500)`;
      instSlashPopup.querySelectorAll(".pb-slash-item").forEach((item) => {
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          instEl.value = item.dataset.tpl;
          closeInstSlash();
          this._checkGen(root);
          instEl.focus();
        });
      });
    });
    instEl.addEventListener("keydown", (e) => {
      if (!instSlashPopup) return;
      const items = [...instSlashPopup.querySelectorAll(".pb-slash-item")];
      if (!items.length) return;
      const active = instSlashPopup.querySelector(".pb-slash-active");
      const idx = active ? items.indexOf(active) : -1;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active == null ? void 0 : active.classList.remove("pb-slash-active");
        items[idx + 1 < items.length ? idx + 1 : 0].classList.add("pb-slash-active");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active == null ? void 0 : active.classList.remove("pb-slash-active");
        items[idx > 0 ? idx - 1 : items.length - 1].classList.add("pb-slash-active");
      } else if (e.key === "Enter" && active) {
        e.preventDefault();
        instEl.value = active.dataset.tpl;
        closeInstSlash();
        this._checkGen(root);
      } else if (e.key === "Escape") {
        closeInstSlash();
      }
    });
    instEl.addEventListener("blur", () => setTimeout(closeInstSlash, 150));
    root.querySelector(".pb-btn-gen").addEventListener("click", () => this._generate(root));
    (_c = root.querySelector(".pb-batch-litnote")) == null ? void 0 : _c.addEventListener(
      "click",
      () => this._batchAddLitNotes(root)
    );
    (_d = root.querySelector(".pb-batch-collect")) == null ? void 0 : _d.addEventListener("click", () => {
      var _a2;
      const q = (((_a2 = root.querySelector(".pb-search-input")) == null ? void 0 : _a2.value) || "").trim();
      const n = this.plugin._collectRelatedRefs(this._rows || [], q ? `相关：${q.slice(0, 24)}` : "相关文献");
      new obsidian11.Notice(n ? `已将 ${n} 篇相关文献加入文献收集` : "没有可加入的结果");
    });
    root.querySelector(".pb-btn-regen").addEventListener("click", () => {
      this._generationSeq = (this._generationSeq || 0) + 1;
      this._generating = false;
      const insertBtn = root.querySelector(".pb-btn-insert");
      if (insertBtn) insertBtn.disabled = false;
      this._lastGeneratedDraft = null;
      root.querySelector(".pb-preview").style.display = "none";
    });
    root.querySelector(".pb-btn-insert").addEventListener("click", () => {
      var _a2;
      if (this._generating) {
        new obsidian11.Notice("正在关联来源，请稍候");
        return;
      }
      const previewText = (_a2 = root.querySelector(".pb-preview-bd").innerText) == null ? void 0 : _a2.trim();
      if (!previewText) return;
      const btn = root.querySelector(".pb-btn-insert");
      if (btn.classList.contains("pb-btn-insert--picking")) return;
      navigator.clipboard.writeText(previewText).catch(() => {
      });
      btn.textContent = "请点击文档中的插入位置…";
      btn.classList.add("pb-btn-insert--picking");
      const cleanup = () => {
        btn.textContent = this._lastGeneratedDraft ? "插入正文并关联来源" : "插入 AI 草稿（未关联来源）";
        btn.classList.remove("pb-btn-insert--picking");
        document.removeEventListener("mousedown", onPickInsert, true);
        document.removeEventListener("keydown", onEscCancel, true);
      };
      const onPickInsert = async (e) => {
        var _a3, _b2, _c2, _d2, _e, _f;
        if (root.contains(e.target)) return;
        const edView = (_b2 = (_a3 = cmView) == null ? void 0 : _a3.EditorView) == null ? void 0 : _b2.findFromDOM(e.target);
        if (!edView) {
          cleanup();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const pos = (_c2 = edView.posAtCoords({ x: e.clientX, y: e.clientY }, false)) != null ? _c2 : edView.state.doc.length;
        let text = previewText;
        let bundle = null;
        if (this._lastGeneratedDraft) {
          try {
            const targetLeaf = this.app.workspace.getLeavesOfType("markdown").find((leaf) => {
              var _a4, _b3;
              return (_b3 = (_a4 = leaf.containerEl) == null ? void 0 : _a4.contains) == null ? void 0 : _b3.call(_a4, e.target);
            });
            const targetPath = ((_e = (_d2 = targetLeaf == null ? void 0 : targetLeaf.view) == null ? void 0 : _d2.file) == null ? void 0 : _e.path) || ((_f = this.app.workspace.getActiveFile()) == null ? void 0 : _f.path) || "";
            bundle = this.plugin._buildEvidenceBackedDraft(this._lastGeneratedDraft, targetPath);
            text = bundle.text;
          } catch (err) {
            this._lastGeneratedDraft = null;
            new obsidian11.Notice(`来源关联不完整，将插入为未关联来源的 AI 草稿：${err.message}`, 8e3);
          }
        }
        edView.dispatch({
          changes: { from: pos, insert: text },
          selection: { anchor: pos + text.length }
        });
        try {
          if (bundle) await this.plugin._commitEvidenceBackedDraft(bundle);
        } catch (err) {
          try {
            if (edView.state.doc.sliceString(pos, pos + text.length) === text) {
              edView.dispatch({ changes: { from: pos, to: pos + text.length, insert: "" } });
            }
          } catch (_) {
          }
          cleanup();
          new obsidian11.Notice(`来源记录保存失败，已撤销插入：${err.message}`, 9e3);
          return;
        }
        edView.focus();
        cleanup();
        new obsidian11.Notice(bundle ? `已插入 ${bundle.claims.length} 条论断并关联来源` : "已插入 AI 草稿（未关联来源）");
      };
      const onEscCancel = (e) => {
        if (e.key === "Escape") cleanup();
      };
      document.addEventListener("mousedown", onPickInsert, true);
      document.addEventListener("keydown", onEscCancel, true);
      this.register(() => {
        document.removeEventListener("mousedown", onPickInsert, true);
        document.removeEventListener("keydown", onEscCancel, true);
      });
    });
  }
  _refreshOrigDisclosures(scope) {
    if (!(scope == null ? void 0 : scope.querySelectorAll)) return;
    scope.querySelectorAll(".pb-orig-wrap").forEach((wrap) => {
      const openTarget = wrap.querySelector(".pb-orig-open");
      const fullText = wrap.querySelector(".pb-txt-full");
      const toggle = wrap.querySelector(".pb-orig-toggle");
      if (!openTarget || !fullText || !toggle) return;
      if (toggle.getAttribute("aria-expanded") === "true") {
        toggle.hidden = false;
        return;
      }
      if (openTarget.getBoundingClientRect().width <= 1) {
        toggle.hidden = true;
        return;
      }
      const probe = fullText.cloneNode(true);
      probe.hidden = false;
      probe.classList.remove("pb-txt-full");
      probe.classList.add("pb-orig-overflow-probe");
      openTarget.appendChild(probe);
      toggle.hidden = !(probe.scrollHeight > probe.clientHeight + 1);
      probe.remove();
    });
  }
  _watchOrigDisclosureLayout(scope) {
    var _a;
    (_a = this._origDisclosureObserver) == null ? void 0 : _a.disconnect();
    this._origDisclosureObserver = null;
    if (this._origDisclosureFrame) cancelAnimationFrame(this._origDisclosureFrame);
    const refresh = () => {
      if (this._origDisclosureFrame) cancelAnimationFrame(this._origDisclosureFrame);
      this._origDisclosureFrame = requestAnimationFrame(() => {
        this._origDisclosureFrame = null;
        this._refreshOrigDisclosures(scope);
      });
    };
    refresh();
    if (typeof ResizeObserver === "undefined" || !scope) return;
    this._origDisclosureObserver = new ResizeObserver(refresh);
    this._origDisclosureObserver.observe(scope);
  }
  // ── 卡片事件绑定（可重复调用，用于视图切换后重绑）────
  _bindCardEvents(scope, root) {
    if (!root) root = scope;
    scope.querySelectorAll(".pb-result-card").forEach((card) => {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", (e) => {
        const id = card.dataset.id;
        const row = this._rows.find((r) => r.id === id);
        if (!row) return;
        const tm = TAG_META[row.tag];
        const checkedIds = [...root.querySelectorAll(".pb-cb:checked")].map((cb) => cb.dataset.id);
        const isMultiDrag = checkedIds.includes(row.id) && checkedIds.length >= 2;
        const dragRows = isMultiDrag ? checkedIds.map((cid) => this._rows.find((r) => r.id === cid)).filter(Boolean) : [row];
        const ghost = document.createElement("div");
        ghost.className = "pb-drag-ghost";
        if (isMultiDrag) {
          ghost.innerHTML = `
            <span class="pb-drag-ghost-tag pb-rt-${row.tag}">${tm.label} ×${dragRows.length}</span>
            <span class="pb-drag-ghost-title">已选 ${dragRows.length} 条</span>`;
        } else {
          ghost.innerHTML = `
            <span class="pb-drag-ghost-tag pb-rt-${row.tag}">${tm.label}</span>
            <span class="pb-drag-ghost-title">${row.title}</span>
            <span class="pb-drag-ghost-venue">${row.venue}</span>`;
        }
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 20, 16);
        setTimeout(() => ghost.remove(), 0);
        e.dataTransfer.effectAllowed = "copy";
        const payload = dragRows.map((r) => ({
          id: r.id,
          tag: r.tag,
          title: r.title,
          venue: r.venue,
          cites: r.cites,
          origFull: r.origFull,
          reasonShort: r.reasonShort,
          // ── source 锚（引注对象用）──
          paperTitle: r.paperTitle,
          page: r.page,
          _docId: r._docId,
          _sourceFile: r._sourceFile
        }));
        e.dataTransfer.setData("application/paperbell-cards", JSON.stringify(payload));
        card.classList.add("pb-dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("pb-dragging"));
    });
    scope.querySelectorAll(".pb-orig-wrap").forEach((wrap) => {
      const card = wrap.closest(".pb-result-card");
      const id = card == null ? void 0 : card.dataset.id;
      const openTarget = wrap.querySelector(".pb-orig-open") || wrap;
      const shortText = wrap.querySelector(".pb-txt-short");
      const fullText = wrap.querySelector(".pb-txt-full");
      const toggle = wrap.querySelector(".pb-orig-toggle");
      const openPdf = () => {
        var _a;
        const row = ((_a = this._rows) != null ? _a : []).find((r) => r.id === id);
        if (row) this._showPdfModal(root, row);
      };
      openTarget.addEventListener("click", openPdf);
      openTarget.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        openPdf();
      });
      if (shortText && fullText && toggle) {
        const label = toggle.querySelector(".pb-orig-toggle-label");
        const setExpanded = (expanded) => {
          wrap.classList.toggle("pb-orig-expanded", expanded);
          shortText.hidden = expanded;
          fullText.hidden = !expanded;
          toggle.setAttribute("aria-expanded", String(expanded));
          toggle.setAttribute("aria-label", expanded ? "收起原文" : "展开原文");
          if (label) label.textContent = expanded ? "收起原文" : "展开原文";
        };
        toggle.addEventListener("click", (e) => {
          var _a;
          e.preventDefault();
          e.stopPropagation();
          (_a = wrap.querySelector(".pb-orig-popup")) == null ? void 0 : _a.classList.remove("visible");
          setExpanded(toggle.getAttribute("aria-expanded") !== "true");
        });
      }
      const popup = wrap.querySelector(".pb-orig-popup");
      if (popup) {
        const pbody = popup.querySelector(".pb-orig-popup-body") || popup;
        const origPlain = pbody.textContent;
        let zhDone = false, zhText = "";
        const showZh = async () => {
          if (zhDone) {
            pbody.textContent = zhText;
            return;
          }
          pbody.textContent = "翻译中…";
          try {
            zhText = await this._llmTranslateToZh(origPlain) || origPlain;
            zhDone = true;
            pbody.textContent = zhText;
          } catch (e) {
            pbody.textContent = "翻译失败：" + ((e == null ? void 0 : e.message) || e);
          }
        };
        const ensureTrBtn = () => {
          if (popup.querySelector(".pb-orig-popup-tr")) return;
          const b = popup.createEl("div", { cls: "pb-orig-popup-tr", text: "翻译为中文", attr: { role: "button" } });
          b.onclick = (e) => {
            e.stopPropagation();
            b.remove();
            showZh();
          };
        };
        openTarget.addEventListener("mouseenter", () => {
          if (wrap.classList.contains("pb-orig-expanded")) return;
          const mode = this.plugin.settings.hoverPopupMode || "click";
          if (mode === "off") return;
          popup.classList.add("visible");
          if (mode === "auto") showZh();
          else ensureTrBtn();
        });
        openTarget.addEventListener("mouseleave", () => {
          setTimeout(() => {
            if (!popup.matches(":hover")) popup.classList.remove("visible");
          }, 100);
        });
        popup.addEventListener("mouseleave", () => popup.classList.remove("visible"));
      }
    });
    this._watchOrigDisclosureLayout(scope);
    scope.querySelectorAll(".pb-reason-wrap").forEach((wrap) => {
      const popup = wrap.querySelector(".pb-reason-popup");
      if (!popup) return;
      wrap.addEventListener("click", () => {
        const opening = !popup.classList.contains("visible");
        root.querySelectorAll(".pb-reason-popup.visible").forEach((p) => p.classList.remove("visible"));
        root.querySelectorAll(".pb-reason-wrap.pb-reason-expanded").forEach((w) => w.classList.remove("pb-reason-expanded"));
        if (opening) {
          popup.classList.add("visible");
          wrap.classList.add("pb-reason-expanded");
        }
      });
      popup.addEventListener("click", (e) => e.stopPropagation());
    });
    scope.querySelectorAll(".pb-rtag, .pb-rtag-tbl").forEach((el) => {
      let timer;
      el.addEventListener("mousedown", () => {
        timer = setTimeout(() => this._openTagEditor(root, el), 600);
      });
      el.addEventListener("mouseup", () => clearTimeout(timer));
      el.addEventListener("mouseleave", () => clearTimeout(timer));
    });
    scope.querySelectorAll(".pb-focus-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const row = this._rows.find((r) => r.id === btn.dataset.id);
        if (row) this._showFocusScreen(root, row);
      });
    });
    scope.querySelectorAll(".pb-collect-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const row = this._rows.find((r) => r.id === btn.dataset.id);
        if (row) this._collectForReading(root, row);
      });
    });
    scope.querySelectorAll(".pb-fb-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        var _a, _b, _c, _d, _e, _f, _g;
        e.stopPropagation();
        const wrap = btn.closest(".pb-fb");
        const id = wrap == null ? void 0 : wrap.dataset.id;
        const row = this._rows.find((r) => r.id === id);
        if (!row) return;
        if (!this._requestId) {
          new obsidian11.Notice("本次检索无反馈标识，无法记录");
          return;
        }
        const value = btn.dataset.v;
        wrap.querySelectorAll(".pb-fb-btn").forEach((b) => b.classList.toggle("active", b === btn));
        try {
          await this.plugin.api.postJson("/feedback", {
            request_id: this._requestId,
            library: (_b = (_a = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a.dataset.lib) != null ? _b : "default",
            query: (_c = this._lastQuery) != null ? _c : "",
            feedback_value: value,
            chunk_id: row.id,
            source_file: (_d = row._sourceFile) != null ? _d : "",
            page_number: (_e = row.page) != null ? _e : null,
            retrieval_strategy: "raw-child-vector-bm25",
            // 后端固定
            chunk_score: (_f = row.docScore) != null ? _f : null,
            doc_score: (_g = row.docScore) != null ? _g : null
          });
          new obsidian11.Notice(value === "upvote" ? "已标记为相关，谢谢反馈" : "已标记为不相关，谢谢反馈");
        } catch (err) {
          wrap.querySelectorAll(".pb-fb-btn").forEach((b) => b.classList.remove("active"));
          new obsidian11.Notice(`反馈提交失败：${err.message}`);
        }
      });
    });
  }
  // ── 网格视图：按标签分组 HTML（含顶部控制栏）────────
  _gridGroupedHTML() {
    const ORDER = ["support", "method", "contrast", "bg", "data", "theory"];
    const groups = {};
    this._rows.forEach((r) => {
      if (!groups[r.tag]) groups[r.tag] = [];
      groups[r.tag].push(r);
    });
    const active = ORDER.filter((t) => groups[t]);
    const navPills = active.map((tag) => {
      const tm = TAG_META[tag];
      return `<span class="pb-grid-nav-pill pb-rt-${tag}" data-group="${tag}">${tm.label}&nbsp;<em>${groups[tag].length}</em></span>`;
    }).join("");
    const groupsHTML = active.map((tag) => {
      const tm = TAG_META[tag];
      return `
<div class="pb-grid-group" id="pb-group-${tag}" data-group="${tag}">
  <div class="pb-grid-group-hd pb-rt-${tag}">
    <span class="pb-grid-group-label">${tm.label}</span>
    <span class="pb-grid-group-count">${groups[tag].length} 条</span>
    <span class="pb-grid-group-chev">${CHEV}</span>
  </div>
  <div class="pb-grid-group-body">${groups[tag].map(rowHTML).join("")}</div>
</div>`;
    }).join("");
    return `<div class="pb-grid-ctrl">
  <div class="pb-grid-nav-pills">${navPills}</div>
  <div class="pb-grid-toggle-all" data-expanded="1" role="button">全部折叠</div>
</div>${groupsHTML}`;
  }
  // ── 网格分组折叠 ────────────────────────────────────
  _bindGridGroupToggles(container) {
    const refreshDisclosures = () => requestAnimationFrame(() => this._refreshOrigDisclosures(container));
    container.querySelectorAll(".pb-grid-group-hd").forEach((hd) => {
      hd.addEventListener("click", () => {
        hd.closest(".pb-grid-group").classList.toggle("pb-collapsed");
        this._syncGridToggleBtn(container);
        refreshDisclosures();
      });
    });
    const btn = container.querySelector(".pb-grid-toggle-all");
    if (btn) {
      btn.addEventListener("click", () => {
        const expanding = btn.dataset.expanded === "0";
        container.querySelectorAll(".pb-grid-group").forEach((g) => g.classList.toggle("pb-collapsed", !expanding));
        btn.dataset.expanded = expanding ? "1" : "0";
        btn.textContent = expanding ? "全部折叠" : "全部展开";
        refreshDisclosures();
      });
    }
    container.querySelectorAll(".pb-grid-nav-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const g = container.querySelector(`#pb-group-${pill.dataset.group}`);
        if (!g) return;
        g.classList.remove("pb-collapsed");
        this._syncGridToggleBtn(container);
        refreshDisclosures();
        const scroll = container.closest(".pb-results");
        if (scroll) scroll.scrollTo({ top: g.offsetTop - 38, behavior: "smooth" });
        else g.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
  // ── 同步全局折叠按钮文字 ─────────────────────────────
  _syncGridToggleBtn(container) {
    const btn = container.querySelector(".pb-grid-toggle-all");
    if (!btn) return;
    const groups = [...container.querySelectorAll(".pb-grid-group")];
    const allCollapsed = groups.every((g) => g.classList.contains("pb-collapsed"));
    btn.dataset.expanded = allCollapsed ? "0" : "1";
    btn.textContent = allCollapsed ? "全部展开" : "全部折叠";
  }
  // ── 综合筛选（来源 + 标签）────────────────────────────
  _applyFilters(root) {
    var _a, _b;
    const tag = (_b = (_a = root.querySelector(".pb-fc.active")) == null ? void 0 : _a.dataset.tag) != null ? _b : "all";
    root.querySelectorAll(".pb-result-card").forEach((card) => {
      const matchTag = tag === "all" || card.dataset.tag === tag;
      card.style.display = matchTag ? "" : "none";
    });
  }
  // ── 排序 ──────────────────────────────────────────────
  _sortResults(root, key, dir = "desc") {
    const container = root.querySelector(".pb-results");
    const cards = [...container.querySelectorAll(".pb-result-card")];
    const TAG_ORDER = ["support", "method", "theory", "bg", "data", "contrast", "unclassified"];
    cards.sort((a, b) => {
      var _a, _b, _c, _d, _e, _f;
      let diff = 0;
      if (key === "sim") {
        const sa = parseFloat((_b = (_a = a.querySelector(".pb-sim")) == null ? void 0 : _a.textContent) != null ? _b : "0");
        const sb = parseFloat((_d = (_c = b.querySelector(".pb-sim")) == null ? void 0 : _c.textContent) != null ? _d : "0");
        diff = sb - sa;
      } else if (key === "tag") {
        diff = TAG_ORDER.indexOf(a.dataset.tag) - TAG_ORDER.indexOf(b.dataset.tag);
      } else if (key === "doc") {
        diff = parseFloat((_e = b.dataset.doc) != null ? _e : "0") - parseFloat((_f = a.dataset.doc) != null ? _f : "0");
      } else if (key === "rel") {
        const REL_ORDER = ["同一问题", "同一机制", "同一对象·场景", "同一方法", "对照·补充", "背景·间接"];
        diff = REL_ORDER.indexOf(a.dataset.rel) - REL_ORDER.indexOf(b.dataset.rel);
      }
      return dir === "asc" ? -diff : diff;
    });
    cards.forEach((c) => container.appendChild(c));
  }
  // ── 长按标签弹出编辑器 ───────────────────────────────
  _openTagEditor(root, tagEl) {
    root.querySelectorAll(".pb-tag-editor").forEach((e) => e.remove());
    const card = tagEl.closest(".pb-result-card");
    const currentTag = tagEl.dataset.tag;
    const editor = document.createElement("div");
    editor.className = "pb-tag-editor";
    editor.innerHTML = `
      <div class="pb-tag-opts">
        ${TAG_KEYS.map((k) => `
          <span class="pb-tag-opt pb-rt-${k} ${k === currentTag ? "chosen" : ""}"
                data-val="${k}">${TAG_META[k].label}</span>
        `).join("")}
      </div>
      <textarea class="pb-tag-reason" placeholder="（选填）说明修改原因，帮助优化 RAG 排序…"></textarea>
      <div class="pb-tag-btns">
        <button class="pb-tag-cancel">取消</button>
        <button class="pb-tag-confirm">确认反馈</button>
      </div>`;
    card.appendChild(editor);
    editor.querySelectorAll(".pb-tag-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        editor.querySelectorAll(".pb-tag-opt").forEach((o) => o.classList.remove("chosen"));
        opt.classList.add("chosen");
      });
    });
    editor.querySelector(".pb-tag-cancel").addEventListener("click", () => editor.remove());
    editor.querySelector(".pb-tag-confirm").addEventListener("click", () => {
      const chosen = editor.querySelector(".pb-tag-opt.chosen");
      if (!chosen) return;
      const val = chosen.dataset.val;
      const tm = TAG_META[val];
      card.querySelectorAll(".pb-rtag, .pb-rtag-tbl").forEach((t) => {
        TAG_KEYS.forEach((k) => t.classList.remove(`pb-rt-${k}`));
        t.classList.add(tm.cls);
        t.textContent = tm.label;
        t.dataset.tag = val;
      });
      card.dataset.tag = val;
      editor.remove();
      new obsidian11.Notice(`标签已更新为「${tm.label}」`);
    });
  }
  // ── 勾选同步 ─────────────────────────────────────────
  _updateSelection(root) {
    const checked = [...root.querySelectorAll(".pb-cb:checked")];
    const n = checked.length;
    root.querySelector(".pb-footer-sel").textContent = n > 0 ? ` · 已选 ${n} 条` : "";
    const ta = root.querySelector(".pb-inst");
    ta.disabled = n === 0;
    ta.placeholder = n === 0 ? "先勾选文献，输入指令或 / 选模板…" : "描述写作目标，例如：整合为综述段落，150字…";
    root.querySelectorAll(".pb-result-card").forEach((card) => {
      const cb = card.querySelector(".pb-cb");
      card.classList.toggle("pb-card-selected", !!(cb == null ? void 0 : cb.checked));
    });
    this._checkGen(root);
  }
  _checkGen(root) {
    const n = root.querySelectorAll(".pb-cb:checked").length;
    const inst = root.querySelector(".pb-inst");
    const v = inst.value.trim();
    const btn = root.querySelector(".pb-btn-gen");
    const ok = n > 0 && v.length > 0;
    btn.disabled = !ok;
    btn.className = "pb-btn-gen " + (ok ? "on" : "off");
    const batch = root.querySelector(".pb-section.pb-batch");
    if (batch) batch.style.display = n > 0 ? "" : "none";
    inst.disabled = n === 0;
  }
  // ── 检索历史：渲染 ────────────────────────────────────
  _renderHistoryState(root) {
    var _a;
    const results = root.querySelector(".pb-results");
    if (!results.classList.contains("pb-results-idle")) return;
    if (!((_a = this._searchHistory) == null ? void 0 : _a.length)) {
      this._renderEmptyState(root);
      return;
    }
    const timeAgo = (ts) => {
      const m = Math.floor((Date.now() - ts) / 6e4);
      if (m < 1) return "刚刚";
      if (m < 60) return `${m} 分钟前`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h} 小时前`;
      const d = Math.floor(h / 24);
      if (d < 7) return `${d} 天前`;
      return new Date(ts).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
    };
    results.innerHTML = `
      <div class="pb-history-hd">
        <span class="pb-scope-label">最近检索</span>
        <div class="pb-history-clear" role="button">清空</div>
      </div>
      <div class="pb-history-list">
        ${this._searchHistory.map((h, i) => `
          <div class="pb-history-item" data-idx="${i}">
            <svg class="pb-history-icon" width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/>
              <path d="M8 5v3l1.8 1.2" stroke="currentColor" stroke-width="1.3"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="pb-history-q">${pbEscapeHtml(h.q)}</span>
            <span class="pb-history-ts">${timeAgo(h.ts)}</span>
          </div>`).join("")}
      </div>`;
    results.querySelectorAll(".pb-history-item").forEach((item) => {
      item.addEventListener("mousedown", (e) => e.preventDefault());
      item.addEventListener("click", () => {
        const h = this._searchHistory[+item.dataset.idx];
        this._loadHistoryResult(root, h);
      });
    });
    results.querySelector(".pb-history-clear").addEventListener("click", () => {
      this._searchHistory = [];
      this._renderEmptyState(root);
    });
  }
  // ── 从历史记录恢复搜索结果（用结构化 rows，不再用 cachedHTML）──
  _loadHistoryResult(root, h) {
    var _a, _b, _c;
    const container = root.querySelector(".pb-results");
    root.querySelector(".pb-search-input").value = h.q;
    const intentButton = h.intent && root.querySelector(`[data-intent="${h.intent}"]`);
    const presetButton = h.preset && root.querySelector(`[data-preset="${h.preset}"]`);
    intentButton == null ? void 0 : intentButton.click();
    presetButton == null ? void 0 : presetButton.click();
    if (h.library) {
      const libWidget = root.querySelector(".pb-lib-widget");
      if (libWidget) {
        libWidget.dataset.lib = h.library;
        const label = libWidget.querySelector(".pb-lib-cur");
        if (label) label.textContent = h.library;
        this.plugin.settings.lastLibrary = h.library;
        this._warmup(h.library);
      }
    }
    if (!h.cachedRows) {
      this._runSearch(root);
      return;
    }
    this._rows = h.cachedRows;
    this._lastResult = (_a = h.cachedResult) != null ? _a : null;
    this._requestId = (_b = h.cachedRequestId) != null ? _b : "";
    this._lastQuery = h.q;
    this._hasSearched = true;
    container.classList.remove("pb-results-idle");
    root.querySelector(".pb-footer").style.display = "";
    const breadcrumb = `
      <div class="pb-history-nav">
        <div class="pb-history-back" role="button">
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          检索历史
        </div>
        <span class="pb-history-nav-q">${pbEscapeHtml(h.q)}</span>
      </div>`;
    const view = (_c = this._currentView) != null ? _c : "list";
    const bodyHTML = view === "grid" ? this._gridGroupedHTML() : this._rows.map(rowHTML).join("");
    container.innerHTML = breadcrumb + bodyHTML;
    if (view === "grid") this._bindGridGroupToggles(container);
    this._bindCardEvents(container, root);
    this._applyFilters(root);
    const cnt = root.querySelector(".pb-footer strong");
    if (cnt) cnt.textContent = String(this._rows.length);
    this._setSearchProgress(
      root,
      "done",
      `检索完成 · ${this._rows.length} 条结果`,
      h.elapsedMs || ((this._lastResult || {}).timings_ms || {}).total_ms || 0,
      this._searchTimingDetail(this._lastResult || {})
    );
    this._applyAnswerAndRewrite(root, this._lastResult || {}, h.q);
    container.querySelector(".pb-history-back").addEventListener("click", () => {
      var _a2, _b2;
      root.querySelector(".pb-search-input").value = "";
      container.classList.add("pb-results-idle");
      this._hasSearched = false;
      this._rows = [];
      root.querySelector(".pb-footer").style.display = "none";
      (_a2 = root.querySelector(".pb-answer-panel")) == null ? void 0 : _a2.style.setProperty("display", "none");
      (_b2 = root.querySelector(".pb-qrewrite")) == null ? void 0 : _b2.style.setProperty("display", "none");
      const progress = root.querySelector(".pb-search-progress");
      if (progress) progress.style.display = "none";
      this._renderHistoryState(root);
    });
  }
  _renderEmptyState(root) {
    const results = root.querySelector(".pb-results");
    results.innerHTML = `
      <div class="pb-empty-state">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>输入研究问题或关键词后点击「检索」</p>
        <p>或在文档中选中文字直接推送</p>
      </div>`;
  }
  // 后端 relation_type → 前端标签分类
  _relationToTag(rel) {
    const MAP = {
      "同一问题": "support",
      "同一机制": "theory",
      "同一对象/场景": "data",
      "同一对象·场景": "data",
      "对照/补充": "contrast",
      "对照·补充": "contrast",
      "同一方法": "method",
      "背景/间接": "bg",
      "背景·间接": "bg"
    };
    return MAP[rel] || "unclassified";
  }
  // RetrievedChunk → 卡片 row 对象
  _chunkToRow(c, idx) {
    var _a, _b, _c, _d, _e;
    const esc = (s) => String(s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const file = c.source_file || c.document_id || "未命名文献";
    const stem = file.replace(/\.pdf$/i, "");
    const score = (_c = (_b = (_a = c.doc_relevance_score) != null ? _a : c.similarity_score) != null ? _b : c.rerank_score) != null ? _c : 0;
    const rel = c.relation_type || "";
    const expectsAnnotation = ((_d = this._lastSearchParams) == null ? void 0 : _d.annotate_chunks) !== false;
    const txt = esc(c.text || "");
    const ptxt = esc(c.parent_text || c.text || "");
    return {
      id: c.chunk_id || `c${idx}`,
      tag: this._relationToTag(rel),
      relation_type: rel,
      // 不再写死 srcType / src 假标签（来源信息没有就不显示）
      cites: void 0,
      // 后端无引用数
      docScore: Number(score) || 0,
      // ★ 论文标题：用文件名 stem（如 Liu_Yang_2012_Water-Crisis）
      paperTitle: esc(stem),
      // ★ 章节标题：单独字段，来自 chunk.section_title
      section: esc(c.section_title || ""),
      title: esc(stem),
      venue: esc(c.section_title || ""),
      author: "",
      // 表格视图右列：作者（元数据解析后由 _patchCardMeta 填）
      journal: "",
      // 表格视图右列：期刊（同上）
      page: (_e = c.page_number) != null ? _e : null,
      keywords: (c.keywords || c.shared_keywords || []).slice(0, 6).map(esc),
      sim: score ? Number(score).toFixed(2) : "",
      // 保留完整命中片段，交给 CSS 按真实行数折叠；避免宽卡片未满五行就提前出现省略号。
      origShort: txt,
      origFull: ptxt,
      reasonShort: esc(c.relevance_label || (expectsAnnotation ? "正在生成相关性说明…" : "快速模式不生成相关性说明")),
      reasonFull: esc(c.connection_reason || c.relevance_label || (expectsAnnotation ? "—" : "快速模式不生成相关性说明")),
      _docId: c.document_id || "",
      _sourceFile: c.source_file || "",
      _sourcePath: c.source_path || ""
      // 后端绝对路径（用于 file:// 链接）
    };
  }
  // searchParams → AnalyzeRequest
  _buildAnalyzeBody(p) {
    return {
      text: p.text,
      library: p.library,
      top_k: p.top_k,
      recall_top_k: p.recall_top_k,
      max_chunks_per_document: p.max_chunks_per_document,
      optimize_query: p.optimize_query,
      annotate_chunks: p.annotate_chunks,
      ui_mode_scope: p.mode_scope || "preset",
      ui_preset_mode: p.mode_scope === "custom" ? "" : p.preset || "balanced",
      // generate_answer 始终关：综合回答用前端 LLM 直流，不依赖后端
      generate_answer: false,
      validate_retrieval: false
    };
  }
  // ── 预热文献库（POST /warmup）—— 静默调用，由后端 cooldown 去重
  // 后端长期保持向量库加载态，warmup 仅在「冷启动」或「最近未使用」时真正干活
  _warmup(libName) {
    if (!libName) return;
    if (this._warmingLib === libName) return;
    this._warmingLib = libName;
    this.plugin.api.postJson("/warmup", { library: libName, force: false }).catch(() => {
    }).finally(() => {
      if (this._warmingLib === libName) this._warmingLib = null;
    });
  }
  // ── 元数据 → 卡片增量 patch（不重渲染整张卡）─────────
  // 当 MetadataResolver 解析完一篇文献，emit 一个事件，本方法找到所有该文献的卡片更新：
  //   - 真实标题（来自 CSL）覆盖文件名 stem
  //   - 被引数 + ★ 高影响标记
  //   - 同步 this._rows 里的对应字段，便于后续 lit note / 拖拽用
  _patchCardMeta(root, docId, entry) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const cards = root.querySelectorAll(
      `.pb-result-card[data-doc-id=${CSS.escape(docId)}]`
    );
    if (!cards.length) return;
    const title = ((_a2 = entry.csl) == null ? void 0 : _a2.title) || "";
    const cites = (_b = entry.s2) == null ? void 0 : _b.citationCount;
    const star = ((_d = (_c = entry.s2) == null ? void 0 : _c.influentialCitationCount) != null ? _d : 0) >= 50;
    const tldr = ((_e = entry.s2) == null ? void 0 : _e.tldr) || "";
    const _a = (_f = entry.csl) == null ? void 0 : _f.author;
    const _yr = ((_j = (_i = (_h = (_g = entry.csl) == null ? void 0 : _g.issued) == null ? void 0 : _h["date-parts"]) == null ? void 0 : _i[0]) == null ? void 0 : _j[0]) || "";
    let authorStr = "";
    if (Array.isArray(_a) && _a.length) {
      const f0 = _a[0].family || _a[0].literal || _a[0].given || "";
      authorStr = (_a.length > 1 ? `${f0} 等` : f0) + (_yr ? ` · ${_yr}` : "");
    } else if (_yr) {
      authorStr = String(_yr);
    }
    const journal = ((_k = entry.csl) == null ? void 0 : _k["container-title"]) || "";
    cards.forEach((card) => {
      var _a3, _b2, _c2, _d2, _e2, _f2;
      const titleEl = card.querySelector(".pb-meta-paper");
      if (titleEl && title) {
        titleEl.textContent = title;
        titleEl.title = title;
      }
      if (authorStr) {
        const at = card.querySelector(".pb-meta-title");
        if (at) {
          at.textContent = authorStr;
          at.title = authorStr;
        }
      }
      if (journal) {
        let sub = card.querySelector(".pb-meta-sub");
        if (sub) {
          sub.textContent = journal;
          sub.title = journal;
        } else {
          const at = card.querySelector(".pb-meta-title");
          if (at) {
            sub = document.createElement("span");
            sub.className = "pb-meta-sub";
            sub.textContent = journal;
            sub.title = journal;
            at.parentNode.insertBefore(sub, at.nextSibling);
          }
        }
      }
      if (cites != null) {
        const right = card.querySelector(".pb-meta-right");
        if (right) {
          let citeChip = right.querySelector(".pb-meta-cites");
          if (!citeChip) {
            citeChip = document.createElement("span");
            citeChip.className = "pb-meta-cites";
            right.insertBefore(citeChip, right.firstChild);
          }
          citeChip.textContent = `被引 ${cites.toLocaleString()}`;
          if (star) citeChip.classList.add("pb-meta-cites-star");
          else citeChip.classList.remove("pb-meta-cites-star");
        }
      }
      if ((_a3 = this.plugin.settings.bbtBibPath) == null ? void 0 : _a3.trim()) {
        const right = card.querySelector(".pb-meta-right");
        if (right) {
          const row = ((_b2 = this._rows) != null ? _b2 : []).find((r) => (r._docId || "") === docId);
          const m = this.plugin._matchBib({
            csl: entry.csl,
            bbt: entry.bbt,
            doi: (_c2 = entry.csl) == null ? void 0 : _c2.DOI,
            title: (_d2 = entry.csl) == null ? void 0 : _d2.title,
            source_doc: (row == null ? void 0 : row._sourceFile) || (row == null ? void 0 : row.source_doc) || "",
            citekey: (_e2 = entry.bbt) == null ? void 0 : _e2.citekey
          });
          let bibChip = right.querySelector(".pb-meta-bib");
          if (!bibChip) {
            bibChip = document.createElement("span");
            bibChip.className = "pb-meta-bib";
            right.insertBefore(bibChip, right.firstChild);
          }
          if (m) {
            bibChip.textContent = `✓ @${m.citekey}`;
            bibChip.className = "pb-meta-bib in-bib";
            bibChip.title = "在你的 .bib，可直接 @citekey 引用（点击复制 [@citekey]）";
            bibChip.onclick = async (e) => {
              e.stopPropagation();
              await navigator.clipboard.writeText(`[@${m.citekey}]`);
              new obsidian11.Notice(`已复制 [@${m.citekey}]`);
            };
          } else {
            bibChip.textContent = "未在 .bib";
            bibChip.className = "pb-meta-bib not-bib";
            bibChip.title = "未匹配到 Better BibTeX 条目；插入引用时可一键追加到 .bib";
            bibChip.onclick = null;
          }
        }
      }
      if (star) {
        const top = card.querySelector(".pb-card-top");
        if (top && !top.querySelector(".pb-star-badge")) {
          const s = document.createElement("span");
          s.className = "pb-star-badge";
          s.title = `高影响力引用 ${entry.s2.influentialCitationCount} 条`;
          s.textContent = "★";
          top.appendChild(s);
        }
      }
      if (tldr) {
        let tldrEl = card.querySelector(".pb-tldr");
        if (!tldrEl) {
          tldrEl = document.createElement("div");
          tldrEl.className = "pb-tldr";
          const reasonWrap = card.querySelector(".pb-reason-wrap");
          (_f2 = reasonWrap == null ? void 0 : reasonWrap.parentNode) == null ? void 0 : _f2.insertBefore(tldrEl, reasonWrap);
        }
        tldrEl.textContent = `TL;DR · ${tldr}`;
      }
    });
    const rows = (_l = this._rows) != null ? _l : [];
    for (const r of rows) {
      if ((r._docId || "") === docId) {
        if (title) {
          r.paperTitle = title;
          r.title = title;
        }
        if (authorStr) r.author = authorStr;
        if (journal) r.journal = journal;
        if (cites != null) r.cites = cites;
        r._meta = entry;
      }
    }
  }
  // 渲染完后立刻把已缓存的元数据一次性 patch 上（避免等 resolveBatch）
  _patchRowsFromCache(root) {
    var _a, _b;
    const cache = (_a = this.plugin.docMetaCache) == null ? void 0 : _a.entries;
    if (!cache) return;
    const seen = /* @__PURE__ */ new Set();
    for (const r of (_b = this._rows) != null ? _b : []) {
      const id = r._docId;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const entry = cache[id];
      if (entry) this._patchCardMeta(root, id, entry);
    }
  }
  // AI 综合回答：credentials 向 PaperBell 请求，PaperSearch 发起 LLM 调用（按句渐显）
  async _generateAISummaryStream(bd, triggerBtn) {
    var _a, _b;
    const s = this.plugin.settings;
    if (!((_a = this._rows) == null ? void 0 : _a.length)) {
      bd.empty();
      bd.createEl("div", { cls: "pb-answer-gen", text: "没有检索结果" });
      return;
    }
    (_b = this._answerAbortCtl) == null ? void 0 : _b.abort();
    const ctl = this._answerAbortCtl = new AbortController();
    const stripHtml = (x) => String(x != null ? x : "").replace(/<[^>]+>/g, "");
    const topN = this._rows.slice(0, 8);
    const sources = topN.map((r, i) => {
      const title = r.paperTitle || r.title;
      const text = stripHtml(r.origFull || r.origShort).slice(0, 400);
      const bib = this.plugin._matchBib({ source_doc: r._sourceFile, title, _sourceFile: r._sourceFile });
      const tag = (bib == null ? void 0 : bib.citekey) ? `[@${bib.citekey}]` : `[${i + 1}]`;
      return `${tag} ${title}
${text}`;
    }).join("\n\n");
    const sys = s.aiAnswerPrompt && s.aiAnswerPrompt.trim() || DEFAULT_AI_ANSWER_PROMPT;
    const user = `检索主题：${this._lastQuery || ""}

召回文献片段（每条开头方括号是它的引用标号 / citekey）：
${sources}

请写文献综述式综合回答：`;
    bd.empty();
    const status = bd.createEl("div", { cls: "pb-answer-gen pb-answer-gen-loading" });
    status.textContent = "正在生成…";
    const stream = bd.createEl("div", { cls: "pb-answer-stream" });
    try {
      const full = await this.plugin._requestPaperbellCompletion({
        system: sys,
        messages: [{ role: "user", content: user }],
        temperature: 0.4,
        maxTokens: 2e3
      });
      if (ctl.signal.aborted) return;
      status.remove();
      await this._revealText(stream, full, ctl);
      if (ctl.signal.aborted) return;
      this._renderAnswerMd(bd, full);
    } catch (e) {
      if (ctl.signal.aborted) return;
      bd.empty();
      const rb = bd.createEl("div", {
        cls: "pb-answer-gen",
        text: `生成失败：${e.message}，点此重试`
      });
      rb.setAttribute("role", "button");
      rb.onclick = () => this._generateAISummaryStream(bd, triggerBtn);
    }
  }
  // 按句/标点切块逐块追加，模拟「逐渐显现」（requestUrl 不能真流式时用）
  async _revealText(el, text, ctl) {
    var _a;
    const chunks = String(text).match(/[^。！？!?\n]+[。！？!?\n]?/g) || [text];
    let acc = "";
    for (const c of chunks) {
      if ((_a = ctl == null ? void 0 : ctl.signal) == null ? void 0 : _a.aborted) return;
      acc += c;
      el.textContent = acc;
      el.scrollTop = el.scrollHeight;
      await new Promise((r) => setTimeout(r, 55));
    }
  }
  // 把答案文本规整后用 Obsidian Markdown 渲染进 el
  _renderAnswerMd(el, text) {
    const md = String(text != null ? text : "").split("\n").map((l) => l.replace(/^[ \t]+/, "")).join("\n").replace(/\n{3,}/g, "\n\n");
    el.empty();
    el.style.display = "";
    try {
      if (obsidian11.MarkdownRenderer.render) {
        obsidian11.MarkdownRenderer.render(this.app, md, el, "", this);
      } else {
        obsidian11.MarkdownRenderer.renderMarkdown(md, el, "", this);
      }
    } catch (_) {
      el.textContent = md;
    }
  }
  _intentPrefixes() {
    return {
      support: "支持证据、理论依据与实证结果：",
      contrast: "反例、相反结论、边界条件与批评：",
      method: "研究设计、方法、数据、测量与操作步骤：",
      definition: "权威定义、理论来源、概念边界与经典出处："
    };
  }
  _parseIntentQuery(value) {
    const raw = String(value || "").trim();
    for (const [intent, prefix] of Object.entries(this._intentPrefixes())) {
      if (raw.startsWith(prefix)) return { query: raw.slice(prefix.length).trim(), intent };
    }
    return { query: raw, intent: "" };
  }
  // 检索完成后：填充 LLM 综合答案 + 智能改写检索词提示
  _applyAnswerAndRewrite(root, result, typedQuery) {
    const panel = root.querySelector(".pb-answer-panel");
    if (panel) {
      if (!this.plugin.settings.enableAISummary) {
        panel.style.display = "none";
      } else {
        const bd = panel.querySelector(".pb-answer-bd");
        const tg = panel.querySelector(".pb-answer-toggle");
        const directAns = ((result == null ? void 0 : result.answer) || "").trim();
        let generated = !!directAns;
        if (directAns) this._renderAnswerMd(bd, directAns);
        const expand = () => {
          bd.style.display = "";
          tg.textContent = "收起";
          if (!generated) {
            generated = true;
            this._generateAISummaryStream(bd, null);
          }
        };
        const collapse = () => {
          bd.style.display = "none";
          tg.textContent = "展开";
        };
        tg.onclick = () => {
          bd.style.display === "none" ? expand() : collapse();
        };
        collapse();
        panel.style.display = "";
      }
    }
    const chip = root.querySelector(".pb-qrewrite");
    const rqRaw = ((result == null ? void 0 : result.retrieval_query) || (result == null ? void 0 : result.optimized_query) || "").trim();
    const rq = this._parseIntentQuery(rqRaw).query;
    if (chip) {
      if (rq && rq !== (typedQuery || "").trim()) {
        chip.querySelector(".pb-qrewrite-text").textContent = rq;
        chip.style.display = "";
        chip.querySelector(".pb-qrewrite-apply").onclick = () => {
          const input = root.querySelector(".pb-search-input");
          input.value = rq;
          chip.style.display = "none";
        };
        chip.querySelector(".pb-qrewrite-close").onclick = () => {
          chip.style.display = "none";
        };
      } else {
        chip.style.display = "none";
      }
    }
  }
  _stopSearchTimer() {
    if (this._searchTimer) window.clearInterval(this._searchTimer);
    this._searchTimer = null;
  }
  _searchTimingDetail(source = {}) {
    const timings = source.timings_ms || source.timings || source;
    const retrievalTimings = source.retrieval_timings_ms || ((source.retrieval_debug || {}).baseline_timings_ms || {});
    const parts = [];
    const add = (label, value) => {
      const ms = Number(value) || 0;
      if (ms >= 0.5) parts.push(`${label} ${pbFormatSearchDuration(ms)}`);
    };
    add("检索词处理", timings.prepare_query);
    add("本地召回", timings.retrieval || retrievalTimings.total_ms);
    add("相关性说明", timings.annotation);
    add("回答生成", timings.answer);
    add("结果核查", timings.validate);
    return parts.join(" · ");
  }
  _setSearchProgress(root, state, label, elapsedMs, detail = "") {
    const panel = root.querySelector(".pb-search-progress");
    if (!panel) return;
    panel.style.display = "";
    panel.classList.remove("is-running", "is-done", "is-error");
    panel.classList.add(`is-${state}`);
    const labelEl = panel.querySelector(".pb-search-progress-label");
    const elapsedEl = panel.querySelector(".pb-search-elapsed");
    const detailEl = panel.querySelector(".pb-search-progress-detail");
    if (labelEl) labelEl.textContent = label;
    if (elapsedEl) elapsedEl.textContent = `${state === "running" ? "已用时 " : "总耗时 "}${pbFormatSearchDuration(elapsedMs)}`;
    if (detailEl) {
      detailEl.textContent = detail;
      detailEl.style.display = detail ? "" : "none";
    }
  }
  // ── 检索流程（POST /analyze-stream，NDJSON 流式）────────
  _runSearch(root) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p2;
    if (this._librariesReady === false) {
      new obsidian11.Notice("正在选择可用文献库，请稍候");
      return;
    }
    if (this._hasLibraries === false) {
      new obsidian11.Notice("还没有可检索的文献库，请先在「文献库管理」中导入 PDF");
      return;
    }
    const query = root.querySelector(".pb-search-input").value.trim();
    if (!query) return;
    this._lastQuery = query;
    const intent = this.plugin.settings.searchIntent || "support";
    const preset = this.plugin.settings.searchMode || "balanced";
    const INTENT_PREFIX = this._intentPrefixes();
    const library = (_b = (_a = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a.dataset.lib) != null ? _b : "default";
    this.plugin.settings.lastLibrary = library;
    this.plugin.saveSettings();
    this._searchHistory = [
      { q: query, ts: Date.now(), library, intent, preset },
      ...((_c = this._searchHistory) != null ? _c : []).filter((h) => !(h.q === query && h.intent === intent && h.library === library))
    ].slice(0, 20);
    const container = root.querySelector(".pb-results");
    const _p = (field) => root.querySelector(`[data-field="${field}"]`);
    const searchParams = {
      text: `${INTENT_PREFIX[intent] || ""}${query}`,
      raw_text: query,
      intent,
      preset,
      mode_scope: this._searchModeScope || "preset",
      library,
      top_k: parseInt((_e = (_d = _p("top_k")) == null ? void 0 : _d.value) != null ? _e : 5),
      recall_top_k: parseInt((_g = (_f = _p("recall_top_k")) == null ? void 0 : _f.value) != null ? _g : 20),
      max_chunks_per_document: parseInt((_i = (_h = _p("max_chunks_per_document")) == null ? void 0 : _h.value) != null ? _i : 2),
      optimize_query: (_k = (_j = root.querySelector('.pb-ai-toggle[data-key="optimize"]')) == null ? void 0 : _j.classList.contains("active")) != null ? _k : false,
      annotate_chunks: (_m = (_l = root.querySelector('.pb-ai-toggle[data-key="annotate"]')) == null ? void 0 : _l.classList.contains("active")) != null ? _m : false
    };
    this._stopSearchTimer();
    (_p2 = this._searchAbortCtl) == null ? void 0 : _p2.abort();
    const ctl = this._searchAbortCtl = new AbortController();
    const searchStartedAt = performance.now();
    let progressLabel = "正在连接本地检索服务…";
    let progressDetail = "";
    let searchFinished = false;
    const currentElapsed = () => Math.max(0, performance.now() - searchStartedAt);
    const refreshProgress = () => this._setSearchProgress(root, "running", progressLabel, currentElapsed(), progressDetail);
    const finishSearch = (state, label, result = null, detail = "") => {
      if (searchFinished) return this._lastSearchElapsedMs || currentElapsed();
      searchFinished = true;
      this._stopSearchTimer();
      const elapsed = currentElapsed();
      this._lastSearchElapsedMs = elapsed;
      this._setSearchProgress(root, state, label, elapsed, detail || this._searchTimingDetail(result || {}));
      return elapsed;
    };
    refreshProgress();
    this._searchTimer = window.setInterval(refreshProgress, 100);
    (_n = root.querySelector(".pb-answer-panel")) == null ? void 0 : _n.style.setProperty("display", "none");
    (_o = root.querySelector(".pb-qrewrite")) == null ? void 0 : _o.style.setProperty("display", "none");
    container.classList.remove("pb-results-idle");
    container.innerHTML = `
      <div class="pb-search-running">
        <div class="pb-search-dots"><span></span><span></span><span></span></div>
        <span class="pb-search-status">正在搜索文献…</span>
      </div>`;
    const setStatus = (msg, detail = progressDetail) => {
      progressLabel = msg;
      progressDetail = detail || "";
      refreshProgress();
      const el = container.querySelector(".pb-search-status");
      if (el) el.textContent = msg;
    };
    const renderRows = () => {
      var _a2;
      const view = (_a2 = this._currentView) != null ? _a2 : "list";
      if (view === "grid") {
        container.innerHTML = this._gridGroupedHTML();
        this._bindGridGroupToggles(container);
      } else {
        container.innerHTML = this._rows.map(rowHTML).join("");
      }
      this._bindCardEvents(container, root);
      this._applyFilters(root);
      const cnt = root.querySelector(".pb-footer strong");
      if (cnt) cnt.textContent = String(this._rows.length);
      const hEntry = this._searchHistory.find((h) => h.q === query && h.intent === intent && h.library === library);
      if (hEntry) {
        hEntry.cachedRows = [...this._rows];
        hEntry.cachedResult = this._lastResult;
        hEntry.cachedRequestId = this._requestId;
      }
    };
    this._lastSearchParams = searchParams;
    const body = this._buildAnalyzeBody(searchParams);
    let gotAny = false;
    this.plugin.api.streamJson("/analyze-stream", body, (evt) => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
      if (ctl.signal.aborted) return;
      const t = evt.type;
      if (t === "progress") {
        setStatus(evt.label || "正在检索…", this._searchTimingDetail({
          timings_ms: evt.timings_ms || {},
          retrieval_timings_ms: evt.retrieval_timings_ms || {}
        }));
      } else if (t === "initial") {
        const chunks = (_b2 = (_a2 = evt.result) == null ? void 0 : _a2.retrieved_chunks) != null ? _b2 : [];
        this._rows = chunks.map((c, i) => this._chunkToRow(c, i));
        this._lastResult = evt.result;
        this._hasSearched = true;
        root.querySelector(".pb-footer").style.display = "";
        if (!this._rows.length) {
          container.innerHTML = `<div class="pb-empty-state"><p>未检索到相关文献</p>
             <p>试试换一种问法，或在设置中使用「深度」检索</p></div>`;
        } else {
          renderRows();
          setStatus(
            searchParams.annotate_chunks ? `已找到 ${this._rows.length} 条结果，正在生成相关性说明…` : "正在整理检索结果…",
            this._searchTimingDetail(evt.result || {})
          );
          this._applyAnswerAndRewrite(root, evt.result, query);
        }
        gotAny = true;
      } else if (t === "chunk_annotation") {
        const i = evt.index;
        if (this._rows[i]) {
          const merged = this._chunkToRow(evt.chunk, i);
          this._rows[i] = merged;
          const card = container.querySelector(
            `.pb-result-card[data-id="${merged.id}"]`
          );
          if (card) {
            const rs = card.querySelector(".pb-reason-short");
            const rp = card.querySelector(".pb-reason-popup");
            const rc = card.querySelector(".pb-rel-chip");
            if (rs) rs.innerHTML = merged.reasonShort;
            if (rp) rp.innerHTML = merged.reasonFull;
            if (rc && merged.relation_type) rc.textContent = merged.relation_type;
            card.dataset.tag = merged.tag;
            card.dataset.rel = merged.relation_type || "";
            card.querySelectorAll(".pb-rtag, .pb-rtag-tbl").forEach((tagEl) => {
              TAG_KEYS.forEach((key) => tagEl.classList.remove(`pb-rt-${key}`));
              tagEl.classList.add(TAG_META[merged.tag].cls);
              tagEl.dataset.tag = merged.tag;
              tagEl.textContent = TAG_META[merged.tag].label;
            });
          }
        }
      } else if (t === "final") {
        const chunks = (_d2 = (_c2 = evt.result) == null ? void 0 : _c2.retrieved_chunks) != null ? _d2 : [];
        this._rows = chunks.map((c, i) => this._chunkToRow(c, i));
        this._lastResult = evt.result;
        this._requestId = (_f2 = (_e2 = evt.result) == null ? void 0 : _e2.request_id) != null ? _f2 : "";
        this._hasSearched = true;
        root.querySelector(".pb-footer").style.display = "";
        if (!this._rows.length) {
          container.innerHTML = `<div class="pb-empty-state"><p>未检索到相关文献</p>
             <p>试试换一种问法，或在设置中使用「深度」检索</p></div>`;
        } else {
          renderRows();
          this._patchRowsFromCache(root);
          this._prefetchPaperFocus(
            this._rows.slice(0, 3),
            searchParams.library,
            query
          );
          if (((_g2 = this.plugin.settings.metadataResolver) == null ? void 0 : _g2.enabled) !== false) {
            this.plugin.metaResolver.resolveBatch(this._rows.slice(0, 10), { signal: ctl.signal }).catch(() => {
            });
          }
        }
        this._applyAnswerAndRewrite(root, evt.result, query);
        const elapsed = finishSearch("done", `检索完成 · ${this._rows.length} 条结果`, evt.result || {});
        const hEntry = this._searchHistory.find((h) => h.q === query && h.intent === intent && h.library === library);
        if (hEntry) hEntry.elapsedMs = elapsed;
        gotAny = true;
      } else if (t === "error") {
        finishSearch("error", "检索失败", null, evt.detail || "本地服务返回错误");
        container.innerHTML = `<div class="pb-empty-state pb-ls-error">
             <p>检索失败</p><p>${pbEscapeHtml((_h2 = evt.detail) != null ? _h2 : "本地服务返回错误")}</p></div>`;
      }
    }, { signal: ctl.signal }).catch(async (err) => {
      if (ctl.signal.aborted || (err == null ? void 0 : err.name) === "AbortError") return;
      if (gotAny) {
        finishSearch("error", "检索未完整完成", this._lastResult || {}, err.message || "连接中断，已保留已返回结果");
        return;
      }
      let dg;
      try {
        dg = await this.plugin.api.diagnose();
      } catch (_) {
        dg = { title: "无法连接本地服务", hint: err.message };
      }
      const action = dg.repair ? `<button class="pb-empty-action pb-empty-repair">安装或修复本地服务</button>` : dg.retry ? `<button class="pb-empty-action pb-empty-retry">重试</button>` : "";
      container.innerHTML = `<div class="pb-empty-state pb-ls-error">
           <p>${pbEscapeHtml(dg.title)}</p>
           <p class="pb-empty-hint">${pbEscapeHtml(dg.hint)}</p>
           ${action}</div>`;
      finishSearch("error", dg.title || "检索失败", null, dg.hint || err.message || "");
      const rb = container.querySelector(".pb-empty-repair");
      if (rb) rb.onclick = () => {
        var _a2, _b2;
        return (_b2 = (_a2 = this.plugin)._openCoreSetup) == null ? void 0 : _b2.call(_a2);
      };
      const ry = container.querySelector(".pb-empty-retry");
      if (ry) ry.onclick = () => this._runSearch(root);
    });
  }
  // ── AI 生成：要求结构化 Claim → source_numbers，插入时才能建立真实 Evidence 映射 ──
  _generate(root) {
    var _a;
    const checked = [...root.querySelectorAll(".pb-cb:checked")];
    const n = checked.length;
    if (!n) return;
    const rows = checked.map((cb) => this._rows.find((r) => r.id === cb.dataset.id)).filter(Boolean);
    const inst = ((_a = root.querySelector(".pb-inst")) == null ? void 0 : _a.value.trim()) || "";
    const preview = root.querySelector(".pb-preview");
    const bd = root.querySelector(".pb-preview-bd");
    const meta = root.querySelector(".pb-preview-meta");
    const insertBtn = root.querySelector(".pb-btn-insert");
    const generationToken = this._generationSeq = (this._generationSeq || 0) + 1;
    this._generating = true;
    this._lastGeneratedDraft = null;
    meta.textContent = `· 基于 ${n} 条原文片段`;
    preview.style.display = "";
    bd.textContent = "生成中…";
    if (insertBtn) {
      insertBtn.textContent = "正在关联来源…";
      insertBtn.disabled = true;
    }
    (async () => {
      var _a2;
      const strip = (x) => String(x != null ? x : "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const papers = rows.map((r, i) => {
        const t = r.paperTitle || r.title || r.source_doc || `文献${i + 1}`;
        const psg = strip(r.origFull || r.origShort).slice(0, 500);
        return `[${i + 1}] ${t}${r.page ? `（第 ${r.page} 页）` : ""}
命中片段：${psg || "（无）"}`;
      }).join("\n\n");
      const sys = [
        "你是严谨的中文学术写作助手。只能根据给定原文生成有明确原文依据的论断。",
        '返回严格 JSON：{"claims":[{"text":"一条完整论断句","source_numbers":[1,2]}]}。',
        "每条 text 必须是一条能与给定原文直接比对的完整论断；每条都必须至少有一个来源编号；编号只能来自给定文献。",
        "不得生成没有来源的过渡句、评价句或结论；不得把来源未表达的内容写成事实。",
        "不要在 text 内写 [1]、脚注、Markdown 或解释，来源只放在 source_numbers。",
        "除非指令要求换语言，否则用中文。"
      ].join("\n");
      const user = `指令：${inst || "综合这些文献，生成若干条可供修改且逐句关联来源的学术论断"}

可用文献：
${papers}`;
      let raw = "";
      try {
        raw = await this.plugin._requestPaperbellCompletion({
          system: sys,
          messages: [{ role: "user", content: user }],
          temperature: 0.2,
          maxTokens: 1600,
          responseFormat: { type: "json_object" }
        });
        if (generationToken !== this._generationSeq) return;
      } catch (e) {
        if (generationToken !== this._generationSeq) return;
        bd.textContent = "生成失败：" + (e.message || "未知错误");
        if (insertBtn) {
          insertBtn.textContent = "插入 AI 草稿（未关联来源）";
          insertBtn.disabled = false;
        }
        this._generating = false;
        new obsidian11.Notice("AI 生成失败：" + (e.message || "未知错误"));
        return;
      }
      const cleaned = String(raw || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      try {
        const parsed = JSON.parse(cleaned || "{}");
        const claims = (Array.isArray(parsed.claims) ? parsed.claims : []).map((c) => ({
          text: String((c == null ? void 0 : c.text) || "").trim(),
          source_numbers: [...new Set((Array.isArray(c == null ? void 0 : c.source_numbers) ? c.source_numbers : []).map((x) => parseInt(x, 10)))]
        }));
        const valid = claims.length > 0 && claims.every((c) => c.text && c.source_numbers.length > 0 && c.source_numbers.every((x) => Number.isInteger(x) && x >= 1 && x <= rows.length));
        if (!valid) throw new Error("存在无来源论断或来源编号越界");
        const library = ((_a2 = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a2.dataset.lib) || this.plugin.settings.lastLibrary || "default";
        this._lastGeneratedDraft = { claims, rows, library };
        bd.textContent = claims.map((c) => `${c.text} ${c.source_numbers.map((x) => `[${x}]`).join("")}`).join("\n\n");
        meta.textContent = `· ${claims.length} 条论断 · ${n} 条来源 · 插入时关联来源`;
        if (insertBtn) {
          insertBtn.textContent = "插入正文并关联来源";
          insertBtn.disabled = false;
        }
        this._generating = false;
      } catch (err) {
        this._lastGeneratedDraft = null;
        bd.textContent = cleaned || "模型没有返回可用内容";
        meta.textContent = "· 部分论断未关联来源";
        if (insertBtn) {
          insertBtn.textContent = "插入 AI 草稿（未关联来源）";
          insertBtn.disabled = false;
        }
        this._generating = false;
        new obsidian11.Notice(`部分 AI 论断未关联来源，将作为普通草稿插入：${err.message}`, 9e3);
      }
    })();
  }
  // ── 写作项目：上下文提取 + 关联分析（Longform 场景感知）──
  async _extractWritingContext() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const path = this.plugin.settings.writingProjectPath;
    if (!path) return null;
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) return null;
    let raw = "";
    try {
      raw = await this.app.vault.read(file);
    } catch (_) {
      return null;
    }
    let body = raw, fm = {};
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (fmMatch) {
      body = raw.slice(fmMatch[0].length);
      try {
        fm = (_b = (_a = obsidian11.parseYaml) == null ? void 0 : _a(fmMatch[1])) != null ? _b : {};
      } catch (_) {
      }
    }
    const title = fm.title || ((_c = fm.longform) == null ? void 0 : _c.title) || fm.paper_title || file.basename;
    let thesis = fm.thesis || "";
    if (!thesis) {
      const firstPara = body.split(/\n\s*\n/).find((p) => p.trim().length > 30) || "";
      thesis = firstPara.replace(/^[#>*\-\s]+/, "").trim().slice(0, 280);
    }
    const isLongformScenes = ((_d = fm.longform) == null ? void 0 : _d.format) === "scenes" && Array.isArray(fm.longform.scenes);
    let outline = "";
    if (isLongformScenes) {
      outline = fm.longform.scenes.map((s, i) => `§${i + 1} ${s}`).join("\n");
    } else {
      outline = (body.match(/^#{1,3}\s+.+$/gm) || []).map((h) => h.trim()).slice(0, 30).join("\n");
    }
    let focus = "", focusSceneRel = "", focusSceneMtime = 0, focusSceneTitle = "";
    const project = {
      path,
      folder: ((_e = file.parent) == null ? void 0 : _e.path) || "",
      format: isLongformScenes ? "scenes" : ((_f = fm.longform) == null ? void 0 : _f.format) || "single"
    };
    const activeScenePath = this.plugin._resolveActiveScene(project);
    if (activeScenePath) {
      const sceneFile = this.app.vault.getAbstractFileByPath(activeScenePath);
      if (sceneFile) {
        try {
          const sraw = await this.app.vault.read(sceneFile);
          const sBody = sraw.replace(/^---\n[\s\S]*?\n---\n?/, "");
          focus = sBody.slice(0, 1500).trim();
          focusSceneRel = activeScenePath.replace(project.folder + "/", "");
          focusSceneTitle = sceneFile.basename;
          focusSceneMtime = ((_g = sceneFile.stat) == null ? void 0 : _g.mtime) || 0;
        } catch (_) {
        }
      }
    }
    if (!focus) {
      const lastH2 = body.lastIndexOf("\n## ");
      focus = lastH2 >= 0 ? body.slice(lastH2).replace(/^[\n#\s]+/, "").slice(0, 1e3) : body.slice(-700).trim();
    }
    return {
      path,
      mtime: ((_h = file.stat) == null ? void 0 : _h.mtime) || 0,
      title,
      thesis,
      outline,
      focus,
      focusSceneRel,
      focusSceneTitle,
      focusSceneMtime,
      isLongform: !!fm.longform
    };
  }
  // 论文 ↔ 写作项目 关联分析（按需触发，结果缓存到 paper-focus cache 的 writingFit 字段）
  async _analyzeFitWithProject(row, f) {
    const ctx = await this._extractWritingContext();
    if (!ctx) throw new Error("请先设置当前写作项目（命令：「设为当前写作项目」）");
    const sceneKey = ctx.focusSceneRel || "__main__";
    const sceneMtime = ctx.focusSceneMtime || ctx.mtime;
    const cacheKey = this.plugin._analysisCacheKey({
      library: row._library || "",
      documentId: row._docId,
      sourceFile: row._sourceFile,
      query: `__fit__|${ctx.path}|${sceneKey}|${sceneMtime}`
    });
    const cached = this.plugin._readAnalysisCache(cacheKey);
    if (cached == null ? void 0 : cached.fitResult) return cached.fitResult;
    const stripHtml = (x) => String(x != null ? x : "").replace(/<[^>]+>/g, "");
    const sys = "你是学术写作助手。给定研究者正在写的论文上下文和一篇文献分析，判断该文献如何融入当前论证。返回严格 JSON，字段：fit_summary（关联摘要）/ best_placement（适合放在哪一节及理由）/ specific_use（数组，基于原文提炼的使用要点）/ risks（数组，引用风险）/ suggested_angle（建议引用角度）。不要返回任何 markdown 标记或 JSON 外的字符。";
    const user = [
      "【正在写的论文】",
      `标题：${ctx.title}`,
      `核心论点 / Thesis：${ctx.thesis || "（未提供）"}`,
      "",
      "章节大纲：",
      ctx.outline || "（无）",
      "",
      ctx.focusSceneTitle ? `用户当前正在编辑的章节：「${ctx.focusSceneTitle}」` : "用户最近编辑的段落：",
      ctx.focus || "（无）",
      "",
      "【待关联的文献】",
      `标题：${row.paperTitle || row.title}`,
      `研究角色：${f.roleLabel || ""}`,
      `核心结论：${stripHtml(f.judgement || "")}`,
      `文献要点（请核对原文）：${(f.contributions || []).map(stripHtml).join("；")}`,
      `局限与适用边界：${(f.limitations || []).map(stripHtml).join("；")}`,
      `关键原文片段：${stripHtml(row.origFull || row.origShort || "").slice(0, 600)}`
    ].join("\n");
    const out = await this.plugin._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: user }],
      temperature: 0.3,
      maxTokens: 1500,
      responseFormat: { type: "json_object" }
    });
    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (e) {
      throw new Error("LLM 返回非 JSON");
    }
    const result = {
      generated_at: Date.now(),
      project_path: ctx.path,
      project_title: ctx.title,
      project_mtime: ctx.mtime,
      // 新增：本次分析针对的具体场景（Longform scenes 模式下）
      scene_rel: ctx.focusSceneRel || "",
      scene_title: ctx.focusSceneTitle || "",
      scene_mtime: ctx.focusSceneMtime || 0,
      fit_summary: parsed.fit_summary || "",
      best_placement: parsed.best_placement || "",
      specific_use: parsed.specific_use || [],
      risks: parsed.risks || [],
      suggested_angle: parsed.suggested_angle || ""
    };
    const existing = this.plugin._readAnalysisCache(cacheKey) || {};
    this.plugin._writeAnalysisCache(cacheKey, {
      response: existing.response || null,
      paperTitle: row.paperTitle || row.title || "",
      sourceFile: row._sourceFile || "",
      library: row._library || "",
      query: `__fit__|${ctx.path}`,
      fitResult: result
    });
    return result;
  }
  // 把关联分析结果格式化为 markdown 章节
  _fitResultToMd(fit) {
    var _a, _b;
    const projectBase = fit.project_path.replace(/\.md$/i, "").split("/").pop();
    const sceneLabel = fit.scene_title ? ` · 章节：[[${fit.scene_title}]]` : "";
    const lines = [
      "",
      "## 与当前写作项目的关联",
      "",
      `> 项目：[[${projectBase}]]${sceneLabel} · 分析于 ${new Date(fit.generated_at).toLocaleString("zh-CN")}`,
      "",
      `**与论点的契合**：${fit.fit_summary || "—"}`,
      "",
      `**建议放置**：${fit.best_placement || "—"}`,
      "",
      "**具体可拿来用**：",
      ...((_a = fit.specific_use) == null ? void 0 : _a.length) ? fit.specific_use.map((s) => `- ${s}`) : ["- —"],
      "",
      "**风险与边界**：",
      ...((_b = fit.risks) == null ? void 0 : _b.length) ? fit.risks.map((r) => `- ${r}`) : ["- —"],
      "",
      `**建议引用角度**：${fit.suggested_angle || "—"}`,
      ""
    ];
    return lines.join("\n");
  }
  // 中译：credentials 向 PaperBell 请求
  async _llmTranslateToZh(text) {
    return this.plugin._requestPaperbellCompletion({
      system: "你是学术翻译助手。把英文学术段落翻译成准确流畅的中文，保留专有名词原文（首次出现可在括号注英文），保持学术严谨。直接返回译文，不要加任何标记或解释。",
      messages: [{ role: "user", content: text }],
      temperature: 0.3,
      maxTokens: 2e3
    });
  }
  // ── 点击检索卡片原文 → 弹 PDF 浮窗（PDF.js 自渲染）────
  // 用 Obsidian 内置 window.pdfjsLib 渲染：工具栏全主题化 + 跳页 + 命中片段高亮闪烁
  // 后端没有坐标，按 chunk.text 在该页 textContent 里做文本匹配定位高亮
  async _showPdfModal(root, row) {
    var _a, _b, _c;
    const library = ((_a = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a.dataset.lib) || ((_b = this._lastSearchParams) == null ? void 0 : _b.library) || "default";
    if (!row._docId && !row._sourceFile && !row._sourcePath) {
      new obsidian11.Notice("该结果缺少 PDF 标识，无法定位原文");
      return;
    }
    (_c = root.querySelector(".pb-pdf-modal")) == null ? void 0 : _c.remove();
    const hitText = String(row.origFull || row.origShort || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const overlay = root.createDiv({ cls: "pb-pdf-modal" });
    const panel = overlay.createDiv({ cls: "pb-pdf-modal-panel" });
    const bar = panel.createDiv({ cls: "pb-pdf-modal-bar" });
    bar.createSpan({ cls: "pb-pdf-modal-title", text: row.paperTitle || row.title || "原文 PDF" });
    const tools = bar.createDiv({ cls: "pb-pdf-tools" });
    const openExt = tools.createSpan({ cls: "pb-pdf-tool", text: "↗", attr: { title: "在 Obsidian 新标签页打开" } });
    const closeBtn = tools.createSpan({ cls: "pb-pdf-tool pb-pdf-modal-close", text: "✕", attr: { title: "关闭 (Esc)" } });
    const host = panel.createDiv({ cls: "pb-pdf-modal-host" });
    const viewer = this.plugin._mountPdfViewer(host, {
      library,
      documentId: row._docId || "",
      sourceFile: row._sourceFile || "",
      srcPath: row._sourcePath || "",
      page: parseInt(row.page) || 1,
      hitText
    });
    const dock = this.plugin._mountPdfModalAnnoDock(panel, { srcPath: row._sourcePath || "", sourceFile: row._sourceFile || "" }, viewer);
    const close = () => {
      try {
        dock == null ? void 0 : dock.destroy();
      } catch (_) {
      }
      try {
        viewer == null ? void 0 : viewer.destroy();
      } catch (_) {
      }
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") viewer == null ? void 0 : viewer.prev();
      else if (e.key === "ArrowRight") viewer == null ? void 0 : viewer.next();
    };
    closeBtn.onclick = close;
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
    this.registerDomEvent(document, "keydown", onKey);
    this.register(close);
    openExt.onclick = async () => {
      try {
        await this.plugin.openPdfInObsidian(library, row._docId, row._sourceFile);
        close();
      } catch (err) {
        new obsidian11.Notice(`打开失败：${err.message}`);
      }
    };
  }
  // 拿 Obsidian 内置 pdf.js —— 用官方 API obsidian.loadPdfJs()
  // 它返回完整 pdfjs-dist 模块（getDocument / Util / GlobalWorkerOptions 均有），
  // worker 由 Obsidian 配好，不依赖打开过 PDF，不依赖 window 全局
  // 委托给插件（统一实现，供检索弹窗 + 内联/悬停代码块共用）
  async _ensurePdfjs() {
    return this.plugin._ensurePdfjs();
  }
  _matchHitRects(textContent, hitText, viewport) {
    return this.plugin._matchHitRects(textContent, hitText, viewport);
  }
  // ── Paper Focus：全窗口分析视图（带本地缓存）──────────
  _showFocusScreen(root, row) {
    var _a, _b, _c, _d, _e;
    const screen = root.querySelector(".pb-focus-screen");
    const body = screen.querySelector(".pb-fs-body");
    screen.querySelector(".pb-fs-back").onclick = () => screen.classList.remove("active");
    screen.classList.add("active");
    const stripHtml = (s) => String(s != null ? s : "").replace(/<[^>]+>/g, "");
    const library = (_b = (_a = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a.dataset.lib) != null ? _b : "default";
    const query = this._lastQuery || ((_d = (_c = root.querySelector(".pb-search-input")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "";
    const cacheKey = this.plugin._analysisCacheKey({
      library,
      documentId: row._docId,
      sourceFile: row._sourceFile,
      query
    });
    const reqBody = {
      query,
      library,
      document_id: row._docId || "",
      source_file: row._sourceFile || "",
      hit_chunks: [{
        chunk_id: row.id,
        page_number: (_e = row.page) != null ? _e : null,
        chunk_index: null,
        text: stripHtml(row.origShort),
        parent_text: stripHtml(row.origFull),
        relevance_label: stripHtml(row.reasonShort),
        relation_type: row.relation_type || "",
        connection_reason: stripHtml(row.reasonFull)
      }]
    };
    const ageText = (ms) => {
      const m = Math.floor(ms / 6e4);
      if (m < 1) return "刚刚";
      if (m < 60) return `${m} 分钟前`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h} 小时前`;
      const d = Math.floor(h / 24);
      return `${d} 天前`;
    };
    const renderFocus = (f, cacheMeta) => {
      var _a2, _b2;
      const e = pbEscapeHtml;
      const metaParts = [row.venue, row.cites ? `被引 ${e(row.cites)} 次` : ""].filter(Boolean);
      const roleChips = f.roles.map((r) => `<span class="pb-focus-role pb-rt-${e(r.tag)}">${e(r.label)}</span>`).join("");
      const chunkLabel = `查看本次命中的 ${e((_a2 = f.hitCount) != null ? _a2 : 1)} 个片段`;
      const cacheBar = cacheMeta ? `<div class="pb-fs-cache-bar">
             <span>已缓存 · ${ageText(Date.now() - cacheMeta.createdAt)}</span>
             <span class="pb-fs-rerun" role="button">重新分析</span>
           </div>` : "";
      body.innerHTML = `
        ${cacheBar}
        <div class="pb-fs-paper-hd">
          <div class="pb-fs-paper-title">${row.paperTitle || row.title}</div>
          <div class="pb-fs-paper-meta">${[row.title, ...metaParts].filter(Boolean).join(" · ")}</div>
        </div>

        <div class="pb-fs-roles-hd">
          <div>
            <div class="pb-fs-slabel">研究角色</div>
            <div class="pb-fs-roles">${roleChips}</div>
          </div>
          <div class="pb-fs-analysis-meta">${e(f.analysisMeta)}</div>
        </div>

        <div class="pb-fs-grid">
          <div class="pb-fs-card">
            <div class="pb-fs-slabel">核心结论</div>
            <div class="pb-fs-judgement">${e(f.judgement)}</div>
          </div>
          <div class="pb-fs-card">
            <div class="pb-fs-slabel">建议用途</div>
            <p class="pb-fs-text">${e(f.advice)}</p>
          </div>
          <div class="pb-fs-card">
            <div class="pb-fs-slabel">文献要点（请核对原文）</div>
            <ul class="pb-fs-list">${f.contributions.map((c) => `<li>${e(c)}</li>`).join("")}</ul>
          </div>
          <div class="pb-fs-card pb-fs-card--limits">
            <div class="pb-fs-slabel">局限与适用边界</div>
            <ul class="pb-fs-list">${f.limitations.map((l) => `<li>${e(l)}</li>`).join("")}</ul>
          </div>
        </div>

        <div class="pb-fs-details">
          <details class="pb-fs-detail">
            <summary>查看本次检索问题</summary>
            <p class="pb-fs-detail-text">${e(f.userInput)}</p>
          </details>
          <details class="pb-fs-detail" open>
            <summary>${chunkLabel}</summary>
            <div class="pb-fs-chunk-actions">
              <button class="pb-fs-translate" type="button">翻译为中文</button>
            </div>
            <div class="pb-fs-detail-text" data-mode="orig">${e(f.hitChunk)}</div>
          </details>
        </div>`;
      (_b2 = body.querySelector(".pb-fs-rerun")) == null ? void 0 : _b2.addEventListener(
        "click",
        () => runApi(true)
      );
      const trBtn = body.querySelector(".pb-fs-translate");
      const trEl = body.querySelector(".pb-fs-detail-text[data-mode]");
      if (trBtn && trEl) {
        const origText = f.hitChunk;
        trBtn.onclick = async () => {
          var _a3;
          if (trEl.dataset.mode === "zh") {
            trEl.textContent = origText;
            trEl.dataset.mode = "orig";
            trBtn.textContent = "翻译为中文";
            return;
          }
          const cached2 = (_a3 = this._translateCache) == null ? void 0 : _a3.get(origText);
          if (cached2) {
            trEl.textContent = cached2;
            trEl.dataset.mode = "zh";
            trBtn.textContent = "查看原文";
            return;
          }
          trBtn.disabled = true;
          trBtn.textContent = "翻译中…";
          try {
            const zh = await this._llmTranslateToZh(origText);
            if (!this._translateCache) this._translateCache = /* @__PURE__ */ new Map();
            this._translateCache.set(origText, zh);
            trEl.textContent = zh;
            trEl.dataset.mode = "zh";
            trBtn.textContent = "查看原文";
          } catch (e2) {
            new obsidian11.Notice(`翻译失败：${e2.message}`);
          } finally {
            trBtn.disabled = false;
          }
        };
      }
      screen.querySelector(".pb-fs-note-btn").onclick = () => {
        this.plugin._pinAnalysisCache(cacheKey);
        Promise.race([
          this.plugin.metaResolver.resolve(row).catch(() => null),
          new Promise((r) => setTimeout(r, 5e3))
        ]).then(() => {
          var _a3;
          this._addLitNote(row, f, { library, query, batch: (_a3 = this._rows) != null ? _a3 : [] });
        });
      };
    };
    const runApi = (force) => {
      body.innerHTML = `<div class="pb-fs-loading"><span class="pb-loading">正在分析这篇论文…</span></div>`;
      this.plugin.api.postJson("/paper-focus", reqBody).then((resp) => {
        this._lastFocusRequestId = (resp == null ? void 0 : resp.request_id) || "";
        this.plugin._writeAnalysisCache(cacheKey, {
          response: resp,
          paperTitle: row.paperTitle || row.title || "",
          sourceFile: row._sourceFile || "",
          library,
          query,
          requestId: (resp == null ? void 0 : resp.request_id) || ""
        });
        renderFocus(this._focusRespToF(resp, row), null);
      }).catch((err) => {
        body.innerHTML = `<div class="pb-fs-loading pb-ls-error">
             <p>论文分析失败</p><p>${pbEscapeHtml(err.message)}</p></div>`;
      });
    };
    const cached = this.plugin._readAnalysisCache(cacheKey);
    if (cached) {
      this._lastFocusRequestId = cached.requestId || "";
      renderFocus(
        this._focusRespToF(cached.response, row),
        { createdAt: cached.createdAt }
      );
    } else {
      runApi(false);
    }
  }
  // /paper-focus 响应 → focus 视图 f 对象
  _focusRespToF(resp, row) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const a = (_a = resp == null ? void 0 : resp.analysis) != null ? _a : {};
    const ROLE_TAG = {
      "直接支持": "support",
      "机制补充": "theory",
      "方法参考": "method",
      "对照/边界": "contrast",
      "反例/冲突": "contrast",
      "背景参考": "bg"
    };
    const primary = a.primary_role || "参考文献";
    const roles = [
      { label: primary, tag: (_c = (_b = ROLE_TAG[primary]) != null ? _b : row.tag) != null ? _c : "support" },
      ...((_d = a.secondary_roles) != null ? _d : []).map((s) => {
        var _a2;
        return {
          label: s,
          tag: (_a2 = ROLE_TAG[s]) != null ? _a2 : "bg"
        };
      })
    ];
    const takeaways = ((_e = a.hit_chunk_takeaways) != null ? _e : []).map((t) => t.note).filter(Boolean);
    const chars = ((_f = resp == null ? void 0 : resp.document_text_chars) != null ? _f : 0).toLocaleString("zh-CN");
    return {
      roles,
      roleLabel: primary,
      hitCount: (_g = resp == null ? void 0 : resp.hit_chunk_count) != null ? _g : 1,
      analysisMeta: `${(_h = resp == null ? void 0 : resp.hit_chunk_count) != null ? _h : 1} 个原文片段 · 已分析约 ${chars} 字正文`,
      judgement: a.overall_judgement || "—",
      advice: a.usage_advice || "—",
      contributions: ((_i = a.contribution_points) != null ? _i : []).length ? a.contribution_points : ["（无）"],
      limitations: ((_j = a.limitations) != null ? _j : []).length ? a.limitations : ["（无）"],
      userInput: this._lastQuery || ((_l = (_k = row.keywords) == null ? void 0 : _k.join(" ")) != null ? _l : ""),
      hitChunk: takeaways.length ? takeaways.join("；") : (row.origFull || row.origShort || "").replace(/<[^>]+>/g, "")
    };
  }
  // ── 文献库管理：层1 渲染库列表（GET /libraries）─────────
  // 拖拽兜底：File 没有 .path 时（少见），用 Blob 直拼 multipart
  async _dropIngestViaBlob(libName, files) {
    const fd = new FormData();
    fd.append("action", "append");
    fd.append("existing_library", libName);
    fd.append("ingest_mode", "raw");
    fd.append("ingest_preprocess_concurrency", "1");
    files.forEach((f) => fd.append("files", f, f.name));
    const job = this.plugin.buildManager.start(fd, {
      label: `向「${libName}」追加`,
      libName,
      mode: "add"
    });
    await job.promise;
  }
  // ── 「文献收集」标签页：把悬浮收集栏的内容搬进面板内 ──
  _renderCollectModule(root) {
    const plugin = this.plugin;
    const layer = root.querySelector(".pb-mod-collect");
    layer.empty();
    const hd = layer.createDiv({ cls: "pb-collect-head" });
    const titleRow = hd.createDiv({ cls: "pb-cc-titlerow" });
    titleRow.createSpan({ cls: "pb-cc-title pb-collect-title", text: "文献收集" });
    plugin._collectTabCountEl = titleRow.createSpan({ cls: "pb-collect-count" });
    const gsel = titleRow.createEl("select", { cls: "pb-cite-panel-filter pb-cc-groupsel dropdown", attr: { "aria-label": "分组方式" } });
    for (const o of [["doc", "按文献"], ["time", "按时间"], ["color", "按颜色"]]) {
      const e = gsel.createEl("option", { text: o[1] });
      e.value = o[0];
    }
    gsel.value = plugin._collGroupBy || "time";
    gsel.onchange = () => {
      plugin._collGroupBy = gsel.value;
      plugin._refreshCollections();
    };
    hd.createSpan({ cls: "pb-cc-sub", text: plugin._collSubLabel() });
    plugin._buildCollectChips(hd);
    const tsel = hd.createEl("select", { cls: "pb-cite-panel-filter dropdown", attr: { "aria-label": "按时间筛选" } });
    for (const o of [["all", "全部时间"], ["1", "今天"], ["7", "近 7 天"], ["30", "近 30 天"]]) {
      const e = tsel.createEl("option", { text: o[1] });
      e.value = o[0];
    }
    tsel.value = plugin._collTime || "all";
    tsel.onchange = () => {
      plugin._collTime = tsel.value;
      plugin._refreshCollections();
    };
    const sin = hd.createEl("input", { cls: "pb-cite-panel-search", attr: { type: "text", placeholder: "搜索文献名…" } });
    sin.value = plugin._collDocQ || "";
    sin.oninput = () => {
      plugin._collDocQ = sin.value;
      plugin._refreshCollections();
    };
    const listEl = layer.createDiv({ cls: "pb-cite-panel-list pb-collect-list" });
    plugin._collectTabListEl = listEl;
    const n = plugin._populateCollectList(listEl);
    if (plugin._collectTabCountEl) plugin._collectTabCountEl.textContent = n ? String(n) : "";
  }
  async _renderLibModule(root) {
    var _a;
    const body = root.querySelector(".pb-ls-lib-body");
    const createBtnHTML = `
      <div class="pb-ls-create-btn" role="button">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round"/>
        </svg>
        新建文献库
      </div>`;
    body.innerHTML = createBtnHTML + `<div class="pb-ls-lib-list"><div class="pb-ls-loading">加载文献库…</div></div>`;
    body.querySelector(".pb-ls-create-btn").addEventListener("click", () => this._renderCreateForm(root, "create"));
    let libs;
    try {
      const data = await this.plugin.api.get("/libraries");
      libs = (_a = data.libraries) != null ? _a : [];
      this._libs = libs;
    } catch (err) {
      body.querySelector(".pb-ls-lib-list").innerHTML = `<div class="pb-ls-loading pb-ls-error">无法连接本地服务：${pbEscapeHtml(err.message)}</div>`;
      return;
    }
    if (!libs.length) {
      body.querySelector(".pb-ls-lib-list").innerHTML = `<div class="pb-ls-loading">还没有文献库，点击上方「新建文献库」</div>`;
      this._renderBuildIndicator(root);
      return;
    }
    const libItemHTML = (name) => `
      <div class="pb-ls-lib-item" data-name="${pbEscapeHtml(name)}">
        <div class="pb-ls-lib-info">
          <div class="pb-ls-lib-name">${pbEscapeHtml(name)}</div>
          <div class="pb-ls-lib-stats" data-name="${pbEscapeHtml(name)}">统计中…</div>
        </div>
        <div class="pb-ls-lib-del" data-name="${pbEscapeHtml(name)}" role="button" title="删除文献库">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 4h10M6.5 4V2.8h3V4M5 4l.6 9h4.8L11 4"
                  stroke="currentColor" stroke-width="1.3"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <svg class="pb-ls-lib-arrow" width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path d="M2 2l4 4-4 4" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`;
    body.innerHTML = createBtnHTML + `<div class="pb-ls-lib-list">${libs.map(libItemHTML).join("")}</div>`;
    body.querySelector(".pb-ls-create-btn").addEventListener("click", () => this._renderCreateForm(root, "create"));
    this._renderBuildIndicator(root);
    body.querySelectorAll(".pb-ls-lib-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".pb-ls-lib-del")) return;
        if (item._suppressClick) return;
        this._renderLibFiles(root, { name: item.dataset.name });
      });
      item.addEventListener("dragenter", (e) => {
        e.preventDefault();
        item.classList.add("pb-ls-dragging-over");
      });
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      });
      item.addEventListener("dragleave", (e) => {
        if (e.target === item) item.classList.remove("pb-ls-dragging-over");
      });
      item.addEventListener("drop", async (e) => {
        var _a2;
        e.preventDefault();
        e.stopPropagation();
        item.classList.remove("pb-ls-dragging-over");
        item._suppressClick = true;
        setTimeout(() => {
          item._suppressClick = false;
        }, 200);
        const files = [...e.dataTransfer.files || []].filter((f) => /\.pdf$/i.test(f.name));
        if (!files.length) {
          new obsidian11.Notice("请拖入 PDF 文件");
          return;
        }
        const libName = item.dataset.name;
        const abs = files.map((f) => pbFilePath(f)).filter(Boolean);
        if (abs.length === files.length) {
          await this.plugin._triggerAppendIngest(libName, abs);
        } else {
          await this._dropIngestViaBlob(libName, files);
        }
        (_a2 = this._libStats) == null ? void 0 : _a2.delete(libName);
        this._libs = null;
        this._renderLibModule(root);
      });
    });
    body.querySelectorAll(".pb-ls-lib-del").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        var _a2, _b;
        e.stopPropagation();
        const name = btn.dataset.name;
        if (name === "default") {
          new obsidian11.Notice("默认库不可删除");
          return;
        }
        const ok = await pbConfirm(this.plugin.app, {
          title: "删除文献库",
          message: `确定删除文献库「${name}」？
该库的索引与 PDF 副本将被移除，且不可恢复。`,
          confirmText: "删除",
          danger: true
        });
        if (!ok) return;
        btn.innerHTML = '<span class="pb-ls-loading-inline">删除中…</span>';
        try {
          await this.plugin.api.del(`/libraries/${encodeURIComponent(name)}`);
          new obsidian11.Notice(`已删除文献库「${name}」`);
          (_a2 = this._libStats) == null ? void 0 : _a2.delete(name);
          this._libs = null;
          const searchWidget = root.querySelector(".pb-lib-widget");
          const searchButton = root.querySelector(".pb-btn-search");
          if (this.plugin.settings.lastLibrary === name || (searchWidget == null ? void 0 : searchWidget.dataset.lib) === name) {
            try {
              const data = await this.plugin.api.get("/libraries");
              const remaining = (Array.isArray(data.libraries) ? data.libraries : []).map((item) => typeof item === "string" ? item : (item == null ? void 0 : item.name) || (item == null ? void 0 : item.library) || (item == null ? void 0 : item.id) || "").filter(Boolean);
              this._libs = remaining;
              const ranked = await Promise.all(remaining.map(async (libraryName) => {
                var _a3, _b2, _c;
                try {
                  const stat = await this.plugin.api.get(`/libraries/${encodeURIComponent(libraryName)}/documents`);
                  const value = { count: (_a3 = stat.document_count) != null ? _a3 : 0, chunks: (_b2 = stat.chunk_count) != null ? _b2 : 0, at: Date.now() };
                  (_c = this._libStats) == null ? void 0 : _c.set(libraryName, value);
                  return { name: libraryName, ...value };
                } catch (_) {
                  return { name: libraryName, count: null };
                }
              }));
              ranked.sort((a, b) => {
                var _a3, _b2;
                return ((_a3 = b.count) != null ? _a3 : 0) - ((_b2 = a.count) != null ? _b2 : 0);
              });
              const next = ((_b = ranked.find((item) => {
                var _a3;
                return ((_a3 = item.count) != null ? _a3 : 0) > 0;
              })) == null ? void 0 : _b.name) || remaining.find((libraryName) => libraryName !== "default") || remaining[0] || "";
              if (next) {
                this.plugin.settings.lastLibrary = next;
                this._hasLibraries = true;
                if (searchWidget) searchWidget.dataset.lib = next;
                const current = searchWidget == null ? void 0 : searchWidget.querySelector(".pb-lib-cur");
                if (current) current.textContent = next;
                if (searchButton) searchButton.disabled = false;
                this._warmup(next);
                await this.plugin.saveSettings();
              } else {
                this.plugin.settings.lastLibrary = "";
                this._hasLibraries = false;
                if (searchWidget) searchWidget.dataset.lib = "";
                const current = searchWidget == null ? void 0 : searchWidget.querySelector(".pb-lib-cur");
                if (current) current.textContent = "尚无文献库";
                if (searchButton) searchButton.disabled = true;
                await this.plugin.saveSettings();
              }
            } catch (refreshError) {
              this._libs = null;
              this._hasLibraries = false;
              this.plugin.settings.lastLibrary = "";
              if (searchWidget) searchWidget.dataset.lib = "";
              const current = searchWidget == null ? void 0 : searchWidget.querySelector(".pb-lib-cur");
              if (current) current.textContent = "列表刷新失败，请重载";
              if (searchButton) searchButton.disabled = true;
              await this.plugin.saveSettings();
              new obsidian11.Notice(`文献库已删除，但列表刷新失败：${refreshError.message}`, 8e3);
            }
          }
          this._renderLibModule(root);
        } catch (err) {
          new obsidian11.Notice(`删除失败：${err.message}`);
          this._renderLibModule(root);
        }
      });
    });
    if (this._noDocsEndpoint) {
      body.querySelectorAll(".pb-ls-lib-stats").forEach((s) => s.textContent = "点击进入");
      return;
    }
    (async () => {
      var _a2, _b, _c;
      for (const name of libs) {
        const stat = body.querySelector(`.pb-ls-lib-stats[data-name="${name}"]`);
        try {
          const d = await this.plugin.api.get(
            `/libraries/${encodeURIComponent(name)}/documents`
          );
          const docs = (_a2 = d.documents) != null ? _a2 : [];
          const failed = docs.filter((f) => {
            var _a3, _b2;
            return ((_a3 = f.retrievable_chunk_count) != null ? _a3 : 0) === 0 && ((_b2 = f.chunk_count) != null ? _b2 : 0) === 0;
          }).length;
          if (stat) {
            stat.innerHTML = [
              `${pbEscapeHtml((_b = d.document_count) != null ? _b : docs.length)} 篇`,
              `<span class="pb-ls-stat-ok">${(_c = d.chunk_count) != null ? _c : 0} 片段</span>`,
              failed ? `<span class="pb-ls-stat-fail">异常 ${failed}</span>` : ""
            ].filter(Boolean).join(" · ");
          }
        } catch (err) {
          if (/HTTP 404/.test(err.message)) {
            this._noDocsEndpoint = true;
            body.querySelectorAll(".pb-ls-lib-stats").forEach((s) => s.textContent = "点击进入");
            return;
          }
          if (stat) stat.textContent = "统计不可用";
        }
      }
    })();
  }
  // ── 文献库管理：层3 入库表单（新建 / 追加 两模式）──────
  // 对应后端 POST /library-manager/ingest-stream
  // mode='create' → action=create
  // mode='add'    → action=append，lib 为目标库对象
  _renderCreateForm(root, mode = "create", lib = null) {
    var _a, _b, _c, _d, _e;
    (_b = (_a = this.plugin)._clearSpotlight) == null ? void 0 : _b.call(_a);
    const layer = root.querySelector(".pb-ls-create-layer");
    const body = layer.querySelector(".pb-ls-create-body");
    const titleEl = layer.querySelector(".pb-ls-file-title");
    const SCHEMES = [
      {
        value: "raw",
        badge: "方案 1",
        speed: "最快",
        cost: "不用 AI",
        title: "本地快速建库",
        sub: "无需 AI · 不产生 AI 费用",
        desc: "在本机完成 PDF 解析、分段和索引，不调用 AI。速度快；复杂版式的分段效果可能较弱。",
        scenario: "适合：批量建库，或希望全程不调用 AI 时",
        recommended: false,
        lockTo: 1,
        lockNote: "本方案不调用 AI，系统自动串行处理（同时 1 篇）"
      },
      {
        value: "full_document_llm_boundary_split",
        badge: "方案 2",
        speed: "较快",
        cost: "少量 AI",
        title: "AI 辅助整理结构",
        sub: "需要 PaperBell AI",
        desc: "AI 帮助识别正文、章节和参考文献边界，其余处理在本机完成；会发送论文文本并产生 AI 费用。",
        scenario: "适合：日常研究文献库，兼顾速度与结构质量",
        recommended: true,
        lockTo: null,
        lockNote: null
      },
      {
        value: "full_document_llm_structured",
        badge: "方案 3",
        speed: "最慢",
        cost: "重度 AI",
        title: "AI 深度整理全文",
        sub: "逐篇处理 · 费用较高",
        desc: "将整篇 PDF 文本交给 AI 整理为结构化正文后再建立索引；耗时和费用较高，结果仍建议抽查。",
        scenario: "适合：少量重点文献，不适合批量建库",
        recommended: false,
        lockTo: null,
        lockNote: null
      }
    ];
    let currentMode = mode;
    let isAdd = mode === "add";
    titleEl.textContent = isAdd ? `追加文件 · ${lib == null ? void 0 : lib.name}` : "新建文献库";
    layer.querySelector(".pb-ls-create-back").onclick = () => {
      layer.style.display = "none";
    };
    body.innerHTML = `
      <div class="pb-lc-form">

        ${isAdd ? `<div class="pb-lc-target-hint">
               <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                 <rect x="2" y="2" width="12" height="12" rx="1.5"
                       stroke="currentColor" stroke-width="1.4"/>
                 <path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.3"
                       stroke-linecap="round"/>
               </svg>
               向&nbsp;<strong>${pbEscapeHtml(lib.name)}</strong>&nbsp;追加文件
               <input type="hidden" data-field="existing_library" value="${pbEscapeHtml(lib.name)}">
             </div>` : `<div class="pb-lc-field">
               <label class="pb-lc-label">文献库名称 <span class="pb-lc-required">*</span></label>
               <input class="pb-lc-input" data-field="library_name" type="text"
                      placeholder="例如：yellow-river-case（字母·数字·横线）"
                      autocomplete="off">
               <p class="pb-lc-hint">文献库创建后暂不支持改名；请使用简短、易识别的名称</p>
             </div>`}

        <details class="pb-lc-expert">
          <summary>高级选项 · 本地快速建库 · 同时处理 1 篇</summary>
          <div class="pb-lc-field">
            <label class="pb-lc-label">文献整理方式</label>
            <p class="pb-lc-hint">决定建库时是否借助 AI 整理文献结构，影响检索质量、速度与成本</p>
            <div class="pb-scheme-list">
            ${SCHEMES.map((s, i) => `
              <label class="pb-scheme-card${i === 0 ? " selected" : ""}" data-value="${s.value}">
                <input type="radio" class="pb-scheme-radio" name="pb_ingest_scheme"
                       value="${s.value}"${i === 0 ? " checked" : ""}>
                <div class="pb-scheme-body">
                  <div class="pb-scheme-hd">
                    <span class="pb-scheme-badge">${s.badge}</span>
                    <span class="pb-scheme-title">${s.title}</span>
                    ${s.recommended ? '<span class="pb-scheme-rec">推荐</span>' : ""}
                    <span class="pb-scheme-sub">${s.sub}</span>
                  </div>
                  <div class="pb-scheme-chips">
                    <span class="pb-scheme-chip pb-scheme-chip-speed">${s.speed}</span>
                    <span class="pb-scheme-chip pb-scheme-chip-cost">${s.cost}</span>
                  </div>
                  <p class="pb-scheme-desc">${s.desc}</p>
                  <div class="pb-scheme-footer">
                    <span class="pb-scheme-scenario">${s.scenario}</span>
                    ${s.lockNote ? `<span class="pb-scheme-lock">${s.lockNote}</span>` : ""}
                  </div>
                </div>
              </label>`).join("")}
            </div>
          </div>

          <div class="pb-lc-inline-row">
            <label class="pb-lc-label">同时处理</label>
            <input class="pb-lc-num" data-field="ingest_preprocess_concurrency"
                   type="number" value="${(_c = SCHEMES[0].lockTo) != null ? _c : 2}" min="1" max="16"
                   ${SCHEMES[0].lockTo ? "disabled" : ""}>
            <span class="pb-lc-num-unit">篇</span>
            <span class="pb-lc-concurrency-note">${(_d = SCHEMES[0].lockNote) != null ? _d : "同时处理数量越高，速度可能越快，也更容易触发 AI 服务限流；建议从 2 开始"}</span>
          </div>
        </details>

        <div class="pb-lc-field">
          <label class="pb-lc-label">导入来源</label>
          <div class="pb-lc-src-toggle">
            <div class="pb-lc-src-btn active" data-src="folder" role="button" tabindex="0" aria-pressed="true">现有 PDF 文件夹</div>
            <div class="pb-lc-src-btn" data-src="upload" role="button" tabindex="0" aria-pressed="false">选择 PDF</div>
          </div>
        </div>

        <div class="pb-lc-pane" data-pane="folder">
          <input class="pb-lc-input" data-field="source_folder" type="text"
                 placeholder="目录绝对路径，例如 D:\\papers\\行政法研究"
                 autocomplete="off">
          <p class="pb-lc-hint">默认导入文件夹内全部 PDF；如只导入部分文件，可在下方填写相对路径</p>
          <div class="pb-lc-relpaths-wrap" style="display:none">
            <label class="pb-lc-label" style="margin-top:6px">
              指定文件范围 <span class="pb-lc-opt">可选</span>
            </label>
            <textarea class="pb-lc-textarea" data-field="relative_paths_json"
                      placeholder="每行一个，相对于上方目录，例如：&#10;2024/行刑衔接.pdf&#10;理论框架.pdf&#10;（留空则索引整个目录）"
                      rows="3"></textarea>
          </div>
        </div>

        <div class="pb-lc-pane" data-pane="upload" style="display:none">
          <div class="pb-lc-dropzone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>点击选择 PDF，支持多选</span>
            <input class="pb-lc-file-input" type="file" accept=".pdf" multiple>
          </div>
          <div class="pb-lc-file-list"></div>
        </div>

        <div class="pb-lc-progress" style="display:none">
          <div class="pb-lc-progress-hd">
            <span class="pb-lc-progress-label">建库进度</span>
            <span class="pb-lc-progress-stat"></span>
          </div>
          <div class="pb-lc-progress-list"></div>
        </div>

        <div class="pb-lc-actions">
          <button class="pb-lc-submit">${isAdd ? "追加入库" : "开始建库"}</button>
        </div>

      </div>`;
    const concInput = body.querySelector('[data-field="ingest_preprocess_concurrency"]');
    const concNote = body.querySelector(".pb-lc-concurrency-note");
    const expertSummary = body.querySelector(".pb-lc-expert > summary");
    const updateExpertSummary = () => {
      const selected = body.querySelector(".pb-scheme-radio:checked");
      const scheme = SCHEMES.find((s) => s.value === (selected == null ? void 0 : selected.value)) || SCHEMES[0];
      if (expertSummary) expertSummary.textContent = `高级选项 · ${scheme.title} · 同时 ${(concInput == null ? void 0 : concInput.value) || scheme.lockTo || 1} 篇`;
    };
    body.querySelectorAll(".pb-scheme-radio").forEach((radio) => {
      radio.addEventListener("change", () => {
        const scheme = SCHEMES.find((s) => s.value === radio.value);
        if (!scheme) return;
        body.querySelectorAll(".pb-scheme-card").forEach((c) => c.classList.toggle("selected", c.dataset.value === scheme.value));
        if (scheme.lockTo) {
          concInput.value = scheme.lockTo;
          concInput.disabled = true;
          concNote.textContent = scheme.lockNote;
        } else {
          if (concInput.disabled) concInput.value = 2;
          concInput.disabled = false;
          concNote.textContent = "同时处理数量越高，速度可能越快，也更容易触发 AI 服务限流；建议从 2 开始";
        }
        updateExpertSummary();
      });
    });
    concInput == null ? void 0 : concInput.addEventListener("input", updateExpertSummary);
    updateExpertSummary();
    body.querySelectorAll(".pb-lc-src-btn").forEach((btn) => {
      const activate = () => {
        body.querySelectorAll(".pb-lc-src-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        const src = btn.dataset.src;
        body.querySelectorAll(".pb-lc-pane").forEach((p) => {
          p.style.display = p.dataset.pane === src ? "" : "none";
        });
      };
      btn.addEventListener("click", activate);
      btn.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activate();
      });
    });
    const folderInput = body.querySelector('[data-field="source_folder"]');
    const relWrap = body.querySelector(".pb-lc-relpaths-wrap");
    folderInput == null ? void 0 : folderInput.addEventListener("input", () => {
      if (relWrap) relWrap.style.display = folderInput.value.trim() ? "" : "none";
    });
    const fileInput = body.querySelector(".pb-lc-file-input");
    const fileList = body.querySelector(".pb-lc-file-list");
    (_e = body.querySelector(".pb-lc-dropzone")) == null ? void 0 : _e.addEventListener("click", () => fileInput == null ? void 0 : fileInput.click());
    fileInput == null ? void 0 : fileInput.addEventListener("change", () => {
      const files = [...fileInput.files];
      fileList.innerHTML = files.map(
        (f) => `<div class="pb-lc-file-row">
           <span class="pb-ls-src pb-ls-src-pdf">PDF</span>
           <span class="pb-lc-file-name">${pbEscapeHtml(f.name)}</span>
           <span class="pb-lc-file-size">${(f.size / 1024 / 1024).toFixed(1)} MB</span>
         </div>`
      ).join("");
    });
    body.querySelector(".pb-lc-submit").addEventListener("click", () => {
      var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i;
      const activeSrc = (_b2 = (_a2 = body.querySelector(".pb-lc-src-btn.active")) == null ? void 0 : _a2.dataset.src) != null ? _b2 : "folder";
      const scheme = (_d2 = (_c2 = body.querySelector(".pb-scheme-radio:checked")) == null ? void 0 : _c2.value) != null ? _d2 : "raw";
      const concurrency = (_e2 = concInput == null ? void 0 : concInput.value) != null ? _e2 : "1";
      const fd = new FormData();
      fd.append("ingest_mode", scheme);
      fd.append("ingest_preprocess_concurrency", concurrency);
      if (isAdd) {
        fd.append("action", "append");
        fd.append("existing_library", lib.name);
      } else {
        const libName = (_f = body.querySelector('[data-field="library_name"]')) == null ? void 0 : _f.value.trim();
        if (!libName) {
          new obsidian11.Notice("请先填写文献库名称");
          return;
        }
        fd.append("action", "create");
        fd.append("library_name", libName);
      }
      if (activeSrc === "upload") {
        if (!((_g = fileInput == null ? void 0 : fileInput.files) == null ? void 0 : _g.length)) {
          new obsidian11.Notice("请先选择 PDF 文件");
          return;
        }
        [...fileInput.files].forEach((f) => fd.append("files", f, f.name));
      } else {
        const folder = (_h = body.querySelector('[data-field="source_folder"]')) == null ? void 0 : _h.value.trim();
        if (!folder) {
          new obsidian11.Notice("请先填写 PDF 文件夹路径");
          return;
        }
        fd.append("source_folder", folder);
        const relRaw = (_i = body.querySelector('[data-field="relative_paths_json"]')) == null ? void 0 : _i.value.trim();
        const relArr = relRaw ? relRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
        fd.append("relative_paths_json", JSON.stringify(relArr));
      }
      const label = isAdd ? `向「${lib.name}」追加` : `建库「${fd.get("library_name")}」`;
      new obsidian11.Notice(`${label}…`);
      const job = this.plugin.buildManager.start(fd, {
        label,
        libName: isAdd ? lib.name : fd.get("library_name"),
        mode: currentMode
      });
      this._bindBuildDetail(body, root, job);
    });
    layer.style.display = "flex";
  }
  // HTML 转义
  _esc(s) {
    return String(s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // 把一个建库 job 的状态画进进度容器（建库表单 / 重开的进度视图共用），
  // 并订阅 BuildManager 实时刷新。订阅句柄存 this._formBuildUnsub，下次绑定/离开时清。
  _bindBuildDetail(body, root, job) {
    var _a;
    const progressEl = body.querySelector(".pb-lc-progress");
    if (!progressEl) return;
    const progStat = body.querySelector(".pb-lc-progress-stat");
    const progList = body.querySelector(".pb-lc-progress-list");
    const submitBtn = body.querySelector(".pb-lc-submit");
    let bar = progressEl.querySelector(".pb-lc-progbar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "pb-lc-progbar";
      bar.innerHTML = '<div class="pb-lc-progbar-fill"></div>';
      const hd = progressEl.querySelector(".pb-lc-progress-hd");
      (_a = hd || progressEl.firstElementChild) == null ? void 0 : _a.after(bar);
    }
    const barFill = bar.querySelector(".pb-lc-progbar-fill");
    progressEl.style.display = "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "入库中…";
    }
    let cancelBtn = body.querySelector(".pb-lc-cancel");
    if (!cancelBtn && submitBtn) {
      cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "pb-lc-cancel";
      submitBtn.parentElement.insertBefore(cancelBtn, submitBtn);
    }
    if (cancelBtn) {
      cancelBtn.textContent = "取消建库";
      cancelBtn.disabled = false;
      cancelBtn.style.display = "";
      cancelBtn.onclick = () => {
        if (cancelBtn.disabled) return;
        cancelBtn.disabled = true;
        cancelBtn.textContent = "正在取消…";
        this.plugin.buildManager.cancel(job.id);
      };
    }
    const rowMap = /* @__PURE__ */ new Map();
    const paint = (j) => {
      const now = Date.now();
      const totalElapsed = Math.max(0, (j.finishedAt || now) - j.startedAt);
      const liveStageElapsed = j.stageStartedAt ? Math.max(0, now - j.stageStartedAt) : 0;
      if (progStat) {
        progStat.textContent = `${j.stat || ""} · 总耗时 ${pbFormatBuildDuration(totalElapsed)}${j.status === "running" && liveStageElapsed ? ` · 当前阶段 ${pbFormatBuildDuration(liveStageElapsed)}` : ""}`;
      }
      const completedCount = Number(j.completed || j.done + j.failed + j.skipped || 0);
      const ratio = j.total ? Math.min(100, Math.round(completedCount / j.total * 100)) : j.status === "done" ? 100 : 0;
      bar.classList.toggle("pb-lc-progbar--indet", j.status === "running" && !j.total);
      bar.dataset.status = j.status;
      if (barFill) barFill.style.width = ratio + "%";
      for (const [name, st] of j.files) {
        let row = rowMap.get(name);
        if (!row) {
          row = document.createElement("div");
          row.className = "pb-lc-prog-row";
          row.innerHTML = `<div class="pb-lc-prog-main"><span class="pb-lc-prog-name"></span><span class="pb-lc-prog-status"></span></div><div class="pb-lc-prog-meta"></div>`;
          row.querySelector(".pb-lc-prog-name").textContent = name;
          progList.appendChild(row);
          rowMap.set(name, row);
        }
        row.className = `pb-lc-prog-row pb-lc-prog-${st.cls}`;
        const running = st.cls === "ing";
        const stageElapsed = running && st.stageStartedAt ? Math.max(0, now - st.stageStartedAt) : 0;
        const fileElapsed = running && st.processingStartedAt ? Math.max(0, now - st.processingStartedAt) : Number((st.timings || {}).total_ms || 0);
        row.querySelector(".pb-lc-prog-status").textContent = st.statusText || st.stageLabel || "处理中";
        const metaParts = [];
        if (st.index) metaParts.push(`第 ${st.index}/${j.total || "?"} 篇`);
        if (running && stageElapsed) metaParts.push(`阶段 ${pbFormatBuildDuration(stageElapsed)}`);
        if (fileElapsed) metaParts.push(`本篇 ${pbFormatBuildDuration(fileElapsed)}`);
        row.querySelector(".pb-lc-prog-meta").textContent = metaParts.join(" · ");
      }
      if (j.status !== "running") {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = j.mode === "add" ? "追加入库" : "开始建库";
        }
        if (cancelBtn) cancelBtn.style.display = "none";
        if (this._formBuildTimer) {
          window.clearInterval(this._formBuildTimer);
          this._formBuildTimer = null;
        }
      }
    };
    paint(job);
    if (this._formBuildUnsub) {
      this._formBuildUnsub();
      this._formBuildUnsub = null;
    }
    if (this._formBuildTimer) {
      window.clearInterval(this._formBuildTimer);
      this._formBuildTimer = null;
    }
    if (job.status === "running") {
      this._formBuildTimer = window.setInterval(() => {
        const current = this.plugin.buildManager.get(job.id);
        if (current) paint(current);
      }, 1e3);
    }
    let refreshed = false;
    this._formBuildUnsub = this.plugin.buildManager.onChange((j) => {
      if (!j || j.id !== job.id) return;
      paint(j);
      if (j.status !== "running" && !refreshed) {
        refreshed = true;
        this._libs = null;
        this._renderLibModule(root);
      }
    });
  }
  // 库列表顶部常驻建库横幅：进行中（含刚结束）的任务卡片，导航回来仍在。
  // 「查看」重开实时进度，「取消」中止。
  _renderBuildIndicator(root) {
    const body = root.querySelector(".pb-ls-lib-body");
    if (!body) return;
    let banner = body.querySelector(".pb-ls-build-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "pb-ls-build-banner";
      const list = body.querySelector(".pb-ls-lib-list");
      if (list) body.insertBefore(banner, list);
      else body.appendChild(banner);
    }
    const rowHTML2 = (j) => {
      const completedCount = Number(j.completed || j.done + j.failed + j.skipped || 0);
      const pct = j.total ? Math.min(100, Math.round(completedCount / j.total * 100)) : j.status === "done" ? 100 : 0;
      const sCls = j.status === "running" ? "is-running" : j.status === "done" ? "is-done" : j.status === "cancelled" ? "is-cancel" : "is-error";
      const indet = j.status === "running" && !j.total ? " pb-bb-bar--indet" : "";
      const actions = j.status === "running" ? `<button class="pb-bb-btn" data-bview="${j.id}">查看</button><button class="pb-bb-btn pb-bb-cancel" data-bcancel="${j.id}">取消</button>` : `<button class="pb-bb-btn" data-bview="${j.id}">详情</button>`;
      const elapsed = pbFormatBuildDuration(Math.max(0, (j.finishedAt || Date.now()) - j.startedAt));
      return `<div class="pb-bb-row ${sCls}">
        <div class="pb-bb-top">
          <span class="pb-bb-title">${this._esc(j.label)}</span>
          <span class="pb-bb-count">${completedCount}/${j.total || "?"}${j.failed ? ` · ${j.failed}失败` : ""}</span>
        </div>
        <div class="pb-bb-bar${indet}"><div class="pb-bb-fill" style="width:${pct}%"></div></div>
        <div class="pb-bb-bottom">
          <span class="pb-bb-stat">${this._esc(j.stat)} · ${elapsed}</span>
          <span class="pb-bb-actions">${actions}</span>
        </div>
      </div>`;
    };
    const paint = () => {
      const jobs = this.plugin.buildManager.list();
      if (!jobs.length) {
        banner.style.display = "none";
        banner.innerHTML = "";
        return;
      }
      banner.style.display = "";
      banner.innerHTML = jobs.map(rowHTML2).join("");
      banner.querySelectorAll("[data-bview]").forEach((b) => b.onclick = () => this._openBuildProgress(root, b.dataset.bview));
      banner.querySelectorAll("[data-bcancel]").forEach((b) => b.onclick = () => this.plugin.buildManager.cancel(b.dataset.bcancel));
    };
    if (this._buildUnsub) {
      this._buildUnsub();
      this._buildUnsub = null;
    }
    const refreshed = /* @__PURE__ */ new Set();
    this._buildUnsub = this.plugin.buildManager.onChange((j) => {
      paint();
      if (j && j.status !== "running" && !refreshed.has(j.id)) {
        refreshed.add(j.id);
        this._libs = null;
        this._renderLibModule(root);
      }
    });
    paint();
  }
  // 重开某个建库任务的实时进度（复用第三层弹窗，仅进度视图）
  _openBuildProgress(root, jobId) {
    const job = this.plugin.buildManager.get(jobId);
    if (!job) {
      new obsidian11.Notice("该建库任务已结束");
      return;
    }
    const layer = root.querySelector(".pb-ls-create-layer");
    const body = layer.querySelector(".pb-ls-create-body");
    const titleEl = layer.querySelector(".pb-ls-file-title");
    if (titleEl) titleEl.textContent = job.label;
    const back = layer.querySelector(".pb-ls-create-back");
    if (back) back.onclick = () => {
      layer.style.display = "none";
    };
    body.innerHTML = `
      <div class="pb-lc-form">
        <div class="pb-lc-progress">
          <div class="pb-lc-progress-hd">
            <span class="pb-lc-progress-label">建库进度</span>
            <span class="pb-lc-progress-stat"></span>
          </div>
          <div class="pb-lc-progress-list"></div>
        </div>
        <div class="pb-lc-actions"><button class="pb-lc-submit" style="display:none"></button></div>
      </div>`;
    this._bindBuildDetail(body, root, job);
    layer.style.display = "flex";
  }
  // ── 文献库管理：层2 库内文件列表（GET /libraries/{name}/documents）──
  async _renderLibFiles(root, lib) {
    var _a, _b;
    const layer = root.querySelector(".pb-ls-file-layer");
    const fileBody = layer.querySelector(".pb-ls-file-body");
    const titleEl = layer.querySelector(".pb-ls-file-title");
    const backBtn = layer.querySelector(".pb-ls-file-back");
    const nav = layer.querySelector(".pb-ls-file-nav");
    const libName = lib.name;
    titleEl.textContent = libName;
    backBtn.onclick = () => {
      layer.style.display = "none";
    };
    let addBtn = nav.querySelector(".pb-ls-nav-add");
    if (!addBtn) {
      addBtn = document.createElement("div");
      addBtn.className = "pb-ls-nav-add";
      addBtn.setAttribute("role", "button");
      addBtn.innerHTML = `
        <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round"/>
        </svg>
        追加文件`;
      nav.appendChild(addBtn);
    }
    addBtn.onclick = () => this._renderCreateForm(root, "add", { name: libName });
    layer.style.display = "flex";
    fileBody.innerHTML = `<div class="pb-ls-loading">加载文件列表…</div>`;
    let docs, pdfDir;
    try {
      const d = await this.plugin.api.get(
        `/libraries/${encodeURIComponent(libName)}/documents`
      );
      docs = (_a = d.documents) != null ? _a : [];
      pdfDir = (_b = d.pdf_dir) != null ? _b : "";
    } catch (err) {
      const is404 = /HTTP 404/.test(err.message);
      fileBody.innerHTML = is404 ? `<div class="pb-ls-loading">当前本地服务版本不支持「库内文件浏览」<br>
           （缺少 <code>GET /libraries/${pbEscapeHtml(libName)}/documents</code>）<br>
           检索与建库功能不受影响。如需此功能请更新本地服务。</div>` : `<div class="pb-ls-loading pb-ls-error">加载失败：${pbEscapeHtml(err.message)}</div>`;
      return;
    }
    if (!docs.length) {
      fileBody.innerHTML = `<div class="pb-ls-loading">该库还没有文献，点击右上角「追加文件」</div>`;
      return;
    }
    const fileRowHTML = (f) => {
      var _a2, _b2, _c;
      const name = f.source_file || f.document_id || "（未命名）";
      const chunks = (_a2 = f.chunk_count) != null ? _a2 : 0;
      const pages = (_b2 = f.page_count) != null ? _b2 : f.page_end && f.page_start ? f.page_end - f.page_start + 1 : null;
      const methods = ((_c = f.extraction_methods) != null ? _c : []).join("/") || "text";
      const lowQ2 = chunks === 0;
      const sub = [
        `${chunks} 片段`,
        pages ? `${pages} 页` : "",
        methods === "ocr" ? "OCR 提取" : methods.includes("ocr") ? "含 OCR" : ""
      ].filter(Boolean).join(" · ");
      return `
        <div class="pb-ls-item${lowQ2 ? " pb-ls-item-warn" : ""}"
             data-doc="${pbEscapeHtml(f.document_id)}" data-src="${pbEscapeHtml(f.source_file)}">
          <span class="pb-ls-src pb-ls-src-pdf">PDF</span>
          <div class="pb-ls-item-info">
            <div class="pb-ls-item-name">${pbEscapeHtml(name)}</div>
            <div class="pb-ls-item-sub">${pbEscapeHtml(sub) || "已入库"}</div>
          </div>
          ${f.pdf_exists ? `<div class="pb-ls-open-btn" data-doc="${pbEscapeHtml(f.document_id)}"
                    data-src="${pbEscapeHtml(f.source_file)}" role="button" title="打开 PDF">打开</div>` : ""}
          <div class="pb-ls-del-btn" data-doc="${pbEscapeHtml(f.document_id)}"
               data-src="${pbEscapeHtml(f.source_file)}" role="button" title="从库中删除">删除</div>
        </div>`;
    };
    const lowQ = docs.filter((f) => {
      var _a2;
      return ((_a2 = f.chunk_count) != null ? _a2 : 0) === 0;
    });
    const okQ = docs.filter((f) => {
      var _a2;
      return ((_a2 = f.chunk_count) != null ? _a2 : 0) > 0;
    });
    const sectionHTML = (label, list) => list.length === 0 ? "" : `
      <div class="pb-ls-section-label">${label}</div>
      ${list.map(fileRowHTML).join("")}`;
    fileBody.innerHTML = sectionHTML("疑似异常（无片段）", lowQ) + sectionHTML(`已入库 ${okQ.length}`, okQ);
    fileBody.querySelectorAll(".pb-ls-open-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const label = btn.textContent;
        btn.textContent = "打开中…";
        try {
          await this._openPdfInObsidian(
            libName,
            btn.dataset.doc,
            btn.dataset.src
          );
        } catch (err) {
          new obsidian11.Notice(`打开 PDF 失败：${err.message}`);
        } finally {
          btn.textContent = label;
        }
      });
    });
    fileBody.querySelectorAll(".pb-ls-del-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        var _a2;
        const docId = btn.dataset.doc;
        const src = btn.dataset.src;
        const ok = await pbConfirm(this.plugin.app, {
          title: "删除文献",
          message: `确定从「${libName}」删除《${src || docId}》？
该文献的索引将被移除。`,
          confirmText: "删除",
          danger: true
        });
        if (!ok) return;
        btn.textContent = "删除中…";
        const q = new URLSearchParams();
        if (docId) q.set("document_id", docId);
        else if (src) q.set("source_file", src);
        try {
          await this.plugin.api.del(
            `/libraries/${encodeURIComponent(libName)}/documents?${q.toString()}`
          );
          new obsidian11.Notice("已删除该文献");
          (_a2 = this._libStats) == null ? void 0 : _a2.delete(libName);
          this._renderLibFiles(root, { name: libName });
        } catch (err) {
          new obsidian11.Notice(`删除失败：${err.message}`);
          btn.textContent = "删除";
        }
      });
    });
  }
  // 拉取后端 PDF + 用 Obsidian 原生阅读器打开（委托给 plugin，便于协议处理器共用）
  async _openPdfInObsidian(libName, docId, srcFile) {
    return this.plugin.openPdfInObsidian(libName, docId, srcFile);
  }
  // 文件名安全化：去除非法字符 + 截断长度
  _slugFilename(s, maxLen = 100) {
    return String(s != null ? s : "").replace(/[/\\:*?"<>|#^[\]]/g, "_").replace(/\s+/g, " ").trim().slice(0, maxLen) || "untitled";
  }
  // 用 row 的稳定字段生成文件名（不带扩展名）
  _litNoteStem(row) {
    const src = (row._sourceFile || row.title || row.id || "").toString();
    return this._slugFilename(src.replace(/\.pdf$/i, ""));
  }
  // 笔记内容里安全转义 YAML 双引号字符串值
  _yamlStr(s) {
    return `"${String(s != null ? s : "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  // 从文件名 stem 解析作者 + 年份（如 Liu_Yang_2012_Water-Crisis → authors=Liu,Yang  year=2012）
  // 计算 references_in_vault：拿这篇论文的 S2 references[] 跟 vault 已有 lit note 比对
  // 命中规则：DOI 完全相同 优先；否则 title 模糊匹配 + year 一致
  _computeReferencesInVault(entry) {
    var _a, _b;
    const refs = (_a = entry == null ? void 0 : entry.s2) == null ? void 0 : _a.references;
    if (!(refs == null ? void 0 : refs.length)) return [];
    const files = this.plugin._listPaperNotes();
    const byDoi = /* @__PURE__ */ new Map();
    const byTitleYear = /* @__PURE__ */ new Map();
    const normalize = (s) => String(s || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    for (const f of files) {
      const fm = (_b = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _b.frontmatter;
      if (!fm) continue;
      if (fm.csl_DOI) {
        byDoi.set(String(fm.csl_DOI).toLowerCase(), f);
      }
      const t = fm.csl_title;
      const y = fm.csl_issued_year || fm.year;
      if (t && y) byTitleYear.set(`${normalize(t)}|${y}`, f);
    }
    const hits = /* @__PURE__ */ new Set();
    for (const r of refs) {
      let matched = null;
      if (r.doi) {
        const f = byDoi.get(String(r.doi).toLowerCase());
        if (f) matched = f;
      }
      if (!matched && r.title && r.year) {
        const f = byTitleYear.get(`${normalize(r.title)}|${r.year}`);
        if (f) matched = f;
      }
      if (matched) {
        hits.add(matched.basename);
      }
    }
    return [...hits];
  }
  // 从 docMetaCache 读 metadata，生成完整的 CSL + S2 frontmatter 字段
  _buildMetaYaml(row, fallbackAuthors, fallbackYear) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const entry = (_a = row._meta) != null ? _a : this.plugin._readDocMeta(row._docId);
    const lines = [];
    if (entry == null ? void 0 : entry.csl) {
      const csl = entry.csl;
      lines.push(`csl_type: ${csl.type || "article-journal"}`);
      if (csl.title) lines.push(`csl_title: ${this._yamlStr(csl.title)}`);
      if (Array.isArray(csl.author) && csl.author.length) {
        const parts = csl.author.map((a) => {
          const family = a.family || a.literal || "";
          const given = a.given || "";
          return `{family: ${this._yamlStr(family)}${given ? `, given: ${this._yamlStr(given)}` : ""}}`;
        });
        lines.push(`csl_author: [${parts.join(", ")}]`);
      }
      const year = (_g = (_f = (_d = (_c = (_b = csl.issued) == null ? void 0 : _b["date-parts"]) == null ? void 0 : _c[0]) == null ? void 0 : _d[0]) != null ? _f : (_e = csl.issued) == null ? void 0 : _e.year) != null ? _g : fallbackYear;
      if (year) lines.push(`csl_issued_year: ${year}`);
      if (csl["container-title"]) lines.push(`csl_container_title: ${this._yamlStr(csl["container-title"])}`);
      if (csl.volume) lines.push(`csl_volume: ${this._yamlStr(csl.volume)}`);
      if (csl.issue) lines.push(`csl_issue:  ${this._yamlStr(csl.issue)}`);
      if (csl.page) lines.push(`csl_page:   ${this._yamlStr(csl.page)}`);
      if (csl.DOI) lines.push(`csl_DOI:    ${this._yamlStr(csl.DOI)}`);
      if (csl.URL) lines.push(`csl_URL:    ${this._yamlStr(csl.URL)}`);
      if (entry.s2) {
        if (entry.s2.citationCount != null)
          lines.push(`citation_count: ${entry.s2.citationCount}`);
        if (entry.s2.influentialCitationCount != null)
          lines.push(`influential_citation_count: ${entry.s2.influentialCitationCount}`);
        if (entry.s2.tldr) lines.push(`tldr: ${this._yamlStr(entry.s2.tldr)}`);
        if (entry.s2.paperId) lines.push(`ss_paper_id: ${this._yamlStr(entry.s2.paperId)}`);
      }
      if ((_h = entry.bbt) == null ? void 0 : _h.citekey) {
        lines.push(`citekey: ${this._yamlStr(entry.bbt.citekey)}`);
      }
      if ((_i = entry.bbt) == null ? void 0 : _i.zotero_key) {
        lines.push(`zotero_key: ${this._yamlStr(entry.bbt.zotero_key)}`);
      }
      const refsInVault = this._computeReferencesInVault(entry);
      if (refsInVault.length) {
        lines.push("references_in_vault:");
        refsInVault.forEach((s) => lines.push(`  - "[[${s}]]"`));
      }
      if ((_j = entry.meta_source) == null ? void 0 : _j.length) {
        lines.push(`meta_source: [${entry.meta_source.map((s) => this._yamlStr(s)).join(", ")}]`);
      }
    } else {
      lines.push("csl_type: article-journal");
      if (row.paperTitle) lines.push(`csl_title: ${this._yamlStr(row.paperTitle)}`);
      if (fallbackAuthors == null ? void 0 : fallbackAuthors.length) {
        lines.push(`csl_author: [${fallbackAuthors.map((a) => `{family: ${this._yamlStr(a)}}`).join(", ")}]`);
      }
      if (fallbackYear) lines.push(`csl_issued_year: ${fallbackYear}`);
      lines.push('meta_source: ["filename"]');
    }
    return lines;
  }
  _parseAuthorsYear(stem) {
    if (!stem) return { authors: [], year: "" };
    const parts = stem.split(/[_\s-]+/).filter(Boolean);
    const yIdx = parts.findIndex((p) => /^(19|20)\d{2}$/.test(p));
    if (yIdx < 0) return { authors: [], year: "" };
    return {
      authors: parts.slice(0, yIdx),
      year: parts[yIdx]
    };
  }
  // 算 vault 里有多少 lit note 已经引用了该概念（用 metadataCache 反向链接）
  _countConceptRefs(conceptName) {
    var _a, _b, _c;
    try {
      const conceptDir = this.plugin.settings.conceptDir || "PaperSearch概念";
      const cPath = `${conceptDir}/${this._slugFilename(conceptName)}.md`;
      const file = this.app.vault.getAbstractFileByPath(cPath);
      if (!file) return 0;
      const m = this.app.metadataCache;
      const bl = (_a = m == null ? void 0 : m.getBacklinksForFile) == null ? void 0 : _a.call(m, file);
      if (bl && typeof bl.count === "function") return bl.count();
      const resolved = (_b = m == null ? void 0 : m.resolvedLinks) != null ? _b : {};
      let n = 0;
      for (const src of Object.keys(resolved)) {
        if ((_c = resolved[src]) == null ? void 0 : _c[file.path]) n++;
      }
      return n;
    } catch (_) {
      return 0;
    }
  }
  // 异步把后端 PDF 字节下载到 vault 缓存目录（同 _openPdfInObsidian 但不开 leaf）
  async _stashPdfToVault(libName, docId, srcFile) {
    if (!libName || !docId && !srcFile) return null;
    try {
      const path = this.plugin._pdfCachePath(srcFile, docId);
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing && existing.extension === "pdf") {
        this.plugin._touchPdfCache(path);
        return path;
      }
      const buf = await this.plugin.api.pdfBytes(libName, docId, srcFile);
      await this.plugin._writePdfCache(path, buf);
      return path;
    } catch (_) {
      return null;
    }
  }
  // 添加为文献笔记 —— 结构化 YAML + 概念枢纽 + 同批召回互链
  // 限并发执行：items 喂 asyncFn，最多 n 个并发
  async _promisePool(items, asyncFn, n = 4) {
    const results = new Array(items.length);
    let cursor = 0;
    const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length) return;
        try {
          results[i] = { ok: true, value: await asyncFn(items[i], i) };
        } catch (err) {
          results[i] = { ok: false, err };
        }
      }
    });
    await Promise.all(workers);
    return results;
  }
  // 静默预热：搜索后立即把前 N 篇 paper-focus 跑出来写入缓存
  // 用户点「分析」时大概率命中缓存秒开；不阻塞 UI、不显进度
  _prefetchPaperFocus(rows, library, query) {
    var _a;
    (_a = this._prefetchAbortCtl) == null ? void 0 : _a.abort();
    const ctl = this._prefetchAbortCtl = new AbortController();
    const todo = (rows || []).filter((r) => {
      if (!r || ctl.signal.aborted) return false;
      const key = this.plugin._analysisCacheKey({
        library,
        documentId: r._docId,
        sourceFile: r._sourceFile,
        query
      });
      return !this.plugin._readAnalysisCache(key);
    });
    if (!todo.length) return;
    this._promisePool(todo, async (row) => {
      if (ctl.signal.aborted) return;
      try {
        await this._getPaperFocus(row, library, query);
      } catch (_) {
      }
    }, 2).catch(() => {
    });
  }
  // 单篇 paper-focus 调用（含缓存命中复用 + 写缓存），返回 { resp, fromCache }
  // ── 收入精读：拷 PDF 入库 → 文献笔记 → Obsidian 原生打开跳命中页 ──
  async _collectForReading(root, row) {
    var _a, _b, _c, _d, _e, _f;
    const library = ((_a = root.querySelector(".pb-lib-widget")) == null ? void 0 : _a.dataset.lib) || ((_b = this._lastSearchParams) == null ? void 0 : _b.library) || "default";
    const query = this._lastQuery || ((_d = (_c = root.querySelector(".pb-search-input")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "";
    if (!row._docId && !row._sourceFile) {
      new obsidian11.Notice("该结果缺少 PDF 标识，无法收入");
      return;
    }
    const stem = this._litNoteStem(row);
    const page = parseInt(row.page) || 1;
    const ntc = new obsidian11.Notice(`正在保存：${row.paperTitle || stem}…`, 0);
    try {
      ntc.setMessage("正在读取 PDF 并确认身份…");
      const buf = await this.plugin.api.pdfBytes(library, row._docId, row._sourceFile);
      const fileHash = nodeCrypto.createHash("sha256").update(Buffer.from(buf)).digest("hex");
      const libraryRoot = this.plugin.settings.paperLibraryDir || "PaperSearch/文献";
      const paperIdentity = this.plugin._resolvePaperIdentity({ row, library, meta: row._meta, fileHash });
      const existingPaperNote = this.plugin._findPaperNote(paperIdentity, stem);
      let dir = `${libraryRoot}/${stem}`;
      const defaultNotePath = `${dir}/${stem}.md`;
      const noteOccupant = this.app.vault.getAbstractFileByPath(defaultNotePath);
      if (noteOccupant && noteOccupant.path !== (existingPaperNote == null ? void 0 : existingPaperNote.path)) {
        const occupantId = ((_f = (_e = this.app.metadataCache.getFileCache(noteOccupant)) == null ? void 0 : _e.frontmatter) == null ? void 0 : _f.paper_id) || "";
        if (!occupantId || occupantId !== paperIdentity.paper_id) {
          dir = `${libraryRoot}/${stem}--${paperIdentity.paper_id.replace(/^paper-/, "").slice(0, 8)}`;
        }
      }
      let pdfRel = `${dir}/${stem}.pdf`;
      const existingPdf = this.app.vault.getAbstractFileByPath(pdfRel);
      if (existingPdf) {
        let existingHash = "";
        try {
          const abs = nodePath4.join(this.app.vault.adapter.getBasePath(), existingPdf.path);
          existingHash = await this.plugin._sha256File(abs);
        } catch (_) {
        }
        if (existingHash && existingHash !== fileHash) {
          dir = `${libraryRoot}/${stem}--${paperIdentity.paper_id.replace(/^paper-/, "").slice(0, 8)}`;
          pdfRel = `${dir}/${stem}.pdf`;
        }
      }
      const ensure = async (d) => {
        let cur = "";
        for (const p of d.split("/")) {
          cur = cur ? `${cur}/${p}` : p;
          if (!this.app.vault.getAbstractFileByPath(cur))
            await this.app.vault.createFolder(cur).catch(() => {
            });
        }
      };
      await ensure(dir);
      if (!this.app.vault.getAbstractFileByPath(pdfRel)) {
        ntc.setMessage("正在拷贝 PDF…");
        await this.app.vault.createBinary(pdfRel, buf);
      }
      ntc.setMessage("正在分析…");
      const { resp, cacheKey } = await this._getPaperFocus(row, library, query);
      const f = this._focusRespToF(resp, row);
      const file = await this._addLitNote(row, f, {
        library,
        query,
        batch: this._rows,
        folderPerPaper: true,
        localPdfPath: pdfRel,
        hitPage: page,
        readStatus: "collected",
        silent: true
      });
      this.plugin._pinAnalysisCache(cacheKey);
      ntc.hide();
      new obsidian11.Notice("已保存");
      const leaf = this.app.workspace.getLeaf("tab");
      const pdfFile = this.app.vault.getAbstractFileByPath(pdfRel);
      if (pdfFile) {
        await leaf.openFile(pdfFile, { eState: { subpath: `#page=${page}` } });
      } else if (file) {
        await leaf.openFile(file);
      }
    } catch (err) {
      ntc.hide();
      new obsidian11.Notice(`保存失败：${err.message}`);
    }
  }
  async _getPaperFocus(row, library, query) {
    var _a;
    const stripHtml = (s) => String(s != null ? s : "").replace(/<[^>]+>/g, "");
    const cacheKey = this.plugin._analysisCacheKey({
      library,
      documentId: row._docId,
      sourceFile: row._sourceFile,
      query
    });
    const cached = this.plugin._readAnalysisCache(cacheKey);
    if (cached == null ? void 0 : cached.response) return { resp: cached.response, cacheKey, fromCache: true };
    const reqBody = {
      query,
      library,
      document_id: row._docId || "",
      source_file: row._sourceFile || "",
      hit_chunks: [{
        chunk_id: row.id,
        page_number: (_a = row.page) != null ? _a : null,
        chunk_index: null,
        text: stripHtml(row.origShort),
        parent_text: stripHtml(row.origFull),
        relevance_label: stripHtml(row.reasonShort),
        relation_type: row.relation_type || "",
        connection_reason: stripHtml(row.reasonFull)
      }]
    };
    const resp = await this.plugin.api.postJson("/paper-focus", reqBody);
    this.plugin._writeAnalysisCache(cacheKey, {
      response: resp,
      paperTitle: row.paperTitle || row.title || "",
      sourceFile: row._sourceFile || "",
      library,
      query,
      requestId: (resp == null ? void 0 : resp.request_id) || ""
    });
    return { resp, cacheKey, fromCache: false };
  }
  // 批量添加为文献笔记 —— 已勾选则仅勾选，否则全部（并发 4 路）
  async _batchAddLitNotes(root) {
    var _a, _b, _c, _d, _e;
    if (!((_a = this._rows) == null ? void 0 : _a.length)) {
      new obsidian11.Notice("当前没有检索结果");
      return;
    }
    const checkedIds = new Set(
      [...root.querySelectorAll(".pb-cb:checked")].map((cb) => cb.dataset.id)
    );
    const targets = checkedIds.size ? this._rows.filter((r) => checkedIds.has(r.id)) : this._rows;
    const library = (_c = (_b = root.querySelector(".pb-lib-widget")) == null ? void 0 : _b.dataset.lib) != null ? _c : "";
    const query = this._lastQuery || ((_e = (_d = root.querySelector(".pb-search-input")) == null ? void 0 : _d.value) == null ? void 0 : _e.trim()) || "";
    const label = checkedIds.size ? `已选 ${targets.length} 条` : `全部 ${targets.length} 条`;
    const proceed = await pbConfirm(this.app, {
      title: "批量保存为文献笔记",
      message: `将${label}结果保存为文献笔记？
同一文献的多个片段会合并到一份笔记；原文片段、相关性说明和概念信息会一并写入。
已有分析结果会直接复用，否则需要调用一次 AI。`,
      confirmText: "保存"
    });
    if (!proceed) return;
    const ntc = new obsidian11.Notice(`批量保存中… 0 / ${targets.length}`, 0);
    let done = 0, ok = 0, fail = 0;
    const tick = () => {
      done++;
      ntc.setMessage(`批量保存中… ${done} / ${targets.length}`);
    };
    await this._promisePool(targets, async (row) => {
      try {
        const { resp, cacheKey } = await this._getPaperFocus(row, library, query);
        const f = this._focusRespToF(resp, row);
        const file = await this._addLitNote(row, f, {
          library,
          query,
          batch: this._rows,
          silent: true
        });
        if (file) {
          this.plugin._pinAnalysisCache(cacheKey);
          ok++;
        }
      } catch (_) {
        fail++;
      } finally {
        tick();
      }
    }, 4);
    ntc.hide();
    new obsidian11.Notice(
      `批量保存完成 · 成功 ${ok}${fail ? ` · 失败 ${fail}` : ""}`
    );
  }
  async _addLitNote(row, f, ctx = {}) {
    var _a, _b, _c, _d, _e;
    const {
      library = "",
      query = "",
      batch = [],
      silent = false,
      folderPerPaper = false,
      // [兼容参数] 新版所有入口都统一为一篇一目录
      localPdfPath = "",
      // 精读：已拷进 vault 的 PDF 相对路径 → 原生嵌入
      hitPage = null,
      // 命中页（原生 PDF 嵌入跳页）
      readStatus = ""
      // collected / reading / done
    } = ctx;
    const CONCEPT_DIR = this.plugin.settings.conceptCandidateDir || "PaperSearch/概念/_候选";
    const stem = this._litNoteStem(row);
    let hashPath = row._sourcePath || "";
    if (!hashPath && localPdfPath) {
      try {
        hashPath = nodePath4.join(this.app.vault.adapter.getBasePath(), localPdfPath);
      } catch (_) {
      }
    }
    const fileHash = row.file_sha256 || ((_a = row._meta) == null ? void 0 : _a.file_sha256) || (hashPath ? await this.plugin._sha256File(hashPath) : "");
    const paperIdentity = this.plugin._resolvePaperIdentity({ row, library, meta: row._meta, fileHash });
    this.plugin._upsertPaperAttachment(paperIdentity.paper_id, {
      sha256: fileHash,
      library,
      document_id: row._docId || "",
      source_file: row._sourceFile || `${stem}.pdf`,
      locator_kind: "source",
      pdf_paths: [localPdfPath, hashPath].filter(Boolean)
    });
    const existingPaperNote = this.plugin._findPaperNote(paperIdentity, stem);
    const libraryRoot = this.plugin.settings.paperLibraryDir || "PaperSearch/文献";
    let baseDir = `${libraryRoot}/${stem}`;
    let filePath = `${baseDir}/${stem}.md`;
    const pathOccupant = this.app.vault.getAbstractFileByPath(filePath);
    if (pathOccupant && pathOccupant.path !== (existingPaperNote == null ? void 0 : existingPaperNote.path)) {
      const occupantFm = ((_b = this.app.metadataCache.getFileCache(pathOccupant)) == null ? void 0 : _b.frontmatter) || {};
      const occupantId = occupantFm.paper_id || "";
      if (!occupantId || occupantId !== paperIdentity.paper_id) {
        const suffix = paperIdentity.paper_id.replace(/^paper-/, "").slice(0, 8);
        baseDir = `${libraryRoot}/${stem}--${suffix}`;
        filePath = `${baseDir}/${stem}.md`;
      }
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const stripHtml = (s) => String(s != null ? s : "").replace(/<[^>]+>/g, "");
    const { authors, year } = this._parseAuthorsYear(stem);
    const concepts = [];
    const seen = /* @__PURE__ */ new Set();
    ((_c = row.keywords) != null ? _c : []).forEach((k) => {
      const t = String(k != null ? k : "").trim();
      if (!t || seen.has(t)) return;
      seen.add(t);
      concepts.push(t);
    });
    const others = (batch || []).filter((r) => r && r.id !== row.id);
    const relatedItems = others.map((r) => ({
      stem: this._litNoteStem(r),
      title: r.paperTitle || r.title || "",
      relation: r.relation_type || ""
    })).filter((x) => x.stem);
    const rawPdfMode = this.plugin.settings.pdfLinkMode || "inline";
    const normalizedPdfMode = rawPdfMode === "hover" || rawPdfMode === "embed" ? "inline" : rawPdfMode;
    const pdfMode = localPdfPath ? "native" : normalizedPdfMode;
    let pdfPath = "";
    let pdfFileUri = "";
    let pdfObsUri = "";
    let pdfEmbedQS = "";
    let pdfNative = "";
    if (pdfMode === "native") {
      pdfNative = localPdfPath;
    } else if (pdfMode === "embed") {
      pdfPath = await this._stashPdfToVault(
        library,
        row._docId,
        row._sourceFile
      );
    } else if (pdfMode === "link") {
      const abs = row._sourcePath || "";
      if (abs) {
        const normalized = abs.replace(/\\/g, "/");
        pdfFileUri = normalized.match(/^[A-Za-z]:/) ? `file:///${normalized}` : `file://${normalized}`;
      }
    } else if (pdfMode === "obsidian-preview") {
      if (row._docId || row._sourceFile) {
        const q = new URLSearchParams({
          action: "open-pdf",
          library: library || "",
          docId: row._docId || "",
          srcFile: row._sourceFile || ""
        });
        pdfObsUri = `obsidian://${PROTOCOL}?${q.toString()}`;
      }
    } else if (pdfMode === "hover" || pdfMode === "inline") {
      if (row._docId || row._sourceFile || row._sourcePath) {
        const hitStr = stripHtml(row.origFull || row.origShort || "").replace(/\s+/g, " ").trim().slice(0, 200);
        const q = new URLSearchParams({
          library: library || "",
          ...row._docId ? { document_id: row._docId } : {},
          ...row._sourceFile ? { source_file: row._sourceFile } : {},
          // src_path：源 PDF 绝对路径（如 Zotero storage），渲染器优先直接 fs 读盘，零拷贝零后端
          ...row._sourcePath ? { src_path: row._sourcePath } : {},
          ...row.page != null ? { page: String(row.page) } : {},
          ...hitStr ? { hit: hitStr } : {}
        });
        pdfEmbedQS = q.toString();
      }
    }
    const cslAuthors = authors.length ? `[${authors.map((a) => `{family: ${this._yamlStr(a)}}`).join(", ")}]` : "";
    const yaml = [
      "---",
      "type: literature-note",
      `paper_id: ${this._yamlStr(paperIdentity.paper_id)}`,
      "paper_aliases:",
      ...paperIdentity.aliases.map((alias) => `  - ${this._yamlStr(alias)}`),
      `paper_title: ${this._yamlStr(row.paperTitle || row.title || "")}`,
      `source_file: ${this._yamlStr(row._sourceFile || "")}`,
      ...authors.length ? [`authors: [${authors.map((a) => this._yamlStr(a)).join(", ")}]`] : [],
      ...year ? [`year: ${year}`] : [],
      `library: ${this._yamlStr(library)}`,
      ...row._docId ? [`document_id: ${this._yamlStr(row._docId)}`] : [],
      ...fileHash ? [`file_sha256: ${this._yamlStr(fileHash)}`] : [],
      ...row.page != null ? [`page: ${row.page}`] : [],
      `role: ${this._yamlStr(f.roleLabel || "—")}`,
      ...concepts.length ? ["concepts:", ...concepts.map((c) => `  - ${this._yamlStr(c)}`)] : [],
      ...query ? [`source_query: ${this._yamlStr(query)}`] : [],
      ...pdfPath ? [`pdf: ${this._yamlStr(pdfPath)}`] : pdfNative ? [`pdf: ${this._yamlStr(pdfNative)}`] : pdfFileUri ? [`pdf_uri: ${this._yamlStr(pdfFileUri)}`] : pdfObsUri ? [`pdf_uri: ${this._yamlStr(pdfObsUri)}`] : [],
      ...readStatus ? [`read_status: ${readStatus}`] : [],
      ...hitPage ? [`hit_page: ${hitPage}`] : [],
      `created: ${today}`,
      `updated: ${today}`,
      // ── 元数据丰富化（优先用 MetadataResolver 缓存里的 CSL + S2 数据）──
      ...this._buildMetaYaml(row, authors, year),
      ...relatedItems.length ? ["related:", ...relatedItems.map((r) => `  - "[[${r.stem}]]"`)] : [],
      "---"
    ].join("\n");
    const conceptLinks = concepts.length ? concepts.map((c) => {
      const n = this._countConceptRefs(c);
      const display = n > 0 ? `${c} (${n})` : c;
      return `[[${this._slugFilename(c)}|${display}]]`;
    }).join(" · ") : "";
    const relatedList = relatedItems.length ? relatedItems.map((r) => `- [[${r.stem}]]${r.relation ? ` —— ${r.relation}` : ""}`).join("\n") : "";
    const hitText = stripHtml(row.origFull || row.origShort || "").trim();
    const pageNote = row.page != null ? `p. ${row.page} · ` : "";
    const venueNote = row.venue ? row.venue : "";
    const body = [
      `# ${row.paperTitle || row.title || stem}`,
      "",
      `> ${pageNote}${venueNote ? venueNote + " · " : ""}角色：**${f.roleLabel || "—"}**`,
      ...query ? [`> 来自检索：「${stripHtml(query)}」`] : [],
      "",
      ...pdfNative ? [
        "## 原文",
        "",
        `> 命中第 ${hitPage || "?"} 页 · 点 PDF 全屏阅读；选中文字 → 右键「复制到选区的链接」→ 粘到下方「摘录」区，双链回原位`,
        "",
        `![[${pdfNative}${hitPage ? `#page=${hitPage}` : ""}]]`,
        "",
        "## 我的摘录与批注",
        "",
        "> 读 PDF 时选中重要段落 → 右键「复制为引用」或「复制到选区的链接」→ 粘到这里。",
        ""
      ] : pdfEmbedQS ? [
        "## 论文",
        "",
        "```pdf-embed",
        pdfEmbedQS,
        "```",
        ""
      ] : pdfPath ? ["## 论文", "", `![[${pdfPath}]]`, ""] : pdfObsUri ? ["## 论文", "", `[在 Obsidian 中预览 PDF](${pdfObsUri})`, ""] : pdfFileUri ? ["## 论文", "", `[在系统中打开 PDF](${pdfFileUri})`, ""] : [],
      "## 核心结论",
      "",
      stripHtml(f.judgement || "—"),
      "",
      "## 建议用途",
      "",
      stripHtml(f.advice || "—"),
      "",
      "## 文献要点（请核对原文）",
      "",
      ...((_d = f.contributions) != null ? _d : []).map((c) => `- ${stripHtml(c)}`),
      "",
      "## 局限与适用边界",
      "",
      ...((_e = f.limitations) != null ? _e : []).map((l) => `- ${stripHtml(l)}`),
      "",
      ...hitText ? ["## 命中片段", "", `> ${hitText.replace(/\n+/g, "\n> ")}`, ""] : [],
      ...conceptLinks ? ["## 相关概念", "", conceptLinks, ""] : [],
      ...relatedList ? ["## 同批召回", "", relatedList, ""] : [],
      "---",
      `*由 PaperSearch · ${today}*`
    ].join("\n");
    const content = `${yaml}

${body}
`;
    const ensureDir = async (dir) => {
      const parts = dir.split("/");
      let cur = "";
      for (const p of parts) {
        cur = cur ? `${cur}/${p}` : p;
        if (!this.app.vault.getAbstractFileByPath(cur)) {
          try {
            await this.app.vault.createFolder(cur);
          } catch (_) {
          }
        }
      }
    };
    try {
      await ensureDir(baseDir);
      if (concepts.length) {
        await ensureDir(CONCEPT_DIR);
        for (const c of concepts) {
          const cName = this._slugFilename(c);
          const cPath = `${CONCEPT_DIR}/${cName}.md`;
          if (!this.app.vault.getAbstractFileByPath(cPath)) {
            const stub = [
              "---",
              "type: concept",
              `aliases: [${this._yamlStr(c)}]`,
              `created: ${today}`,
              "---",
              "",
              `# ${c}`,
              "",
              "> 反向链接中可看到所有引用此概念的文献笔记。",
              ""
            ].join("\n");
            try {
              await this.app.vault.create(cPath, stub);
            } catch (_) {
            }
          }
        }
      }
      let file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file && existingPaperNote) {
        file = existingPaperNote;
        const canonicalRoot = (this.plugin.settings.paperLibraryDir || "PaperSearch/文献") + "/";
        if (!file.path.startsWith(canonicalRoot)) {
          try {
            await this.app.fileManager.renameFile(file, filePath);
            file = this.app.vault.getAbstractFileByPath(filePath) || file;
          } catch (_) {
          }
        }
      }
      if (file) {
        await this.app.fileManager.processFrontMatter(file, (fm) => {
          var _a2, _b2, _c2;
          fm.type = "literature-note";
          fm.paper_id = paperIdentity.paper_id;
          fm.paper_aliases = paperIdentity.aliases;
          if (row.paperTitle || row.title) fm.paper_title = stripHtml(row.paperTitle || row.title);
          if (row._sourceFile) fm.source_file = row._sourceFile;
          if (library) fm.library = library;
          if (row._docId) fm.document_id = row._docId;
          if (fileHash) fm.file_sha256 = fileHash;
          if (readStatus) {
            const rank = { "": 0, collected: 1, reading: 2, done: 3 };
            if ((rank[readStatus] || 0) >= (rank[fm.read_status] || 0)) fm.read_status = readStatus;
          }
          if (pdfNative) fm.pdf = pdfNative;
          if (concepts.length) fm.concepts = [.../* @__PURE__ */ new Set([...Array.isArray(fm.concepts) ? fm.concepts : [], ...concepts])];
          if (relatedItems.length) {
            const incoming = relatedItems.map((r) => `[[${r.stem}]]`);
            fm.related = [.../* @__PURE__ */ new Set([...Array.isArray(fm.related) ? fm.related : [], ...incoming])];
          }
          const entry = (_a2 = row._meta) != null ? _a2 : this.plugin._readDocMeta(row._docId);
          const csl = (entry == null ? void 0 : entry.csl) || {};
          if (csl.DOI) fm.csl_DOI = fm.csl_DOI || csl.DOI;
          if (csl.URL) fm.csl_URL = fm.csl_URL || csl.URL;
          if (csl.title) fm.csl_title = fm.csl_title || csl.title;
          if (csl["container-title"]) fm.csl_container_title = fm.csl_container_title || csl["container-title"];
          if ((_b2 = entry == null ? void 0 : entry.bbt) == null ? void 0 : _b2.citekey) fm.citekey = fm.citekey || entry.bbt.citekey;
          if ((_c2 = entry == null ? void 0 : entry.bbt) == null ? void 0 : _c2.zotero_key) fm.zotero_key = fm.zotero_key || entry.bbt.zotero_key;
          fm.updated = today;
        });
        const old = await this.app.vault.read(file);
        if (!old.includes("## 核心结论") && !old.includes("## 一句话判断")) {
          const sectionAt = body.indexOf("## 核心结论");
          const generatedSections = sectionAt >= 0 ? body.slice(sectionAt) : body;
          await this.app.vault.modify(file, old.trimEnd() + "\n\n" + generatedSections.trim() + "\n");
        }
        if (!silent) new obsidian11.Notice("已更新统一文献笔记");
      } else {
        file = await this.app.vault.create(filePath, content);
        if (!silent) {
          new obsidian11.Notice(
            `文献笔记已创建 ✓${concepts.length ? `（含 ${concepts.length} 个概念）` : ""}`
          );
        }
      }
      this.plugin._registerPaperNote(paperIdentity, file);
      await this.plugin.saveSettings();
      if (!silent) {
        const leaf = this.app.workspace.getLeaf("tab");
        await leaf.openFile(file);
      }
      return file;
    } catch (err) {
      if (!silent) new obsidian11.Notice(`创建笔记失败：${err.message}`);
      return null;
    }
  }
};

// src/main.ts
var PaperSearchPlugin = class extends obsidian12.Plugin {
  // 构建时注入的版本号 vs 磁盘 manifest.json 里声明的版本号。
  // 两者不一致意味着上次更新只换了其中一个文件——最典型的是自动更新写进了新
  // manifest 却没换掉 main.js，于是插件顶着新版本号跑着旧代码，任何「这版已修复」
  // 的判断都不成立。宁可启动时吵一声，也不要让它静默错位。
  _assertBuildMatchesManifest() {
    var _a;
    const built = true ? "0.8.2" : "";
    const declared = ((_a = this.manifest) == null ? void 0 : _a.version) || "";
    if (!built || !declared || built === declared) return;
    console.error(`PaperSearch: 版本错位——运行中的代码构建自 ${built}，manifest.json 声明的是 ${declared}。`);
    new obsidian12.Notice(
      `PaperSearch 版本错位：代码 ${built}，清单 ${declared}。请重新安装插件，否则功能与版本号对不上。`,
      0
    );
  }
  async onload() {
    this._assertBuildMatchesManifest();
    await this.loadSettings();
    this.api = new PBApi(this);
    this.coreManager = new CoreManager(this);
    this.buildManager = new BuildManager(this);
    this.metaResolver = new MetadataResolver(this);
    this.registerView(VIEW_TYPE, (leaf) => new PaperSearchView(leaf, this));
    this.registerView(COMPANION_VIEW_TYPE, (leaf) => new WritingCompanionView(leaf, this));
    this.registerView(CITATION_PALETTE_VIEW_TYPE, (leaf) => new CitationPaletteView(leaf, this));
    this.addRibbonIcon("quote", "PaperSearch 文献收集栏", () => this._toggleCitePanel());
    this.app.workspace.onLayoutReady(() => {
      var _a;
      this.app.workspace.getLeavesOfType(CITATION_PALETTE_VIEW_TYPE).forEach((l) => l.detach());
      this._ensureCitePanel();
      this._refreshCitePanel();
      const firstPaperMigration = ((_a = this.paperIndex) == null ? void 0 : _a.migration_version) !== 1;
      this._rebuildPaperIndex({
        writeFrontmatter: true,
        inferLegacyDoi: firstPaperMigration
      }).then(async (result) => {
        const merged = firstPaperMigration ? await this._mergeDuplicatePaperNotes() : { groups: 0, sources: 0 };
        await this._backfillEvidenceIdentity();
        const anchorAudit = await this._reconcileEvidenceAnchors({
          quarantineBroken: firstPaperMigration
        });
        if (firstPaperMigration) {
          new obsidian12.Notice(
            `文献记录整理完成：${result.files} 份笔记归并为 ${result.papers} 篇文献；已保全并合并 ${merged.sources} 份历史副本内容；有效来源记录 ${anchorAudit.anchored} 条，已隔离含失效来源标记的笔记 ${anchorAudit.quarantined} 份`,
            1e4
          );
        } else if (result.duplicates > 0) {
          new obsidian12.Notice(
            `检测到 ${result.duplicates} 组重复文献笔记。请运行「整理并合并重复文献记录」确认并合并`,
            8e3
          );
        }
      }).catch((err) => console.warn("[PaperSearch] Paper identity migration skipped:", err));
    });
    this._setupCoreStatusBar();
    this._setupBuildStatusBar();
    this._injectAnnoCalloutCss();
    if (!this.settings.onboardingDone && !this._coreSetupDismissed) {
      setTimeout(() => {
        new OnboardingWizard(this.app, this, () => this._bootCoreThenViews()).open();
      }, 800);
    } else {
      this._bootCoreThenViews();
    }
    this._sessionId = `obsidian-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const sid = encodeURIComponent(this._sessionId);
    this.api.postJson(`/ui-session/open?session_id=${sid}`, {}).catch(() => {
    });
    this.registerInterval(window.setInterval(() => {
      this.api.postJson(`/ui-session/heartbeat?session_id=${sid}`, {}).catch(() => {
      });
    }, 45e3));
    this.addRibbonIcon("search", "打开 PaperSearch", () => this.activateView());
    this.addCommand({
      id: "open-papersearch",
      name: "打开 PaperSearch 面板",
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "restart-core",
      name: "启动或重启本地服务",
      callback: () => this._restartCore()
    });
    this.addCommand({
      id: "push-to-papersearch",
      name: "推送选中文本到 PaperSearch",
      editorCallback: (editor) => {
        const sel = editor.getSelection().trim();
        if (!sel) {
          new obsidian12.Notice("请先选中文本");
          return;
        }
        this._pushSelectionToPanel(sel);
      }
    });
    this.addCommand({
      id: "draft-scene-opening",
      name: "插入 AI 开篇草稿（来源待核对）",
      callback: async () => {
        var _a, _b, _c;
        const active = this.app.workspace.getActiveFile();
        if (!active) {
          new obsidian12.Notice("请先打开一个章节文件");
          return;
        }
        const projPath = this.settings.writingProjectPath;
        if (!projPath) {
          new obsidian12.Notice("请先设置写作项目");
          return;
        }
        if (!this._paperbellPlugin() && !window.registerPPBplugin) {
          new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
          return;
        }
        const projFile = this.app.vault.getAbstractFileByPath(projPath);
        const folder = ((_a = projFile == null ? void 0 : projFile.parent) == null ? void 0 : _a.path) || "";
        const sceneRel = active.path === projPath ? "__main__" : active.path.replace(folder + "/", "");
        const relevant = [];
        for (const f of this._listPaperNotes()) {
          const fm = (_b = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _b.frontmatter;
          if ((_c = fm == null ? void 0 : fm.analyzed_for_scenes) == null ? void 0 : _c.includes(sceneRel)) {
            relevant.push({ file: f, fm });
          }
        }
        if (!relevant.length) {
          new obsidian12.Notice("本节还没有关联文献。请先分析几篇文献与当前写作项目的关系");
          return;
        }
        const top = relevant.sort((a, b) => (b.fm.citation_count || 0) - (a.fm.citation_count || 0)).slice(0, 5);
        const ntc = new obsidian12.Notice("起草中…", 0);
        try {
          const sceneTitle = active.basename;
          const sceneTxt = (await this.app.vault.read(active)).replace(/^---\n[\s\S]*?\n---\n?/, "").slice(0, 800);
          const refsText = top.map((r, i) => {
            const t = r.fm.csl_title || r.fm.paper_title || r.file.basename;
            const authors = Array.isArray(r.fm.csl_author) ? r.fm.csl_author.map((a) => a.family || a).join(", ") : (r.fm.authors || []).join(", ");
            const year = r.fm.csl_issued_year || r.fm.year || "";
            const tldr = r.fm.tldr || "";
            const ck = r.fm.citekey || r.file.basename;
            return `[${i + 1}] ${authors} (${year}) "${t}"
   citekey: ${ck}
   要点：${tldr}`;
          }).join("\n\n");
          const sys = "你是学术写作助手。根据用户提供的本节标题与已读文献清单，写一段 200-300 字的开篇段落，自然融入文献引用（用 Pandoc 风格 @citekey 标注）。文风学术、严谨、避免堆砌。直接输出段落正文，不要添加任何解释或 markdown 标记。";
          const user = [
            `本节标题：${sceneTitle}`,
            `本节已有内容（开头部分）：${sceneTxt || "（空）"}`,
            "",
            "可用文献：",
            refsText,
            "",
            "请写本节的开篇段落（200-300 字，用 @citekey 引用相关文献）："
          ].join("\n");
          const para = await this._requestPaperbellCompletion({
            system: sys,
            messages: [{ role: "user", content: user }],
            temperature: 0.5,
            maxTokens: 1200
          });
          const raw = await this.app.vault.read(active);
          const fmMatch = raw.match(/^---\n[\s\S]*?\n---\n?/);
          const fmTail = fmMatch ? fmMatch[0] : "";
          const rest = fmMatch ? raw.slice(fmMatch[0].length) : raw;
          const draft = [
            "",
            "> [!draft] AI 开篇草稿（来源待核对）",
            ...para.split("\n").map((l) => `> ${l}`),
            ""
          ].join("\n");
          await this.app.vault.modify(active, fmTail + draft + rest);
          ntc.hide();
          new obsidian12.Notice(`已插入 AI 开篇草稿；请核对其中 ${top.length} 篇文献的引用位置`);
        } catch (e) {
          ntc.hide();
          new obsidian12.Notice(`起草失败：${e.message}`);
        }
      }
    });
    this.addCommand({
      id: "excerpt-pdf-selection",
      name: "收入选中文字到文献笔记（在 PDF 中）",
      checkCallback: (checking) => {
        var _a, _b;
        const sel = (_b = (_a = window.getSelection()) == null ? void 0 : _a.toString()) == null ? void 0 : _b.trim();
        const file = this.app.workspace.getActiveFile();
        const isPdf = (file == null ? void 0 : file.extension) === "pdf";
        if (!isPdf || !sel) return false;
        if (checking) return true;
        this._excerptToNote(file, sel).catch((e) => new obsidian12.Notice(`收入失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "search-from-pdf-selection",
      name: "用选中文字找相似文献（在 PDF 中）",
      checkCallback: (checking) => {
        var _a, _b;
        const sel = (_b = (_a = window.getSelection()) == null ? void 0 : _a.toString()) == null ? void 0 : _b.trim();
        const file = this.app.workspace.getActiveFile();
        if ((file == null ? void 0 : file.extension) !== "pdf" || !sel) return false;
        if (checking) return true;
        (async () => {
          await this.activateView();
          const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
          if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) {
            leaf.view.pushQuery(sel.slice(0, 300));
          }
        })();
        return true;
      }
    });
    this.addCommand({
      id: "search-from-current-scene",
      name: "从当前章节搜索文献",
      checkCallback: (checking) => {
        const active = this.app.workspace.getActiveFile();
        if (!active) return false;
        if (checking) return true;
        (async () => {
          let txt = "";
          try {
            txt = await this.app.vault.read(active);
          } catch (_) {
          }
          const body = txt.replace(/^---\n[\s\S]*?\n---\n?/, "");
          const h = (body.match(/^#{1,3}\s+(.+)$/m) || [])[1] || "";
          const tail = body.slice(-400).replace(/[#>*\-]/g, "").replace(/\s+/g, " ").trim();
          const query = (h + " " + tail).trim().slice(0, 200) || active.basename;
          await this.activateView();
          const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
          if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) {
            leaf.view.pushQuery(query);
          }
        })();
        return true;
      }
    });
    this.addCommand({
      id: "rebuild-citation-linkback",
      name: "重新建立项目内的引用反向链接",
      callback: async () => {
        var _a;
        const projPath = this.settings.writingProjectPath;
        if (!projPath) {
          new obsidian12.Notice("请先设置写作项目");
          return;
        }
        const projFile = this.app.vault.getAbstractFileByPath(projPath);
        if (!projFile) {
          new obsidian12.Notice("项目文件不存在");
          return;
        }
        const folder = ((_a = projFile.parent) == null ? void 0 : _a.path) || "";
        const sceneFiles = this.app.vault.getMarkdownFiles().filter((f) => f.path === projPath || folder && f.path.startsWith(folder + "/"));
        this._rebuildLitNoteCitekeyIndex();
        const ntc = new obsidian12.Notice(`扫描 0 / ${sceneFiles.length}…`, 0);
        let done = 0;
        for (const f of sceneFiles) {
          done++;
          ntc.setMessage(`扫描 ${done} / ${sceneFiles.length}…`);
          await this._scanFileAndLinkback(f);
        }
        ntc.hide();
        new obsidian12.Notice(`引用链路已重建（扫了 ${sceneFiles.length} 个文件）`);
      }
    });
    this.addCommand({
      id: "generate-bibliography",
      name: "生成本文参考文献表（References）",
      checkCallback: (checking) => {
        if (!this.app.workspace.getActiveViewOfType(obsidian12.MarkdownView)) return false;
        if (checking) return true;
        this._generateBibliography();
        return true;
      }
    });
    this.addCommand({
      id: "guide-create-library",
      name: "上手引导：新建文献库",
      callback: () => this._guideCreateLibrary()
    });
    this.addCommand({
      id: "open-writing-companion",
      name: "打开写作伴侣（本节相关文献）",
      callback: async () => {
        const existing = this.app.workspace.getLeavesOfType(COMPANION_VIEW_TYPE)[0];
        if (existing) {
          this.app.workspace.revealLeaf(existing);
        } else {
          const leaf = this.app.workspace.getRightLeaf(false);
          await leaf.setViewState({ type: COMPANION_VIEW_TYPE, active: true });
          this.app.workspace.revealLeaf(leaf);
        }
      }
    });
    this.addCommand({
      id: "verify-citation-fidelity",
      name: "AI 核查当前论断",
      editorCheckCallback: (checking, editor) => {
        const cit = this._citationAtCursor(editor);
        if (!cit) return false;
        if (checking) return true;
        this._verifyCitationFidelity(editor, cit).catch((e) => new obsidian12.Notice(`AI 核查失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "verify-all-citations",
      name: "AI 核查全文论断",
      editorCheckCallback: (checking, editor) => {
        const text = editor.getValue();
        if (!/%%cite:[\w-]+%%/.test(text)) return false;
        if (checking) return true;
        this._verifyAllCitations(editor).catch((e) => new obsidian12.Notice(`全文 AI 核查失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "format-citation",
      name: "复制引文（APA / MLA / Chicago / BibTeX）",
      editorCheckCallback: (checking, editor) => {
        const cit = this._citationAtCursor(editor);
        if (!cit || !cit.csl) return false;
        if (checking) return true;
        this._pickCitationStyle(cit);
        return true;
      }
    });
    this.addCommand({
      id: "load-citation-demo",
      name: "加载 AI 证据核查示例（含原文不支持的论断）",
      callback: () => {
        this._loadCitationDemo().catch((e) => new obsidian12.Notice("加载示例库失败：" + e.message));
      }
    });
    this.addCommand({
      id: "paraphrase-citation",
      name: "AI 转述当前原文（自动关联来源）",
      editorCheckCallback: (checking, editor) => {
        const cit = this._citationAtCursor(editor);
        if (!cit || !cit.source_quote) return false;
        if (checking) return true;
        this._paraphraseCitation(editor, cit).catch((e) => new obsidian12.Notice(`转述失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "open-citation-palette",
      name: "展开 / 固定 文献收集栏",
      callback: () => this._toggleCitePanel()
    });
    this.addCommand({
      id: "scan-existing-citations",
      name: "为已有引用补充来源定位",
      editorCheckCallback: (checking, editor) => {
        const text = editor.getValue();
        const hasCite = /@[A-Za-z][\w:-]+/.test(text);
        const hasPdf = /\[\[[^\]]+\.pdf#page=\d+/.test(text);
        if (!hasCite && !hasPdf) return false;
        if (checking) return true;
        this._scanExistingCitations(editor).catch((e) => new obsidian12.Notice(`事后扫描失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "aggregate-recent-citations",
      name: "把最近几条引用聚合成综述句",
      editorCheckCallback: (checking, editor) => {
        var _a, _b;
        if (!editor) return false;
        const items = Object.values((_b = (_a = this.citationIndex) == null ? void 0 : _a.items) != null ? _b : {}).filter((c) => c && String(c.source_quote || "").trim());
        if (items.length < 2) return false;
        if (checking) return true;
        const recent = items.sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 4);
        this._aggregateFromCitations(editor, recent).catch((e) => new obsidian12.Notice(`聚合失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "set-as-writing-project",
      name: "设为当前写作项目",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (checking) return true;
        this.settings.writingProjectPath = file.path;
        this.saveSettings();
        new obsidian12.Notice(`已设为当前写作项目：${file.basename}`);
        return true;
      }
    });
    this.addCommand({
      id: "analyze-fit-with-writing",
      name: "分析当前文献与写作项目的关联",
      checkCallback: (checking) => {
        var _a;
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
        if (!fm || fm.type !== "literature-note") return false;
        if (!this.settings.writingProjectPath) return false;
        if (checking) return true;
        (async () => {
          var _a2, _b;
          const docId = fm.document_id || "";
          const srcFile = fm.source_file || "";
          let view = (_a2 = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]) == null ? void 0 : _a2.view;
          if (!view) {
            await this.activateView();
            view = (_b = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]) == null ? void 0 : _b.view;
          }
          if (!(view == null ? void 0 : view._analyzeFitWithProject)) {
            new obsidian12.Notice("需要打开 PaperSearch 面板");
            return;
          }
          const row = {
            id: fm.document_id || file.basename,
            paperTitle: fm.csl_title || fm.paper_title || file.basename,
            title: file.basename,
            _docId: docId,
            _sourceFile: srcFile,
            origFull: "",
            origShort: ""
          };
          const f = {
            roleLabel: fm.role || "",
            judgement: fm.tldr || "",
            // 没有 judgement 时用 tldr 兜底
            contributions: [],
            limitations: [],
            advice: "",
            hitChunk: ""
          };
          const ntc = new obsidian12.Notice("正在分析与写作项目的关联…", 0);
          try {
            const fit = await view._analyzeFitWithProject(row, f);
            const section = view._fitResultToMd(fit);
            const raw = await this.app.vault.read(file);
            const stripped = raw.replace(/\n## 与当前写作项目的关联[\s\S]*?(?=\n## |\n---\n|$)/g, "");
            const newContent = stripped.trimEnd() + "\n" + section;
            await this.app.vault.modify(file, newContent);
            const sceneRel = fit.scene_rel || "__main__";
            await this.app.fileManager.processFrontMatter(file, (fm2) => {
              const arr = Array.isArray(fm2.analyzed_for_scenes) ? fm2.analyzed_for_scenes : [];
              if (!arr.includes(sceneRel)) arr.push(sceneRel);
              fm2.analyzed_for_scenes = arr;
            });
            new obsidian12.Notice("关联分析已写入文献笔记 ✓");
          } catch (e) {
            new obsidian12.Notice(`分析失败：${e.message}`);
          } finally {
            ntc.hide();
          }
        })();
        return true;
      }
    });
    this.addCommand({
      id: "reresolve-current-paper-meta",
      name: "重新解析当前文献元数据",
      checkCallback: (checking) => {
        var _a;
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
        const docId = (fm == null ? void 0 : fm.document_id) || "";
        const srcFile = (fm == null ? void 0 : fm.source_file) || "";
        if (!docId && !srcFile) return false;
        if (checking) return true;
        const row = { _docId: docId, _sourceFile: srcFile, title: file.basename };
        this.metaResolver.resolve(row, { force: true }).then((entry) => {
          new obsidian12.Notice(`已重新解析（来源：${((entry == null ? void 0 : entry.meta_source) || []).join("+") || "失败"}）`);
        }).catch((e) => new obsidian12.Notice(`解析失败：${e.message}`));
        return true;
      }
    });
    this.addCommand({
      id: "rebuild-references-in-vault",
      name: "重新查找当前文献的库内参考文献",
      checkCallback: (checking) => {
        var _a, _b, _c, _d;
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
        if (!(fm == null ? void 0 : fm.document_id)) return false;
        if (checking) return true;
        const entry = this._readDocMeta(fm.document_id);
        if (!((_c = (_b = entry == null ? void 0 : entry.s2) == null ? void 0 : _b.references) == null ? void 0 : _c.length)) {
          new obsidian12.Notice("该文献还没有 S2 references 数据");
          return true;
        }
        const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
        if ((_d = leaf == null ? void 0 : leaf.view) == null ? void 0 : _d._computeReferencesInVault) {
          const refs = leaf.view._computeReferencesInVault(entry);
          new obsidian12.Notice(`在当前 Obsidian 库中匹配到 ${refs.length} 篇参考文献：${refs.slice(0, 3).join(", ")}${refs.length > 3 ? "…" : ""}`);
        }
        return true;
      }
    });
    this.addCommand({
      id: "show-claim-evidence-status",
      name: "查看当前论断的 AI 核查状态",
      editorCheckCallback: (checking, editor) => {
        const claim = this._claimAtCursor(editor);
        if (!claim) return false;
        if (checking) return true;
        this._showClaimEvidenceStatus(editor, claim);
        return true;
      }
    });
    this.addCommand({
      id: "rebuild-paper-identity-index",
      name: "整理并合并重复文献记录",
      callback: async () => {
        const ntc = new obsidian12.Notice("正在整理文献身份记录…", 0);
        try {
          const result = await this._rebuildPaperIndex({ writeFrontmatter: true });
          const merged = await this._mergeDuplicatePaperNotes();
          await this._backfillEvidenceIdentity();
          const anchorAudit = await this._reconcileEvidenceAnchors();
          new obsidian12.Notice(
            `文献记录已整理：${result.files} 份笔记 → ${result.papers} 篇文献；本次合并 ${merged.sources} 份历史副本，待确认 ${result.unresolved} 份；有效来源记录 ${anchorAudit.anchored} 条，失去来源关联的记录已归档 ${anchorAudit.detached} 条`,
            9e3
          );
        } catch (err) {
          new obsidian12.Notice(`整理失败：${err.message}`, 9e3);
        } finally {
          ntc.hide();
        }
      }
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        const sel = editor.getSelection().trim();
        if (sel) {
          menu.addItem((item) => {
            item.setTitle("推送到 PaperSearch").setIcon("search").onClick(() => this._pushSelectionToPanel(sel));
          });
        }
        menu.addItem((item) => {
          item.setTitle("从本节内容搜索文献").setIcon("book-open").onClick(() => this.app.commands.executeCommandById(`${this.manifest.id}:search-from-current-scene`));
        });
      })
    );
    this.registerEditorExtension([
      createInlineBarExtension(this),
      createDragExtension(this)
    ]);
    this.addSettingTab(new PaperSearchSettingTab(this.app, this));
    document.body.style.setProperty("--pb-abstract-lines", String(this.settings.originalPreviewLines));
    this._applyHoverPopupSetting();
    this._bootSourceWatchers();
    this._loadBbtBib();
    this._watchBbtBib();
    this.registerMarkdownCodeBlockProcessor("pdf-embed", (source, el, ctx) => {
      this._renderPdfEmbed(el, source.trim(), { inline: true }, ctx);
    });
    this.registerMarkdownCodeBlockProcessor("pdf-hover", (source, el, ctx) => {
      this._renderPdfEmbed(el, source.trim(), { inline: false }, ctx);
    });
    const handleProtocol = async (params) => {
      try {
        if (params.action === "open-pdf") {
          const library = params.library || params.lib || "default";
          const docId = params.docId || params.doc || "";
          const srcFile = params.srcFile || params.src || "";
          const page = parseInt(params.page) || 0;
          if (page > 0) {
            this.openPdfModalAt({ library, documentId: docId, sourceFile: srcFile, page });
          } else {
            const ntc = new obsidian12.Notice("打开 PDF 中…", 0);
            try {
              await this.openPdfInObsidian(library, docId, srcFile);
            } finally {
              ntc.hide();
            }
          }
        }
      } catch (e) {
        new obsidian12.Notice(`打开 PDF 失败：${e.message}`);
      }
    };
    this.registerObsidianProtocolHandler(PROTOCOL, handleProtocol);
    this.registerObsidianProtocolHandler(LEGACY_PROTOCOL, handleProtocol);
    this._setupCitationLinkback();
    this._setupClaimStalenessTracking();
    this._setupPdfSelectionToolbar();
  }
  // ── 引用链路：scene 文件保存后扫 @citekey，回写 lit note cited_in ──
  _setupCitationLinkback() {
    this._litNoteCitekeyIndex = null;
    this._linkbackDebounce = /* @__PURE__ */ new Map();
    this.registerEvent(this.app.vault.on("modify", (file) => {
      this._maybeScanForCitations(file);
    }));
    const attach = (file) => {
      var _a;
      if (!this._isPaperNoteFile(file)) return;
      this._litNoteCitekeyIndex = null;
      const fm = ((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) || {};
      const identity = this._resolvePaperIdentity({ paperId: fm.paper_id || "", fm, sourceFile: fm.source_file || file.basename });
      if (identity.paper_id) this._registerPaperNote(identity, file);
      this.saveSettings();
    };
    const detachPath = (path) => {
      let changed = false;
      for (const item of Object.values(this.paperIndex.items || {})) {
        if (!(item.note_paths || []).includes(path) && item.note_path !== path) continue;
        item.note_paths = (item.note_paths || []).filter((p) => p !== path);
        if (item.note_path === path) item.note_path = item.note_paths[0] || "";
        changed = true;
      }
      if (changed) this.saveSettings();
      this._litNoteCitekeyIndex = null;
    };
    this.registerEvent(this.app.vault.on("create", attach));
    this.registerEvent(this.app.vault.on("delete", (file) => detachPath((file == null ? void 0 : file.path) || "")));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      let changed = false;
      for (const item of Object.values(this.paperIndex.items || {})) {
        if (!(item.note_paths || []).includes(oldPath) && item.note_path !== oldPath) continue;
        item.note_paths = [...new Set((item.note_paths || []).map((p) => p === oldPath ? file.path : p))];
        if (item.note_path === oldPath) item.note_path = file.path;
        changed = true;
      }
      if (changed) this.saveSettings();
      attach(file);
    }));
  }
  // 重建 lit note 索引（citekey → file），命中后续 linkback 用
  _rebuildLitNoteCitekeyIndex() {
    var _a;
    const map = /* @__PURE__ */ new Map();
    for (const f of this._listPaperNotes()) {
      const fm = (_a = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _a.frontmatter;
      if (fm == null ? void 0 : fm.citekey) {
        map.set(String(fm.citekey).trim(), f);
      }
    }
    this._litNoteCitekeyIndex = map;
  }
  _maybeScanForCitations(file) {
    var _a, _b;
    if (!file || !((_a = file.path) == null ? void 0 : _a.endsWith(".md"))) return;
    if (this._unloading) return;
    if (this._isPaperNoteFile(file)) {
      this._litNoteCitekeyIndex = null;
      return;
    }
    const projPath = this.settings.writingProjectPath;
    if (!projPath) return;
    const projFile = this.app.vault.getAbstractFileByPath(projPath);
    if (!projFile) return;
    const projFolder = ((_b = projFile.parent) == null ? void 0 : _b.path) || "";
    const inProject = file.path.startsWith(projFolder + "/") || file.path === projPath;
    if (!inProject) return;
    if (this._linkbackDebounce.has(file.path)) {
      clearTimeout(this._linkbackDebounce.get(file.path));
    }
    const timer = setTimeout(() => {
      this._linkbackDebounce.delete(file.path);
      if (this._unloading) return;
      this._scanFileAndLinkback(file).catch(() => {
      });
    }, 3e3);
    this._linkbackDebounce.set(file.path, timer);
  }
  async _scanFileAndLinkback(sceneFile) {
    var _a, _b;
    if (!this._litNoteCitekeyIndex) this._rebuildLitNoteCitekeyIndex();
    const idx = this._litNoteCitekeyIndex;
    let txt = "";
    try {
      txt = await this.app.vault.read(sceneFile);
    } catch (_) {
      return;
    }
    const found = /* @__PURE__ */ new Set();
    const re = /(?:^|[^\w@])@(?!(?:fig|eq|tbl|sec|lst):)([A-Za-z][\w:.\-]*)/g;
    let m;
    while ((m = re.exec(txt)) !== null) found.add(m[1]);
    const targetPaths = /* @__PURE__ */ new Set();
    for (const ck of found) {
      const litFile = idx.get(ck);
      if (litFile) targetPaths.add(litFile.path);
    }
    for (const match of txt.matchAll(/%%cite:([\w-]+)%%/g)) {
      const cit = this._readCitation(match[1]);
      const notePath = (cit == null ? void 0 : cit.paper_id) && ((_b = (_a = this.paperIndex.items) == null ? void 0 : _a[cit.paper_id]) == null ? void 0 : _b.note_path);
      if (notePath) targetPaths.add(notePath);
    }
    for (const litFile of this._listPaperNotes()) {
      try {
        await this.app.fileManager.processFrontMatter(litFile, (fm) => {
          const list = new Set(Array.isArray(fm.cited_in) ? fm.cited_in : []);
          if (targetPaths.has(litFile.path)) list.add(sceneFile.path);
          else list.delete(sceneFile.path);
          fm.cited_in = [...list];
        });
      } catch (_) {
      }
    }
  }
  _applyHoverPopupSetting() {
    const off = (this.settings.hoverPopupMode || "click") === "off";
    document.body.classList.toggle("pb-no-hover-popup", off);
  }
  // 拉起 Core 后端 → 检测健康 → 不健康也不阻塞 UI（自愈交给 CoreManager）
  async _bootCoreThenViews() {
    if (this.coreManager._canLaunch()) {
      try {
        this.coreManager._restartAttempts = 0;
        await this.coreManager.spawn();
      } catch (e) {
        new obsidian12.Notice(`PaperSearch 本地服务未启动：${e.message}`);
      }
      return;
    }
    if (this.settings.developerMode) return;
    this.coreManager._setStatus("idle", "本地服务未安装");
    new obsidian12.Notice("PaperSearch：本地服务尚未安装，点击状态栏中的「PaperSearch 未就绪」即可安装", 7e3);
  }
  // 打开核心安装/管理向导（状态栏 + 检索失败「安装/修复」按钮都走这里）
  _openCoreSetup() {
    new OnboardingWizard(this.app, this, () => this._bootCoreThenViews()).open();
  }
  // ── PaperBell host API 客户端 ───────────────────────────────────
  // 账号授权 / AI 密钥 / 受保护下载票据统一委托给 PaperBell 宿主插件；
  // PaperSearch 不再自己起 OAuth loopback，也不再保存 / 管理 activationCode。
  _siteBase() {
    return (this.settings.siteBaseUrl || "https://paperbell.cn").trim().replace(/\/+$/, "");
  }
  _safeJson(r) {
    try {
      return r.json || {};
    } catch (_) {
      return {};
    }
  }
  // 找到 PaperBell 宿主插件（兼容其可能的历史 id）
  _paperbellPlugin() {
    var _a, _b;
    const plugins = ((_b = (_a = this.app) == null ? void 0 : _a.plugins) == null ? void 0 : _b.plugins) || {};
    return plugins.paperbell || plugins["paperbell-build"] || plugins["paperbell-pro"] || null;
  }
  // 打开 PaperBell 的设置页（只调用宿主的 openSettings，不关 Obsidian 原设置窗）
  _openPaperbellSettings(tabId = "ai") {
    const host = this._paperbellPlugin();
    if (!(host == null ? void 0 : host.openSettings)) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件");
      return;
    }
    try {
      host.openSettings(tabId);
    } catch (e) {
      new obsidian12.Notice("打开 PaperBell 设置失败：" + (e.message || String(e)));
    }
  }
  // 注册 PaperSearch 到 PaperBell，拿到 host client（缓存复用；onunload 释放）
  _ensurePaperbellClient() {
    var _a;
    if (this._paperbellClient) return this._paperbellClient;
    const host = this._paperbellPlugin();
    const register = ((_a = host == null ? void 0 : host.api) == null ? void 0 : _a.registerPPBplugin) || window.registerPPBplugin;
    if (!register) throw new Error("请先安装并启用 PaperBell 插件");
    this._paperbellClient = register({
      id: this.manifest.id,
      name: this.manifest.name || "PaperSearch",
      description: "PaperSearch 使用 PaperBell 的账户与 AI 密钥授权，不在设置页二次填写服务商密钥。",
      icon: "search",
      onOpen: () => {
        var _a2;
        return (_a2 = this._openCoreSetup) == null ? void 0 : _a2.call(this);
      }
    });
    return this._paperbellClient;
  }
  // 向 PaperBell 请求账号授权状态
  async _requestPaperbellActivationInfo() {
    const client = this._ensurePaperbellClient();
    if (!client.requestActivationInfo) {
      throw new Error("当前 PaperBell 版本不支持账号授权状态，请更新 PaperBell 插件");
    }
    const info = await client.requestActivationInfo();
    if (!info) throw new Error("PaperBell 授权被拒绝");
    return info;
  }
  _paperbellActivationCode() {
    var _a, _b, _c;
    const host = this._paperbellPlugin();
    return String(((_a = host == null ? void 0 : host.settings) == null ? void 0 : _a.registrationId) || ((_b = host == null ? void 0 : host.proxyService) == null ? void 0 : _b.activationCode) || ((_c = host == null ? void 0 : host.verificationWorker) == null ? void 0 : _c.activationCode) || "").trim();
  }
  hasValidActivation() {
    return !!this._paperbellActivationCode();
  }
  async _runOAuthActivation() {
    throw new Error("PaperSearch 不再单独管理 OAuth，请在 PaperBell 插件中完成授权");
  }
  async _clearActivation() {
    new obsidian12.Notice("PaperSearch 不再单独管理授权，请在 PaperBell 插件中管理账号授权。");
  }
  // 取受保护下载票据：PaperBell 负责授权，PaperSearch 负责平台包选择。
  // 旧版宿主不会转发 platform/arch，非 Windows 平台在获得下载授权后由 PaperSearch 补发精确请求。
  async _fetchCoreDownloadTicket() {
    const client = this._ensurePaperbellClient();
    if (!client.requestProtectedDownloadTicket) {
      throw new Error("当前 PaperBell 版本不支持下载授权，请更新 PaperBell 插件");
    }
    const baseUrl = this._siteBase();
    const platform = this.coreManager.platform();
    const arch = this.coreManager.arch();
    const ticket = await client.requestProtectedDownloadTicket({
      product: "paperbell-core",
      baseUrl
    });
    if (!(ticket == null ? void 0 : ticket.url)) throw new Error("PaperBell 未返回下载链接");
    if (platform === "win") return ticket;
    const activationCode = this._paperbellActivationCode();
    if (!activationCode) throw new Error("无法读取 PaperBell 授权信息，请重新登录 PaperBell");
    const query = new URLSearchParams({ platform, arch });
    const response = await obsidian12.requestUrl({
      url: `${baseUrl}/api/downloads/paperbell-core?${query.toString()}`,
      method: "GET",
      headers: { "X-Activation-Code": activationCode },
      throw: false
    });
    const payload = this._safeJson(response);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(payload.message || payload.error || `获取 ${platform}/${arch} 下载链接失败（HTTP ${response.status}）`);
    }
    const platformTicket = payload.data || payload;
    if (!(platformTicket == null ? void 0 : platformTicket.url)) throw new Error(`下载服务未返回 ${platform}/${arch} 安装包`);
    return platformTicket;
  }
  // 一步到位：取票(可传入已取好的) → CoreManager 下载+校验+解压 → 记录安装指纹。返回 ticket。
  async _downloadCoreAuthorized(onProgress, ticket = null) {
    ticket = ticket || await this._fetchCoreDownloadTicket();
    const sha256 = String(ticket.sha256 || this.settings.coreDownloadSha256 || "").trim();
    await this.coreManager.download(ticket.url, sha256, onProgress);
    this._rememberInstalledCore(ticket);
    await this.saveSettings();
    return ticket;
  }
  // 记录本次安装的核心指纹（供「检查并更新」判断是否已是最新）
  _rememberInstalledCore(ticket = {}) {
    this.settings.coreInstalledVersion = String(ticket.version || "").trim();
    this.settings.coreInstalledSha256 = String(ticket.sha256 || "").trim();
    this.settings.coreInstalledFilename = String(ticket.filename || "").trim();
    this.settings.coreInstalledAt = Date.now();
  }
  _coreTicketLabel(ticket = {}) {
    const parts = [];
    if (ticket.version) parts.push(`版本 ${ticket.version}`);
    if (ticket.filename) parts.push(ticket.filename);
    if (ticket.sha256) parts.push(`SHA ${String(ticket.sha256).slice(0, 12)}…`);
    return parts.join(" / ") || "最新程序包";
  }
  // 已安装核心是否就是 ticket 指的这个版本（sha256 → version → filename 逐级判断）
  _isInstalledCoreCurrent(ticket = {}) {
    var _a, _b;
    if (!((_b = (_a = this.coreManager) == null ? void 0 : _a.isInstalled) == null ? void 0 : _b.call(_a))) return false;
    const installedSha = String(this.settings.coreInstalledSha256 || "").trim().toLowerCase();
    const ticketSha = String(ticket.sha256 || "").trim().toLowerCase();
    if (installedSha && ticketSha) return installedSha === ticketSha;
    const installedVersion = String(this.settings.coreInstalledVersion || "").trim();
    const ticketVersion = String(ticket.version || "").trim();
    if (installedVersion && ticketVersion) return installedVersion === ticketVersion;
    const installedFilename = String(this.settings.coreInstalledFilename || "").trim();
    const ticketFilename = String(ticket.filename || "").trim();
    if (installedFilename && ticketFilename) return installedFilename === ticketFilename;
    return false;
  }
  // ── AI 调用：credentials 从 PaperBell 授权读取，请求由 PaperSearch 自己发 ──
  async _requestPaperbellLLMCredentials() {
    const client = this._ensurePaperbellClient();
    if (!client.requestLLMCredentials) {
      throw new Error("当前 PaperBell 版本不支持提供 AI 密钥，请更新 PaperBell 插件");
    }
    const config = await client.requestLLMCredentials();
    if (!config) throw new Error("PaperBell AI 密钥授权被拒绝");
    if (!config.apiKey || !config.model) {
      throw new Error("请先在 PaperBell 中完成 AI 提供方、模型和密钥配置");
    }
    return config;
  }
  // 统一 AI 请求：openai / anthropic 双协议；params = { system?, messages, model?, maxTokens?, temperature?, responseFormat? }
  async _requestPaperbellCompletion(params) {
    var _a, _b, _c, _d, _e, _f;
    const cfg = await this._requestPaperbellLLMCredentials();
    const api = cfg.api || "openai";
    const key = cfg.apiKey;
    const model = params.model || cfg.model || "";
    const baseUrl = String(
      cfg.baseUrl || (api === "anthropic" ? "https://api.anthropic.com/v1" : "https://api.openai.com/v1")
    ).replace(/\/+$/, "");
    if (!Array.isArray(params.messages) || params.messages.length === 0) {
      throw new Error("messages 不能为空");
    }
    if (!key || !model) {
      throw new Error("请先在 PaperBell 中完成 AI 提供方、模型和密钥配置");
    }
    const isAnthropic = api === "anthropic";
    const body = isAnthropic ? {
      model,
      max_tokens: (_a = params.maxTokens) != null ? _a : 1024,
      ...params.system ? { system: params.system } : {},
      ...params.temperature !== void 0 ? { temperature: params.temperature } : {},
      messages: params.messages
    } : {
      model,
      ...params.maxTokens !== void 0 ? { max_tokens: params.maxTokens } : {},
      ...params.temperature !== void 0 ? { temperature: params.temperature } : {},
      ...params.responseFormat ? { response_format: params.responseFormat } : {},
      messages: params.system ? [{ role: "system", content: params.system }, ...params.messages] : params.messages
    };
    const res = await obsidian12.requestUrl({
      url: isAnthropic ? `${baseUrl}/messages` : `${baseUrl}/chat/completions`,
      method: "POST",
      contentType: "application/json",
      headers: isAnthropic ? { "x-api-key": key, "anthropic-version": "2023-06-01" } : { Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      throw: false
    });
    const json = res.json || (() => {
      try {
        return JSON.parse(res.text || "{}");
      } catch (_) {
        return {};
      }
    })();
    if (res.status < 200 || res.status >= 300) {
      throw new Error((json == null ? void 0 : json.message) || ((_b = json == null ? void 0 : json.error) == null ? void 0 : _b.message) || (json == null ? void 0 : json.error) || `AI 请求失败（HTTP ${res.status}）`);
    }
    const text = isAnthropic ? Array.isArray(json == null ? void 0 : json.content) ? json.content.filter((b) => (b == null ? void 0 : b.type) === "text").map((b) => b.text).join("") : "" : (_f = (_e = (_d = (_c = json == null ? void 0 : json.choices) == null ? void 0 : _c[0]) == null ? void 0 : _d.message) == null ? void 0 : _e.content) != null ? _f : "";
    const out = String(text || "").trim();
    if (!out) throw new Error("模型返回空");
    return out;
  }
  // 状态栏核心状态：始终可见，点击弹菜单（启动/重启/停止/日志/重装）——随手可触发，不必每次找设置
  _setupCoreStatusBar() {
    const el = this.addStatusBarItem();
    el.addClass("pb-core-status");
    el.onclick = (e) => this._coreMenu(e);
    this._coreStatusEl = el;
    const map = {
      idle: { dot: "○", txt: "未就绪", cls: "pb-cs-idle" },
      downloading: { dot: "⤓", txt: "下载中", cls: "pb-cs-busy" },
      starting: { dot: "◌", txt: "启动中", cls: "pb-cs-busy" },
      healthy: { dot: "●", txt: "就绪", cls: "pb-cs-ok" },
      crashed: { dot: "▲", txt: "重启中", cls: "pb-cs-busy" },
      failed: { dot: "✕", txt: "异常", cls: "pb-cs-bad" },
      stopped: { dot: "○", txt: "已停止", cls: "pb-cs-idle" }
    };
    const render = (s, detail) => {
      const m = map[s] || map.idle;
      el.className = `pb-core-status ${m.cls}`;
      el.setText(`${m.dot} PaperSearch ${m.txt}`);
      el.setAttribute("aria-label", (detail ? `${m.txt}：${detail}` : m.txt) + "（点击管理本地服务）");
    };
    this.coreManager.onStatus(render);
    render(this.coreManager.status, this.coreManager.statusDetail);
  }
  // 状态栏建库胶囊：后台有建库任务时显示「⟳ 建库 N/M」，离开面板也能看到；点击回到文献库
  _setupBuildStatusBar() {
    const el = this.addStatusBarItem();
    el.addClass("pb-build-status");
    el.style.display = "none";
    el.onclick = () => this._openLibFromStatus();
    this._buildStatusEl = el;
    this.buildManager.onChange(() => {
      const active = this.buildManager.active();
      if (!active.length) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      const done = active.reduce((a, j) => a + Number(j.completed || j.done + j.failed + j.skipped || 0), 0);
      const total = active.reduce((a, j) => a + (j.total || 0), 0);
      const current = active[0];
      el.setText(`⟳ 建库 ${done}/${total || "?"} · ${current.stageLabel || "处理中"}${active.length > 1 ? ` (${active.length})` : ""}`);
      el.setAttribute("aria-label", `${current.currentFile || "PaperSearch"}：${current.stageLabel || "正在后台建库"}（点击查看进度）`);
    });
  }
  // 从状态栏胶囊回到「文献库」模块
  async _openLibFromStatus() {
    await this.activateView();
    setTimeout(() => {
      var _a;
      const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
      const root = (_a = leaf == null ? void 0 : leaf.view) == null ? void 0 : _a.containerEl;
      const libBtn = root == null ? void 0 : root.querySelector('.pb-mod-btn[data-mod="lib"]');
      if (libBtn && !libBtn.classList.contains("active")) libBtn.click();
    }, 300);
  }
  // 状态栏点击菜单：按当前状态给出可操作项（启动 / 重启 / 停止 / 日志 / 重装）
  _coreMenu(evt) {
    var _a;
    const cm = this.coreManager;
    const menu = new obsidian12.Menu();
    const healthy = cm.status === "healthy";
    const canLaunch = (_a = cm._canLaunch) == null ? void 0 : _a.call(cm);
    if (healthy) {
      menu.addItem((it) => it.setTitle("重启本地服务").setIcon("refresh-cw").onClick(() => this._restartCore()));
      menu.addItem((it) => it.setTitle("停止本地服务").setIcon("square").onClick(async () => {
        try {
          await cm.kill();
          new obsidian12.Notice("本地服务已停止");
        } catch (e) {
          new obsidian12.Notice("停止失败：" + e.message);
        }
      }));
    } else if (canLaunch) {
      menu.addItem((it) => it.setTitle("启动本地服务").setIcon("play").onClick(() => this._restartCore()));
    }
    menu.addItem((it) => it.setTitle("查看本地检索日志").setIcon("file-text").onClick(() => this._openCoreLog()));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle(canLaunch ? "重新安装或配置…" : "安装本地服务…").setIcon("download").onClick(() => this._openCoreSetup()));
    menu.addItem((it) => it.setTitle("从本地安装包导入…").setIcon("upload").onClick(() => this._importCoreZip()));
    menu.showAtMouseEvent(evt);
  }
  // 启动 / 重启核心（命令 + 状态栏共用）：先杀干净再按既有 boot 逻辑拉起
  async _restartCore() {
    const cm = this.coreManager;
    const wasUp = cm.status === "healthy" || !!cm.proc;
    new obsidian12.Notice(wasUp ? "正在重启本地服务…" : "正在启动本地服务…");
    try {
      if (wasUp) await cm.kill();
    } catch (_) {
    }
    cm._restartAttempts = 0;
    await this._bootCoreThenViews();
  }
  // 打开核心日志（排查"起来了但模型没加载/降级"）；桌面端用系统默认程序打开
  _openCoreLog() {
    var _a, _b, _c, _d, _e;
    let p = "";
    try {
      p = ((_b = (_a = this.coreManager)._logPath) == null ? void 0 : _b.call(_a)) || "";
    } catch (_) {
    }
    if (!p) {
      new obsidian12.Notice("暂无本地检索日志（组件尚未启动）");
      return;
    }
    try {
      const shell = (_d = (_c = window.require) == null ? void 0 : _c.call(window, "electron")) == null ? void 0 : _d.shell;
      if (shell == null ? void 0 : shell.openPath) {
        shell.openPath(p);
        return;
      }
    } catch (_) {
    }
    (_e = navigator.clipboard) == null ? void 0 : _e.writeText(p).catch(() => {
    });
    new obsidian12.Notice("日志路径已复制：" + p);
  }
  // 从本地导入核心压缩包（手动 / 离线 / 内网 / CDN 还没配好）：选 zip → 停旧核心 → 解压安装 → 重新拉起。
  // 状态栏菜单、设置页、首启向导三处共用。onSuccess 传入则用它收尾，否则默认重启核心。
  async _importCoreZip(onSuccess) {
    if (this._importingCore) {
      new obsidian12.Notice("本地安装包正在导入，请稍候…");
      return;
    }
    const cm = this.coreManager;
    const f = await pbPickFile({ accept: ".zip" });
    if (!f) return;
    const zipPath = pbFilePath(f);
    if (!zipPath) {
      new obsidian12.Notice("未能获取文件路径（需桌面版 Obsidian）");
      return;
    }
    if (!/\.zip$/i.test(zipPath)) {
      new obsidian12.Notice("请选择 .zip 压缩包");
      return;
    }
    this._importingCore = true;
    const wasUp = cm.status === "healthy" || !!cm.proc;
    const notice = new obsidian12.Notice("正在准备导入本地服务…", 0);
    const say = (text) => {
      try {
        notice.setMessage ? notice.setMessage(text) : notice.noticeEl.setText(text);
      } catch (_) {
      }
    };
    const tick = pbMakeExtractTimer();
    try {
      if (wasUp) {
        try {
          await cm.kill();
        } catch (_) {
        }
      }
      const expectedSha = (this.settings.coreDownloadSha256 || "").trim();
      let beat = null;
      const stopBeat = () => {
        if (beat) {
          clearInterval(beat);
          beat = null;
        }
      };
      const push = (text) => {
        say(text);
        cm._setStatus("downloading", text);
      };
      try {
        await cm.installFromZip(zipPath, expectedSha, {
          deleteZipAfter: false,
          onPhase: (phase, p) => {
            if (phase === "verify") {
              stopBeat();
              push("正在校验安装包…");
              return;
            }
            push(tick(p).text);
            if (!beat) beat = setInterval(() => push(tick.stalled().text), 3e3);
          }
        });
      } finally {
        stopBeat();
      }
      notice.hide();
      new obsidian12.Notice("本地服务导入完成");
      if (onSuccess) {
        onSuccess();
      } else {
        cm._restartAttempts = 0;
        await this._bootCoreThenViews();
      }
    } catch (e) {
      notice.hide();
      new obsidian12.Notice("本地服务导入失败：" + e.message, 8e3);
    } finally {
      this._importingCore = false;
    }
  }
  async onunload() {
    var _a, _b, _c, _d, _e;
    if (this._citSaveScheduled || this._annoSaveScheduled || this._metaSaveScheduled) {
      try {
        await this.saveSettings();
      } catch (_) {
      }
    }
    this._unloading = true;
    (_b = (_a = this._paperbellClient) == null ? void 0 : _a.unregister) == null ? void 0 : _b.call(_a);
    this._paperbellClient = null;
    if (this._linkbackDebounce) {
      for (const t of this._linkbackDebounce.values()) clearTimeout(t);
      this._linkbackDebounce.clear();
    }
    if (this._sessionId) {
      const sid = encodeURIComponent(this._sessionId);
      (_c = this.api) == null ? void 0 : _c.postJson(`/ui-session/close?session_id=${sid}`, {}).catch(() => {
      });
    }
    this._stopAllWatchers();
    if (this._bbtWatcher) {
      try {
        this._bbtWatcher.close();
      } catch (_) {
      }
    }
    if (this._bbtTimer) {
      clearTimeout(this._bbtTimer);
      this._bbtTimer = null;
    }
    if (this._selTimer) {
      clearTimeout(this._selTimer);
      this._selTimer = null;
    }
    if (this._citSaveTimer) {
      clearTimeout(this._citSaveTimer);
      this._citSaveTimer = null;
    }
    if (this._annoSaveTimer) {
      clearTimeout(this._annoSaveTimer);
      this._annoSaveTimer = null;
    }
    if (this._metaSaveTimer) {
      clearTimeout(this._metaSaveTimer);
      this._metaSaveTimer = null;
    }
    await ((_d = this.coreManager) == null ? void 0 : _d.kill());
    (_e = this._hidePdfToolbar) == null ? void 0 : _e.call(this);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(COMPANION_VIEW_TYPE);
  }
  async loadSettings() {
    var _a;
    const raw = (_a = await this.loadData()) != null ? _a : {};
    const flat = raw.settings && typeof raw.settings === "object" ? raw.settings : raw;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, flat);
    const savedPreviewLines = flat.originalPreviewLines == null ? NaN : Number(flat.originalPreviewLines);
    const legacyPreviewLines = flat.abstractLines == null ? NaN : Number(flat.abstractLines);
    const preferredPreviewLines = Number.isFinite(savedPreviewLines) ? savedPreviewLines : Number.isFinite(legacyPreviewLines) && legacyPreviewLines !== 3 ? legacyPreviewLines : 5;
    this.settings.originalPreviewLines = Math.min(8, Math.max(1, Math.round(preferredPreviewLines)));
    const defaultRoleIdByColor = new Map(DEFAULT_SETTINGS.annotationRoles.map((r) => [r.color, r.id]));
    this.settings.annotationRoles = (Array.isArray(this.settings.annotationRoles) ? this.settings.annotationRoles : DEFAULT_SETTINGS.annotationRoles).map((role, index) => ({
      ...role,
      id: role.id || defaultRoleIdByColor.get(role.color) || `role-${index + 1}`
    }));
    this.settings.apiKey = "";
    this.settings.apiBaseUrl = "";
    this.settings.apiModel = "";
    if (!Array.isArray(flat.annotationRoles)) {
      this.settings.annotationRoles = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.annotationRoles));
    }
    if (!this.settings.metadataResolver || typeof this.settings.metadataResolver !== "object") {
      this.settings.metadataResolver = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.metadataResolver));
    } else {
      const dmr = DEFAULT_SETTINGS.metadataResolver;
      const mr = this.settings.metadataResolver;
      if (!mr.resolvers || typeof mr.resolvers !== "object") mr.resolvers = { ...dmr.resolvers };
      if (!mr.s2 || typeof mr.s2 !== "object") mr.s2 = { ...dmr.s2 };
      if (!mr.reranking || typeof mr.reranking !== "object") mr.reranking = { ...dmr.reranking };
    }
    this.analysisCache = raw.analysisCache && typeof raw.analysisCache === "object" ? raw.analysisCache : { version: 1, entries: {} };
    this._sweepAnalysisCache();
    this.docMetaCache = raw.docMetaCache && typeof raw.docMetaCache === "object" ? raw.docMetaCache : { version: 2, entries: {}, by_doi: {}, by_citekey: {} };
    if (!this.docMetaCache.entries || typeof this.docMetaCache.entries !== "object") this.docMetaCache.entries = {};
    if (!this.docMetaCache.by_doi || typeof this.docMetaCache.by_doi !== "object") this.docMetaCache.by_doi = {};
    if (!this.docMetaCache.by_citekey || typeof this.docMetaCache.by_citekey !== "object") this.docMetaCache.by_citekey = {};
    this._sweepDocMetaCache();
    this.paperIndex = raw.paperIndex && typeof raw.paperIndex === "object" ? raw.paperIndex : { version: 1, items: {}, by_alias: {} };
    if (!this.paperIndex.items || typeof this.paperIndex.items !== "object") this.paperIndex.items = {};
    if (!this.paperIndex.by_alias || typeof this.paperIndex.by_alias !== "object") this.paperIndex.by_alias = {};
    this.citationIndex = raw.citationIndex && typeof raw.citationIndex === "object" ? raw.citationIndex : { version: 1, items: {} };
    this.claimIndex = raw.claimIndex && typeof raw.claimIndex === "object" ? raw.claimIndex : { version: 1, items: {} };
    if (!this.claimIndex.items || typeof this.claimIndex.items !== "object") {
      this.claimIndex.items = {};
    }
    if (this._claimStaleTimers) {
      for (const t of this._claimStaleTimers.values()) clearTimeout(t);
      this._claimStaleTimers.clear();
    }
    this.annotationIndex = raw.annotationIndex && typeof raw.annotationIndex === "object" ? raw.annotationIndex : { version: 1, items: {} };
    this.collectedRefs = raw.collectedRefs && typeof raw.collectedRefs === "object" ? raw.collectedRefs : { version: 1, items: {} };
  }
  async saveSettings() {
    if (this._unloading) return;
    await this.saveData({
      settings: this.settings,
      analysisCache: this.analysisCache,
      docMetaCache: this.docMetaCache,
      paperIndex: this.paperIndex,
      citationIndex: this.citationIndex,
      claimIndex: this.claimIndex,
      annotationIndex: this.annotationIndex,
      collectedRefs: this.collectedRefs
    });
  }
  // ── PaperRepository：统一 Paper 身份与文献笔记入口 ─────────────
  _normalizePaperDoi(value) {
    return String(value || "").trim().toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "").replace(/^doi:\s*/, "");
  }
  _normalizePaperStem(value) {
    return String(value || "").replace(/\.pdf$/i, "").trim().toLowerCase().replace(/[\s_\-–—]+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim();
  }
  _paperAliases(input = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    const row = input.row || {};
    const fm = input.fm || {};
    const meta = input.meta || row._meta || ((_a = this._readDocMeta) == null ? void 0 : _a.call(this, row._docId)) || {};
    const library = String(input.library || row._library || fm.library || ((_b = input.item) == null ? void 0 : _b.lib) || "").trim();
    const documentId = String(input.documentId || row._docId || fm.document_id || ((_c = input.item) == null ? void 0 : _c.docId) || "").trim();
    const sourceFile = String(input.sourceFile || row._sourceFile || fm.source_file || ((_d = input.item) == null ? void 0 : _d.src) || ((_e = input.item) == null ? void 0 : _e.nativePdfPath) || input.stem || fm.paper_title || "").trim();
    const doi = this._normalizePaperDoi(
      input.doi || fm.csl_DOI || fm.doi || ((_f = meta.csl) == null ? void 0 : _f.DOI) || meta.doi || row.doi
    );
    const zoteroKey = String(input.zoteroKey || fm.zotero_key || ((_g = meta.bbt) == null ? void 0 : _g.zotero_key) || row.zotero_key || "").trim();
    const fileHash = String(input.fileHash || fm.file_sha256 || fm.sha256 || meta.file_sha256 || row.file_sha256 || "").trim().toLowerCase();
    const aliases = [];
    const storedAliases = Array.isArray(fm.paper_aliases) ? fm.paper_aliases : [];
    for (const alias of storedAliases) {
      const value = String(alias || "").trim().toLowerCase();
      if (/^(doi|zotero|doc|sha256|file):/.test(value)) aliases.push(value);
    }
    if (doi) aliases.push(`doi:${doi}`);
    if (zoteroKey) aliases.push(`zotero:${library || "unknown"}:${zoteroKey.toLowerCase()}`);
    if (documentId) aliases.push(`doc:${library || "unknown"}:${documentId}`);
    if (fileHash) aliases.push(`sha256:${fileHash}`);
    const sourceName = sourceFile.replace(/[?#].*$/, "").split(/[\\/]/).pop() || sourceFile;
    const stem = this._normalizePaperStem(sourceName);
    if (stem) aliases.push(`file:${library || "unknown"}:${stem}`);
    return [...new Set(aliases)];
  }
  _resolvePaperIdentity(input = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const fm = input.fm || {};
    const aliases = this._paperAliases(input);
    const explicitId = String(input.paperId || ((_a = input.item) == null ? void 0 : _a.paperId) || fm.paper_id || "").trim();
    const strongAliases = aliases.filter((a) => !a.startsWith("file:"));
    const mapped = (strongAliases.length ? strongAliases : aliases).map((a) => this.paperIndex.by_alias[a]).filter(Boolean);
    let ambiguousWeakIds = [];
    if (!mapped.length) {
      const weakAliases = aliases.filter((a) => a.startsWith("file:"));
      const weakMatches = new Set(weakAliases.map((a) => this.paperIndex.by_alias[a]).filter(Boolean));
      for (const weak of weakAliases.filter((a) => a.startsWith("file:unknown:"))) {
        const stem = weak.slice("file:unknown:".length);
        for (const [alias, paperId] of Object.entries(this.paperIndex.by_alias)) {
          if (alias.startsWith("file:") && alias.endsWith(`:${stem}`)) weakMatches.add(paperId);
        }
      }
      if (weakMatches.size > 1) ambiguousWeakIds = [...weakMatches];
      if (weakMatches.size === 1) {
        const candidateId = [...weakMatches][0];
        const candidateAliases = ((_b = this.paperIndex.items[candidateId]) == null ? void 0 : _b.aliases) || [];
        const strongType = (alias) => {
          const p = alias.split(":");
          return ["doc", "zotero"].includes(p[0]) ? `${p[0]}:${p[1] || "unknown"}` : p[0];
        };
        const conflict = strongAliases.some((alias) => {
          const type = strongType(alias);
          const sameType = candidateAliases.filter((existing) => strongType(existing) === type);
          return sameType.length > 0 && !sameType.includes(alias);
        });
        let upgradeSafe = !conflict;
        if (upgradeSafe && strongAliases.length) {
          const candidate = this.paperIndex.items[candidateId] || {};
          const candidateFile = candidate.note_path && this.app.vault.getAbstractFileByPath(candidate.note_path);
          const candidateFm = candidateFile ? ((_c = this.app.metadataCache.getFileCache(candidateFile)) == null ? void 0 : _c.frontmatter) || {} : {};
          const incomingTitle = ((_e = (_d = input.meta) == null ? void 0 : _d.csl) == null ? void 0 : _e.title) || ((_f = input.row) == null ? void 0 : _f.paperTitle) || ((_g = input.row) == null ? void 0 : _g.title) || ((_h = input.fm) == null ? void 0 : _h.csl_title) || ((_i = input.fm) == null ? void 0 : _i.paper_title) || "";
          const candidateTitle = candidateFm.csl_title || candidateFm.paper_title || "";
          const normTitle = (value) => this._normalizePaperStem(value);
          const incomingYear = ((_n = (_m = (_l = (_k = (_j = input.meta) == null ? void 0 : _j.csl) == null ? void 0 : _k.issued) == null ? void 0 : _l["date-parts"]) == null ? void 0 : _m[0]) == null ? void 0 : _n[0]) || ((_o = input.fm) == null ? void 0 : _o.csl_issued_year) || ((_p = input.fm) == null ? void 0 : _p.year) || "";
          const candidateYear = candidateFm.csl_issued_year || candidateFm.year || "";
          for (const alias of strongAliases) {
            const type = strongType(alias);
            const sameType = candidateAliases.filter((existing) => strongType(existing) === type);
            if (sameType.length) continue;
            if (type === "doi") {
              const incomingNorm = normTitle(incomingTitle);
              const candidateNorm = normTitle(candidateTitle);
              const titleMatches = !!incomingNorm && !!candidateNorm && (incomingNorm === candidateNorm || Math.min(incomingNorm.length, candidateNorm.length) >= 20 && (incomingNorm.includes(candidateNorm) || candidateNorm.includes(incomingNorm)));
              const yearMatches = !incomingYear || !candidateYear || String(incomingYear) === String(candidateYear);
              if (!titleMatches || !yearMatches) upgradeSafe = false;
            } else {
              upgradeSafe = false;
            }
          }
        }
        if (upgradeSafe) mapped.push(candidateId);
      }
    }
    if (!mapped.length && ambiguousWeakIds.length) {
      return {
        paper_id: "",
        aliases,
        needs_review: true,
        conflict: true,
        conflict_reason: "ambiguous_filename",
        conflicting_paper_ids: ambiguousWeakIds
      };
    }
    const mappedIds = [...new Set(mapped)];
    if (mappedIds.length > 1 && !explicitId) {
      return {
        paper_id: "",
        aliases,
        needs_review: true,
        conflict: true,
        conflicting_paper_ids: mappedIds
      };
    }
    let id = explicitId || mappedIds[0] || "";
    if (!id) {
      const mayCreate = input.allowCreate !== false && (input.allowCreate !== "strong" || strongAliases.length > 0);
      if (!mayCreate) return { paper_id: "", aliases, needs_review: true, unresolved: true };
      const seed = strongAliases[0] || aliases[0] || `unresolved:${this._normalizePaperStem(input.stem || input.sourceFile || ((_q = input.row) == null ? void 0 : _q._sourceFile) || "unknown") || "unknown"}`;
      id = `paper-${this._hashText(seed).slice(0, 16)}`;
    }
    const item = this.paperIndex.items[id] || {
      paper_id: id,
      aliases: [],
      note_path: "",
      attachments: [],
      created_at: Date.now()
    };
    const acceptedAliases = aliases.filter((alias) => {
      const mappedId = this.paperIndex.by_alias[alias];
      return !mappedId || mappedId === id;
    });
    item.aliases = [.../* @__PURE__ */ new Set([...item.aliases || [], ...acceptedAliases])];
    item.updated_at = Date.now();
    if (strongAliases.length && mappedIds.length && !strongAliases.some((a) => this.paperIndex.by_alias[a])) {
      item.identity_match_basis = "unique_filename_upgrade";
      item.needs_review = true;
    }
    if (mappedIds.some((other) => other !== id)) {
      item.needs_review = true;
      item.conflicting_paper_ids = [.../* @__PURE__ */ new Set([...item.conflicting_paper_ids || [], ...mappedIds.filter((x) => x !== id)])];
    }
    this.paperIndex.items[id] = item;
    for (const alias of item.aliases) {
      if (!this.paperIndex.by_alias[alias] || this.paperIndex.by_alias[alias] === id) {
        this.paperIndex.by_alias[alias] = id;
      }
    }
    return item;
  }
  _paperNoteRoots() {
    return [...new Set([
      (this.settings.paperLibraryDir || "PaperSearch/文献").replace(/\/+$/, ""),
      (this.settings.litNoteDir || "PaperSearch笔记").replace(/\/+$/, "")
    ].filter(Boolean))];
  }
  _isPaperNoteFile(file) {
    var _a, _b;
    if (!((_a = file == null ? void 0 : file.path) == null ? void 0 : _a.endsWith(".md"))) return false;
    const fm = (_b = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _b.frontmatter;
    if (this._paperNoteRoots().some((root) => file.path.startsWith(root + "/"))) return true;
    return !!((fm == null ? void 0 : fm.paper_id) || (fm == null ? void 0 : fm.document_id) || (fm == null ? void 0 : fm.csl_DOI) || (fm == null ? void 0 : fm.doi) || (fm == null ? void 0 : fm.zotero_key) || (fm == null ? void 0 : fm.file_sha256) || (fm == null ? void 0 : fm.sha256));
  }
  _listPaperNotes({ dedupe = true } = {}) {
    var _a;
    const files = this.app.vault.getMarkdownFiles().filter((file) => this._isPaperNoteFile(file));
    if (!dedupe) return files;
    const groups = /* @__PURE__ */ new Map();
    const canonicalRoot = (this.settings.paperLibraryDir || "PaperSearch/文献").replace(/\/+$/, "");
    for (const file of files) {
      const fm = ((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) || {};
      if (dedupe && (fm.paper_alias_of || fm.papersearch_migration_status === "merged-read-only")) continue;
      const identity = this._resolvePaperIdentity({ fm, sourceFile: fm.source_file || file.basename, stem: file.basename });
      const groupKey = identity.paper_id || `unresolved:${file.path}`;
      const previous = groups.get(groupKey);
      if (!previous || !previous.path.startsWith(canonicalRoot + "/") && file.path.startsWith(canonicalRoot + "/")) {
        groups.set(groupKey, file);
      }
      if (previous && previous.path !== file.path) {
        identity.duplicate_note_paths = [.../* @__PURE__ */ new Set([...identity.duplicate_note_paths || [], previous.path, file.path])];
        identity.needs_review = true;
      }
    }
    return [...groups.values()];
  }
  _findPaperNote(identity, fallbackStem = "") {
    var _a, _b, _c, _d;
    const id = (identity == null ? void 0 : identity.paper_id) || (identity == null ? void 0 : identity.id) || "";
    const indexed = id && ((_a = this.paperIndex.items[id]) == null ? void 0 : _a.note_path);
    if (indexed) {
      const file = this.app.vault.getAbstractFileByPath(indexed);
      if ((_b = file == null ? void 0 : file.path) == null ? void 0 : _b.endsWith(".md")) return file;
    }
    const wantedAliases = new Set((identity == null ? void 0 : identity.aliases) || []);
    const candidates = [];
    for (const file of this._listPaperNotes({ dedupe: false })) {
      const fm = ((_c = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _c.frontmatter) || {};
      const found = this._resolvePaperIdentity({ fm, sourceFile: fm.source_file || file.basename, stem: file.basename });
      const overlap = found.paper_id === id || ((_d = found.aliases) == null ? void 0 : _d.some((a) => wantedAliases.has(a)));
      if (overlap) candidates.push(file);
    }
    const canonicalRoot = (this.settings.paperLibraryDir || "PaperSearch/文献").replace(/\/+$/, "");
    candidates.sort((a, b) => Number(b.path.startsWith(canonicalRoot + "/")) - Number(a.path.startsWith(canonicalRoot + "/")));
    return candidates[0] || null;
  }
  _registerPaperNote(identity, file) {
    if (!identity || !file) return;
    const id = identity.paper_id || identity.id || "";
    if (!id) return;
    const item = this.paperIndex.items[id] || identity;
    const canonicalRoot = (this.settings.paperLibraryDir || "PaperSearch/文献").replace(/\/+$/, "") + "/";
    const previous = item.note_path || "";
    const prefer = !previous || !previous.startsWith(canonicalRoot) && file.path.startsWith(canonicalRoot);
    if (prefer) item.note_path = file.path;
    item.note_paths = [.../* @__PURE__ */ new Set([...item.note_paths || [], file.path])];
    if (item.note_paths.length > 1) {
      item.duplicate_note_paths = item.note_paths;
      item.needs_review = true;
    }
    item.updated_at = Date.now();
    this.paperIndex.items[item.paper_id] = item;
  }
  _inferLegacyOwnDoi(raw, file, fm = {}) {
    const text = String(raw || "");
    const title = String(fm.csl_title || fm.paper_title || (file == null ? void 0 : file.basename) || "").replace(/^.+?\s+-\s+\d{4}\s+-\s+/, "");
    const normalizedTitle = this._normalizePaperStem(title);
    if (normalizedTitle.length < 20) return "";
    const candidates = /* @__PURE__ */ new Set();
    const doiRe = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/ig;
    for (const line of text.split(/\r?\n/)) {
      const matches = line.match(doiRe) || [];
      if (!matches.length) continue;
      const normalizedLine = this._normalizePaperStem(line);
      const bibtexOwnField = /\bdoi\s*=\s*[{"]/i.test(line);
      const titleMatches = normalizedLine.includes(normalizedTitle) || normalizedTitle.length >= 36 && normalizedLine.includes(normalizedTitle.slice(0, 36));
      if (!bibtexOwnField && !titleMatches) continue;
      for (const match of matches) {
        const doi = this._normalizePaperDoi(match.replace(/[}\]),.;:'"]+$/g, ""));
        if (doi) candidates.add(doi);
      }
    }
    return candidates.size === 1 ? [...candidates][0] : "";
  }
  async _rebuildPaperIndex({ writeFrontmatter = false, inferLegacyDoi = false } = {}) {
    var _a, _b;
    const previousIndex = this.paperIndex || { items: {}, by_alias: {} };
    const files = this._listPaperNotes({ dedupe: false }).sort((a, b) => {
      const strength = (file) => {
        var _a2;
        const fm = ((_a2 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.frontmatter) || {};
        return Number(!!fm.paper_id) * 8 + Number(!!(fm.csl_DOI || fm.doi)) * 4 + Number(!!(fm.zotero_key || fm.document_id || fm.file_sha256 || fm.sha256)) * 2 + Number(file.path.startsWith((this.settings.paperLibraryDir || "PaperSearch/文献") + "/"));
      };
      return strength(b) - strength(a) || a.path.localeCompare(b.path);
    });
    this.paperIndex = { version: 1, migration_version: 1, items: {}, by_alias: {} };
    let updated = 0;
    let unresolved = 0;
    for (const file of files) {
      const fm = ((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) || {};
      let inferredDoi = "";
      if (inferLegacyDoi && !fm.csl_DOI && !fm.doi) {
        try {
          const raw = await this.app.vault.cachedRead(file);
          inferredDoi = this._inferLegacyOwnDoi(raw, file, fm);
        } catch (_) {
        }
      }
      let inferredHash = String(fm.file_sha256 || fm.sha256 || "").trim().toLowerCase();
      const pdfRef = fm.pdf || fm.source_pdf || "";
      let pdfAbs = "";
      if (!inferredHash && pdfRef) {
        try {
          const localFile = this.app.vault.getAbstractFileByPath(String(pdfRef).replace(/^\[\[|\]\]$/g, ""));
          pdfAbs = (localFile == null ? void 0 : localFile.path) ? nodePath5.join(this.app.vault.adapter.getBasePath(), localFile.path) : nodeFs3.existsSync(pdfRef) ? pdfRef : "";
          if (pdfAbs) inferredHash = await this._sha256File(pdfAbs);
        } catch (_) {
        }
      }
      const identityFm = {
        ...fm,
        ...inferredDoi ? { csl_DOI: inferredDoi } : {},
        ...inferredHash ? { file_sha256: inferredHash } : {}
      };
      const identity = this._resolvePaperIdentity({ fm: identityFm, sourceFile: fm.source_file || file.basename, stem: file.basename });
      if (!identity.paper_id) {
        unresolved++;
        continue;
      }
      this._registerPaperNote(identity, file);
      const inferredSourceFile = fm.source_file || `${file.basename}.pdf`;
      const attachmentLocator = [fm.library || "", fm.document_id || "", inferredSourceFile].map((value) => String(value).trim()).join("|");
      identity.attachments = this._mergePaperAttachments(identity.paper_id, [
        ...identity.attachments || [],
        {
          attachment_id: `attachment-${this._hashText(inferredHash || `${identity.paper_id}|${attachmentLocator || pdfRef}`).slice(0, 16)}`,
          sha256: inferredHash,
          library: fm.library || "",
          document_id: fm.document_id || "",
          source_file: inferredSourceFile,
          locator_kind: inferredHash || pdfRef || fm.document_id || fm.source_file ? "source" : "note-stem",
          pdf_paths: [pdfRef, pdfAbs].filter(Boolean)
        }
      ]);
      const hashNeedsWrite = !!inferredHash && !fm.file_sha256 && !fm.sha256;
      if (writeFrontmatter && (fm.paper_id !== identity.paper_id || inferredDoi || hashNeedsWrite)) {
        await this.app.fileManager.processFrontMatter(file, (data) => {
          data.type = data.type || "literature-note";
          data.paper_id = identity.paper_id;
          data.paper_aliases = identity.aliases;
          if (inferredDoi && !data.csl_DOI && !data.doi) data.csl_DOI = inferredDoi;
          if (inferredDoi) data.papersearch_doi_inference_source = "legacy-own-citation";
          if (inferredHash && !data.file_sha256 && !data.sha256) data.file_sha256 = inferredHash;
        });
        updated++;
      }
    }
    for (const [paperId, item] of Object.entries(this.paperIndex.items)) {
      const previous = (_b = previousIndex.items) == null ? void 0 : _b[paperId];
      if (!previous) continue;
      for (const alias of previous.aliases || []) {
        const owner = this.paperIndex.by_alias[alias];
        if (!owner || owner === paperId) {
          item.aliases = [.../* @__PURE__ */ new Set([...item.aliases || [], alias])];
          this.paperIndex.by_alias[alias] = paperId;
        }
      }
      item.attachments = this._mergePaperAttachments(paperId, [
        ...previous.attachments || [],
        ...item.attachments || []
      ]);
    }
    const duplicates = Object.values(this.paperIndex.items).filter((item) => {
      var _a2;
      const activePaths = (item.note_paths || []).filter((path) => {
        var _a3;
        const file = this.app.vault.getAbstractFileByPath(path);
        const fm = file ? (_a3 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a3.frontmatter : null;
        return (fm == null ? void 0 : fm.papersearch_migration_status) !== "merged-read-only";
      });
      item.alias_note_paths = (item.note_paths || []).filter((path) => !activePaths.includes(path));
      if (activePaths.length <= 1) {
        delete item.duplicate_note_paths;
        if (!((_a2 = item.conflicting_paper_ids) == null ? void 0 : _a2.length) && item.identity_match_basis !== "unique_filename_upgrade") {
          delete item.needs_review;
        }
      } else {
        item.duplicate_note_paths = activePaths;
        item.needs_review = true;
      }
      return activePaths.length > 1;
    }).length;
    await this.saveSettings();
    return { files: files.length, papers: Object.keys(this.paperIndex.items).length, updated, duplicates, unresolved };
  }
  async _mergeDuplicatePaperNotes() {
    var _a, _b, _c, _d;
    let groups = 0;
    let sources = 0;
    const arrayFields = [
      "paper_aliases",
      "tags",
      "authors",
      "concepts",
      "related",
      "references_in_vault",
      "analyzed_for_scenes",
      "cited_in"
    ];
    const scalarFields = [
      "paper_title",
      "source_file",
      "library",
      "document_id",
      "file_sha256",
      "csl_type",
      "csl_title",
      "csl_author",
      "csl_issued_year",
      "csl_container_title",
      "csl_volume",
      "csl_issue",
      "csl_page",
      "csl_DOI",
      "csl_URL",
      "citekey",
      "zotero_key",
      "tldr",
      "ss_paper_id",
      "meta_source",
      "pdf",
      "source_pdf"
    ];
    const rank = { "": 0, collected: 1, reading: 2, done: 3 };
    for (const item of Object.values(this.paperIndex.items || {})) {
      const paths = [...new Set(item.note_paths || [])];
      if (paths.length < 2 || !item.note_path) continue;
      const target = this.app.vault.getAbstractFileByPath(item.note_path);
      if (!((_a = target == null ? void 0 : target.path) == null ? void 0 : _a.endsWith(".md"))) continue;
      let groupChanged = false;
      for (const sourcePath of paths) {
        if (sourcePath === target.path) continue;
        const source = this.app.vault.getAbstractFileByPath(sourcePath);
        if (!((_b = source == null ? void 0 : source.path) == null ? void 0 : _b.endsWith(".md"))) continue;
        const targetRaw = await this.app.vault.read(target);
        const sourceRaw = await this.app.vault.read(source);
        const sourceFm = ((_c = this.app.metadataCache.getFileCache(source)) == null ? void 0 : _c.frontmatter) || {};
        const mergeMarkerId = sourceFm.papersearch_merge_marker || this._hashText(`${source.path}|${this._hashText(sourceRaw)}`).slice(0, 20);
        const marker = `<!-- papersearch-merged:${mergeMarkerId} -->`;
        if (targetRaw.includes(marker) && sourceFm.papersearch_migration_status === "merged-read-only") continue;
        if (!targetRaw.includes(marker)) {
          const sourceBody = sourceRaw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
          if (sourceBody) {
            const preserved = sourceBody.split(/\r?\n/).map((line) => /^#{1,6}\s+/.test(line) ? line.replace(/^#{1,6}\s+/, "#### ") : line).join("\n");
            const appendix = [
              "",
              marker,
              `## 历史证据（合并自 ${source.basename}）`,
              "",
              preserved,
              ""
            ].join("\n");
            await this.app.vault.modify(target, targetRaw.trimEnd() + "\n" + appendix);
          }
        }
        await this.app.fileManager.processFrontMatter(target, (data) => {
          for (const field of arrayFields) {
            const left = Array.isArray(data[field]) ? data[field] : [];
            const right = Array.isArray(sourceFm[field]) ? sourceFm[field] : [];
            if (left.length || right.length) data[field] = [.../* @__PURE__ */ new Set([...left, ...right])];
          }
          for (const field of scalarFields) {
            if ((data[field] == null || data[field] === "") && sourceFm[field] != null && sourceFm[field] !== "") {
              data[field] = sourceFm[field];
            }
          }
          if ((rank[sourceFm.read_status] || 0) > (rank[data.read_status] || 0)) {
            data.read_status = sourceFm.read_status;
          }
          data.paper_id = item.paper_id;
          data.papersearch_merged_sources = [.../* @__PURE__ */ new Set([
            ...Array.isArray(data.papersearch_merged_sources) ? data.papersearch_merged_sources : [],
            source.path
          ])];
        });
        const backupRoot = ".papersearch-backups/paper-identity-v1";
        try {
          if (!await this.app.vault.adapter.exists(".papersearch-backups")) await this.app.vault.adapter.mkdir(".papersearch-backups");
          if (!await this.app.vault.adapter.exists(backupRoot)) await this.app.vault.adapter.mkdir(backupRoot);
          const backupPath = `${backupRoot}/${mergeMarkerId}.md.bak`;
          if (!await this.app.vault.adapter.exists(backupPath)) await this.app.vault.adapter.write(backupPath, sourceRaw);
        } catch (e) {
          throw new Error(`备份旧文献笔记失败：${source.path}；${e.message}`);
        }
        const targetLink = target.path.replace(/\.md$/i, "");
        const redirect = [
          "---",
          "type: paper-alias",
          `paper_id: "${item.paper_id}"`,
          `paper_alias_of: "${target.path.replace(/"/g, '\\"')}"`,
          "papersearch_migration_status: merged-read-only",
          `papersearch_merge_marker: "${mergeMarkerId}"`,
          "---",
          "",
          "# 文献笔记已合并",
          "",
          `此历史笔记的内容已保全并合并到 [[${targetLink}]]。`,
          ""
        ].join("\n");
        await this.app.vault.modify(source, redirect);
        sources++;
        groupChanged = true;
      }
      if (groupChanged) {
        groups++;
        item.alias_note_paths = paths.filter((path) => path !== target.path);
        delete item.duplicate_note_paths;
        if (!((_d = item.conflicting_paper_ids) == null ? void 0 : _d.length) && item.identity_match_basis !== "unique_filename_upgrade") {
          delete item.needs_review;
        }
      }
    }
    if (groups) await this.saveSettings();
    return { groups, sources };
  }
  _attachmentNames(attachment = {}) {
    return [...new Set([
      attachment.source_file,
      ...attachment.pdf_paths || []
    ].map((value) => {
      const name = String(value || "").split(/[\\/]/).pop() || "";
      return this._normalizePaperStem(name);
    }).filter(Boolean))];
  }
  _attachmentLocatorStatus(attachment = {}) {
    var _a, _b, _c;
    for (const rawPath of attachment.pdf_paths || []) {
      const value = String(rawPath || "").replace(/^\[\[|\]\]$/g, "");
      if (!value) continue;
      const vaultFile = (_c = (_b = (_a = this.app) == null ? void 0 : _a.vault) == null ? void 0 : _b.getAbstractFileByPath) == null ? void 0 : _c.call(_b, value.replace(/\\/g, "/"));
      if (vaultFile == null ? void 0 : vaultFile.path) return "local";
      try {
        if (nodeFs3.existsSync(value)) return "local";
      } catch (_) {
      }
    }
    if (attachment.library && (attachment.document_id || attachment.source_file)) return "remote";
    return "unverified";
  }
  _mergePaperAttachments(paperId, attachments = []) {
    const merged = [];
    for (const raw of attachments.filter(Boolean)) {
      const incoming = {
        ...raw,
        pdf_paths: [...new Set((raw.pdf_paths || []).filter(Boolean))]
      };
      const incomingNames = this._attachmentNames(incoming);
      const match = merged.find((existing) => {
        if (incoming.sha256 && existing.sha256) return incoming.sha256 === existing.sha256;
        const compatibleLibrary = !incoming.library || !existing.library || incoming.library === existing.library;
        if (!compatibleLibrary) return false;
        if (incoming.document_id && existing.document_id) {
          if (incoming.document_id !== existing.document_id) return false;
          return true;
        }
        const existingNames = this._attachmentNames(existing);
        return incomingNames.some((name) => existingNames.includes(name));
      });
      if (!match) {
        merged.push(incoming);
        continue;
      }
      match.sha256 = match.sha256 || incoming.sha256 || "";
      match.library = match.library || incoming.library || "";
      match.document_id = match.document_id || incoming.document_id || "";
      match.source_file = match.source_file || incoming.source_file || "";
      match.locator_kind = match.locator_kind === "source" || incoming.locator_kind === "source" ? "source" : match.locator_kind || incoming.locator_kind || "note-stem";
      match.pdf_paths = [...new Set([...match.pdf_paths || [], ...incoming.pdf_paths || []].filter(Boolean))];
    }
    for (const attachment of merged) {
      const stableName = this._attachmentNames(attachment).sort()[0] || "";
      const seed = attachment.sha256 ? `sha256:${attachment.sha256}` : attachment.document_id ? `doc:${paperId}|${attachment.library || "unknown"}|${attachment.document_id}` : stableName ? `file:${paperId}|${attachment.library || "unknown"}|${stableName}` : `legacy:${paperId}|${attachment.attachment_id || "unknown"}`;
      attachment.attachment_id = `attachment-${this._hashText(seed).slice(0, 16)}`;
      attachment.locator_status = this._attachmentLocatorStatus(attachment);
    }
    return merged;
  }
  _upsertPaperAttachment(paperId, attachment = {}) {
    var _a, _b;
    const paper = (_a = this.paperIndex.items) == null ? void 0 : _a[paperId];
    if (!paper) return null;
    const evidence = {
      source_library: attachment.library || "",
      source_document_id: attachment.document_id || "",
      source_file: attachment.source_file || ((_b = attachment.pdf_paths) == null ? void 0 : _b[0]) || ""
    };
    if (!attachment.sha256 && this._attachmentIsAmbiguous(paperId, evidence)) return null;
    paper.attachments = this._mergePaperAttachments(paperId, [
      ...paper.attachments || [],
      attachment
    ]);
    this._rebindPaperAttachmentReferences(paperId);
    return this._attachmentForEvidence(paperId, evidence);
  }
  _rebindPaperAttachmentReferences(paperId) {
    var _a, _b;
    const apply = (evidence) => {
      if (evidence.paper_id !== paperId) return;
      const attachment = this._attachmentForEvidence(paperId, evidence);
      if (attachment) {
        evidence.attachment_id = attachment.attachment_id;
        if (attachment.locator_status === "unverified") evidence.attachment_review = "locator-unverified";
        else delete evidence.attachment_review;
      } else {
        evidence.attachment_review = this._attachmentIsAmbiguous(paperId, evidence) ? "ambiguous" : "unresolved";
      }
    };
    Object.values(((_a = this.citationIndex) == null ? void 0 : _a.items) || {}).forEach(apply);
    Object.values(((_b = this.annotationIndex) == null ? void 0 : _b.items) || {}).forEach(apply);
  }
  _attachmentIsAmbiguous(paperId, evidence = {}) {
    var _a, _b;
    const list = ((_b = (_a = this.paperIndex.items) == null ? void 0 : _a[paperId]) == null ? void 0 : _b.attachments) || [];
    if (list.length <= 1) return false;
    const library = evidence.source_library || evidence.library || evidence.lib || "";
    const documentId = evidence.source_document_id || evidence.document_id || evidence.docId || "";
    const sourceFile = this._normalizePaperStem(
      String(evidence.source_file || evidence.src || evidence.native_pdf_path || evidence.source_doc || evidence.doc || "").split(/[\\/]/).pop() || ""
    );
    const exactDoc = list.filter((a) => documentId && a.document_id === documentId && (!library || !a.library || a.library === library));
    if (exactDoc.length > 1) return true;
    if (exactDoc.length === 1) return false;
    const exactFile = list.filter((a) => sourceFile && this._attachmentNames(a).includes(sourceFile));
    if (exactFile.length > 1) return true;
    if (exactFile.length === 1) return false;
    return !documentId && !sourceFile;
  }
  _attachmentForEvidence(paperId, evidence = {}) {
    var _a, _b;
    const list = ((_b = (_a = this.paperIndex.items) == null ? void 0 : _a[paperId]) == null ? void 0 : _b.attachments) || [];
    if (!list.length) return null;
    const library = evidence.source_library || evidence.library || evidence.lib || "";
    const documentId = evidence.source_document_id || evidence.document_id || evidence.docId || "";
    const sourceFile = this._normalizePaperStem(
      String(evidence.source_file || evidence.src || evidence.native_pdf_path || evidence.source_doc || evidence.doc || "").split(/[\\/]/).pop() || ""
    );
    const exactDoc = list.filter((a) => documentId && a.document_id === documentId && (!library || !a.library || a.library === library));
    if (exactDoc.length === 1) return exactDoc[0];
    const exactFile = list.filter((a) => {
      return sourceFile && this._attachmentNames(a).includes(sourceFile);
    });
    if (exactFile.length === 1) return exactFile[0];
    return list.length === 1 ? list[0] : null;
  }
  async _backfillEvidenceIdentity() {
    var _a, _b, _c, _d, _e, _f;
    let changed = false;
    for (const cit of Object.values(((_a = this.citationIndex) == null ? void 0 : _a.items) || {})) {
      const identity = this._resolvePaperIdentity({
        paperId: cit.paper_id || "",
        library: cit.source_library || "",
        documentId: cit.source_document_id || "",
        sourceFile: cit.source_file || cit.source_doc || "",
        stem: cit.source_doc || "",
        doi: ((_b = cit.csl) == null ? void 0 : _b.DOI) || "",
        meta: { csl: cit.csl || {} },
        allowCreate: "strong"
      });
      if (identity.paper_id) {
        if (cit.paper_id !== identity.paper_id) changed = true;
        cit.paper_id = identity.paper_id;
        delete cit.identity_review;
      } else {
        cit.identity_review = "paper-unresolved";
        changed = true;
      }
      if (!cit.evidence_id) {
        cit.evidence_id = cit.source_annotation_id ? `annotation:${cit.source_annotation_id}` : cit.source_chunk_id ? `chunk:${cit.paper_id}:${cit.source_chunk_id}` : `legacy:${cit.id}`;
        changed = true;
      }
      if (cit.paper_id) {
        const attachment = this._attachmentForEvidence(cit.paper_id, cit);
        if (attachment) {
          const desiredReview = attachment.locator_status === "unverified" ? "locator-unverified" : "";
          if (cit.attachment_id !== attachment.attachment_id || (cit.attachment_review || "") !== desiredReview) changed = true;
          cit.attachment_id = attachment.attachment_id;
          if (desiredReview) cit.attachment_review = desiredReview;
          else delete cit.attachment_review;
        } else {
          cit.attachment_review = this._attachmentIsAmbiguous(cit.paper_id, cit) ? "ambiguous" : "unresolved";
        }
      }
      if (!cit.source_kind) {
        cit.source_kind = cit.source_annotation_id ? "annotation" : cit.source_chunk_id ? "chunk" : "legacy";
        changed = true;
      }
      if (!cit.claim_hash && !["unchecked", "stale"].includes(cit.fidelity || "unchecked")) {
        cit.previous_fidelity = cit.fidelity;
        cit.fidelity = "stale";
        cit.verification_state = "stale";
        changed = true;
      }
    }
    for (const anno of Object.values(((_c = this.annotationIndex) == null ? void 0 : _c.items) || {})) {
      if (!anno.role_id || !anno.role_label_snapshot) {
        const role = this._annoRoleOf(anno.color) || {};
        const label = role.label || "未分类";
        anno.role_id = role.id || "unspecified";
        anno.role_label_snapshot = label;
        changed = true;
      }
      const identity = this._resolvePaperIdentity({
        paperId: anno.paper_id || "",
        library: anno.library || anno.lib || "",
        documentId: anno.document_id || anno.docId || "",
        sourceFile: anno.source_file || anno.src || anno.native_pdf_path || anno.doc || "",
        stem: anno.doc || "",
        allowCreate: "strong"
      });
      if (identity.paper_id) {
        if (anno.paper_id !== identity.paper_id) changed = true;
        anno.paper_id = identity.paper_id;
        delete anno.identity_review;
      } else {
        anno.identity_review = "paper-unresolved";
        changed = true;
      }
      if (!anno.evidence_id) {
        anno.evidence_id = `annotation:${anno.id}`;
        changed = true;
      }
      if (anno.paper_id) {
        const attachment = this._attachmentForEvidence(anno.paper_id, anno);
        if (attachment) {
          const desiredReview = attachment.locator_status === "unverified" ? "locator-unverified" : "";
          if (anno.attachment_id !== attachment.attachment_id || (anno.attachment_review || "") !== desiredReview) changed = true;
          anno.attachment_id = attachment.attachment_id;
          if (desiredReview) anno.attachment_review = desiredReview;
          else delete anno.attachment_review;
        } else {
          anno.attachment_review = this._attachmentIsAmbiguous(anno.paper_id, anno) ? "ambiguous" : "unresolved";
        }
      }
    }
    for (const item of Object.values(this.paperIndex.items || {})) {
      if (!item.note_path || !((_d = item.aliases) == null ? void 0 : _d.length)) continue;
      const file = this.app.vault.getAbstractFileByPath(item.note_path);
      if (!((_e = file == null ? void 0 : file.path) == null ? void 0 : _e.endsWith(".md"))) continue;
      const fm = ((_f = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _f.frontmatter) || {};
      const current = new Set(Array.isArray(fm.paper_aliases) ? fm.paper_aliases.map(String) : []);
      if (item.aliases.some((alias) => !current.has(alias))) {
        await this.app.fileManager.processFrontMatter(file, (data) => {
          data.paper_id = item.paper_id;
          data.paper_aliases = [.../* @__PURE__ */ new Set([...Array.isArray(data.paper_aliases) ? data.paper_aliases : [], ...item.aliases])];
        });
        changed = true;
      }
    }
    if (changed) await this.saveSettings();
  }
  async _reconcileEvidenceAnchors({ quarantineBroken = false } = {}) {
    var _a, _b, _c, _d, _e, _f;
    const citeLocations = /* @__PURE__ */ new Map();
    const claimLocations = /* @__PURE__ */ new Map();
    const fileTexts = /* @__PURE__ */ new Map();
    const addLocation = (map, id, path) => {
      if (!map.has(id)) map.set(id, /* @__PURE__ */ new Set());
      map.get(id).add(path);
    };
    for (const file of this.app.vault.getMarkdownFiles()) {
      let text = "";
      try {
        text = await this.app.vault.cachedRead(file);
      } catch (_) {
        continue;
      }
      if (!text.includes("%%cite:") && !text.includes("%%claim:")) continue;
      fileTexts.set(file.path, { file, text });
      for (const match of text.matchAll(/%%cite:([\w-]+)%%/g)) addLocation(citeLocations, match[1], file.path);
      for (const match of text.matchAll(/%%claim:([\w-]+)%%/g)) addLocation(claimLocations, match[1], file.path);
    }
    let changed = false;
    let anchored = 0;
    let detached = 0;
    for (const citation of Object.values(((_a = this.citationIndex) == null ? void 0 : _a.items) || {})) {
      const locations = [...citeLocations.get(citation.id) || []];
      if (!locations.length) {
        detached++;
        if (citation.anchor_state !== "detached" || citation.detached_reason !== "anchor_missing") changed = true;
        citation.anchor_state = "detached";
        citation.detached_reason = "anchor_missing";
        citation.detached_at = citation.detached_at || Date.now();
        if (!citation.claim_id && citation.verification_state === "current") {
          citation.previous_fidelity = citation.fidelity;
          citation.fidelity = "stale";
          citation.verification_state = "stale";
          citation.stale_reason = "citation_anchor_removed";
          citation.stale_at = Date.now();
        }
        const claim = citation.claim_id ? (_c = (_b = this.claimIndex) == null ? void 0 : _b.items) == null ? void 0 : _c[citation.claim_id] : null;
        if (claim && this._markClaimStale(claim, "citation_anchor_removed")) changed = true;
        continue;
      }
      anchored++;
      const state = locations.length === 1 ? "anchored" : "duplicate";
      if (citation.anchor_state !== state || citation.document_path !== locations[0] || citation.detached_reason) changed = true;
      citation.anchor_state = state;
      citation.document_path = locations[0];
      delete citation.detached_reason;
      delete citation.detached_at;
      if (locations.length > 1) {
        citation.duplicate_document_paths = locations;
        const claim = citation.claim_id ? (_e = (_d = this.claimIndex) == null ? void 0 : _d.items) == null ? void 0 : _e[citation.claim_id] : null;
        if (claim && this._markClaimStale(claim, "citation_anchor_copied")) changed = true;
      } else delete citation.duplicate_document_paths;
    }
    for (const claim of Object.values(((_f = this.claimIndex) == null ? void 0 : _f.items) || {})) {
      const locations = [...claimLocations.get(claim.id) || []];
      if (!locations.length) {
        if (this._markClaimStale(claim, "claim_anchor_removed")) changed = true;
      } else if (locations.length > 1 || claim.document_path && !locations.includes(claim.document_path)) {
        claim.duplicate_document_paths = locations;
        if (this._markClaimStale(claim, "claim_anchor_copied")) changed = true;
      } else if (!claim.document_path) {
        claim.document_path = locations[0];
        changed = true;
      }
    }
    const brokenIds = [...citeLocations.keys()].filter((id) => {
      var _a2, _b2;
      return !((_b2 = (_a2 = this.citationIndex) == null ? void 0 : _a2.items) == null ? void 0 : _b2[id]);
    });
    const modified = [];
    if (quarantineBroken && brokenIds.length) {
      const broken = new Set(brokenIds);
      const backupRoot = ".papersearch-backups/citation-reconcile-v1";
      if (!await this.app.vault.adapter.exists(".papersearch-backups")) await this.app.vault.adapter.mkdir(".papersearch-backups");
      if (!await this.app.vault.adapter.exists(backupRoot)) await this.app.vault.adapter.mkdir(backupRoot);
      try {
        for (const { file, text } of fileTexts.values()) {
          const next = text.replace(/%%cite:([\w-]+)%%/g, (full, id) => broken.has(id) ? `%%cite-missing:${id}%%` : full);
          if (next === text) continue;
          const backupId = this._hashText(`${file.path}|${this._hashText(text)}`).slice(0, 20);
          const backupPath = `${backupRoot}/${backupId}.md.bak`;
          if (!await this.app.vault.adapter.exists(backupPath)) await this.app.vault.adapter.write(backupPath, text);
          await this.app.vault.modify(file, next);
          modified.push({ file, text });
        }
      } catch (error) {
        for (const entry of modified.reverse()) {
          try {
            await this.app.vault.modify(entry.file, entry.text);
          } catch (_) {
          }
        }
        throw new Error(`无法隔离失效的引用记录：${error.message}`);
      }
      changed = changed || modified.length > 0;
    }
    this.citationIndex.anchor_audit = {
      audited_at: Date.now(),
      anchored,
      detached,
      broken: brokenIds.length,
      quarantined: quarantineBroken ? modified.length : 0
    };
    if (changed || brokenIds.length) await this.saveSettings();
    return this.citationIndex.anchor_audit;
  }
  // ── 引注对象持久层 ──────────────────────────────────
  _newCitationId() {
    const n = this.citationIndex._seq = (this.citationIndex._seq || 0) + 1;
    return `cite-${n.toString(36)}${Date.now().toString(36).slice(-4)}`;
  }
  _setupClaimStalenessTracking() {
    this._claimStaleTimers = /* @__PURE__ */ new Map();
    const schedule = (text, path = "") => {
      const key = path || "__active__";
      if (this._claimStaleTimers.has(key)) clearTimeout(this._claimStaleTimers.get(key));
      const timer = setTimeout(() => {
        this._claimStaleTimers.delete(key);
        this._scanClaimStaleness(String(text || ""), path);
      }, 350);
      this._claimStaleTimers.set(key, timer);
    };
    this.registerEvent(this.app.workspace.on("editor-change", (editor, view) => {
      var _a, _b;
      try {
        schedule(((_a = editor == null ? void 0 : editor.getValue) == null ? void 0 : _a.call(editor)) || "", ((_b = view == null ? void 0 : view.file) == null ? void 0 : _b.path) || "");
      } catch (_) {
      }
    }));
    this.registerEvent(this.app.vault.on("modify", (file) => {
      var _a;
      if (!((_a = file == null ? void 0 : file.path) == null ? void 0 : _a.endsWith(".md"))) return;
      this.app.vault.cachedRead(file).then((text) => schedule(text, file.path)).catch(() => {
      });
    }));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      var _a, _b, _c;
      if (!(oldPath == null ? void 0 : oldPath.endsWith(".md")) || !((_a = file == null ? void 0 : file.path) == null ? void 0 : _a.endsWith(".md"))) return;
      let changed = false;
      for (const claim of Object.values(((_b = this.claimIndex) == null ? void 0 : _b.items) || {})) {
        if (claim.document_path === oldPath) {
          claim.document_path = file.path;
          changed = true;
        }
      }
      for (const cit of Object.values(((_c = this.citationIndex) == null ? void 0 : _c.items) || {})) {
        if (cit.document_path === oldPath) {
          cit.document_path = file.path;
          changed = true;
        }
      }
      if (changed) this.saveSettings();
    }));
  }
  _extractClaimFromLines(lines, line) {
    const out = [];
    const clean = (value) => String(value || "").replace(/%%(?:claim|cite):[\w-]+%%/g, "").trim();
    const first = clean(lines[line] || "");
    if (first && !/^\s*>/.test(first)) out.push(first);
    for (let ln = line + 1; ln < lines.length && ln < line + 12; ln++) {
      const raw = lines[ln] || "";
      if (/%%claim:[\w-]+%%/.test(raw) || /%%cite:[\w-]+%%/.test(raw) && out.length) break;
      if (/^#{1,6}\s/.test(raw) && out.length) break;
      if (raw.trim() === "" && out.length) break;
      if (/^\s*>/.test(raw)) continue;
      const value = clean(raw);
      if (value) out.push(value);
    }
    return this._normalizeClaimText(out.join(" "));
  }
  _markClaimStale(claim, reason) {
    if (!claim || claim.verification_state !== "current") return false;
    claim.previous_fidelity = claim.fidelity;
    claim.fidelity = "stale";
    claim.verification_state = "stale";
    claim.stale_at = Date.now();
    claim.stale_reason = reason;
    this._writeClaim(claim);
    for (const id of claim.citation_ids || []) {
      const cit = this._readCitation(id);
      if (!cit) continue;
      cit.previous_fidelity = cit.fidelity;
      cit.fidelity = "stale";
      cit.verification_state = "stale";
      cit.stale_at = claim.stale_at;
      cit.stale_reason = reason;
      this._writeCitation(cit);
    }
    return true;
  }
  _scanClaimStaleness(text, documentPath = "") {
    var _a, _b;
    const lines = text.split("\n");
    let changed = false;
    const seenClaims = /* @__PURE__ */ new Set();
    const markStale = (claim, reason) => {
      if (this._markClaimStale(claim, reason)) changed = true;
    };
    lines.forEach((line, index) => {
      var _a2, _b2;
      for (const match of line.matchAll(/%%claim:([\w-]+)%%/g)) {
        const claim = (_b2 = (_a2 = this.claimIndex) == null ? void 0 : _a2.items) == null ? void 0 : _b2[match[1]];
        if (!claim) continue;
        seenClaims.add(claim.id);
        const liveText = this._extractClaimFromLines(lines, index);
        const liveHash = this._claimHash(liveText);
        claim.current_claim_hash = liveHash;
        if (documentPath && claim.document_path && claim.document_path !== documentPath) {
          claim.duplicate_document_paths = [.../* @__PURE__ */ new Set([...claim.duplicate_document_paths || [], claim.document_path, documentPath])];
          markStale(claim, "claim_anchor_copied");
          continue;
        }
        if (documentPath && !claim.document_path) claim.document_path = documentPath;
        const cits = (claim.citation_ids || []).map((id) => this._readCitation(id)).filter(Boolean);
        const currentEvidenceHash = this._evidenceHash(cits);
        const bodyCitationIds = [...line.matchAll(/%%cite:([\w-]+)%%/g)].map((m) => m[1]);
        const expectedCitationIds = [...new Set(claim.citation_ids || [])];
        const anchorChanged = bodyCitationIds.length !== expectedCitationIds.length || [...bodyCitationIds].sort().some((id, i) => id !== [...expectedCitationIds].sort()[i]);
        const missingEvidence = cits.length !== expectedCitationIds.length;
        const claimChanged = !!claim.claim_hash && claim.claim_hash !== liveHash;
        const evidenceChanged = !!claim.evidence_hash && claim.evidence_hash !== currentEvidenceHash;
        if (claimChanged) markStale(claim, "claim_changed");
        else if (anchorChanged) markStale(claim, "citation_anchors_changed");
        else if (missingEvidence) markStale(claim, "evidence_missing");
        else if (evidenceChanged) markStale(claim, "evidence_changed");
      }
    });
    if (documentPath) {
      for (const claim of Object.values(((_a = this.claimIndex) == null ? void 0 : _a.items) || {})) {
        if (claim.document_path === documentPath && !seenClaims.has(claim.id)) {
          markStale(claim, "claim_anchor_removed");
        }
      }
    }
    if (changed) {
      this.saveSettings();
      (_b = this._refreshCitePanel) == null ? void 0 : _b.call(this);
    }
  }
  _newClaimId() {
    const n = this.claimIndex._seq = (this.claimIndex._seq || 0) + 1;
    return `claim-${n.toString(36)}${Date.now().toString(36).slice(-4)}`;
  }
  _normalizeClaimText(text) {
    return String(text || "").replace(/%%(?:claim|cite):[\w-]+%%/g, "").replace(/\s+/g, " ").trim();
  }
  _hashText(text) {
    return nodeCrypto2.createHash("sha256").update(String(text || ""), "utf8").digest("hex");
  }
  _sha256File(filePath) {
    if (!filePath) return Promise.resolve("");
    return new Promise((resolve) => {
      const hash = nodeCrypto2.createHash("sha256");
      let stream;
      try {
        stream = nodeFs3.createReadStream(filePath);
      } catch (_) {
        resolve("");
        return;
      }
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("error", () => resolve(""));
      stream.on("end", () => {
        try {
          resolve(hash.digest("hex"));
        } catch (_) {
          resolve("");
        }
      });
    });
  }
  _claimHash(text) {
    return this._hashText(this._normalizeClaimText(text));
  }
  _evidenceHash(citations) {
    const stable = (citations || []).map((c) => {
      var _a;
      return {
        id: c.evidence_id || c.source_chunk_id || c.source_annotation_id || c.id,
        quote: String(c.source_quote || "").replace(/\s+/g, " ").trim(),
        page: (_a = c.source_page) != null ? _a : null,
        paper: c.paper_id || c.source_doc || "",
        attachment: c.attachment_id || "",
        library: c.source_library || "",
        document: c.source_document_id || "",
        file: c.source_file || ""
      };
    });
    return this._hashText(JSON.stringify(stable));
  }
  _writeClaim(claim) {
    if (!this.claimIndex.items) this.claimIndex.items = {};
    this.claimIndex.items[claim.id] = claim;
    if (!this._citSaveScheduled) {
      this._citSaveScheduled = true;
      this._citSaveTimer = setTimeout(() => {
        this._citSaveScheduled = false;
        this._citSaveTimer = null;
        this.saveSettings();
      }, 150);
    }
  }
  // 把结构化 AI 草稿转换成“Claim + Evidence + Citation”事务。
  // 这里只构造内存对象；正文真正插入成功后才调用 _commitEvidenceBackedDraft，避免孤儿索引。
  _buildEvidenceBackedDraft(draft, documentPath = "") {
    const rows = Array.isArray(draft == null ? void 0 : draft.rows) ? draft.rows : [];
    const claimsIn = Array.isArray(draft == null ? void 0 : draft.claims) ? draft.claims : [];
    const library = String((draft == null ? void 0 : draft.library) || this.settings.lastLibrary || "default");
    if (!rows.length || !claimsIn.length) throw new Error("草稿缺少来源映射");
    const citations = [];
    const claims = [];
    const blocks = [];
    const strip = (value) => String(value || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    for (const rawClaim of claimsIn) {
      const claimText = this._normalizeClaimText((rawClaim == null ? void 0 : rawClaim.text) || "");
      const sourceNumbers = [...new Set(((rawClaim == null ? void 0 : rawClaim.source_numbers) || []).map((n) => parseInt(n, 10)).filter((n) => Number.isInteger(n) && n >= 1 && n <= rows.length))];
      if (!claimText || !sourceNumbers.length) {
        throw new Error("AI 返回了没有可核验来源的论断");
      }
      const claimId = this._newClaimId();
      const claimCitations = [];
      const sourceLinks = [];
      const citekeys = [];
      sourceNumbers.forEach((sourceNo) => {
        var _a;
        const row = rows[sourceNo - 1];
        const sourceLibrary = String(row._library || row.library || library || "default");
        const quote = strip(row.origFull || row.origShort || "");
        if (!quote) throw new Error(`来源 ${sourceNo} 缺少原文片段`);
        const docMeta = this._readDocMeta(row._docId) || row._meta || {};
        const paperIdentity = this._resolvePaperIdentity ? this._resolvePaperIdentity({ row, library: sourceLibrary, meta: docMeta }) : { paper_id: `paper-${this._hashText(`${sourceLibrary}|${row._docId || row._sourceFile || row.id}`).slice(0, 16)}` };
        const citeId = this._newCitationId();
        const stem = strip(row._sourceFile || row.paperTitle || row.title || `来源${sourceNo}`).replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_");
        const page = parseInt(row.page, 10) || null;
        const citekey = ((_a = docMeta.bbt) == null ? void 0 : _a.citekey) || row.citekey || "";
        const evidenceId = `chunk:${sourceLibrary}:${row._docId || row._sourceFile || stem}:${row.id || sourceNo}`;
        const cit = {
          id: citeId,
          claim_id: claimId,
          evidence_id: evidenceId,
          paper_id: paperIdentity.paper_id,
          document_path: documentPath,
          source_kind: "chunk",
          source_chunk_id: row.id || "",
          source_annotation_id: "",
          source_quote: quote,
          source_page: page,
          source_doc: stem,
          source_library: sourceLibrary,
          source_document_id: row._docId || "",
          source_file: row._sourceFile || "",
          csl: docMeta.csl || null,
          citekey,
          evidence_role: row.relation_type || row.tag || "",
          user_claim: claimText,
          claim_hash: "",
          transform: "ai-synthesis",
          fidelity: "unchecked",
          verification_state: "unchecked",
          fidelity_note: "",
          verified_at: null,
          created_at: Date.now()
        };
        citations.push(cit);
        claimCitations.push(cit);
        if (citekey) citekeys.push(citekey);
        const params = new URLSearchParams({
          action: "open-pdf",
          library: sourceLibrary,
          docId: row._docId || "",
          srcFile: row._sourceFile || "",
          ...page ? { page: String(page) } : {}
        });
        const label = `${stem}${page ? ` p.${page}` : ""}`;
        sourceLinks.push(`[证据 ${sourceNo} · ${label}](obsidian://${PROTOCOL}?${params.toString()})`);
      });
      const claimHash = this._claimHash(claimText);
      const evidenceHash = this._evidenceHash(claimCitations);
      const claim = {
        id: claimId,
        document_path: documentPath,
        claim_text: claimText,
        citation_ids: claimCitations.map((c) => c.id),
        evidence_ids: claimCitations.map((c) => c.evidence_id),
        claim_hash: "",
        current_claim_hash: claimHash,
        evidence_hash: evidenceHash,
        fidelity: "unchecked",
        verification_state: "unchecked",
        fidelity_note: "",
        verified_at: null,
        created_at: Date.now()
      };
      claims.push(claim);
      const anchors = `%%claim:${claimId}%%` + claimCitations.map((c) => `%%cite:${c.id}%%`).join("");
      const pandoc = citekeys.length === claimCitations.length ? ` [${citekeys.map((k) => `@${k}`).join("; ")}]` : "";
      blocks.push(`${anchors}
${claimText}${pandoc}
> 证据：${sourceLinks.join(" · ")}`);
    }
    return { text: blocks.join("\n\n") + "\n", claims, citations };
  }
  async _commitEvidenceBackedDraft(bundle) {
    const citations = (bundle == null ? void 0 : bundle.citations) || [];
    const claims = (bundle == null ? void 0 : bundle.claims) || [];
    const previousCitations = new Map(citations.map((c) => {
      var _a;
      return [c.id, (_a = this.citationIndex.items) == null ? void 0 : _a[c.id]];
    }));
    const previousClaims = new Map(claims.map((c) => {
      var _a;
      return [c.id, (_a = this.claimIndex.items) == null ? void 0 : _a[c.id]];
    }));
    if (this._citSaveTimer) clearTimeout(this._citSaveTimer);
    this._citSaveTimer = null;
    this._citSaveScheduled = false;
    try {
      if (!this.citationIndex.items) this.citationIndex.items = {};
      if (!this.claimIndex.items) this.claimIndex.items = {};
      const normalizedCitations = citations.map((cit) => this._normalizeCitationIdentity(cit));
      const unlocatable = normalizedCitations.find((cit) => !cit.attachment_id || ["unresolved", "ambiguous", "locator-unverified"].includes(cit.attachment_review));
      if (unlocatable) {
        throw new Error(`来源片段无法定位到原 PDF：${unlocatable.source_doc || unlocatable.id}。请先重新关联原 PDF`);
      }
      for (const claim of claims) {
        const evidence = normalizedCitations.filter((cit) => cit.claim_id === claim.id);
        claim.evidence_ids = evidence.map((cit) => cit.evidence_id);
        claim.evidence_hash = this._evidenceHash(evidence);
        claim.current_claim_hash = this._claimHash(claim.claim_text || "");
      }
      for (const cit of normalizedCitations) this.citationIndex.items[cit.id] = cit;
      for (const claim of claims) this.claimIndex.items[claim.id] = claim;
      await this.saveSettings();
    } catch (err) {
      for (const [id, previous] of previousCitations) {
        if (previous) this.citationIndex.items[id] = previous;
        else delete this.citationIndex.items[id];
      }
      for (const [id, previous] of previousClaims) {
        if (previous) this.claimIndex.items[id] = previous;
        else delete this.claimIndex.items[id];
      }
      throw err;
    }
  }
  _normalizeCitationIdentity(cit) {
    var _a;
    delete cit._line;
    if (!cit.paper_id) {
      const identity = this._resolvePaperIdentity({
        library: cit.source_library || "",
        documentId: cit.source_document_id || "",
        sourceFile: cit.source_file || cit.source_doc || "",
        stem: cit.source_doc || "",
        doi: ((_a = cit.csl) == null ? void 0 : _a.DOI) || "",
        zoteroKey: cit.zotero_key || "",
        allowCreate: "strong"
      });
      if (identity.paper_id) cit.paper_id = identity.paper_id;
      else cit.identity_review = cit.identity_review || "paper-unresolved";
    }
    if (!cit.evidence_id) {
      cit.evidence_id = cit.source_annotation_id ? `annotation:${cit.source_annotation_id}` : cit.source_chunk_id ? `chunk:${cit.paper_id || "unresolved"}:${cit.source_chunk_id}` : `legacy:${cit.id}`;
    }
    if (cit.paper_id) {
      const sourceFile = cit.source_file || (cit.source_doc ? `${cit.source_doc}.pdf` : "");
      const attachment = this._upsertPaperAttachment(cit.paper_id, {
        library: cit.source_library || "",
        document_id: cit.source_document_id || "",
        source_file: sourceFile,
        locator_kind: cit.source_library || cit.source_document_id || cit.source_file ? "source" : "note-stem",
        pdf_paths: cit.native_pdf_path ? [cit.native_pdf_path] : []
      }) || this._attachmentForEvidence(cit.paper_id, cit);
      if (attachment) {
        cit.attachment_id = attachment.attachment_id;
        if (attachment.locator_status === "unverified") cit.attachment_review = "locator-unverified";
        else delete cit.attachment_review;
      } else cit.attachment_review = this._attachmentIsAmbiguous(cit.paper_id, cit) ? "ambiguous" : "unresolved";
    }
    cit.source_kind = cit.source_kind || (cit.source_annotation_id ? "annotation" : cit.source_chunk_id ? "chunk" : "legacy");
    cit.verification_state = cit.verification_state || "unchecked";
    cit.anchor_state = cit.anchor_state || (cit.document_path ? "anchored" : "pending");
    return cit;
  }
  _writeCitation(cit) {
    if (!this.citationIndex.items) this.citationIndex.items = {};
    this.citationIndex.items[cit.id] = this._normalizeCitationIdentity(cit);
    if (!this._citSaveScheduled) {
      this._citSaveScheduled = true;
      this._citSaveTimer = setTimeout(() => {
        this._citSaveScheduled = false;
        this._citSaveTimer = null;
        this.saveSettings();
      }, 150);
    }
  }
  // ── 悬浮「文献收集栏」（Floating-TOC 式：收起=带计数的把手，hover/pinned 展开）────
  _fidMeta(fid) {
    const map = {
      faithful: { icon: "●", label: "充分支持", cls: "pb-cpal-fid-ok" },
      partial: { icon: "●", label: "部分支持", cls: "pb-cpal-fid-warn" },
      distorted: { icon: "●", label: "不支持", cls: "pb-cpal-fid-bad" },
      stale: { icon: "◷", label: "正文已修改，需重新核查", cls: "pb-cpal-fid-stale" },
      unchecked: { icon: "·", label: "待核查", cls: "pb-cpal-fid-none" }
    };
    return map[fid] || map.unchecked;
  }
  _ensureCitePanel() {
    if (this.settings.citePanelEnabled === false) return;
    if (this._citePanelEl && document.body.contains(this._citePanelEl)) return;
    const wrap = document.body.createDiv({ cls: "pb-cite-panel" });
    const tab = wrap.createDiv({ cls: "pb-cite-panel-tab" });
    tab.createSpan({ cls: "pb-cite-panel-count", text: "0" });
    const body = wrap.createDiv({ cls: "pb-cite-panel-body" });
    const head = body.createDiv({ cls: "pb-cite-panel-head" });
    const titleRow = head.createDiv({ cls: "pb-cc-titlerow" });
    titleRow.createSpan({ cls: "pb-cite-panel-title pb-cc-title", text: "文献收集" });
    titleRow.createSpan({ cls: "pb-cite-panel-count" });
    const gsel = titleRow.createEl("select", { cls: "pb-cite-panel-filter pb-cc-groupsel dropdown", attr: { "aria-label": "分组方式" } });
    for (const o of [["doc", "按文献"], ["time", "按时间"], ["color", "按颜色"]]) {
      const e = gsel.createEl("option", { text: o[1] });
      e.value = o[0];
    }
    gsel.value = this._collGroupBy || "time";
    gsel.onchange = () => {
      this._collGroupBy = gsel.value;
      this._refreshCollections();
    };
    const pin = titleRow.createSpan({ cls: "pb-cite-panel-pin", attr: { "aria-label": "固定 / 取消固定" } });
    obsidian12.setIcon(pin, "pin");
    pin.onclick = () => {
      this.settings.citePanelPinned = !this.settings.citePanelPinned;
      this.saveSettings();
      this._applyCitePanelState();
    };
    head.createSpan({ cls: "pb-cc-sub", text: this._collSubLabel() });
    this._buildCollectChips(head);
    const tsel = head.createEl("select", { cls: "pb-cite-panel-filter dropdown", attr: { "aria-label": "按时间筛选" } });
    for (const o of [["all", "全部时间"], ["1", "今天"], ["7", "近 7 天"], ["30", "近 30 天"]]) {
      const e = tsel.createEl("option", { text: o[1] });
      e.value = o[0];
    }
    tsel.value = this._collTime || "all";
    tsel.onchange = () => {
      this._collTime = tsel.value;
      this._refreshCitePanel();
    };
    const sin = body.createEl("input", { cls: "pb-cite-panel-search", attr: { type: "text", placeholder: "搜索文献名…" } });
    sin.value = this._collDocQ || "";
    sin.oninput = () => {
      this._collDocQ = sin.value;
      this._refreshCitePanel();
    };
    body.createDiv({ cls: "pb-cite-panel-list" });
    this._citePanelEl = wrap;
    this._applyCitePanelEdge();
    this._applyCitePanelState();
    this.register(() => {
      try {
        wrap.remove();
      } catch (_) {
      }
    });
  }
  _applyCitePanelEdge() {
    if (!this._citePanelEl) return;
    const edge = ["right", "left", "top", "bottom"].includes(this.settings.citePanelEdge) ? this.settings.citePanelEdge : "right";
    this._citePanelEl.dataset.edge = edge;
  }
  _applyCitePanelState() {
    if (!this._citePanelEl) return;
    this._citePanelEl.toggleClass("is-pinned", !!this.settings.citePanelPinned);
  }
  _applyCitePanelSetting() {
    if (this.settings.citePanelEnabled === false) {
      if (this._citePanelEl) {
        try {
          this._citePanelEl.remove();
        } catch (_) {
        }
        this._citePanelEl = null;
      }
      return;
    }
    this._ensureCitePanel();
    this._applyCitePanelEdge();
    this._applyCitePanelState();
    this._refreshCitePanel();
  }
  // 命令 / ribbon：展开并固定（再点取消固定）
  _toggleCitePanel() {
    this._ensureCitePanel();
    if (!this._citePanelEl) {
      new obsidian12.Notice("文献收集栏已在设置里关闭");
      return;
    }
    this.settings.citePanelPinned = !this.settings.citePanelPinned;
    this.saveSettings();
    this._applyCitePanelState();
    this._refreshCitePanel();
  }
  _refreshCitePanel() {
    var _a, _b;
    if (this.settings.citePanelEnabled === false) {
      if (this._citePanelEl) this._citePanelEl.style.display = "none";
      return;
    }
    if (!this._citePanelEl || !document.body.contains(this._citePanelEl)) return;
    this._citePanelEl.style.display = "";
    const total = Object.values(((_a = this.annotationIndex) == null ? void 0 : _a.items) || {}).length;
    const refsAll = Object.values(((_b = this.collectedRefs) == null ? void 0 : _b.items) || {});
    const list = this._citePanelEl.querySelector(".pb-cite-panel-list");
    this._citePanelEl.querySelectorAll(".pb-cite-panel-count").forEach((el) => {
      el.textContent = total > 99 ? "99+" : String(total);
    });
    this._citePanelEl.toggleClass("is-empty", total === 0 && refsAll.length === 0);
    const subEl = this._citePanelEl.querySelector(".pb-cc-sub");
    if (subEl) subEl.textContent = this._collSubLabel();
    const chipsEl = this._citePanelEl.querySelector(".pb-cc-chips");
    if (chipsEl) this._buildCollectChips(chipsEl.parentElement);
    if (!list) return;
    this._populateCollectList(list);
  }
  // 构建文献收集列表（悬浮收集栏与「文献收集」标签页共用）。返回标注总数。
  _populateCollectList(listEl) {
    var _a, _b;
    if (!listEl) return 0;
    if (!this._collSel) this._collSel = /* @__PURE__ */ new Set();
    const all = Object.values(((_a = this.annotationIndex) == null ? void 0 : _a.items) || {});
    const refsAll = Object.values(((_b = this.collectedRefs) == null ? void 0 : _b.items) || {});
    const total = all.length;
    const list = listEl;
    list.empty();
    const panelEl = list.closest(".pb-cite-panel");
    const selHost = panelEl || list.parentElement || list;
    selHost.querySelectorAll(":scope > .pb-cite-panel-selbar").forEach((n) => n.remove());
    if (this._collSel.size) {
      const sb = selHost.createDiv({ cls: "pb-cite-panel-selbar" + (panelEl ? " pb-cite-panel-selbar--float" : "") });
      sb.createSpan({ cls: "pb-cite-panel-selcount", text: `已选 ${this._collSel.size} 条` });
      const go = sb.createEl("button", { cls: "pb-cite-panel-selgo mod-cta", text: "查相关文献" });
      go.onclick = (e) => {
        e.stopPropagation();
        this._sendAnnosToSearch([...this._collSel].map((id) => {
          var _a2;
          return (_a2 = this.annotationIndex.items) == null ? void 0 : _a2[id];
        }).filter(Boolean));
      };
      const clr = sb.createSpan({ cls: "pb-cite-panel-selclr", text: "清除", attr: { role: "button" } });
      clr.onclick = (e) => {
        e.stopPropagation();
        this._collSel.clear();
        this._refreshCollections();
      };
      if (!panelEl) selHost.insertBefore(sb, list);
    }
    const colorF = this._collColor || "all";
    const timeF = this._collTime || "all";
    const docQ = (this._collDocQ || "").toLowerCase().trim();
    let items = all;
    if (colorF !== "all") items = items.filter((a) => a.color === colorF);
    if (timeF !== "all") {
      const cut = Date.now() - parseInt(timeF, 10) * 864e5;
      items = items.filter((a) => (a.created_at || 0) >= cut);
    }
    if (docQ) items = items.filter((a) => String(a.doc || "").toLowerCase().includes(docQ));
    if (!items.length && !refsAll.length) {
      list.createDiv({ cls: "pb-cite-panel-empty", text: total ? "当前筛选下没有标注。" : "还没有收录标注。在 PDF 阅读时用颜色标记，就会收进这里。" });
      return total;
    }
    if ((this._collGroupBy || "time") === "time") {
      const now = /* @__PURE__ */ new Date();
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startYest = startToday - 864e5;
      const cut7 = Date.now() - 7 * 864e5;
      const cut30 = Date.now() - 30 * 864e5;
      const bucketOf = (ts) => ts >= startToday ? "今天" : ts >= startYest ? "昨天" : ts >= cut7 ? "近 7 天" : ts >= cut30 ? "近 30 天" : "更早";
      const order = ["今天", "昨天", "近 7 天", "近 30 天", "更早"];
      const tg = {};
      for (const a of items) {
        const k = bucketOf(a.created_at || 0);
        (tg[k] = tg[k] || []).push(a);
      }
      for (const k of order) {
        const arr = tg[k];
        if (!arr || !arr.length) continue;
        arr.sort((x, y) => (y.created_at || 0) - (x.created_at || 0));
        const colEl = list.createDiv({ cls: "pb-cc-col" });
        const gh = colEl.createDiv({ cls: "pb-cc-group" });
        gh.createSpan({ cls: "pb-cc-gname", text: k });
        gh.createSpan({ cls: "pb-cc-gcount", text: String(arr.length) });
        for (const a of arr) this._renderCiteRow(colEl, a, this._matchBib({ source_doc: a.doc, title: a.doc }));
      }
    } else if (this._collGroupBy === "color") {
      const roles = this._annoRoles();
      const order = roles.map((r) => r.color);
      const labelOf = (col) => {
        var _a2;
        return ((_a2 = roles.find((r) => r.color === col)) == null ? void 0 : _a2.label) || "其它";
      };
      const cg = {};
      for (const a of items) {
        (cg[a.color] = cg[a.color] || []).push(a);
      }
      const keys = Object.keys(cg).sort((x, y) => {
        const ix = order.indexOf(x), iy = order.indexOf(y);
        return (ix < 0 ? 999 : ix) - (iy < 0 ? 999 : iy);
      });
      for (const col of keys) {
        const arr = cg[col].sort((x, y) => (y.created_at || 0) - (x.created_at || 0));
        const colEl = list.createDiv({ cls: "pb-cc-col" });
        const gh = colEl.createDiv({ cls: "pb-cc-group" });
        const d = gh.createSpan({ cls: "pb-cc-gdot" });
        d.style.background = col;
        gh.createSpan({ cls: "pb-cc-gname", text: labelOf(col) });
        gh.createSpan({ cls: "pb-cc-gcount", text: String(arr.length) });
        for (const a of arr) this._renderCiteRow(colEl, a, this._matchBib({ source_doc: a.doc, title: a.doc }));
      }
    } else {
      const groups = {};
      for (const a of items) {
        const k = a.doc || "（未知文献）";
        (groups[k] = groups[k] || []).push(a);
      }
      for (const docKey of Object.keys(groups).sort((x, y) => x.localeCompare(y))) {
        const arr = groups[docKey].sort((x, y) => (y.created_at || 0) - (x.created_at || 0));
        const colEl = list.createDiv({ cls: "pb-cc-col" });
        const gh = colEl.createDiv({ cls: "pb-cc-group" });
        gh.createSpan({ cls: "pb-cc-gname", text: docKey });
        const bib = this._matchBib({ source_doc: docKey, title: docKey });
        if (bib == null ? void 0 : bib.citekey) {
          const ck = gh.createSpan({ cls: "pb-cc-gkey", text: `@${bib.citekey}`, attr: { title: "点击复制 [@citekey]（pandoc 引用）" } });
          ck.onclick = (e) => {
            var _a2;
            e.stopPropagation();
            (_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText(`[@${bib.citekey}]`);
            new obsidian12.Notice(`已复制 [@${bib.citekey}]`);
          };
        } else {
          gh.createSpan({ cls: "pb-cc-reddot", attr: { title: "此文献未匹配到你的文献库（.bib），暂时没有可用的引用键" } });
        }
        gh.createSpan({ cls: "pb-cc-gcount", text: String(arr.length) });
        for (const a of arr) this._renderCiteRow(colEl, a, bib);
      }
    }
    let refs = refsAll;
    if (docQ) refs = refs.filter((r) => String(r.title || "").toLowerCase().includes(docQ));
    if (refs.length) {
      list.createDiv({ cls: "pb-cite-panel-section", text: "相关文献 · PaperSearch 检索收入" });
      const byGroup = {};
      for (const r of refs) {
        const g = r.group || "相关文献";
        (byGroup[g] = byGroup[g] || []).push(r);
      }
      for (const g of Object.keys(byGroup).sort((x, y) => x.localeCompare(y))) {
        const colEl = list.createDiv({ cls: "pb-cc-col" });
        const gh = colEl.createDiv({ cls: "pb-cc-group" });
        gh.createSpan({ cls: "pb-cc-gname", text: g });
        gh.createSpan({ cls: "pb-cc-gcount", text: String(byGroup[g].length) });
        for (const r of byGroup[g].sort((x, y) => (y.created_at || 0) - (x.created_at || 0))) this._renderRefRow(colEl, r);
      }
    }
    return total;
  }
  // 刷新「文献收集」标签页的列表（若该标签页当前挂载在 DOM 中）
  _refreshCollectTab() {
    var _a;
    if (this._collectTabListEl && document.body.contains(this._collectTabListEl)) {
      const tabChips = (_a = this._collectTabListEl.parentElement) == null ? void 0 : _a.querySelector(".pb-cc-chips");
      if (tabChips) this._buildCollectChips(tabChips.parentElement);
      const n = this._populateCollectList(this._collectTabListEl);
      if (this._collectTabCountEl) this._collectTabCountEl.textContent = n ? String(n) : "";
    }
  }
  // 同时刷新两处收集界面：悬浮收集栏 + 面板内「文献收集」标签页
  _refreshCollections() {
    this._refreshCitePanel();
    this._refreshCollectTab();
  }
  _renderCiteRow(parent, anno, bib) {
    if (!this._collSel) this._collSel = /* @__PURE__ */ new Set();
    const role = this._annoRoleOf(anno.color);
    const card = parent.createDiv({ cls: "pb-cc-card" });
    card.style.setProperty("--pb-cc-bar", anno.color || "var(--text-faint)");
    const cb = card.createEl("input", { cls: "pb-cc-check", attr: { type: "checkbox", title: "选中以批量「查相关文献」" } });
    cb.checked = this._collSel.has(anno.id);
    cb.onclick = (e) => {
      e.stopPropagation();
      if (cb.checked) this._collSel.add(anno.id);
      else this._collSel.delete(anno.id);
      this._refreshCollections();
    };
    const t = String(anno.text || "").replace(/\s+/g, " ").trim();
    card.createDiv({ cls: "pb-cc-text", text: t || "（无文字）" });
    const foot = card.createDiv({ cls: "pb-cc-foot" });
    const sep2 = () => foot.createSpan({ cls: "pb-cc-sep", text: "·" });
    if (bib == null ? void 0 : bib.citekey) {
      const ck = foot.createSpan({ cls: "pb-cc-key", text: `@${bib.citekey}`, attr: { title: "点击复制 [@citekey]（pandoc 引用）" } });
      ck.onclick = (e) => {
        var _a;
        e.stopPropagation();
        (_a = navigator.clipboard) == null ? void 0 : _a.writeText(`[@${bib.citekey}]`);
        new obsidian12.Notice(`已复制 [@${bib.citekey}]`);
      };
    } else {
      foot.createSpan({ cls: "pb-cc-reddot", attr: { "aria-label": "未匹配到文献库", title: "这篇还没匹配到你的文献库（.bib），暂时没有可用的引用键" } });
    }
    if (anno.doc) {
      sep2();
      const d = String(anno.doc);
      foot.createSpan({ cls: "pb-cc-doc", text: d.length > 14 ? d.slice(0, 14) + "…" : d, attr: { title: d } });
    }
    if (anno.page) {
      sep2();
      foot.createSpan({ cls: "pb-cc-page", text: `p.${anno.page}` });
    }
    if (anno.created_at) {
      sep2();
      foot.createSpan({ cls: "pb-cc-time", text: this._fmtAnnoAgo(anno.created_at), attr: { title: this._fmtAnnoDateTime(anno.created_at) } });
    }
    card.setAttr("draggable", "true");
    card.addEventListener("dragstart", (e) => {
      try {
        e.dataTransfer.setData("text/plain", this._annoInsertText(anno, bib));
      } catch (_) {
      }
    });
    card.onclick = (e) => this._citeRowMenu(e, anno, bib);
  }
  _fmtAnnoDate(ms) {
    try {
      const d = new Date(ms);
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    } catch (_) {
      return "";
    }
  }
  // 相对时间：与今天 0 点对比的天数差 → 今天 / 昨天 / N 天前 / 回退到 YYYY-MM-DD
  _fmtAnnoAgo(ms) {
    try {
      const now = /* @__PURE__ */ new Date();
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const d = new Date(ms);
      const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const diff = Math.round((startToday - startThat) / 864e5);
      if (diff <= 0) return "今天";
      if (diff === 1) return "昨天";
      if (diff < 30) return `${diff} 天前`;
      return this._fmtAnnoDate(ms);
    } catch (_) {
      return this._fmtAnnoDate(ms);
    }
  }
  // 收集面板副标题：跨文献 · 按 X 分组
  _collSubLabel() {
    const g = this._collGroupBy || "time";
    const part = g === "doc" ? "按文献分组" : g === "color" ? "按颜色（角色）分组" : "按时间分组";
    return `跨文献 · ${part}`;
  }
  // 角色色板 chip 行：每个角色 = 色点 + 名称 + 数量；点击切换 _collColor 筛选
  _buildCollectChips(container) {
    var _a;
    let chips = container.querySelector(".pb-cc-chips");
    if (!chips) chips = container.createDiv({ cls: "pb-cc-chips" });
    chips.empty();
    const counts = {};
    for (const a of Object.values(((_a = this.annotationIndex) == null ? void 0 : _a.items) || {})) {
      const c = a.color;
      if (c) counts[c] = (counts[c] || 0) + 1;
    }
    const active = this._collColor || "all";
    for (const r of this._annoRoles()) {
      const chip = chips.createSpan({ cls: "pb-cc-chip" });
      chip.dataset.color = r.color;
      const dot = chip.createSpan({ cls: "pb-cc-cdot" });
      dot.style.background = r.color;
      chip.createSpan({ cls: "pb-cc-clabel", text: r.label });
      chip.createSpan({ cls: "pb-cc-ccount", text: String(counts[r.color] || 0) });
      chip.classList.toggle("active", active === r.color);
      chip.onclick = (e) => {
        e.stopPropagation();
        this._collColor = this._collColor === r.color ? "all" : r.color;
        this._refreshCollections();
      };
    }
    return chips;
  }
  _openLitNote(stem) {
    const f = this.app.vault.getMarkdownFiles().find((x) => x.basename === stem);
    if (!f) {
      new obsidian12.Notice("这篇还没有文献笔记");
      return;
    }
    this.app.workspace.getLeaf("tab").openFile(f);
  }
  _citeRowMenu(evt, anno, bib) {
    const menu = new obsidian12.Menu();
    menu.addItem((it) => it.setTitle("插入到正文（原文 + 引用）").setIcon("quote").onClick(() => this._insertAtCursor(this._annoInsertText(anno, bib))));
    menu.addItem((it) => it.setTitle("插入并 AI 改写").setIcon("wand").onClick(async () => {
      var _a;
      const view = this.app.workspace.getActiveViewOfType(obsidian12.MarkdownView);
      const editor = view == null ? void 0 : view.editor;
      if (!editor) {
        new obsidian12.Notice("请先打开一篇笔记");
        return;
      }
      new obsidian12.Notice("AI 改写中…");
      try {
        const rew = await this._aiRewrite(anno.text || "", "");
        if (!(rew == null ? void 0 : rew.trim())) throw new Error("改写结果为空");
        const row = {
          id: anno.id,
          origFull: anno.text || "",
          page: anno.page,
          _sourceFile: anno.src || `${anno.doc || "文献"}.pdf`,
          _docId: anno.docId || "",
          _library: anno.lib || anno.library || this.settings.lastLibrary || "default",
          paperTitle: anno.doc || "文献",
          citekey: (bib == null ? void 0 : bib.citekey) || ""
        };
        const bundle = this._buildEvidenceBackedDraft({
          rows: [row],
          claims: [{ text: rew, source_numbers: [1] }],
          library: row._library
        }, ((_a = view.file) == null ? void 0 : _a.path) || "");
        for (const cit of bundle.citations) {
          cit.paper_id = anno.paper_id || cit.paper_id;
          cit.attachment_id = anno.attachment_id || "";
          cit.evidence_id = anno.evidence_id || `annotation:${anno.id}`;
          cit.source_kind = "annotation";
          cit.source_annotation_id = anno.id;
          cit.evidence_role = anno.role_id || "unspecified";
          cit.transform = "ai-rewrite";
        }
        for (const claim of bundle.claims) {
          const evidence = bundle.citations.filter((cit) => cit.claim_id === claim.id);
          claim.evidence_ids = evidence.map((cit) => cit.evidence_id);
          claim.evidence_hash = this._evidenceHash(evidence);
        }
        const before = editor.getValue();
        editor.replaceSelection(bundle.text);
        try {
          await this._commitEvidenceBackedDraft(bundle);
        } catch (e) {
          editor.setValue(before);
          throw e;
        }
        new obsidian12.Notice("AI 改写已插入，并保留原文来源");
      } catch (e) {
        new obsidian12.Notice("AI 改写失败：" + ((e == null ? void 0 : e.message) || e));
      }
    }));
    menu.addItem((it) => it.setTitle("查相关文献").setIcon("search").onClick(() => this._sendAnnosToSearch([anno])));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle("打开文献笔记").setIcon("file-text").onClick(() => this._openLitNote(anno.doc)));
    menu.addItem((it) => it.setTitle("复制标注原文").setIcon("copy").onClick(() => {
      var _a;
      (_a = navigator.clipboard) == null ? void 0 : _a.writeText(anno.text || "");
      new obsidian12.Notice("已复制原文");
    }));
    if (bib == null ? void 0 : bib.citekey) menu.addItem((it) => it.setTitle(`复制引用 [@${bib.citekey}]`).setIcon("clipboard-copy").onClick(() => {
      var _a;
      (_a = navigator.clipboard) == null ? void 0 : _a.writeText(`[@${bib.citekey}]`);
      new obsidian12.Notice(`已复制 [@${bib.citekey}]`);
    }));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle("从收集栏删除该标注").setIcon("trash").onClick(() => {
      var _a;
      (_a = this._collSel) == null ? void 0 : _a.delete(anno.id);
      this._deleteAnno(anno.id);
      this._refreshCollections();
    }));
    menu.showAtMouseEvent(evt);
  }
  _fmtAnnoDateTime(ms) {
    try {
      const d = new Date(ms);
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    } catch (_) {
      return "";
    }
  }
  _annoInsertText(anno, bib) {
    const q = String((anno == null ? void 0 : anno.text) || "").replace(/\s+/g, " ").trim();
    return (bib == null ? void 0 : bib.citekey) ? `“${q}” [@${bib.citekey}]` : `“${q}”`;
  }
  _insertAtCursor(text) {
    const view = this.app.workspace.getActiveViewOfType(obsidian12.MarkdownView);
    const editor = view == null ? void 0 : view.editor;
    if (!editor) {
      new obsidian12.Notice("请先打开一篇笔记");
      return false;
    }
    editor.replaceSelection(text);
    return true;
  }
  // 把勾选/单条标注的原文当 query，发给 PaperSearch 检索相关文献
  async _sendAnnosToSearch(annos) {
    const q = (annos || []).map((a) => String((a == null ? void 0 : a.text) || "").trim()).filter(Boolean).join(" ").slice(0, 500);
    if (!q) {
      new obsidian12.Notice("没有可检索的标注文字");
      return;
    }
    await this.activateView();
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) {
      leaf.view.pushQuery(q);
      new obsidian12.Notice(`已用 ${(annos || []).length} 条标注检索相关文献`);
    } else new obsidian12.Notice("请先打开 PaperSearch 检索面板");
  }
  // ── 相关文献收集（文献收集栏的「相关文献」分组）──
  _unesc(s) {
    return String(s || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  }
  _newRefId() {
    const n = this.collectedRefs._seq = (this.collectedRefs._seq || 0) + 1;
    return `ref-${n.toString(36)}${Date.now().toString(36).slice(-4)}`;
  }
  _collectRelatedRefs(rows, groupLabel) {
    var _a;
    if (!this.collectedRefs.items) this.collectedRefs.items = {};
    let n = 0;
    for (const r of rows || []) {
      const title = this._unesc(r.paperTitle || r.title || r._sourceFile || "未命名文献");
      const bib = this._matchBib({ source_doc: r._sourceFile || title, title, _sourceFile: r._sourceFile });
      const id = this._newRefId();
      this.collectedRefs.items[id] = {
        id,
        title,
        citekey: (bib == null ? void 0 : bib.citekey) || "",
        snippet: this._unesc(r.origShort || r.origFull || "").replace(/\s+/g, " ").trim().slice(0, 160),
        doc: this._unesc(r._sourceFile || title),
        page: (_a = r.page) != null ? _a : null,
        group: groupLabel || "相关文献",
        created_at: Date.now()
      };
      n++;
    }
    if (n) this.saveSettings();
    this._refreshCollections();
    return n;
  }
  _removeCollectedRef(id) {
    try {
      delete this.collectedRefs.items[id];
    } catch (_) {
    }
    this.saveSettings();
    this._refreshCollections();
  }
  _renderRefRow(parent, ref) {
    const row = parent.createDiv({ cls: "pb-cite-panel-item pb-cite-panel-refitem" });
    const main = row.createDiv({ cls: "pb-cite-panel-itemmain" });
    const meta = main.createDiv({ cls: "pb-cite-panel-meta" });
    meta.createSpan({ cls: "pb-cite-panel-refname", text: ref.title || "未命名文献" });
    if (ref.citekey) meta.createSpan({ cls: "pb-cite-panel-citekey", text: `@${ref.citekey}` });
    if (ref.snippet) main.createDiv({ cls: "pb-cite-panel-text", text: ref.snippet });
    row.onclick = (e) => this._refRowMenu(e, ref);
  }
  _refRowMenu(evt, ref) {
    const menu = new obsidian12.Menu();
    menu.addItem((it) => it.setTitle("用此文献再检索").setIcon("search").onClick(() => this._sendAnnosToSearch([{ text: ref.snippet || ref.title }])));
    menu.addItem((it) => it.setTitle("打开文献笔记").setIcon("file-text").onClick(() => this._openLitNote(ref.doc)));
    if (ref.citekey) menu.addItem((it) => it.setTitle(`复制引用 [@${ref.citekey}]`).setIcon("clipboard-copy").onClick(() => {
      var _a;
      (_a = navigator.clipboard) == null ? void 0 : _a.writeText(`[@${ref.citekey}]`);
      new obsidian12.Notice(`已复制 [@${ref.citekey}]`);
    }));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle("从收集栏移除").setIcon("trash").onClick(() => this._removeCollectedRef(ref.id)));
    menu.showAtMouseEvent(evt);
  }
  _readCitation(id) {
    var _a, _b;
    return ((_b = (_a = this.citationIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[id]) || null;
  }
  _citationStats() {
    var _a, _b;
    const items = Object.values((_b = (_a = this.citationIndex) == null ? void 0 : _a.items) != null ? _b : {});
    const byFid = {};
    for (const c of items) byFid[c.fidelity || "unchecked"] = (byFid[c.fidelity || "unchecked"] || 0) + 1;
    return { total: items.length, byFid };
  }
  // ── PDF 标注持久层（颜色即语义：每条标注带 role）────────
  // Annotation = { id, doc(stem), page, rects:[{x,y,w,h}](scale-1 页坐标), color, role, text, created_at }
  _newAnnoId() {
    const n = this.annotationIndex._seq = (this.annotationIndex._seq || 0) + 1;
    return `anno-${n.toString(36)}${Date.now().toString(36).slice(-4)}`;
  }
  _writeAnno(anno) {
    const role = this._annoRoleOf(anno.color) || {};
    anno.role_id = anno.role_id || role.id || "unspecified";
    anno.role_label_snapshot = anno.role_label_snapshot || role.label || "未分类";
    if (!anno.paper_id) {
      anno.paper_id = this._resolvePaperIdentity({
        library: anno.library || anno.lib || "",
        documentId: anno.document_id || anno.docId || "",
        sourceFile: anno.source_file || anno.src || anno.native_pdf_path || anno.doc || "",
        stem: anno.doc || ""
      }).paper_id;
    }
    if (anno.paper_id) {
      const sourceFile = anno.src || anno.source_file || (anno.doc ? `${anno.doc}.pdf` : "");
      const attachment = this._upsertPaperAttachment(anno.paper_id, {
        library: anno.lib || anno.library || "",
        document_id: anno.docId || anno.document_id || "",
        source_file: sourceFile,
        locator_kind: anno.lib || anno.library || anno.docId || anno.document_id || anno.src || anno.source_file || anno.native_pdf_path ? "source" : "note-stem",
        pdf_paths: anno.native_pdf_path ? [anno.native_pdf_path] : []
      }) || this._attachmentForEvidence(anno.paper_id, anno);
      if (attachment) {
        anno.attachment_id = attachment.attachment_id;
        if (attachment.locator_status === "unverified") anno.attachment_review = "locator-unverified";
        else delete anno.attachment_review;
      } else anno.attachment_review = this._attachmentIsAmbiguous(anno.paper_id, anno) ? "ambiguous" : "unresolved";
    }
    anno.evidence_id = anno.evidence_id || `annotation:${anno.id}`;
    if (!this.annotationIndex.items) this.annotationIndex.items = {};
    this.annotationIndex.items[anno.id] = anno;
    this._scheduleAnnoSave();
    this._refreshAnnoPanel();
    this._refreshCollections();
  }
  _deleteAnno(id) {
    var _a, _b;
    if ((_b = (_a = this.annotationIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[id]) {
      delete this.annotationIndex.items[id];
      this._scheduleAnnoSave();
      this._refreshAnnoPanel();
      this._refreshCollections();
    }
  }
  _scheduleAnnoSave() {
    if (this._annoSaveScheduled) return;
    this._annoSaveScheduled = true;
    this._annoSaveTimer = setTimeout(() => {
      this._annoSaveScheduled = false;
      this._annoSaveTimer = null;
      this.saveSettings();
    }, 150);
  }
  _annosForDoc(doc, page = null, source = {}) {
    var _a, _b;
    const items = Object.values((_b = (_a = this.annotationIndex) == null ? void 0 : _a.items) != null ? _b : {});
    const identity = this._resolvePaperIdentity({
      library: source.library || "",
      documentId: source.documentId || "",
      sourceFile: source.srcPath || source.sourceFile || doc,
      stem: doc,
      allowCreate: "strong"
    });
    return items.filter((a) => (identity.paper_id && a.paper_id === identity.paper_id || !a.paper_id && a.doc === doc) && (page == null || a.page === page));
  }
  // 角色色板（用户可改 label）；找不到匹配色时回退第一项
  _annoRoles() {
    const roles = this.settings.annotationRoles;
    return Array.isArray(roles) && roles.length ? roles : DEFAULT_SETTINGS.annotationRoles;
  }
  _annoRoleOf(color) {
    return this._annoRoles().find((r) => r.color === color) || this._annoRoles()[0];
  }
  // ── 悬浮标注索引面板（Floating TOC 式：当前 PDF 的标注，点击回跳）────
  // 活动 viewer 注册：最近交互的 PDF 渲染器成为面板数据源；
  // 同时维护存活注册表——活动者销毁时回退到最近的存活 viewer（否则 hover 弹窗一收，面板就消失）
  _setActiveAnnoViewer(docKey, api, label) {
    if (!this._aliveAnnoViewers) this._aliveAnnoViewers = /* @__PURE__ */ new Set();
    if (api) {
      api._pbDocKey = docKey || "";
      api._pbLabel = label || (docKey || "");
      this._aliveAnnoViewers.delete(api);
      this._aliveAnnoViewers.add(api);
    }
    this._activeAnnoDoc = docKey || "";
    this._activeAnnoApi = api || null;
    this._activeAnnoLabel = label || (docKey || "");
    this._ensureAnnoPanel();
    this._refreshAnnoPanel();
  }
  _clearActiveAnnoViewer(api) {
    var _a, _b;
    (_a = this._aliveAnnoViewers) == null ? void 0 : _a.delete(api);
    if (this._activeAnnoApi === api) {
      const rest = [...(_b = this._aliveAnnoViewers) != null ? _b : []];
      const next = rest[rest.length - 1] || null;
      this._activeAnnoDoc = next ? next._pbDocKey || "" : "";
      this._activeAnnoApi = next;
      this._activeAnnoLabel = next ? next._pbLabel || "" : "";
      this._refreshAnnoPanel();
    }
  }
  _ensureAnnoPanel() {
    if (this.settings.annoPanelEnabled === false) return;
    if (this._annoPanelEl && document.body.contains(this._annoPanelEl)) return;
    const wrap = document.body.createDiv({ cls: "pb-anno-panel" });
    wrap.createDiv({ cls: "pb-anno-panel-tab" });
    const body = wrap.createDiv({ cls: "pb-anno-panel-body" });
    const head = body.createDiv({ cls: "pb-anno-panel-head" });
    head.createSpan({ cls: "pb-anno-panel-title", text: "标注" });
    const tools = head.createDiv({ cls: "pb-anno-panel-tools" });
    const fsel = tools.createEl("select", { cls: "pb-anno-panel-filter dropdown", attr: { "aria-label": "按颜色筛选" } });
    {
      const o = fsel.createEl("option", { text: "全部" });
      o.value = "all";
    }
    for (const r of this._annoRoles()) {
      const o = fsel.createEl("option", { text: r.label });
      o.value = r.color;
    }
    fsel.value = this._annoFilterColor || "all";
    fsel.onchange = () => {
      this._annoFilterColor = fsel.value;
      this._refreshAnnoPanel();
    };
    const pin = tools.createSpan({ cls: "pb-anno-panel-pin", attr: { "aria-label": "固定 / 取消固定" } });
    obsidian12.setIcon(pin, "pin");
    pin.onclick = () => {
      this.settings.annoPanelPinned = !this.settings.annoPanelPinned;
      this.saveSettings();
      this._applyAnnoPanelState();
    };
    body.createDiv({ cls: "pb-anno-panel-list" });
    this._annoPanelEl = wrap;
    this._applyAnnoPanelEdge();
    this._applyAnnoPanelState();
    this.register(() => {
      try {
        wrap.remove();
      } catch (_) {
      }
    });
  }
  _applyAnnoPanelEdge() {
    if (!this._annoPanelEl) return;
    const edge = ["right", "left", "top", "bottom"].includes(this.settings.annoPanelEdge) ? this.settings.annoPanelEdge : "right";
    this._annoPanelEl.dataset.edge = edge;
  }
  _applyAnnoPanelState() {
    if (!this._annoPanelEl) return;
    this._annoPanelEl.toggleClass("is-pinned", !!this.settings.annoPanelPinned);
  }
  // 把某文档的标注渲染成可点跳条目到 listEl（悬浮面板 + 模态底部停靠分栏共用）。
  // 返回该文档标注总数（未按颜色过滤前），供标题计数。
  _fillAnnoList(listEl, docKey, api) {
    listEl.empty();
    const allAnnos = docKey ? this._annosForDoc(docKey, null, (api == null ? void 0 : api._pbSpec) || {}) : [];
    const cf = this._annoFilterColor || "all";
    const annos = cf === "all" ? allAnnos.slice() : allAnnos.filter((a) => a.color === cf);
    if (!annos.length) {
      listEl.createDiv({ cls: "pb-anno-panel-empty", text: !docKey ? "打开一篇 PDF 开始标注" : cf !== "all" ? "该颜色下还没有标注" : "本文还没有标注，在 PDF 里划选即可" });
      return allAnnos.length;
    }
    annos.sort((a, b) => a.page - b.page || 0);
    for (const anno of annos) {
      const role = this._annoRoleOf(anno.color);
      const row = listEl.createDiv({ cls: "pb-anno-panel-item" });
      const dot = row.createSpan({ cls: "pb-anno-panel-dot" });
      dot.style.background = anno.color;
      const main = row.createDiv({ cls: "pb-anno-panel-itemmain" });
      const meta = main.createDiv({ cls: "pb-anno-panel-meta" });
      meta.createSpan({ cls: "pb-anno-panel-role", text: (role == null ? void 0 : role.label) || "标注" });
      if (anno.page) meta.createSpan({ cls: "pb-anno-panel-page", text: `p.${anno.page}` });
      main.createDiv({ cls: "pb-anno-panel-text", text: (anno.text || "").slice(0, 90) });
      row.onclick = () => {
        var _a;
        (_a = api == null ? void 0 : api.jumpToAnno) == null ? void 0 : _a.call(api, anno);
      };
    }
    return allAnnos.length;
  }
  _refreshAnnoPanel() {
    var _a, _b;
    (_b = (_a = this._modalAnnoDock) == null ? void 0 : _a.refresh) == null ? void 0 : _b.call(_a);
    if (this.settings.annoPanelEnabled === false) {
      if (this._annoPanelEl) this._annoPanelEl.style.display = "none";
      return;
    }
    if (!this._annoPanelEl || !document.body.contains(this._annoPanelEl)) return;
    if (this._modalAnnoDock) {
      this._annoPanelEl.style.display = "none";
      return;
    }
    const list = this._annoPanelEl.querySelector(".pb-anno-panel-list");
    const titleEl = this._annoPanelEl.querySelector(".pb-anno-panel-title");
    if (!list) return;
    this._annoPanelEl.style.display = this._activeAnnoApi ? "" : "none";
    const total = this._fillAnnoList(list, this._activeAnnoDoc, this._activeAnnoApi);
    if (titleEl) titleEl.textContent = total ? `标注 · ${total}` : "标注";
  }
  // PDF 弹窗底部停靠的"标注分栏"：固定在 PDF 下方，两栏列出本篇标注，点一条回跳。
  // 返回 { el, refresh, destroy }。挂着时悬浮标注面板自动让位（见 _refreshAnnoPanel）。
  _mountPdfModalAnnoDock(panelEl, spec, viewer) {
    const docKey = (() => {
      const s = String(spec.srcPath || spec.sourceFile || "").split(/[\\/]/).pop();
      return (s || "").replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_").trim();
    })();
    const dock = panelEl.createDiv({ cls: "pb-pdf-modal-annos" });
    const head = dock.createDiv({ cls: "pb-pdf-modal-annos-head" });
    const title = head.createSpan({ cls: "pb-pdf-modal-annos-title", text: "标注" });
    const fsel = head.createEl("select", { cls: "pb-anno-panel-filter dropdown", attr: { "aria-label": "按颜色筛选" } });
    {
      const o = fsel.createEl("option", { text: "全部" });
      o.value = "all";
    }
    for (const r of this._annoRoles()) {
      const o = fsel.createEl("option", { text: r.label });
      o.value = r.color;
    }
    fsel.value = this._annoFilterColor || "all";
    const list = dock.createDiv({ cls: "pb-pdf-modal-annos-list" });
    const refresh = () => {
      const total = this._fillAnnoList(list, docKey, viewer);
      title.textContent = total ? `标注 · ${total}` : "标注";
    };
    fsel.onchange = () => {
      this._annoFilterColor = fsel.value;
      refresh();
    };
    refresh();
    const api = {
      el: dock,
      refresh,
      destroy: () => {
        try {
          dock.remove();
        } catch (_) {
        }
        if (this._modalAnnoDock === api) {
          this._modalAnnoDock = null;
          this._refreshAnnoPanel();
        }
      }
    };
    this._modalAnnoDock = api;
    return api;
  }
  // 设置变更时（开关/边缘）即时重建/应用
  _applyAnnoPanelSetting() {
    if (this.settings.annoPanelEnabled === false) {
      if (this._annoPanelEl) {
        try {
          this._annoPanelEl.remove();
        } catch (_) {
        }
        this._annoPanelEl = null;
      }
      return;
    }
    this._ensureAnnoPanel();
    this._applyAnnoPanelEdge();
    this._applyAnnoPanelState();
    this._refreshAnnoPanel();
  }
  // ── 上手引导：聚光灯指引（点一下高亮对应 UI 位置）──────
  _clearSpotlight() {
    clearTimeout(this._spotlightTimer);
    if (this._spotlightEl) {
      try {
        this._spotlightEl.remove();
      } catch (_) {
      }
      this._spotlightEl = null;
    }
  }
  _spotlight(selector, message, opts = {}) {
    this._clearSpotlight();
    const el = document.querySelector(selector);
    if (!el) {
      new obsidian12.Notice(message);
      return;
    }
    try {
      el.scrollIntoView({ block: "center", behavior: "auto" });
    } catch (_) {
    }
    const r = el.getBoundingClientRect();
    const layer = document.body.createDiv({ cls: "pb-spotlight" });
    const ring = layer.createDiv({ cls: "pb-spotlight-ring" });
    ring.style.left = `${r.left - 6}px`;
    ring.style.top = `${r.top - 6}px`;
    ring.style.width = `${r.width + 12}px`;
    ring.style.height = `${r.height + 12}px`;
    const bubble = layer.createDiv({ cls: "pb-spotlight-bubble", text: message });
    bubble.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - 320))}px`;
    bubble.style.top = `${r.bottom + 12}px`;
    this._spotlightEl = layer;
    this._spotlightTimer = setTimeout(() => this._clearSpotlight(), opts.timeout || 8e3);
    this.register(() => this._clearSpotlight());
  }
  // 引导建库：打开面板 → 切到「文献库」模块（懒渲染）→ 聚光「新建文献库」按钮
  async _guideCreateLibrary() {
    await this.activateView();
    setTimeout(() => {
      var _a;
      const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
      const root = (_a = leaf == null ? void 0 : leaf.view) == null ? void 0 : _a.containerEl;
      const libBtn = root == null ? void 0 : root.querySelector('.pb-mod-btn[data-mod="lib"]');
      if (libBtn && !libBtn.classList.contains("active")) libBtn.click();
      setTimeout(() => {
        if (document.querySelector(".pb-ls-create-btn")) {
          this._spotlight(
            ".pb-ls-create-btn",
            "① 点这里「新建文献库」：选一个装 PDF 的文件夹（或你的 Zotero storage），PaperSearch 会建立索引，之后就能检索、精读、引用。",
            { timeout: 1e4 }
          );
        } else {
          new obsidian12.Notice("在右侧 PaperSearch 面板切到「文献库管理」，点「新建文献库」开始");
        }
      }, 350);
    }, 450);
  }
  // ── 文档元数据缓存接口 ──────────────────────────────
  _readDocMeta(docId) {
    var _a, _b;
    return ((_b = (_a = this.docMetaCache) == null ? void 0 : _a.entries) == null ? void 0 : _b[docId]) || null;
  }
  _writeDocMeta(docId, entry) {
    var _a, _b;
    if (!this.docMetaCache.entries) this.docMetaCache.entries = {};
    this.docMetaCache.entries[docId] = entry;
    if (((_a = entry.csl) == null ? void 0 : _a.DOI) && entry.csl.DOI.length > 0) {
      this.docMetaCache.by_doi[entry.csl.DOI] = docId;
    }
    if (((_b = entry.bbt) == null ? void 0 : _b.citekey) && entry.bbt.citekey.length > 0) {
      this.docMetaCache.by_citekey[entry.bbt.citekey] = docId;
    }
    if (!this._metaSaveScheduled) {
      this._metaSaveScheduled = true;
      this._metaSaveTimer = setTimeout(() => {
        this._metaSaveScheduled = false;
        this._metaSaveTimer = null;
        this.saveSettings();
      }, 100);
    }
  }
  _sweepDocMetaCache() {
    const cache = this.docMetaCache;
    if (!(cache == null ? void 0 : cache.entries)) return;
    const now = Date.now();
    let removed = 0;
    for (const k of Object.keys(cache.entries)) {
      const e = cache.entries[k];
      if (e.ttl_until && e.ttl_until < now - 7 * 864e5) {
        delete cache.entries[k];
        removed++;
      }
    }
    if (removed) this.saveSettings();
  }
  _docMetaStats() {
    var _a, _b;
    const entries = Object.values((_b = (_a = this.docMetaCache) == null ? void 0 : _a.entries) != null ? _b : {});
    const enriched = entries.filter((e) => e.s2).length;
    const sources = {};
    for (const e of entries) {
      for (const s of e.meta_source || []) {
        sources[s] = (sources[s] || 0) + 1;
      }
    }
    return { total: entries.length, enriched, sources };
  }
  _clearDocMetaCache() {
    this.docMetaCache = { version: 2, entries: {}, by_doi: {}, by_citekey: {} };
    this.saveSettings();
  }
  // ── Longform 集成：从 frontmatter 扫描项目 ────────────
  // Longform 用 frontmatter 标识项目（不存独立配置文件），所以扫 vault 最稳
  _detectLongformProjects() {
    var _a, _b;
    const out = [];
    const files = this.app.vault.getMarkdownFiles();
    for (const f of files) {
      const fm = (_a = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _a.frontmatter;
      const lf = fm == null ? void 0 : fm.longform;
      if (!lf) continue;
      const isObj = typeof lf === "object" && lf !== null;
      const format = isObj ? lf.format || "single" : "single";
      const title = isObj && lf.title || fm.title || f.basename;
      out.push({
        path: f.path,
        folder: ((_b = f.parent) == null ? void 0 : _b.path) || "",
        format,
        title,
        scenes: isObj && Array.isArray(lf.scenes) ? lf.scenes : null,
        drafts: isObj && Array.isArray(lf.drafts) ? lf.drafts : null
      });
    }
    return out;
  }
  // 根据当前活动编辑器 + 选定项目，决定"活动 scene"
  _resolveActiveScene(project) {
    const active = this.app.workspace.getActiveFile();
    if (!active) return null;
    if (project.format === "single") return null;
    if (project.folder && active.path.startsWith(project.folder + "/") && active.path !== project.path) {
      return active.path;
    }
    return null;
  }
  // ── BBT (.bib) 索引：用户配置 .bib 路径 → 解析 → 多键索引 ──
  // 索引键：filename / DOI / citekey / titleLower
  _loadBbtBib() {
    var _a;
    this.bbtIndex = { byFile: /* @__PURE__ */ new Map(), byDoi: /* @__PURE__ */ new Map(), byCitekey: /* @__PURE__ */ new Map(), byTitle: /* @__PURE__ */ new Map() };
    const bbt = (_a = this.settings.bbtBibPath) == null ? void 0 : _a.trim();
    if (!bbt) return { entries: 0, error: null };
    const files = [this._paperbellBibPath(), bbt].filter(Boolean);
    let total = 0, firstErr = null;
    for (const path of files) {
      if (!nodeFs3.existsSync(path)) {
        if (path === bbt) firstErr = ".bib 文件不存在";
        continue;
      }
      try {
        const entries = parseBibTeX(nodeFs3.readFileSync(path, "utf8"));
        for (const e of entries) {
          if (e.citekey) this.bbtIndex.byCitekey.set(e.citekey, e);
          if (e.doi) this.bbtIndex.byDoi.set(e.doi.toLowerCase().trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, ""), e);
          if (e.file) {
            const fn = bibExtractFilename(e.file);
            if (fn) this.bbtIndex.byFile.set(fn.toLowerCase(), e);
          }
          if (e.title) {
            const t = e.title.toLowerCase().replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
            if (t) this.bbtIndex.byTitle.set(t, e);
          }
        }
        total += entries.length;
      } catch (err) {
        if (!firstErr) firstErr = err.message;
      }
    }
    return { entries: total, error: firstErr };
  }
  // PaperSearch 自己的可写 .bib（孤儿文献的溢出区）；显式设置优先，否则放 BBT .bib 同目录
  _paperbellBibPath() {
    var _a, _b;
    const explicit = (_a = this.settings.paperbellBibPath) == null ? void 0 : _a.trim();
    if (explicit) return explicit;
    const bbt = (_b = this.settings.bbtBibPath) == null ? void 0 : _b.trim();
    if (!bbt) return null;
    const i = Math.max(bbt.lastIndexOf("/"), bbt.lastIndexOf("\\"));
    return (i >= 0 ? bbt.slice(0, i + 1) : "") + "paperbell.bib";
  }
  // 监听 .bib 文件变化（BBT 在 Zotero 改条目时会重写它）
  _watchBbtBib() {
    var _a;
    if (this._bbtWatcher) {
      try {
        this._bbtWatcher.close();
      } catch (_) {
      }
      this._bbtWatcher = null;
    }
    if (this._bbtTimer) {
      clearTimeout(this._bbtTimer);
      this._bbtTimer = null;
    }
    const path = (_a = this.settings.bbtBibPath) == null ? void 0 : _a.trim();
    if (!path || !nodeFs3.existsSync(path)) return;
    try {
      this._bbtWatcher = nodeFs3.watch(path, () => {
        if (this._bbtTimer) clearTimeout(this._bbtTimer);
        this._bbtTimer = setTimeout(() => {
          this._bbtTimer = null;
          const r = this._loadBbtBib();
          if (!r.error) console.log(`[PaperSearch] BBT .bib 已重载：${r.entries} 条`);
        }, 600);
      });
    } catch (_) {
    }
  }
  // ── 单篇分析缓存 ────────────────────────────────────
  _hashString(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
    return (h >>> 0).toString(36);
  }
  _analysisCacheKey({ library, documentId, sourceFile, query }) {
    return `${library || ""}|${documentId || ""}|${sourceFile || ""}|${this._hashString(query || "")}`;
  }
  _readAnalysisCache(key) {
    var _a, _b, _c;
    const e = (_b = (_a = this.analysisCache) == null ? void 0 : _a.entries) == null ? void 0 : _b[key];
    if (!e) return null;
    const days = (_c = this.settings.analysisCacheRetentionDays) != null ? _c : 7;
    if (days > 0 && !e.pinned) {
      if (Date.now() - (e.createdAt || 0) > days * 864e5) return null;
    }
    return e;
  }
  _writeAnalysisCache(key, payload) {
    var _a, _b, _c, _d, _e;
    this.analysisCache.entries[key] = {
      response: payload.response,
      paperTitle: (_a = payload.paperTitle) != null ? _a : "",
      sourceFile: (_b = payload.sourceFile) != null ? _b : "",
      library: (_c = payload.library) != null ? _c : "",
      query: ((_d = payload.query) != null ? _d : "").slice(0, 200),
      requestId: (_e = payload.requestId) != null ? _e : "",
      createdAt: Date.now(),
      pinned: false
    };
    this.saveSettings();
  }
  _pinAnalysisCache(key) {
    var _a, _b;
    const e = (_b = (_a = this.analysisCache) == null ? void 0 : _a.entries) == null ? void 0 : _b[key];
    if (!e) return;
    e.pinned = true;
    this.saveSettings();
  }
  _sweepAnalysisCache() {
    var _a, _b;
    const cache = this.analysisCache;
    const days = (_b = (_a = this.settings) == null ? void 0 : _a.analysisCacheRetentionDays) != null ? _b : 7;
    if (!(cache == null ? void 0 : cache.entries) || days <= 0) return;
    const cutoff = Date.now() - days * 864e5;
    let removed = 0;
    for (const k of Object.keys(cache.entries)) {
      const e = cache.entries[k];
      if (!e.pinned && (e.createdAt || 0) < cutoff) {
        delete cache.entries[k];
        removed++;
      }
    }
    if (removed > 0) this.saveSettings();
  }
  _clearAnalysisCache() {
    this.analysisCache = { version: 1, entries: {} };
    this.saveSettings();
  }
  _analysisCacheStats() {
    var _a, _b;
    const entries = Object.values((_b = (_a = this.analysisCache) == null ? void 0 : _a.entries) != null ? _b : {});
    const pinned = entries.filter((e) => e.pinned).length;
    return { total: entries.length, pinned };
  }
  // ── PDF.js 共用实现（检索弹窗 + 内联/悬停代码块共用）──────
  // 拿 Obsidian 内置 pdf.js（官方 loadPdfJs，worker 已配好，不依赖打开过 PDF）
  async _ensurePdfjs() {
    var _a, _b;
    if ((_a = this._pdfjs) == null ? void 0 : _a.getDocument) return this._pdfjs;
    try {
      if (typeof obsidian12.loadPdfJs === "function") {
        const lib = await obsidian12.loadPdfJs();
        if (lib == null ? void 0 : lib.getDocument) {
          this._pdfjs = lib;
          return lib;
        }
      }
    } catch (e) {
      console.warn("PaperSearch: loadPdfJs 失败", e);
    }
    if ((_b = window.pdfjsLib) == null ? void 0 : _b.getDocument) {
      this._pdfjs = window.pdfjsLib;
      return this._pdfjs;
    }
    return null;
  }
  // 在某页 textContent 里定位命中片段，返回高亮矩形（视口坐标）
  // 策略：特征词命中——不要求连续（双栏 PDF 文本流会乱序），
  // 找命中片段里的长实词集合，逐 item 检查谁含这些词，把命中区域连成片高亮
  _matchHitRects(textContent, hitText, viewport) {
    const items = textContent.items.filter((it) => it.str && it.str.trim());
    if (!items.length) return [];
    const mtx = (m, v) => [
      m[0] * v[0] + m[2] * v[1],
      m[1] * v[0] + m[3] * v[1],
      m[0] * v[2] + m[2] * v[3],
      m[1] * v[2] + m[3] * v[3],
      m[0] * v[4] + m[2] * v[5] + m[4],
      m[1] * v[4] + m[3] * v[5] + m[5]
    ];
    const rectOf = (it) => {
      const tr = mtx(viewport.transform, it.transform);
      const h = Math.hypot(tr[2], tr[3]) || 12;
      return { x: tr[4], y: tr[5] - h, w: it.width * viewport.scale || 40, h: h * 1.18 };
    };
    const clean = (s) => String(s).toLowerCase().replace(/[^a-z0-9一-龥]+/g, "");
    const STOP = /* @__PURE__ */ new Set(["the", "and", "for", "that", "with", "this", "from", "have", "were", "are", "was", "which", "their", "they", "these", "those", "such", "than", "then", "will", "would", "can", "may", "also", "more", "most", "some", "into", "other", "between", "because", "about"]);
    const hitWords = [...new Set(
      hitText.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9一-龥]+/g, "")).filter((w) => w.length >= 5 && !STOP.has(w))
    )];
    if (hitWords.length < 2) {
      const cn = clean(hitText);
      for (let i = 0; i + 2 <= cn.length && hitWords.length < 30; i += 2) {
        const g = cn.slice(i, i + 2);
        if (/[一-龥]{2}/.test(g)) hitWords.push(g);
      }
    }
    if (hitWords.length < 2) return [];
    const hitSet = new Set(hitWords);
    const isHit = (str) => {
      const w = clean(str);
      if (w.length < 2) return false;
      for (const hw of hitSet) {
        if (w.includes(hw) || hw.includes(w)) return true;
      }
      return false;
    };
    const rects = [];
    let started = false, miss = 0;
    for (const it of items) {
      if (isHit(it.str)) {
        started = true;
        miss = 0;
        rects.push(rectOf(it));
      } else if (started) {
        miss++;
        if (miss <= 3) rects.push(rectOf(it));
        else if (rects.length >= 4) break;
        else {
          rects.length = 0;
          started = false;
        }
      }
    }
    return rects;
  }
  // PDF 库缓存目录：从后端拷进来的 PDF 一律放这。读它 = 不碰后端 = 最稳。
  _pdfCacheFolder() {
    return "PaperSearch缓存";
  }
  // 缓存文件路径（与 openPdfInObsidian / _stashPdfToVault 同一套 base 清洗，保证命中同一文件）
  _pdfCachePath(sourceFile, documentId) {
    const base = (sourceFile || documentId || "document").replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_").slice(0, 80);
    return `${this._pdfCacheFolder()}/${base}.pdf`;
  }
  // 记录一次"用到了某缓存 PDF"（会话内 LRU 近期度）：让"读"也算最近使用，避免刚读过又被淘汰
  _touchPdfCache(path) {
    if (!this._pdfCacheTouch) {
      this._pdfCacheTouch = /* @__PURE__ */ new Map();
      this._pdfCacheSeq = 0;
    }
    this._pdfCacheTouch.set(path, ++this._pdfCacheSeq);
  }
  // 把字节落地库缓存（建目录 + 建/改二进制 + LRU 淘汰）。返回缓存 TFile。
  async _writePdfCache(path, buf) {
    const vault = this.app.vault;
    const folder = this._pdfCacheFolder();
    if (!await vault.adapter.exists(folder)) await vault.createFolder(folder).catch(() => {
    });
    const existing = vault.getAbstractFileByPath(path);
    if (existing && existing.extension === "pdf") await vault.modifyBinary(existing, buf);
    else await vault.createBinary(path, buf);
    this._touchPdfCache(path);
    await this._evictPdfCache();
    return vault.getAbstractFileByPath(path);
  }
  // 命中 .bib 时，从条目 file 字段取 Zotero 维护的当前绝对路径——回跳定位源 PDF 的真相源。
  // 后端记录的路径会因 Zotero 移动/改名而失效；.bib 由 BBT 实时重写，路径最准。
  _bibPdfPath(spec) {
    var _a;
    try {
      const hit = this._matchBib({
        source_doc: spec.sourceFile,
        _sourceFile: spec.sourceFile,
        title: spec.title,
        doi: spec.doi
      });
      const p = ((_a = hit == null ? void 0 : hit.entry) == null ? void 0 : _a.file) ? bibExtractPath(hit.entry.file) : "";
      return p && nodeFs3.existsSync(p) ? p : "";
    } catch (_) {
      return "";
    }
  }
  // 解析 PDF 字节：缓存优先，消灭"后端 API 老加载失败"。顺序：
  //  1) 绝对路径：后端元数据真路径；失效则用 Zotero/.bib 登记的当前路径兜底 → fs 直接读，不碰后端
  //  2) 库缓存 PaperSearch缓存/{base}.pdf 已有 → 读本地（稳）
  //  3) 后端取字节一次 → 落地库缓存 → 之后都走 ②。返回 Uint8Array。
  async _resolvePdfBytes(spec) {
    let abs = "";
    if (spec.srcPath) {
      try {
        if (nodeFs3.existsSync(spec.srcPath)) abs = spec.srcPath;
      } catch (_) {
      }
    }
    if (!abs) {
      const bp = this._bibPdfPath(spec);
      if (bp) abs = bp;
    }
    if (abs) {
      try {
        return new Uint8Array(nodeFs3.readFileSync(abs));
      } catch (e) {
        console.warn("PaperSearch: 直接读 PDF 失败，回退缓存/后端", e);
      }
    }
    if (!spec.documentId && !spec.sourceFile) {
      throw new Error("无法定位 PDF 文件");
    }
    const cachePath = this._pdfCachePath(spec.sourceFile, spec.documentId);
    try {
      const cached = this.app.vault.getAbstractFileByPath(cachePath);
      if (cached && cached.extension === "pdf") {
        this._touchPdfCache(cachePath);
        return new Uint8Array(await this.app.vault.readBinary(cached));
      }
    } catch (e) {
      console.warn("PaperSearch: 读 PDF 缓存失败，回退后端", e);
    }
    if (!this.api) throw new Error("无法读取 PDF：本地没有缓存，也无法从文献库获取");
    const ab = await this.api.pdfBytes(spec.library, spec.documentId, spec.sourceFile);
    const bytes = new Uint8Array(ab);
    this._writePdfCache(cachePath, ab).catch((e) => console.warn("PaperSearch: 写 PDF 缓存失败", e));
    return bytes;
  }
  // 把 PDF 渲染进任意容器（canvas + 主题化工具栏 + 跳页 + 命中段高亮）。
  // 与检索弹窗 _showPdfModal 同一套渲染/高亮逻辑，但挂载到给定容器、默认适宽。
  // spec: { srcPath?, library?, documentId?, sourceFile?, page?, hitText? }
  // 返回 { destroy }，悬停面板关闭时调用以中止异步渲染。
  _mountPdfViewer(container, spec, opts = {}) {
    container.empty();
    container.addClass("pb-pdfv");
    const bar = container.createDiv({ cls: "pb-pdfv-bar" });
    const btnPrev = bar.createSpan({ cls: "pb-pdf-tool", text: "‹", attr: { title: "上一页" } });
    const pageBox = bar.createEl("input", { cls: "pb-pdf-pagebox", attr: { type: "text" } });
    const pageTot = bar.createSpan({ cls: "pb-pdf-pagetot", text: "/ ?" });
    const btnNext = bar.createSpan({ cls: "pb-pdf-tool", text: "›", attr: { title: "下一页" } });
    const btnZoomOut = bar.createSpan({ cls: "pb-pdf-tool", text: "−", attr: { title: "缩小" } });
    const zoomLabel = bar.createSpan({ cls: "pb-pdf-zoom", text: "适宽" });
    const btnZoomIn = bar.createSpan({ cls: "pb-pdf-tool", text: "+", attr: { title: "放大" } });
    const btnFit = bar.createSpan({ cls: "pb-pdf-tool", text: "⤢", attr: { title: "适应宽度" } });
    const btnHit = spec.hitText ? bar.createSpan({ cls: "pb-pdf-tool pb-pdf-tool-hit", text: "✦ 命中段", attr: { title: "回到命中片段" } }) : null;
    const scroller = container.createDiv({ cls: "pb-pdfv-scroller" });
    const stage = scroller.createDiv({ cls: "pb-pdf-stage" });
    const loading = container.createDiv({ cls: "pb-pdfv-loading", text: "加载 PDF…" });
    const state = { pdf: null, page: parseInt(spec.page) || 1, scale: null, total: 0, fit: true };
    let destroyed = false;
    let hitRectEl = null;
    let annoLayerEl = null;
    let renderSeq = 0;
    const docKey = (() => {
      let s = String(spec.srcPath || spec.sourceFile || "").split(/[\\/]/).pop();
      return s.replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_").trim();
    })();
    const fitScale = (vp1) => {
      const cw = (scroller.clientWidth || container.clientWidth || 600) - 8;
      return Math.max(0.3, Math.min(3, cw / vp1.width));
    };
    const mtx = (m, v) => [
      m[0] * v[0] + m[2] * v[1],
      m[1] * v[0] + m[3] * v[1],
      m[0] * v[2] + m[2] * v[3],
      m[1] * v[2] + m[3] * v[3],
      m[0] * v[4] + m[2] * v[5] + m[4],
      m[1] * v[4] + m[3] * v[5] + m[5]
    ];
    const annoEls = /* @__PURE__ */ new Map();
    const renderAnnos = () => {
      if (!annoLayerEl || !docKey) return;
      annoLayerEl.empty();
      annoEls.clear();
      for (const anno of this._annosForDoc(docKey, state.page, spec)) {
        const role = this._annoRoleOf(anno.color);
        (anno.rects || []).forEach((rc, idx) => {
          const el = annoLayerEl.createDiv({ cls: "pb-anno" });
          el.style.left = `${rc.x * state.scale}px`;
          el.style.top = `${rc.y * state.scale}px`;
          el.style.width = `${rc.w * state.scale}px`;
          el.style.height = `${rc.h * state.scale}px`;
          el.style.background = anno.color;
          el.setAttribute("aria-label", `${(role == null ? void 0 : role.label) || "标注"}：${(anno.text || "").slice(0, 60)}`);
          el.onclick = (e) => {
            e.stopPropagation();
            this._showAnnoMenu(e, anno, { docKey, spec, refresh: renderAnnos });
          };
          if (idx === 0) annoEls.set(anno.id, el);
        });
      }
    };
    const jumpToAnno = (anno) => {
      if (!anno || anno.doc !== docKey) return;
      const doFlash = () => {
        const el = annoEls.get(anno.id);
        if (!el) return;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.addClass("pb-anno-flash");
        setTimeout(() => {
          try {
            el.removeClass("pb-anno-flash");
          } catch (_) {
          }
        }, 1400);
      };
      if (anno.page && anno.page !== state.page) {
        state.page = Math.min(Math.max(1, anno.page), state.total || anno.page);
        renderPage().then(() => setTimeout(doFlash, 40)).catch(() => {
        });
      } else {
        doFlash();
      }
    };
    const renderPage = async () => {
      var _a, _b;
      if (destroyed || !state.pdf) return;
      const seq = ++renderSeq;
      hideAnnoBar();
      stage.empty();
      hitRectEl = null;
      annoLayerEl = null;
      pageBox.value = String(state.page);
      const pg = await state.pdf.getPage(state.page);
      if (destroyed || seq !== renderSeq) return;
      if (state.fit || state.scale == null) {
        state.scale = fitScale(pg.getViewport({ scale: 1 }));
        zoomLabel.textContent = "适宽";
      } else {
        zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
      }
      const viewport = pg.getViewport({ scale: state.scale });
      const canvas = stage.createEl("canvas", { cls: "pb-pdf-canvas" });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      annoLayerEl = stage.createDiv({ cls: "pb-anno-layer" });
      const layer = stage.createDiv({ cls: "pb-pdf-hl-layer" });
      const tl = stage.createDiv({ cls: "pb-pdf-textlayer" });
      for (const el of [annoLayerEl, layer, tl]) {
        el.style.width = `${viewport.width}px`;
        el.style.height = `${viewport.height}px`;
      }
      await pg.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      if (destroyed || seq !== renderSeq) return;
      let tc = null;
      try {
        tc = await pg.getTextContent();
      } catch (_) {
      }
      if (destroyed || seq !== renderSeq) return;
      if ((_a = tc == null ? void 0 : tc.items) == null ? void 0 : _a.length) {
        const pending = [];
        for (const it of tc.items) {
          if (!it.str || !it.str.trim()) continue;
          const tr = mtx(viewport.transform, it.transform);
          const h = Math.hypot(tr[2], tr[3]) || 12;
          const span = tl.createEl("span");
          span.textContent = it.str;
          span.style.left = `${tr[4]}px`;
          span.style.top = `${tr[5] - h}px`;
          span.style.fontSize = `${h}px`;
          pending.push({ span, w: (it.width || 0) * viewport.scale });
        }
        const widths = pending.map((p) => p.span.offsetWidth);
        pending.forEach((p, i) => {
          if (widths[i] > 0 && p.w > 0) p.span.style.transform = `scaleX(${p.w / widths[i]})`;
        });
      }
      const hitPage = parseInt(spec.page) || 1;
      if (spec.hitText && state.page === hitPage) {
        if ((_b = tc == null ? void 0 : tc.items) == null ? void 0 : _b.length) {
          let rects = [];
          try {
            rects = this._matchHitRects(tc, spec.hitText, viewport);
          } catch (_) {
          }
          for (const rc of rects) {
            const hl = layer.createDiv({ cls: "pb-pdf-hl" });
            hl.style.left = `${rc.x}px`;
            hl.style.top = `${rc.y}px`;
            hl.style.width = `${rc.w}px`;
            hl.style.height = `${rc.h}px`;
            if (!hitRectEl) hitRectEl = hl;
          }
          if (btnHit) btnHit.textContent = rects.length ? "✦ 命中段" : "✦ 未定位";
          if (rects.length) setTimeout(() => {
            if (!destroyed) hitRectEl == null ? void 0 : hitRectEl.scrollIntoView({ block: "center", behavior: "smooth" });
          }, 60);
        } else if (btnHit) {
          btnHit.textContent = "✦ 扫描件";
        }
      }
      renderAnnos();
    };
    const gotoPage = (p) => {
      if (!state.total) return;
      const np = Math.min(Math.max(1, p), state.total);
      if (np === state.page) {
        pageBox.value = String(state.page);
        return;
      }
      state.page = np;
      renderPage();
    };
    btnPrev.onclick = () => gotoPage(state.page - 1);
    btnNext.onclick = () => gotoPage(state.page + 1);
    pageBox.onkeydown = (e) => {
      if (e.key === "Enter") gotoPage(parseInt(pageBox.value) || 1);
    };
    btnZoomIn.onclick = () => {
      state.fit = false;
      state.scale = Math.min(3, (state.scale || 1) + 0.2);
      renderPage();
    };
    btnZoomOut.onclick = () => {
      state.fit = false;
      state.scale = Math.max(0.3, (state.scale || 1) - 0.2);
      renderPage();
    };
    btnFit.onclick = () => {
      state.fit = true;
      renderPage();
    };
    if (btnHit) btnHit.onclick = () => {
      const hitPage = parseInt(spec.page) || 1;
      if (state.page !== hitPage) gotoPage(hitPage);
      else hitRectEl == null ? void 0 : hitRectEl.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    let annoBar = null;
    const hideAnnoBar = () => {
      annoBar == null ? void 0 : annoBar.remove();
      annoBar = null;
    };
    const showAnnoBar = (clientRect, pendingAnno) => {
      hideAnnoBar();
      annoBar = scroller.createDiv({ cls: "pb-anno-bar" });
      const swRow = annoBar.createDiv({ cls: "pb-anno-bar-swatches" });
      const hint = annoBar.createDiv({ cls: "pb-anno-bar-hint", text: "标注为…" });
      for (const role of this._annoRoles()) {
        const sw = swRow.createEl("button", { cls: "pb-anno-swatch", attr: { "aria-label": role.label } });
        sw.style.background = role.color;
        sw.onmouseenter = () => {
          hint.textContent = role.label;
        };
        sw.onmouseleave = () => {
          hint.textContent = "标注为…";
        };
        sw.onclick = (e) => {
          var _a;
          e.stopPropagation();
          const paper = this._resolvePaperIdentity({
            library: spec.library || "",
            documentId: spec.documentId || "",
            sourceFile: spec.sourceFile || docKey,
            stem: docKey
          });
          const annoId = this._newAnnoId();
          this._writeAnno({
            id: annoId,
            evidence_id: `annotation:${annoId}`,
            paper_id: paper.paper_id,
            doc: docKey,
            page: state.page,
            rects: pendingAnno.rects,
            color: role.color,
            role_id: role.id || "unspecified",
            role_label_snapshot: role.label,
            text: pendingAnno.text,
            created_at: Date.now(),
            // PDF 来源：让"定位"链接能用插件 PDF 弹窗回跳（避免 [[name.pdf]] 解析不到生鬼影笔记）
            lib: spec.library || "",
            src: spec.sourceFile || "",
            docId: spec.documentId || ""
          });
          try {
            (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
          } catch (_) {
          }
          hideAnnoBar();
          renderAnnos();
          new obsidian12.Notice(`已标注「${role.label}」`);
          this._fileExcerptToNote({ text: pendingAnno.text, pdfStem: docKey, page: state.page, role: role.label, color: role.color, lib: spec.library, src: spec.sourceFile, docId: spec.documentId }).catch(() => {
          });
        };
      }
      const actRow = annoBar.createDiv({ cls: "pb-anno-bar-acts" });
      const act = (label, fn) => {
        const b = actRow.createSpan({ cls: "pb-anno-bar-act", text: label });
        b.onmousedown = (e) => e.preventDefault();
        b.onclick = (e) => {
          var _a;
          e.stopPropagation();
          const t = pendingAnno.text;
          try {
            (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
          } catch (_) {
          }
          hideAnnoBar();
          fn(t);
        };
      };
      act("摘录", async (t) => {
        const ok = await this._fileExcerptToNote({ text: t, pdfStem: docKey, page: state.page });
        new obsidian12.Notice(ok ? "已写入文献笔记摘录区" : "这篇还没有文献笔记，摘录暂未写入");
      });
      act("找相似", async (t) => {
        await this.activateView();
        const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
        if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) leaf.view.pushQuery(t.slice(0, 300));
      });
      const sRect = scroller.getBoundingClientRect();
      annoBar.style.left = `${Math.max(4, clientRect.left - sRect.left + scroller.scrollLeft)}px`;
      annoBar.style.top = `${clientRect.bottom - sRect.top + scroller.scrollTop + 8}px`;
    };
    stage.addEventListener("mouseup", () => {
      if (!docKey) return;
      setTimeout(() => {
        if (destroyed) return;
        const sel = window.getSelection();
        const text = ((sel == null ? void 0 : sel.toString()) || "").replace(/\s+/g, " ").trim();
        if (!text || !sel.rangeCount) {
          hideAnnoBar();
          return;
        }
        const range = sel.getRangeAt(0);
        const tlEl = stage.querySelector(".pb-pdf-textlayer");
        if (!tlEl || !tlEl.contains(range.commonAncestorContainer)) {
          hideAnnoBar();
          return;
        }
        const stageRect = stage.getBoundingClientRect();
        const raw = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
        if (!raw.length) {
          hideAnnoBar();
          return;
        }
        const rects = raw.map((r) => ({
          x: (r.left - stageRect.left) / state.scale,
          y: (r.top - stageRect.top) / state.scale,
          w: r.width / state.scale,
          h: r.height / state.scale
        }));
        showAnnoBar(raw[raw.length - 1], { text, rects });
      }, 10);
    });
    scroller.addEventListener("scroll", hideAnnoBar);
    scroller.addEventListener("mousedown", (e) => {
      if (annoBar && !annoBar.contains(e.target)) hideAnnoBar();
    });
    (async () => {
      var _a, _b;
      let bytes;
      try {
        bytes = await this._resolvePdfBytes(spec);
      } catch (e) {
        if (!destroyed) loading.textContent = `加载失败：${e.message}`;
        return;
      }
      if (destroyed) return;
      const pdfjs = await this._ensurePdfjs();
      if (destroyed) return;
      if (!pdfjs) {
        if (!spec.documentId && !spec.sourceFile) {
          loading.textContent = "无法显示 PDF：缺少可用的文件来源";
          return;
        }
        loading.remove();
        bar.remove();
        stage.remove();
        const base = ((_b = (_a = this.api) == null ? void 0 : _a._base) == null ? void 0 : _b.call(_a)) || (this.settings.backendUrl || "http://127.0.0.1:8000");
        const q = new URLSearchParams({ library: spec.library || "", raw: "true" });
        if (spec.documentId) q.set("document_id", spec.documentId);
        if (spec.sourceFile) q.set("source_file", spec.sourceFile);
        const ifr = scroller.createEl("iframe", { cls: "pb-pdfv-iframe" });
        ifr.src = `${base}/documents/pdf?${q.toString()}#page=${state.page}`;
        return;
      }
      try {
        state.pdf = await pdfjs.getDocument({ data: bytes }).promise;
        state.total = state.pdf.numPages;
        state.page = Math.min(Math.max(1, state.page), state.total);
        pageTot.textContent = `/ ${state.total}`;
      } catch (e) {
        if (!destroyed) loading.textContent = `解析失败：${e.message}`;
        return;
      }
      if (destroyed) return;
      loading.remove();
      await renderPage();
      if (!destroyed && docKey) this._setActiveAnnoViewer(docKey, viewerApi, spec.title || docKey);
    })();
    const viewerApi = {
      _pbSpec: spec,
      prev: () => gotoPage(state.page - 1),
      // 供 modal 接方向键
      next: () => gotoPage(state.page + 1),
      jumpToAnno,
      // 供悬浮面板回跳
      destroy: () => {
        var _a, _b;
        destroyed = true;
        this._clearActiveAnnoViewer(viewerApi);
        try {
          (_b = (_a = state.pdf) == null ? void 0 : _a.destroy) == null ? void 0 : _b.call(_a);
        } catch (_) {
        }
        try {
          container.empty();
        } catch (_) {
        }
      }
    };
    container.addEventListener("mouseenter", () => {
      if (!destroyed && docKey) this._setActiveAnnoViewer(docKey, viewerApi, spec.title || docKey);
    });
    return viewerApi;
  }
  // ── 标注点击菜单：改角色 / 复制原文 / 转摘录 / 转锚定引用 / 删除 ──
  _showAnnoMenu(evt, anno, ctx = {}) {
    var _a, _b;
    const menu = new obsidian12.Menu();
    for (const role of this._annoRoles()) {
      menu.addItem((it) => it.setTitle(`${anno.color === role.color ? "✓ " : "　"}标为「${role.label}」`).onClick(() => {
        var _a2;
        anno.color = role.color;
        anno.role_id = role.id || "unspecified";
        anno.role_label_snapshot = role.label;
        this._writeAnno(anno);
        (_a2 = ctx.refresh) == null ? void 0 : _a2.call(ctx);
      }));
    }
    menu.addSeparator();
    menu.addItem((it) => it.setTitle("复制原文").setIcon("copy").onClick(async () => {
      await navigator.clipboard.writeText(anno.text || "");
      new obsidian12.Notice("已复制原文");
    }));
    menu.addItem((it) => it.setTitle("转摘录到文献笔记").setIcon("quote").onClick(async () => {
      const role = this._annoRoleOf(anno.color);
      const ok = await this._fileExcerptToNote({
        text: anno.text || "",
        pdfStem: anno.doc,
        page: anno.page,
        role: role == null ? void 0 : role.label,
        color: anno.color
      });
      new obsidian12.Notice(ok ? "已写入文献笔记摘录区" : "这篇还没有文献笔记，未写入");
    }));
    menu.addSeparator();
    const citFromAnno = () => {
      var _a2, _b2;
      const id = this._newCitationId();
      const docMeta = ((_a2 = ctx.spec) == null ? void 0 : _a2.documentId) ? this._readDocMeta(ctx.spec.documentId) || {} : {};
      const cit = {
        id,
        paper_id: anno.paper_id || this._resolvePaperIdentity({ sourceFile: anno.doc, stem: anno.doc }).paper_id,
        attachment_id: anno.attachment_id || "",
        evidence_id: anno.evidence_id || `annotation:${anno.id}`,
        source_kind: "annotation",
        source_annotation_id: anno.id,
        source_chunk_id: "",
        source_quote: anno.text || "",
        source_page: anno.page || null,
        source_doc: anno.doc,
        evidence_role: anno.role_id || "unspecified",
        csl: docMeta.csl || null,
        citekey: ((_b2 = docMeta.bbt) == null ? void 0 : _b2.citekey) || "",
        user_claim: "",
        transform: "quote",
        fidelity: "unchecked",
        fidelity_note: "",
        created_at: Date.now()
      };
      return cit;
    };
    const form = this.settings.citationForm || "pandoc";
    const bibHit = this._matchBib({ ...anno, csl: ((_a = ctx.spec) == null ? void 0 : _a.documentId) ? (_b = this._readDocMeta(ctx.spec.documentId)) == null ? void 0 : _b.csl : null });
    const formLabel = form === "pandoc" ? bibHit ? `@${bibHit.citekey}` : "@citekey · pandoc" : form === "footnote" ? "脚注" : "行内";
    menu.addItem((it) => it.setTitle(`插入引用（${formLabel}）`).setIcon(form === "pandoc" ? "at-sign" : form === "footnote" ? "superscript" : "text-cursor-input").onClick(() => {
      this._insertAcademicCitation(citFromAnno(), form);
    }));
    if (form !== "pandoc") menu.addItem((it) => it.setTitle("改用 @citekey（pandoc）").setIcon("at-sign").onClick(() => this._insertAcademicCitation(citFromAnno(), "pandoc")));
    if (form !== "footnote") menu.addItem((it) => it.setTitle("改用脚注").setIcon("superscript").onClick(() => this._insertAcademicCitation(citFromAnno(), "footnote")));
    if (form !== "inline") menu.addItem((it) => it.setTitle("改用行内（著者-年）").setIcon("text-cursor-input").onClick(() => this._insertAcademicCitation(citFromAnno(), "inline")));
    menu.addItem((it) => it.setTitle("复制原文与出处").setIcon("link").onClick(async () => {
      const anchor = `[[${anno.doc}.pdf${anno.page ? `#page=${anno.page}` : ""}|${anno.doc}${anno.page ? ` p.${anno.page}` : ""}]]`;
      await navigator.clipboard.writeText(`> ${anno.text || ""}
> 来源：${anchor}
`);
      new obsidian12.Notice("原文与出处已复制");
    }));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle("删除标注").setIcon("trash").onClick(() => {
      var _a2;
      this._deleteAnno(anno.id);
      (_a2 = ctx.refresh) == null ? void 0 : _a2.call(ctx);
      new obsidian12.Notice("标注已删除");
    }));
    menu.showAtPosition({ x: evt.clientX, y: evt.clientY });
  }
  // ── PDF inline / hover 渲染（Markdown 后处理器调用）─────
  // 源：代码块内容是 query string，例如
  //   "library=xxx&document_id=yyy&source_file=zzz.pdf&page=3&src_path=...&hit=..."
  // 用 PDF.js 自渲染（主题化 + 跳页 + 命中段高亮）；src_path 存在则直接 fs 读盘，否则走后端
  _renderPdfEmbed(el, source, opts = {}, ctx = null) {
    const p = new URLSearchParams(String(source).replace(/^[?\s]+/, ""));
    const spec = {
      library: p.get("library") || "",
      documentId: p.get("document_id") || "",
      sourceFile: p.get("source_file") || "",
      srcPath: p.get("src_path") || "",
      page: parseInt(p.get("page")) || 1,
      hitText: p.get("hit") || ""
    };
    if (opts.inline) {
      const wrap = el.createDiv({ cls: "pb-pdfv-wrap" });
      const viewer2 = this._mountPdfViewer(wrap, spec, { inline: true });
      if ((ctx == null ? void 0 : ctx.addChild) && obsidian12.MarkdownRenderChild) {
        const child = new obsidian12.MarkdownRenderChild(el);
        child.register(() => {
          try {
            viewer2.destroy();
          } catch (_) {
          }
        });
        ctx.addChild(child);
      }
      return;
    }
    const chip = el.createSpan({ cls: "pb-pdf-hover-chip" });
    chip.textContent = "PDF（悬停预览 / 点击固定）";
    let popover = null;
    let viewer = null;
    let leaveTimer = null;
    let pinned = false;
    const showPopover = () => {
      if (popover) return;
      clearTimeout(leaveTimer);
      popover = document.body.createDiv({ cls: "pb-pdf-hover-popover" });
      const rect = chip.getBoundingClientRect();
      const w = Math.min(720, window.innerWidth - 60);
      const h = Math.min(640, window.innerHeight - 80);
      const left = Math.min(rect.left, window.innerWidth - w - 20);
      const top = Math.min(rect.bottom + 6, window.innerHeight - h - 20);
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
      popover.style.width = `${w}px`;
      popover.style.height = `${h}px`;
      const bar = popover.createDiv({ cls: "pb-pdf-hover-bar" });
      bar.createSpan({ text: "PDF 预览", cls: "pb-pdf-hover-title" });
      const pinBtn = bar.createSpan({ cls: "pb-pdf-hover-pin", attr: { title: "固定预览（点击切换）" } });
      obsidian12.setIcon(pinBtn, "pin");
      const closeBtn = bar.createSpan({
        text: "✕",
        cls: "pb-pdf-hover-close",
        attr: { title: "关闭" }
      });
      const body = popover.createDiv({ cls: "pb-pdf-hover-body" });
      viewer = this._mountPdfViewer(body, spec, {});
      pinBtn.onclick = (e) => {
        e.stopPropagation();
        pinned = !pinned;
        popover.classList.toggle("pinned", pinned);
        obsidian12.setIcon(pinBtn, pinned ? "pin-off" : "pin");
        pinBtn.setAttribute("title", pinned ? "已固定，点击解除" : "固定预览");
      };
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        pinned = false;
        hidePopover(true);
      };
      popover.onmouseenter = () => {
        clearTimeout(leaveTimer);
      };
      popover.onmouseleave = () => {
        if (pinned) return;
        leaveTimer = setTimeout(hidePopover, 250);
      };
    };
    const hidePopover = (force) => {
      if (!popover) return;
      if (pinned && !force) return;
      try {
        viewer == null ? void 0 : viewer.destroy();
      } catch (_) {
      }
      viewer = null;
      popover.remove();
      popover = null;
    };
    chip.onmouseenter = showPopover;
    chip.onmouseleave = () => {
      if (pinned) return;
      leaveTimer = setTimeout(hidePopover, 250);
    };
    chip.onclick = () => {
      if (!popover) showPopover();
      pinned = !pinned;
      if (popover) {
        popover.classList.toggle("pinned", pinned);
        const pb = popover.querySelector(".pb-pdf-hover-pin");
        if (pb) {
          obsidian12.setIcon(pb, pinned ? "pin-off" : "pin");
          pb.setAttribute("title", pinned ? "已固定，点击解除" : "固定预览");
        }
      }
    };
    if ((ctx == null ? void 0 : ctx.addChild) && obsidian12.MarkdownRenderChild) {
      const child = new obsidian12.MarkdownRenderChild(el);
      child.register(() => {
        pinned = false;
        try {
          hidePopover(true);
        } catch (_) {
        }
      });
      ctx.addChild(child);
    }
  }
  // ── PDF 懒拷贝 + LRU：从后端拉字节，写入 PaperSearch缓存/，用 Obsidian 原生阅读器打开
  // 当前活动 PDF 的页码（尽力而为）
  _currentPdfPage() {
    var _a, _b, _c, _d;
    try {
      return ((_d = (_c = (_b = (_a = this.app.workspace.activeLeaf) == null ? void 0 : _a.view) == null ? void 0 : _b.getState) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.page) || "";
    } catch (_) {
      return "";
    }
  }
  // 把一条摘录 {text, pdfStem, page} 写入对应文献笔记的「我的摘录与批注」区
  // 返回 true=成功，false=没找到笔记（保留在篮子里）
  async _fileExcerptToNote(item) {
    var _a;
    const stem = String(item.pdfStem || "").trim();
    const identity = this._resolvePaperIdentity({ item, stem, library: item.lib || "", documentId: item.docId || "", sourceFile: item.src || stem });
    let noteFile = this._findPaperNote(identity, stem);
    if (!noteFile) {
      if (!this._annoNoteInflight) this._annoNoteInflight = /* @__PURE__ */ new Map();
      const inflightKey = identity.paper_id || ((_a = identity.aliases) == null ? void 0 : _a[0]) || stem;
      if (this._annoNoteInflight.has(inflightKey)) {
        noteFile = await this._annoNoteInflight.get(inflightKey);
      } else {
        const pr = this._ensureLitNoteForAnno(item);
        this._annoNoteInflight.set(inflightKey, pr);
        try {
          noteFile = await pr;
        } finally {
          this._annoNoteInflight.delete(inflightKey);
        }
      }
      if (!noteFile) return false;
    }
    const block = this._excerptCallout(item);
    const MARKER = "## 我的摘录与批注";
    await this.app.vault.process(noteFile, (content) => {
      const idx = content.indexOf(MARKER);
      if (idx < 0) return content.trimEnd() + `

${MARKER}
${block}`;
      const after = idx + MARKER.length;
      const nextH = content.indexOf("\n## ", after);
      const insertAt = nextH < 0 ? content.length : nextH;
      return content.slice(0, insertAt).trimEnd() + "\n" + block + content.slice(insertAt);
    });
    return true;
  }
  // 标注要写进文献笔记、但该笔记还不存在时：按设置决定 静默创建 / 询问一次 / 不创建。返回 TFile 或 null。
  async _ensureLitNoteForAnno(item) {
    const mode = this.settings.annoSilentFile;
    if (mode === "never") return null;
    if (mode !== "always") {
      const ans = await new Promise((resolve) => {
        new ConfirmModal(this.app, {
          title: "这篇还没有文献笔记",
          message: `「${item.pdfStem}」还没有文献笔记。
是否自动创建一篇，并把这条批注收进去？`,
          confirmText: "创建并收录",
          cancelText: "只存到标注库",
          checkboxLabel: "以后静默处理，不再询问",
          onConfirm: (ok, checked) => resolve({ ok, checked })
        }).open();
      });
      if (ans.checked) {
        this.settings.annoSilentFile = ans.ok ? "always" : "never";
        await this.saveSettings();
      }
      if (!ans.ok) return null;
    }
    return await this._createAnnoLitNoteStub(item);
  }
  // 为一条标注新建一篇最小文献笔记（带来源元数据 + 「我的摘录与批注」小节），basename = pdfStem 以便后续命中
  async _createAnnoLitNoteStub(item) {
    var _a, _b, _c, _d;
    const stem = String(item.pdfStem || "untitled").replace(/[/\\:*?"<>|#^[\]]/g, "_").replace(/\s+/g, " ").trim().slice(0, 100) || "untitled";
    const identity = this._resolvePaperIdentity({
      item,
      stem,
      library: item.lib || "",
      documentId: item.docId || "",
      sourceFile: item.src || stem
    });
    const existing = this._findPaperNote(identity, stem);
    if (existing) return existing;
    if (!identity.paper_id) {
      new obsidian12.Notice("无法确认这篇 PDF 对应的文献，未自动创建文献笔记");
      return null;
    }
    const root = this.settings.paperLibraryDir || "PaperSearch/文献";
    let noteDir = `${root}/${stem}`;
    let notePath = `${noteDir}/${stem}.md`;
    const occupant = this.app.vault.getAbstractFileByPath(notePath);
    if (occupant) {
      const occupantId = ((_b = (_a = this.app.metadataCache.getFileCache(occupant)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.paper_id) || "";
      if (occupantId === identity.paper_id) return occupant;
      noteDir = `${root}/${stem}--${identity.paper_id.replace(/^paper-/, "").slice(0, 8)}`;
      notePath = `${noteDir}/${stem}.md`;
    }
    let cur = "";
    for (const p of noteDir.split("/")) {
      cur = cur ? `${cur}/${p}` : p;
      if (!this.app.vault.getAbstractFileByPath(cur)) await this.app.vault.createFolder(cur).catch(() => {
      });
    }
    const raceExisting = this.app.vault.getAbstractFileByPath(notePath);
    if (raceExisting) {
      const raceId = ((_d = (_c = this.app.metadataCache.getFileCache(raceExisting)) == null ? void 0 : _c.frontmatter) == null ? void 0 : _d.paper_id) || "";
      if (raceId === identity.paper_id) return raceExisting;
      new obsidian12.Notice("同名文献笔记发生身份冲突，未自动覆盖");
      return null;
    }
    const today = window.moment ? window.moment().format("YYYY-MM-DD") : "";
    const srcPdf = item.nativePdfPath || item.src || "";
    const body = [
      "---",
      "type: literature-note",
      `paper_id: "${identity.paper_id}"`,
      "paper_aliases:",
      ...identity.aliases.map((alias) => `  - "${String(alias).replace(/"/g, '\\"')}"`),
      "tags: [文献]",
      "read_status: collected",
      srcPdf ? `source_pdf: "${srcPdf}"` : "",
      item.lib ? `library: "${item.lib}"` : "",
      item.docId ? `document_id: "${String(item.docId).replace(/"/g, '\\"')}"` : "",
      item.src ? `source_file: "${String(item.src).replace(/"/g, '\\"')}"` : "",
      today ? `collected_at: ${today}` : "",
      "---",
      `# ${stem}`,
      "",
      item.nativePdfPath ? `![[${item.nativePdfPath}]]` : "",
      "",
      "## 我的摘录与批注",
      ""
    ].filter(Boolean).join("\n");
    const file = await this.app.vault.create(notePath, body);
    this._registerPaperNote(identity, file);
    new obsidian12.Notice("已创建文献笔记并收录摘录");
    return file;
  }
  // 生成一条摘录/批注块：带角色 → 角色色 Callout（彩条）+ (role:: …) 可检索字段；无角色 → 朴素引用 callout
  _excerptCallout(item) {
    const stem = item.pdfStem;
    const quoted = String(item.text || "").replace(/\s*\n\s*/g, " ").trim();
    const pg = item.page ? ` p.${item.page}` : "";
    const hasSrc = item.lib && (item.src || item.docId);
    const locator = hasSrc ? `[定位${pg}](obsidian://${PROTOCOL}?action=open-pdf&library=${encodeURIComponent(item.lib)}&docId=${encodeURIComponent(item.docId || "")}&srcFile=${encodeURIComponent(item.src || "")}${item.page ? `&page=${item.page}` : ""})` : `[[${stem}.pdf${item.page ? `#page=${item.page}` : ""}|定位${pg}]]`;
    if (item.role && item.color) {
      const ctype = "pb-c-" + String(item.color).replace("#", "").toLowerCase();
      return [
        "",
        `> [!${ctype}]+ ${item.role}${pg ? " ·" + pg : ""}`,
        `> ${quoted}`,
        "> ",
        `> — ${locator} · (role:: ${item.role})`,
        ""
      ].join("\n");
    }
    return [
      "",
      `> [!quote]+ 摘录${pg}`,
      `> ${quoted}`,
      "> ",
      `> — ${locator}`,
      ""
    ].join("\n");
  }
  _hexToRgb(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex || "").trim());
    if (!m) return "125, 125, 125";
    return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
  }
  // 注入 per-角色 Callout 配色（彩条）；markdown 用 [!pb-c-<hex>]。角色色板改了 → reload 重注入。
  _injectAnnoCalloutCss() {
    const id = "pb-anno-callout-css";
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
      this.register(() => {
        try {
          style.remove();
        } catch (_) {
        }
      });
    }
    style.textContent = this._annoRoles().map((r) => {
      const key = String(r.color).replace("#", "").toLowerCase();
      return `.callout[data-callout="pb-c-${key}"]{--callout-color:${this._hexToRgb(r.color)};--callout-icon:lucide-highlighter;}`;
    }).join("\n");
  }
  // 直接把 PDF 选中文字写入对应文献笔记（命令 / 工具条用）
  async _excerptToNote(pdfFile, selText) {
    const ok = await this._fileExcerptToNote({
      text: selText,
      pdfStem: pdfFile.basename,
      page: this._currentPdfPage()
    });
    new obsidian12.Notice(ok ? "已收入摘录" : "这篇还没有文献笔记，摘录未写入");
  }
  // ── CSL → 引文格式化（轻量内置，无需 citeproc）──────
  _formatCitation(csl, style = "apa") {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!csl) return "";
    const authors = Array.isArray(csl.author) ? csl.author : [];
    const fam = (a) => a.family || a.literal || "";
    const giv = (a) => a.given || "";
    const year = (_g = (_f = (_e = (_c = (_b = (_a = csl.issued) == null ? void 0 : _a["date-parts"]) == null ? void 0 : _b[0]) == null ? void 0 : _c[0]) != null ? _e : (_d = csl.issued) == null ? void 0 : _d.year) != null ? _f : csl.csl_issued_year) != null ? _g : "";
    const title = csl.title || "";
    const journal = csl["container-title"] || "";
    const vol = csl.volume || "", iss = csl.issue || "", pg = csl.page || "", doi = csl.DOI || "";
    const apaAuthors = () => {
      if (!authors.length) return "";
      const fmt = authors.map((a) => {
        const g = giv(a);
        const ini = g ? g.split(/\s+/).map((w) => w[0] + ".").join(" ") : "";
        return `${fam(a)}${ini ? ", " + ini : ""}`;
      });
      if (fmt.length === 1) return fmt[0];
      if (fmt.length === 2) return `${fmt[0]}, & ${fmt[1]}`;
      return fmt.slice(0, -1).join(", ") + ", & " + fmt[fmt.length - 1];
    };
    const mlaAuthors = () => {
      if (!authors.length) return "";
      const a0 = authors[0];
      let s = `${fam(a0)}${giv(a0) ? ", " + giv(a0) : ""}`;
      if (authors.length > 1) s += ", et al";
      return s;
    };
    if (style === "apa") {
      return `${apaAuthors()} (${year}). ${title}. *${journal}*${vol ? `, ${vol}` : ""}${iss ? `(${iss})` : ""}${pg ? `, ${pg}` : ""}.${doi ? ` https://doi.org/${doi}` : ""}`;
    }
    if (style === "mla") {
      return `${mlaAuthors()}. "${title}." *${journal}*${vol ? `, vol. ${vol}` : ""}${iss ? `, no. ${iss}` : ""}, ${year}${pg ? `, pp. ${pg}` : ""}.`;
    }
    if (style === "chicago") {
      return `${mlaAuthors()}. "${title}." *${journal}* ${vol}${iss ? `, no. ${iss}` : ""} (${year})${pg ? `: ${pg}` : ""}.${doi ? ` https://doi.org/${doi}` : ""}`;
    }
    if (style === "bibtex") {
      const key = csl.citekey || `${fam(authors[0] || {})}${year}`;
      return `@article{${key},
  title={${title}},
  author={${authors.map((a) => `${fam(a)}, ${giv(a)}`).join(" and ")}},
  journal={${journal}},
  year={${year}}${vol ? `,
  volume={${vol}}` : ""}${iss ? `,
  number={${iss}}` : ""}${pg ? `,
  pages={${pg}}` : ""}${doi ? `,
  doi={${doi}}` : ""}
}`;
    }
    return "";
  }
  _pickCitationStyle(cit) {
    const menu = new obsidian12.Menu();
    const styles = [
      { key: "apa", label: "APA" },
      { key: "mla", label: "MLA" },
      { key: "chicago", label: "Chicago" },
      { key: "bibtex", label: "BibTeX" }
    ];
    for (const s of styles) {
      const preview = this._formatCitation(cit.csl, s.key);
      menu.addItem((it) => it.setTitle(`${s.label}：${(preview || "").replace(/\*/g, "").slice(0, 40)}…`).onClick(async () => {
        if (!preview) {
          new obsidian12.Notice("该引用缺少 CSL 元数据，无法格式化");
          return;
        }
        await navigator.clipboard.writeText(preview);
        new obsidian12.Notice(`已复制 ${s.label} 引文`);
      }));
    }
    menu.showAtPosition({ x: window.innerWidth / 2, y: 120 });
  }
  // ── 共享 LLM 调用：credentials 向 PaperBell 请求，PaperSearch 自己发请求 ──
  async _aiChat(sys, user) {
    let out = await this._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: user }],
      temperature: 0.4,
      maxTokens: 1500
    });
    out = out.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim();
    out = out.replace(/^["“「『]+/, "").replace(/["”」』]+$/, "").trim();
    if (!out) throw new Error("模型返回空");
    return out;
  }
  // 行内 AI 改写
  async _aiRewrite(origText, instruction) {
    const sys = this.settings.rewritePrompt && this.settings.rewritePrompt.trim() || DEFAULT_REWRITE_PROMPT;
    const user = `指令：${(instruction || "改写为学术风格，保留原意").trim()}

原文：
${origText}`;
    return this._aiChat(sys, user);
  }
  // ── 学术引注：脚注 / 行内著者-年 + 参考文献表 ──────────
  // 取一条引注/标注对应的 CSL；缺元数据时回退到"仅标题"最小 CSL（仍可成文）
  _bibToCsl(bib, fallbackTitle = "") {
    const year = bib.year || (String(bib.date || "").match(/\d{4}/) || [])[0] || "";
    return {
      title: bib.title || fallbackTitle,
      author: (bib.author || "").split(/\s+and\s+/i).filter(Boolean).map((a) => {
        const p = a.split(",").map((s) => s.trim());
        return p.length === 2 ? { family: p[0], given: p[1] } : { literal: a.trim() };
      }),
      issued: year ? { "date-parts": [[year]] } : null,
      "container-title": bib.journal || bib.journaltitle || "",
      DOI: bib.doi || "",
      citekey: bib.citekey || ""
    };
  }
  _cslForCitation(cit) {
    var _a, _b, _c, _d, _e, _f;
    if ((cit == null ? void 0 : cit.csl) && (cit.csl.title || cit.csl.author && cit.csl.author.length)) return cit.csl;
    const stem = String((cit == null ? void 0 : cit.source_doc) || "").replace(/\.pdf$/i, "");
    const bib = ((_b = (_a = this.bbtIndex) == null ? void 0 : _a.byFile) == null ? void 0 : _b.get(stem.toLowerCase() + ".pdf")) || ((_d = (_c = this.bbtIndex) == null ? void 0 : _c.byFile) == null ? void 0 : _d.get(stem.toLowerCase())) || ((_f = (_e = this.bbtIndex) == null ? void 0 : _e.byTitle) == null ? void 0 : _f.get(stem.toLowerCase()));
    if (bib) return this._bibToCsl(bib, stem);
    return { title: stem || "未命名文献", author: [], issued: null, citekey: (cit == null ? void 0 : cit.citekey) || "" };
  }
  // 著者-年行内式："(Ostrom, 2009)"
  _citeAuthorYear(csl) {
    var _a, _b, _c, _d, _e, _f;
    const a = Array.isArray(csl == null ? void 0 : csl.author) ? csl.author : [];
    const year = (_f = (_e = (_c = (_b = (_a = csl == null ? void 0 : csl.issued) == null ? void 0 : _a["date-parts"]) == null ? void 0 : _b[0]) == null ? void 0 : _c[0]) != null ? _e : (_d = csl == null ? void 0 : csl.issued) == null ? void 0 : _d.year) != null ? _f : "";
    let who = "";
    if (a.length === 1) who = a[0].family || a[0].literal || "";
    else if (a.length === 2) who = `${a[0].family || a[0].literal} & ${a[1].family || a[1].literal}`;
    else if (a.length > 2) who = `${a[0].family || a[0].literal} et al.`;
    else who = (csl == null ? void 0 : csl.title) ? String(csl.title).slice(0, 20) : "佚名";
    return `(${who}${year ? `, ${year}` : ""})`;
  }
  // 稳定脚注 id：citekey 优先；清洗有损（中文 citekey 等）直接回退 cit.id，
  // 否则「张三2020」「李四2020」都清成"2020"——第二篇的脚注会静默挂到第一篇的定义上
  _footnoteId(cit, csl) {
    const raw = ((csl == null ? void 0 : csl.citekey) || (cit == null ? void 0 : cit.citekey) || "").toString();
    const cleaned = raw.replace(/[^\w-]/g, "");
    if (cleaned && cleaned === raw) return cleaned.slice(0, 32);
    return String((cit == null ? void 0 : cit.id) || "ref");
  }
  _activeMdEditor() {
    const view = this.app.workspace.getActiveViewOfType(obsidian12.MarkdownView);
    return (view == null ? void 0 : view.editor) || null;
  }
  // ── .bib 为真相源：把检索结果/标注匹配到 BBT 条目，命中即可直接 @citekey ──
  // info 可以是 row / cit / csl / docMeta；按 DOI → 文件名 → 标题 → 已有 citekey 四级匹配
  _matchBib(info) {
    var _a;
    if (!this.bbtIndex || !info) return null;
    const norm = (s) => String(s || "").toLowerCase().trim();
    const csl = info.csl || info;
    const doi = norm(info.doi || csl.DOI || info.DOI).replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
    if (doi) {
      const e = this.bbtIndex.byDoi.get(doi);
      if (e) return { entry: e, citekey: e.citekey, by: "doi" };
    }
    const stem = norm(info.source_doc || info._sourceFile || info.stem || info.doc).replace(/\.pdf$/i, "");
    if (stem) {
      const e = this.bbtIndex.byFile.get(stem + ".pdf") || this.bbtIndex.byFile.get(stem);
      if (e) return { entry: e, citekey: e.citekey, by: "file" };
    }
    const title = norm(info.title || csl.title || info.paperTitle).replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
    if (title) {
      const e = this.bbtIndex.byTitle.get(title);
      if (e) return { entry: e, citekey: e.citekey, by: "title" };
    }
    const ck = info.citekey || csl.citekey || ((_a = info.bbt) == null ? void 0 : _a.citekey);
    if (ck && this.bbtIndex.byCitekey.has(ck)) return { entry: this.bbtIndex.byCitekey.get(ck), citekey: ck, by: "citekey" };
    return null;
  }
  // 为新条目生成一个不冲突的 citekey：firstAuthorLastYearWord
  _genCitekey(csl) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const a = Array.isArray(csl.author) ? csl.author : [];
    const fam = (((_a = a[0]) == null ? void 0 : _a.family) || ((_b = a[0]) == null ? void 0 : _b.literal) || "anon").toString().toLowerCase().replace(/[^a-z]/g, "");
    const year = (_h = (_g = (_e = (_d = (_c = csl.issued) == null ? void 0 : _c["date-parts"]) == null ? void 0 : _d[0]) == null ? void 0 : _e[0]) != null ? _g : (_f = csl.issued) == null ? void 0 : _f.year) != null ? _h : "";
    let base = `${fam || "ref"}${year || ""}`;
    if (!((_i = this.bbtIndex) == null ? void 0 : _i.byCitekey)) return base;
    let key = base, i = 0;
    while (this.bbtIndex.byCitekey.has(key)) {
      key = base + String.fromCharCode(97 + i++ % 26);
      if (i > 52) {
        key = base + i;
        break;
      }
    }
    return key;
  }
  // 追加孤儿文献到 PaperSearch 自己的 paperbell.bib（独立可写；绝不写 BBT 自动导出的 .bib——那会被 Zotero 重写覆盖）
  async _appendToBib(csl) {
    const path = this._paperbellBibPath();
    if (!path) throw new Error("未配置 .bib 路径（设置 → 文献库与 Zotero → Better BibTeX）");
    const citekey = csl.citekey || this._genCitekey(csl);
    const exists = nodeFs3.existsSync(path);
    let txt = "";
    if (exists) {
      try {
        txt = nodeFs3.readFileSync(path, "utf8");
      } catch (_) {
      }
    }
    if (new RegExp(`@\\w+\\s*\\{\\s*${citekey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*,`).test(txt)) {
      return citekey;
    }
    const bib = this._formatCitation({ ...csl, citekey }, "bibtex") || `@misc{${citekey},
  title={${csl.title || ""}}
}`;
    const header = exists ? "" : "% PaperSearch 发现、尚未在 Zotero 的文献。请把本文件也加入 pandoc / enhancing-export 的 bibliography（与你的 BBT .bib 并列）。\n";
    nodeFs3.appendFileSync(path, header + (txt.endsWith("\n") || !txt ? "" : "\n") + "\n" + bib + "\n");
    this._loadBbtBib();
    return citekey;
  }
  // 插入学术引用：mode='pandoc' → [@citekey]（.bib 真相源，pandoc 渲染）；'footnote' → [^id]+定义；'inline' → (著者,年)+参考文献表
  async _insertAcademicCitation(cit, mode) {
    var _a, _b, _c;
    const editor = this._activeMdEditor();
    if (!editor) {
      new obsidian12.Notice("请先打开一篇笔记，把光标放到要插入引用的位置");
      return false;
    }
    const csl = this._cslForCitation(cit);
    const style = this.settings.bibStyle || "apa";
    const entry = this._formatCitation(csl, style) || csl.title || "文献";
    if (mode === "pandoc") {
      let citekey = ((_a = this._matchBib(cit)) == null ? void 0 : _a.citekey) || ((_b = this._matchBib(csl)) == null ? void 0 : _b.citekey);
      if (!citekey) {
        if (!((_c = this.settings.bbtBibPath) == null ? void 0 : _c.trim())) {
          new obsidian12.Notice("未配置 .bib，已改用脚注引用（设置 → 文献库与 Zotero 配好 Better BibTeX 后可用 @citekey）");
          return this._insertAcademicCitation(cit, "footnote");
        }
        const ok = await pbConfirm(this.app, {
          title: "这篇不在你的 Zotero/.bib",
          message: `「${(csl.title || cit.source_doc || "该文献").toString().slice(0, 50)}」未匹配到 Better BibTeX 条目。
是否用解析到的元数据写入独立的 paperbell.bib，并以 @citekey 引用？（不会改动你的 BBT .bib；记得把 paperbell.bib 也加进 pandoc 的 bibliography）`,
          confirmText: "写入 paperbell.bib 并引用",
          cancelText: "改用脚注"
        });
        if (!ok) return this._insertAcademicCitation(cit, "footnote");
        try {
          citekey = await this._appendToBib(csl);
        } catch (e) {
          new obsidian12.Notice("写入 paperbell.bib 失败：" + e.message);
          return false;
        }
      }
      editor.replaceSelection(`[@${citekey}]`);
      new obsidian12.Notice(`已插入 @${citekey}（pandoc；引用表由 .bib 工具链导出时生成）`);
      return true;
    }
    if (mode === "inline") {
      editor.replaceSelection(this._citeAuthorYear(csl) + " ");
      this._ensureBibEntry(editor, entry);
      new obsidian12.Notice("已插入行内引用，并登记到参考文献表");
      return true;
    }
    const fnId = this._footnoteId(cit, csl);
    editor.replaceSelection(`[^${fnId}]`);
    const doc = editor.getValue();
    const defRe = new RegExp(`^\\[\\^${fnId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]:`, "m");
    if (!defRe.test(doc)) {
      const last = editor.lastLine();
      const tail = editor.getLine(last);
      const lead = doc.endsWith("\n\n") ? "" : doc.endsWith("\n") ? "\n" : "\n\n";
      editor.replaceRange(`${lead}[^${fnId}]: ${entry}
`, { line: last, ch: tail.length });
    }
    new obsidian12.Notice("已插入脚注引用");
    return true;
  }
  // 维护「## 参考文献」区：去重追加一条（插到该节末尾，不是文档末尾——节后可能还有附录等章节）
  _ensureBibEntry(editor, entry) {
    const doc = editor.getValue();
    const norm = entry.replace(/\s+/g, " ").trim();
    const heading = "## 参考文献";
    const hIdx = doc.indexOf(heading);
    if (hIdx >= 0) {
      const nextH = doc.indexOf("\n## ", hIdx + heading.length);
      const sectionEnd = nextH < 0 ? doc.length : nextH;
      if (doc.slice(hIdx, sectionEnd).replace(/\s+/g, " ").includes(norm)) return;
      const insertAt = editor.offsetToPos ? editor.offsetToPos(sectionEnd) : null;
      const text = `${doc[sectionEnd - 1] === "\n" ? "" : "\n"}- ${entry}
`;
      if (insertAt) editor.replaceRange(text, insertAt);
      else {
        const last = editor.lastLine();
        editor.replaceRange(text, { line: last, ch: editor.getLine(last).length });
      }
    } else {
      const last = editor.lastLine();
      const tail = editor.getLine(last);
      const lead = doc.endsWith("\n\n") ? "" : doc.endsWith("\n") ? "\n" : "\n\n";
      editor.replaceRange(`${lead}${heading}

- ${entry}
`, { line: last, ch: tail.length });
    }
  }
  // 命令：扫描全文引注 → 生成/刷新「## 参考文献」表（CSL 去重排序）
  _generateBibliography() {
    var _a, _b;
    const editor = this._activeMdEditor();
    if (!editor) {
      new obsidian12.Notice("请先打开一篇笔记");
      return;
    }
    const text = editor.getValue();
    const style = this.settings.bibStyle || "apa";
    const seen = /* @__PURE__ */ new Set();
    const entries = [];
    const add = (csl) => {
      const e = this._formatCitation(csl, style) || csl.title;
      if (!e) return;
      const key = e.replace(/\s+/g, " ").trim().toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      entries.push(e);
    };
    for (const m of text.matchAll(/%%cite:([\w-]+)%%/g)) {
      const cit = this._readCitation(m[1]);
      if (cit) add(this._cslForCitation(cit));
    }
    for (const m of text.matchAll(/(?<![\w@])@(?!(?:fig|eq|tbl|sec|lst):)([A-Za-z][\w:.-]+)/g)) {
      const bib = (_b = (_a = this.bbtIndex) == null ? void 0 : _a.byCitekey) == null ? void 0 : _b.get(m[1]);
      if (bib) add(this._bibToCsl(bib));
    }
    if (!entries.length) {
      new obsidian12.Notice("没有找到可识别的引用或引用键");
      return;
    }
    entries.sort((a, b) => a.localeCompare(b));
    const block = `## 参考文献

${entries.map((e) => `- ${e}`).join("\n")}
`;
    const reSection = /(^|\n)## 参考文献[\s\S]*?(?=\n## |\n# |$)/;
    const cur = editor.getValue();
    if (reSection.test(cur)) {
      editor.setValue(cur.replace(reSection, (_m, lead) => lead + block));
    } else {
      const sep2 = cur.endsWith("\n\n") ? "" : cur.endsWith("\n") ? "\n" : "\n\n";
      editor.setValue(cur + sep2 + block);
    }
    new obsidian12.Notice(`参考文献表已生成：${entries.length} 条（${style.toUpperCase()}）`);
  }
  // ── 论断与原文支持情况核查 ─────────────────────────
  // 找光标所在的引用块：向上扫最近的 %%cite:id%%
  _citationAtCursor(editor) {
    const cur = editor.getCursor();
    for (let ln = cur.line; ln >= 0 && ln >= cur.line - 12; ln--) {
      const m = editor.getLine(ln).match(/%%cite:([\w-]+)%%/);
      if (m) {
        const cit = this._readCitation(m[1]);
        if (cit) return { ...cit, _line: ln };
      }
    }
    return null;
  }
  _upgradeLegacyCitationLineToClaim(editor, line) {
    var _a;
    if (!Number.isInteger(line) || line < 0 || line >= editor.lineCount()) return null;
    const sourceLine = editor.getLine(line);
    const ids = [...new Set([...sourceLine.matchAll(/%%cite:([\w-]+)%%/g)].map((match) => match[1]))];
    const citations = ids.map((id) => this._readCitation(id)).filter(Boolean);
    if (!citations.length || citations.length !== ids.length) return null;
    const existingId = citations.map((cit) => cit.claim_id).find((id) => {
      var _a2, _b;
      return (_b = (_a2 = this.claimIndex) == null ? void 0 : _a2.items) == null ? void 0 : _b[id];
    });
    const claimText = this._extractUserClaim(editor, line);
    if (!claimText) return null;
    if (citations.some((cit) => !String(cit.source_quote || "").trim() || cit.transform === "data")) return null;
    const documentPath = ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "";
    const claim = existingId ? this.claimIndex.items[existingId] : {
      id: this._newClaimId(),
      document_path: documentPath,
      claim_text: claimText,
      claim_hash: "",
      current_claim_hash: this._claimHash(claimText),
      fidelity: "unchecked",
      verification_state: "unchecked",
      fidelity_note: "",
      verified_at: null,
      created_at: Date.now()
    };
    if (existingId && claim.verification_state === "current") {
      this._markClaimStale(claim, "citation_anchors_changed");
    }
    claim.document_path = claim.document_path || documentPath;
    claim.citation_ids = ids;
    claim.evidence_ids = citations.map((cit) => cit.evidence_id || `legacy:${cit.id}`);
    claim.evidence_hash = this._evidenceHash(citations);
    for (const cit of citations) {
      cit.claim_id = claim.id;
      cit.document_path = cit.document_path || documentPath;
      cit.user_claim = claimText;
      this._writeCitation(cit);
    }
    this._writeClaim(claim);
    if (!sourceLine.includes(`%%claim:${claim.id}%%`)) {
      editor.replaceRange(`%%claim:${claim.id}%%`, { line, ch: 0 }, { line, ch: 0 });
    }
    return claim;
  }
  _claimAtCursor(editor) {
    var _a, _b;
    const cur = editor.getCursor();
    for (let ln = cur.line; ln >= 0 && ln >= cur.line - 12; ln--) {
      const match = editor.getLine(ln).match(/%%claim:([\w-]+)%%/);
      const claim = match ? (_b = (_a = this.claimIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[match[1]] : null;
      if (claim) return { ...claim, _line: ln };
    }
    return null;
  }
  _showClaimEvidenceStatus(editor, claim) {
    const key = claim.verification_state === "stale" ? "stale" : claim.fidelity || "unchecked";
    const meta = this._fidMeta(key);
    const reasonLabels = {
      claim_changed: "正文论断已被改写",
      claim_anchor_missing: "论断标记已被删除",
      citation_anchors_changed: "关联来源已增删或替换",
      evidence_missing: "关联来源记录已缺失",
      evidence_changed: "来源原文或出处已变化",
      evidence_quote_missing: "关联来源缺少可比对的原文",
      claim_changed_during_verification: "核查期间正文被修改，旧结果已丢弃",
      evidence_changed_during_verification: "核查期间关联来源发生变化，旧结果已丢弃",
      claim_anchor_copied: "论断标记被复制到另一篇笔记",
      claim_anchor_removed: "论断标记已从原笔记删除",
      citation_anchor_removed: "关联来源标记已从正文删除"
    };
    const verified = claim.verified_at ? new Date(claim.verified_at).toLocaleString() : "待核查";
    const reason = reasonLabels[claim.stale_reason] || claim.stale_reason || "";
    const message = [
      `状态：${meta.label}`,
      `关联来源：${(claim.citation_ids || []).length} 条`,
      `最近核查：${verified}`,
      reason ? `需要重新核查：${reason}` : "",
      claim.fidelity_note ? `核查说明：${claim.fidelity_note}` : "",
      "AI 核查仅作辅助，请结合原文复核。"
    ].filter(Boolean).join("\n");
    new ConfirmModal(this.app, {
      title: "当前论断的 AI 证据核查状态",
      message,
      confirmText: claim.verification_state === "current" ? "重新运行 AI 核查" : "用 AI 核查",
      cancelText: "关闭",
      onConfirm: (ok) => {
        var _a, _b;
        if (!ok) return;
        const stored = (_b = (_a = this.claimIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[claim.id];
        if (!stored) {
          new obsidian12.Notice("论断记录已缺失，请重新生成或关联来源");
          return;
        }
        this._verifyClaimFidelity(editor, stored, claim._line).catch((e) => new obsidian12.Notice(`AI 核查失败：${e.message}`));
      }
    }).open();
  }
  // 提取引用块里"用户写的论断"：%%cite%% 之后、下一个 %%cite%% 或空行段之前的非引文文字
  _extractUserClaim(editor, line) {
    const lines = [];
    for (let i = 0; i < editor.lineCount(); i++) lines.push(editor.getLine(i));
    return this._extractClaimFromLines(lines, line);
  }
  async _verifyCitationFidelity(editor, cit) {
    var _a, _b;
    if (!this._paperbellPlugin() && !window.registerPPBplugin) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
      return;
    }
    if (cit.claim_id && ((_b = (_a = this.claimIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[cit.claim_id])) {
      await this._verifyClaimFidelity(editor, this.claimIndex.items[cit.claim_id], cit._line);
      return;
    }
    if (cit.transform === "aggregate") {
      new obsidian12.Notice("这是聚合综述句的来源之一，请对整句做整体复核，不做单条比对");
      return;
    }
    if (!cit.source_quote || cit.transform === "data") {
      new obsidian12.Notice("该引用未关联原文片段，只能追溯到文献和页码，无法比对论断与原文");
      return;
    }
    const claim = this._upgradeLegacyCitationLineToClaim(editor, cit._line);
    if (!claim) {
      new obsidian12.Notice("未找到这条引用对应的论断文字；请在引用后写下论断，再运行 AI 核查");
      return;
    }
    await this._verifyClaimFidelity(editor, claim, cit._line);
  }
  async _llmFidelity(claim, sourceQuote) {
    const s = this.settings;
    const sys = '你是严谨的学术证据核查员。给定「用户写下的论断」和「被引文献的原文」，判断原文对论断的支持情况。返回严格 JSON：{verdict: "faithful"|"partial"|"distorted", note: "简短理由；若支持不足，指出原文实际所说"}。faithful=原文充分支持；partial=原文仅部分支持或论断有过度引申；distorted=原文不支持或含义相反。只判断支持情况，不评价论断本身对错。';
    const user = `【用户论断】
${claim}

【被引原文】
${sourceQuote || "（缺原文）"}

请判断原文对论断的支持情况：`;
    const raw = await this._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: user }],
      temperature: 0.1,
      maxTokens: 800,
      responseFormat: { type: "json_object" }
    });
    const out = JSON.parse(raw || "{}");
    return { verdict: out.verdict || "partial", note: out.note || "" };
  }
  async _verifyClaimFidelity(editor, claim, fallbackLine = 0, { show = true } = {}) {
    var _a, _b;
    const lines = [];
    for (let i = 0; i < editor.lineCount(); i++) lines.push(editor.getLine(i));
    let line = lines.findIndex((value) => value.includes(`%%claim:${claim.id}%%`));
    const invalidateAndThrow = (reason) => {
      this._markClaimStale(claim, reason);
      const messages = {
        claim_anchor_missing: "论断标记已被删除，原核查结果已失效",
        claim_anchor_copied: "该论断标记来自另一篇笔记，请在复制件中重新关联来源",
        claim_changed_during_verification: "核查期间正文已被修改，本次结果已丢弃，请重新核查",
        evidence_changed_during_verification: "核查期间关联来源已变化，本次结果已丢弃，请重新核查"
      };
      throw new Error(messages[reason] || "关联来源不完整，请修复后重新核查");
    };
    const currentPath = ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "";
    if (claim.document_path && currentPath && claim.document_path !== currentPath) {
      invalidateAndThrow("claim_anchor_copied");
    }
    if (line < 0) invalidateAndThrow("claim_anchor_missing");
    const liveClaim = this._extractClaimFromLines(lines, line);
    if (!liveClaim) throw new Error("未找到该标记对应的正文论断");
    const expectedIds = [...new Set(claim.citation_ids || [])];
    const bodyIds = [...lines[line].matchAll(/%%cite:([\w-]+)%%/g)].map((m) => m[1]);
    if (bodyIds.length !== expectedIds.length || [...bodyIds].sort().some((id, i) => id !== [...expectedIds].sort()[i])) {
      invalidateAndThrow("citation_anchors_changed");
    }
    const citations = expectedIds.map((id) => this._readCitation(id));
    if (citations.some((c) => !c)) invalidateAndThrow("evidence_missing");
    if (citations.some((c) => !String(c.source_quote || "").trim())) invalidateAndThrow("evidence_quote_missing");
    const evidence = citations;
    const requestClaimHash = this._claimHash(liveClaim);
    const requestEvidenceHash = this._evidenceHash(evidence);
    const requestCitationIds = [...expectedIds].sort().join("|");
    const requestPath = currentPath;
    const sys = [
      "你是严谨的学术证据核查员。判断一条论断是否被给定的全部来源原文共同支持。",
      '返回严格 JSON：{"verdict":"faithful|partial|distorted","note":"简短理由"}。',
      "faithful=来源原文充分支持论断；partial=仅部分支持或论断有过度引申；distorted=来源原文不支持或含义相反。",
      "必须综合判断，不得因为其中一条来源不单独覆盖整句就忽略其他来源。"
    ].join("\n");
    const evidenceText = evidence.map(
      (c, i) => `【来源原文 ${i + 1} · ${c.source_doc || "未知文献"}${c.source_page ? ` p.${c.source_page}` : ""}】
${c.source_quote}`
    ).join("\n\n");
    const raw = await this._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: `【当前正文论断】
${liveClaim}

${evidenceText}` }],
      temperature: 0.1,
      maxTokens: 800,
      responseFormat: { type: "json_object" }
    });
    const latestPath = ((_b = this.app.workspace.getActiveFile()) == null ? void 0 : _b.path) || "";
    if (requestPath && latestPath && requestPath !== latestPath) invalidateAndThrow("claim_anchor_copied");
    const latestLines = [];
    for (let i = 0; i < editor.lineCount(); i++) latestLines.push(editor.getLine(i));
    const latestLine = latestLines.findIndex((value) => value.includes(`%%claim:${claim.id}%%`));
    if (latestLine < 0) invalidateAndThrow("claim_anchor_missing");
    const latestClaim = this._extractClaimFromLines(latestLines, latestLine);
    if (this._claimHash(latestClaim) !== requestClaimHash) invalidateAndThrow("claim_changed_during_verification");
    const latestBodyIds = [...latestLines[latestLine].matchAll(/%%cite:([\w-]+)%%/g)].map((match) => match[1]);
    if ([...latestBodyIds].sort().join("|") !== requestCitationIds) invalidateAndThrow("citation_anchors_changed");
    const latestEvidence = expectedIds.map((id) => this._readCitation(id));
    if (latestEvidence.some((citation) => !citation)) invalidateAndThrow("evidence_missing");
    if (latestEvidence.some((citation) => !String(citation.source_quote || "").trim())) invalidateAndThrow("evidence_quote_missing");
    if (this._evidenceHash(latestEvidence) !== requestEvidenceHash) invalidateAndThrow("evidence_changed_during_verification");
    const parsed = JSON.parse(String(raw || "{}").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
    const verdict = ["faithful", "partial", "distorted"].includes(parsed.verdict) ? parsed.verdict : "partial";
    const note = String(parsed.note || "");
    const claimHash = requestClaimHash;
    const evidenceHash = requestEvidenceHash;
    const now = Date.now();
    Object.assign(claim, {
      claim_text: liveClaim,
      evidence_ids: latestEvidence.map((citation) => citation.evidence_id),
      claim_hash: claimHash,
      current_claim_hash: claimHash,
      evidence_hash: evidenceHash,
      fidelity: verdict,
      verification_state: "current",
      fidelity_note: note,
      verified_at: now,
      stale_at: null,
      stale_reason: ""
    });
    this._writeClaim(claim);
    for (const cit of citations) {
      Object.assign(cit, {
        user_claim: liveClaim,
        claim_hash: claimHash,
        fidelity: verdict,
        verification_state: "current",
        fidelity_note: note,
        verified_at: now,
        stale_at: null
      });
      this._writeCitation(cit);
    }
    await this.saveSettings();
    const result = { verdict, note };
    if (show) this._showFidelityResult(result, { ...citations[0], user_claim: liveClaim });
    return result;
  }
  _showFidelityResult(r, cit) {
    const map = {
      faithful: { icon: "●", label: "充分支持", cls: "pb-fid-ok" },
      partial: { icon: "●", label: "部分支持", cls: "pb-fid-warn" },
      distorted: { icon: "●", label: "不支持", cls: "pb-fid-bad" }
    };
    const m = map[r.verdict] || map.partial;
    new ConfirmModal(this.app, {
      title: `${m.icon} AI 证据核查：${m.label}`,
      message: `论断：${cit.user_claim}

原文：${(cit.source_quote || "").slice(0, 300)}

核查说明：${r.note}

AI 核查结果，请结合原文复核。`,
      confirmText: "知道了",
      cancelText: "关闭"
    }).open();
  }
  async _verifyAllCitations(editor) {
    var _a, _b, _c;
    const text = editor.getValue();
    const ids = [...new Set([...text.matchAll(/%%cite:([\w-]+)%%/g)].map((m) => m[1]))];
    if (!ids.length) {
      new obsidian12.Notice("正文中没有可核查的来源标记");
      return;
    }
    const lineOf = {};
    const lines = text.split("\n");
    lines.forEach((l, i) => {
      for (const m of l.matchAll(/%%cite:([\w-]+)%%/g)) lineOf[m[1]] = i;
    });
    const upgradedLines = /* @__PURE__ */ new Set();
    for (const id of ids) {
      const cit = this._readCitation(id);
      const line = lineOf[id];
      if (!cit || cit.claim_id || upgradedLines.has(line)) continue;
      const upgraded = this._upgradeLegacyCitationLineToClaim(editor, line);
      if (upgraded) upgradedLines.add(line);
    }
    const claimGroups = /* @__PURE__ */ new Map();
    const legacyIds = [];
    for (const id of ids) {
      const cit = this._readCitation(id);
      if ((cit == null ? void 0 : cit.claim_id) && ((_b = (_a = this.claimIndex) == null ? void 0 : _a.items) == null ? void 0 : _b[cit.claim_id])) {
        if (!claimGroups.has(cit.claim_id)) claimGroups.set(cit.claim_id, []);
        claimGroups.get(cit.claim_id).push(cit);
      } else legacyIds.push(id);
    }
    const total = claimGroups.size + legacyIds.length;
    const ntc = new obsidian12.Notice(`AI 证据核查 0/${total}…`, 0);
    const results = [];
    let done = 0;
    for (const [claimId, groupedCitations] of claimGroups) {
      const claim = this.claimIndex.items[claimId];
      done++;
      ntc.setMessage(`AI 证据核查 ${done}/${total}…`);
      try {
        const r = await this._verifyClaimFidelity(editor, claim, lineOf[(_c = groupedCitations[0]) == null ? void 0 : _c.id] || 0, { show: false });
        results.push({ cit: groupedCitations[0], claim, verdict: r.verdict, note: r.note });
      } catch (e) {
        results.push({ cit: groupedCitations[0], claim, verdict: "error", note: e.message });
      }
    }
    for (const id of legacyIds) {
      const cit = this._readCitation(id);
      if (!cit) {
        done++;
        continue;
      }
      done++;
      ntc.setMessage(`AI 证据核查 ${done}/${total}…`);
      if (cit.transform === "aggregate") {
        results.push({ cit, verdict: "aggregate" });
        continue;
      }
      if (!cit.source_quote || cit.transform === "data") {
        results.push({ cit, verdict: "no-quote" });
        continue;
      }
      results.push({ cit, verdict: "no-claim" });
    }
    await this.saveSettings();
    ntc.hide();
    const bad = results.filter((x) => x.verdict === "distorted" || x.verdict === "partial");
    const skipped = results.filter((x) => x.verdict === "no-quote" || x.verdict === "aggregate" || x.verdict === "no-claim").length;
    const errors = results.filter((x) => x.verdict === "error").length;
    const summary = `AI 证据核查完成：${results.length} 组 · 充分支持 ${results.filter((x) => x.verdict === "faithful").length} · 部分支持 ${results.filter((x) => x.verdict === "partial").length} · 不支持 ${results.filter((x) => x.verdict === "distorted").length}` + (skipped ? ` · 跳过 ${skipped}（无原文/聚合/无论断）` : "");
    const summaryWithErrors = summary + (errors ? ` · 失败 ${errors}` : "");
    if (!bad.length) {
      new obsidian12.Notice(summaryWithErrors + (errors ? "" : "，未发现部分支持或不支持") + "。请结合原文复核。");
      return;
    }
    const detail = bad.map((x) => `${x.verdict === "distorted" ? "不支持" : "部分支持"} ${x.cit.source_doc} p.${x.cit.source_page || "?"}：${x.note}`).join("\n");
    new ConfirmModal(this.app, {
      title: "AI 证据核查结果",
      message: `${summaryWithErrors}

AI 核查结果，请结合原文复核。

需要复核：
${detail}`,
      confirmText: "知道了",
      cancelText: "关闭"
    }).open();
  }
  // 摘录：把选中文字写进当前 PDF 对应的文献笔记；没有笔记则提示先收入精读
  // ════════════════════════════════════════════════════════
  //  示例库：引注贯穿 + 原文不支持论断的可加载 demo
  //  一键铺设 3 篇文献笔记 + 1 篇综述初稿（含 4 个锚定引用，
  //  第 4 条故意加入原文不支持的论断），并把 4 条引注写入 citationIndex。
  // ════════════════════════════════════════════════════════
  async _loadCitationDemo() {
    const dir = "PaperSearch/示例引用";
    const litDir = dir + "/文献";
    const mainPath = dir + "/综述初稿.md";
    if (await this.app.vault.adapter.exists(mainPath)) {
      const ok = await pbConfirm(this.app, {
        title: "示例已存在",
        message: "检测到 " + mainPath + " 已存在。重新加载会覆盖示例库的全部文件（文献笔记 + 综述初稿）。是否继续？",
        confirmText: "覆盖重建",
        cancelText: "取消"
      });
      if (!ok) return;
    }
    try {
      await this.app.vault.createFolder(dir);
    } catch (_) {
    }
    try {
      await this.app.vault.createFolder(litDir);
    } catch (_) {
    }
    const writeFile = async (path, content) => {
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing) {
        await this.app.vault.modify(existing, content);
      } else {
        try {
          await this.app.vault.create(path, content);
        } catch (_) {
          const f2 = this.app.vault.getAbstractFileByPath(path);
          if (f2) await this.app.vault.modify(f2, content);
          else await this.app.vault.adapter.write(path, content);
        }
      }
    };
    const sources = [
      {
        stem: "Ostrom_2009",
        family: "Ostrom",
        given: "Elinor",
        year: 2009,
        venue: "Science",
        title: "A General Framework for Analyzing Sustainability of Social-Ecological Systems",
        container: "Science",
        doi: "10.1126/science.1172133",
        citekey: "ostrom2009general",
        concepts: ["社会-生态系统", "多中心治理", "可持续性"],
        summary: 'Ostrom 提出社会-生态系统（SES）的多层级分析框架，强调资源系统、资源单位、治理系统与行动者之间的交互，反对"一刀切"的治理处方。该框架成为水资源公共池塘治理的重要分析工具。',
        quotes: [
          "There is no single best way to govern common-pool resources, and panaceas that impose uniform solutions tend to fail across diverse social-ecological settings.",
          "Sustainability of a resource system depends on the fit between governance arrangements and the specific attributes of the resource and the community that uses it."
        ]
      },
      {
        stem: "Gleick_2003",
        family: "Gleick",
        given: "Peter H.",
        year: 2003,
        venue: "Science",
        title: "Global Freshwater Resources: Soft-Path Solutions for the 21st Century",
        container: "Science",
        doi: "10.1126/science.1089967",
        citekey: "gleick2003global",
        concepts: ["软路径", "需求管理", "淡水资源"],
        summary: 'Gleick 提出水资源治理的"软路径"（soft path），主张在传统大型基础设施供给之外，通过需求侧管理、用水效率与分散化方案提升用水可持续性，作为对"硬路径"工程范式的补充而非完全替代。',
        quotes: [
          "The soft path complements centralized infrastructure with efficiency improvements, decentralized options, and management of water demand rather than relentless expansion of supply.",
          "Meeting future water needs will require attention to the productivity of water use, not merely to increasing the total volume of water withdrawn."
        ]
      },
      {
        stem: "Pahl-Wostl_2007",
        family: "Pahl-Wostl",
        given: "Claudia",
        year: 2007,
        venue: "Water Resources Management",
        title: "Transitions Towards Adaptive Management of Water Facing Climate and Global Change",
        container: "Water Resources Management",
        doi: "10.1007/s11269-006-9040-4",
        citekey: "pahlwostl2007transitions",
        concepts: ["适应性管理", "社会学习", "气候变化"],
        summary: "Pahl-Wostl 主张在气候与全球变化的不确定性下，水资源治理应从可预测控制范式转向适应性管理，强调社会学习、多方参与和制度灵活性，使治理体系具备从经验中学习与调整的能力。",
        quotes: [
          "Adaptive management requires social learning processes in which stakeholders develop a shared understanding and adjust management strategies in response to feedback.",
          "Rigid institutional structures hamper the capacity of water management regimes to cope with uncertainty arising from climate change."
        ]
      }
    ];
    for (const s of sources) {
      const identity = this._resolvePaperIdentity({ doi: s.doi, sourceFile: `${s.stem}.pdf`, stem: s.stem });
      s.paperIdentity = identity;
      const fm = [
        "---",
        "type: literature-note",
        `paper_id: "${identity.paper_id}"`,
        "paper_aliases:",
        ...identity.aliases.map((alias) => `  - "${alias}"`),
        'authors: "' + s.given + " " + s.family + '"',
        "year: " + s.year,
        'venue: "' + s.venue + '"',
        'csl_title: "' + s.title.replace(/"/g, '\\"') + '"',
        'csl_container_title: "' + s.container + '"',
        'csl_DOI: "' + s.doi + '"',
        "citekey: " + s.citekey,
        "concepts: [" + s.concepts.map((c) => '"' + c + '"').join(", ") + "]",
        "read_status: done",
        "---"
      ].join("\n");
      const body = [
        "",
        "# " + s.title,
        "",
        "> " + s.given + " " + s.family + "（" + s.year + "）· *" + s.container + "*",
        "",
        s.summary,
        "",
        "## 关键原文片段",
        "",
        "> " + s.quotes[0],
        "",
        "> " + s.quotes[1],
        ""
      ].join("\n");
      await writeFile(litDir + "/" + s.stem + ".md", fm + "\n" + body);
    }
    const O = sources[0], G = sources[1], P = sources[2];
    const now = Date.now();
    const mkCsl = (s) => ({
      title: s.title,
      "container-title": s.container,
      author: [{ family: s.family, given: s.given }],
      issued: { "date-parts": [[s.year]] },
      DOI: s.doi
    });
    const cites = [
      {
        id: "cite-demo-1",
        src: O,
        page: 419,
        quote: O.quotes[0],
        // 充分支持：转述"无单一最佳治理方式"
        claim: "Ostrom（2009）由此提醒我们，公共池塘资源不存在单一最优的治理方式，强加统一处方往往在多样化的社会-生态情境中失败。",
        distorted: false
      },
      {
        id: "cite-demo-2",
        src: G,
        page: 1525,
        quote: G.quotes[0],
        // 充分支持：转述软路径是"补充"而非取代
        claim: 'Gleick（2003）提出的"软路径"并非否定集中式基础设施，而是以效率提升、分散化方案与需求管理对其加以补充。',
        distorted: false
      },
      {
        id: "cite-demo-3",
        src: P,
        page: 51,
        quote: P.quotes[0],
        // 充分支持：转述适应性管理需要社会学习
        claim: "Pahl-Wostl（2007）指出，适应性管理依赖利益相关方的社会学习过程，各方据此形成共识并根据反馈调整管理策略。",
        distorted: false
      },
      {
        id: "cite-demo-4",
        src: G,
        page: 1526,
        quote: G.quotes[1],
        // 故意加入不支持项：原文说"要关注用水生产率、而非单纯增加取水量"，
        // 论断反转为"应当不惜代价持续扩大总取水量"，与原文矛盾、无中生有。
        claim: "Gleick（2003）据此主张，满足未来用水需求的唯一出路是不惜代价、持续大幅扩大总取水量，用水效率无关紧要。",
        distorted: true
      }
    ];
    for (const c of cites) {
      const claimId = c.id.replace(/^cite-/, "claim-");
      c.claimId = claimId;
      const cit = {
        id: c.id,
        claim_id: claimId,
        paper_id: c.src.paperIdentity.paper_id,
        evidence_id: `chunk:demo:${c.src.stem}:${c.id}`,
        document_path: mainPath,
        source_kind: "chunk",
        source_chunk_id: c.id,
        source_quote: c.quote,
        source_page: c.page,
        source_doc: c.src.stem,
        csl: mkCsl(c.src),
        citekey: c.src.citekey,
        user_claim: c.claim,
        transform: "quote",
        fidelity: "unchecked",
        verification_state: "unchecked",
        fidelity_note: "",
        created_at: now
      };
      this._writeCitation(cit);
      this._writeClaim({
        id: claimId,
        document_path: mainPath,
        claim_text: c.claim,
        citation_ids: [c.id],
        claim_hash: "",
        evidence_hash: "",
        fidelity: "unchecked",
        verification_state: "unchecked",
        fidelity_note: "",
        verified_at: null,
        created_at: now
      });
    }
    await this.saveSettings();
    const anchorLabel = (c) => c.src.family + " " + c.src.year + " p." + c.page;
    const block = (c, extraNote) => {
      const anchor = "[[" + c.src.stem + ".pdf#page=" + c.page + "|" + anchorLabel(c) + "]]";
      let b = "%%claim:" + c.claimId + "%%%%cite:" + c.id + "%%\n";
      b += "> " + c.quote + "\n";
      b += "> —— " + anchor + "\n";
      b += c.claim + (extraNote ? " " + extraNote : "") + "\n";
      return b;
    };
    const mainFm = [
      "---",
      "title: 综合水资源管理（IWRM）治理机制综述（示例初稿）",
      "type: longform-draft",
      "longform:",
      "  format: scenes",
      "  scenes:",
      "    - 引言",
      "    - 治理机制",
      "    - 结论",
      "---"
    ].join("\n");
    const mainBody = [
      "",
      "# 综合水资源管理治理机制：一篇示例综述",
      "",
      "> 本文是 PaperSearch 的**AI 证据核查示例**。每条内容都包含「来源原文 + 正文论断」。",
      "> 运行命令面板中的【AI 核查全文论断】即可逐条查看证据支持情况。",
      "> 其中**第 4 条故意加入了原文不支持的论断**，核查结果会显示为「不支持」。",
      "",
      "## 引言",
      "",
      '水资源治理长期在"工程供给"与"制度安排"两条线索间摆动。Ostrom 的社会-生态系统框架为理解这种多样性提供了基础。',
      "",
      block(cites[0]),
      "",
      "## 治理机制",
      "",
      "在具体机制层面，需求侧管理与适应性制度是近二十年的两条主线。",
      "",
      block(cites[1]),
      "",
      block(cites[2]),
      "",
      "## 结论",
      "",
      "综合来看，水资源治理的可持续性取决于制度安排与资源、社区属性之间的契合，而非单一处方。",
      "",
      block(cites[3], "%% 这条故意加入了原文不支持的论断，运行「AI 核查全文论断」会显示为「不支持」 %%"),
      ""
    ].join("\n");
    await writeFile(mainPath, mainFm + "\n" + mainBody);
    const mainFile = this.app.vault.getAbstractFileByPath(mainPath);
    if (mainFile) {
      await this.app.workspace.getLeaf(true).openFile(mainFile);
    }
    new obsidian12.Notice("AI 证据核查示例已加载。运行【AI 核查全文论断】，第 4 条会显示为「不支持」", 8e3);
  }
  // ── AI 转述并关联来源：把原文转述成学术行文，作为 user_claim 挂在引用块后──
  async _pbParaphraseQuote(sourceQuote) {
    const s = this.settings;
    const sys = "你是学术写作助手，把给定原文转述为简洁、不夸大的中文学术句，准确保留原意与限定条件，不添加原文没有的结论。";
    const user = `【原文】
${sourceQuote || "（缺原文）"}

请把上述原文转述为 1-2 句中文学术行文。严格返回 JSON：{"paraphrase": "转述句"}。`;
    const raw = await this._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: user }],
      temperature: 0.2,
      maxTokens: 800,
      responseFormat: { type: "json_object" }
    });
    const out = JSON.parse(raw || "{}");
    return String(out.paraphrase || "").trim();
  }
  // 入口(A)：对光标所在引用块，AI 转述原文并把转述句插到块末尾作为 user_claim
  async _paraphraseCitation(editor, cit) {
    var _a;
    if (!this._paperbellPlugin() && !window.registerPPBplugin) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
      return;
    }
    if (!cit || !cit.source_quote) {
      new obsidian12.Notice("该引用没有原文，无法转述");
      return;
    }
    const ntc = new obsidian12.Notice("AI 转述中…", 0);
    let paraphrase = "";
    try {
      paraphrase = await this._pbParaphraseQuote(cit.source_quote);
    } catch (e) {
      ntc.hide();
      new obsidian12.Notice(`转述失败：${e.message}`);
      return;
    }
    ntc.hide();
    if (!paraphrase) {
      new obsidian12.Notice("转述结果为空");
      return;
    }
    const before = editor.getValue();
    const claimId = this._newClaimId();
    const total = editor.lineCount();
    let endLine = typeof cit._line === "number" ? cit._line : editor.getCursor().line;
    if (endLine >= total) endLine = total - 1;
    if (endLine < 0) endLine = 0;
    for (let ln = endLine + 1; ln < total; ln++) {
      if (/^\s*>/.test(editor.getLine(ln))) endLine = ln;
      else break;
    }
    try {
      editor.replaceRange(`%%claim:${claimId}%%`, { line: cit._line, ch: 0 });
      const insAt = { line: endLine, ch: (editor.getLine(endLine) || "").length };
      editor.replaceRange(`
${paraphrase}
`, insAt);
      cit.claim_id = claimId;
      cit.user_claim = paraphrase;
      cit.transform = "paraphrase";
      cit.fidelity = "unchecked";
      cit.verification_state = "unchecked";
      const claim = {
        id: claimId,
        document_path: ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "",
        claim_text: paraphrase,
        citation_ids: [cit.id],
        evidence_ids: [cit.evidence_id || `legacy:${cit.id}`],
        claim_hash: "",
        current_claim_hash: this._claimHash(paraphrase),
        evidence_hash: this._evidenceHash([cit]),
        fidelity: "unchecked",
        verification_state: "unchecked",
        fidelity_note: "",
        verified_at: null,
        created_at: Date.now()
      };
      await this._commitEvidenceBackedDraft({ claims: [claim], citations: [cit] });
    } catch (e) {
      editor.setValue(before);
      new obsidian12.Notice(`来源记录保存失败，已撤回正文：${e.message}`);
      return;
    }
    new obsidian12.Notice("已插入 AI 转述并关联原文与出处");
    this._verifyCitationFidelity(editor, { ...cit, _line: cit._line }).catch((e) => new obsidian12.Notice(`AI 自动核查失败：${e.message}`));
  }
  // 入口(B)：检索/拖拽卡片直接插入「转述引用」（锚定 + 转述句作 user_claim，可校验）
  async _insertParaphrasedCitation(view, pos, cards) {
    var _a;
    if (!this._paperbellPlugin() && !window.registerPPBplugin) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
      return;
    }
    const ntc = new obsidian12.Notice(`AI 转述中 0/${cards.length}…`, 0);
    const rows = [];
    const claims = [];
    let done = 0;
    try {
      for (const d of cards) {
        const quote = String(d.origFull || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (!quote) {
          done++;
          ntc.setMessage(`AI 转述中 ${done}/${cards.length}…`);
          continue;
        }
        let paraphrase = "";
        try {
          paraphrase = await this._pbParaphraseQuote(quote);
        } catch (_) {
          paraphrase = "";
        }
        done++;
        ntc.setMessage(`AI 转述中 ${done}/${cards.length}…`);
        if (!paraphrase) continue;
        rows.push({ ...d, origFull: quote });
        claims.push({ text: paraphrase, source_numbers: [rows.length] });
      }
    } catch (e) {
      ntc.hide();
      new obsidian12.Notice(`转述失败：${e.message}`);
      return;
    }
    ntc.hide();
    if (!claims.length) {
      new obsidian12.Notice("这些卡片都没有可转述的原文片段");
      return;
    }
    const documentPath = ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "";
    const bundle = this._buildEvidenceBackedDraft({
      rows,
      claims,
      library: this.settings.lastLibrary || "default"
    }, documentPath);
    const text = "\n" + bundle.text;
    const from = Math.min(pos, view.state.doc.length);
    try {
      view.dispatch({
        changes: { from, insert: text },
        selection: { anchor: from + text.length }
      });
      view.focus();
    } catch (_) {
      new obsidian12.Notice("插入位置已失效，请重试");
      return;
    }
    try {
      await this._commitEvidenceBackedDraft(bundle);
    } catch (e) {
      try {
        view.dispatch({ changes: { from, to: from + text.length, insert: "" } });
      } catch (_) {
      }
      new obsidian12.Notice(`来源记录保存失败，已撤回正文：${e.message}`);
      return;
    }
    new obsidian12.Notice(`已插入 ${claims.length} 条 AI 转述并关联原文与出处`);
  }
  // 把一条引注对象作为锚定块插入当前活动 Markdown 笔记
  _paletteInsert(cit) {
    const view = this.app.workspace.getActiveViewOfType(obsidian12.MarkdownView);
    if (!view) {
      new obsidian12.Notice("请先打开一篇笔记");
      return;
    }
    const editor = view.editor;
    if (!editor) {
      new obsidian12.Notice("请先打开一篇笔记");
      return;
    }
    const stem = String(cit.source_doc || "").replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_");
    const page = parseInt(cit.source_page) || "";
    const quote = String(cit.source_quote || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const anchor = stem ? `[[${stem}.pdf${page ? `#page=${page}` : ""}|${stem}${page ? ` p.${page}` : ""}]]` : "（无出处）";
    const block = `%%cite:${cit.id}%%
> ${quote}
> —— ${anchor}
`;
    editor.replaceSelection(block);
    new obsidian12.Notice("已插入原文并关联出处；可在引用后写下论断，再运行 AI 核查");
  }
  // ── 事后扫描：把正文里已有的、未锚定的引用（pandoc @citekey / [[stem.pdf#page=N]]）
  //    升级为可追溯的 %%cite:id%% 锚。兼容模式下 source_quote 为空，只能篇/页级追溯。
  async _scanExistingCitations(editor) {
    var _a, _b;
    const text = editor.getValue();
    const lineStarts = [0];
    for (let i = 0; i < text.length; i++) if (text[i] === "\n") lineStarts.push(i + 1);
    const lines = text.split("\n");
    const lineOfOffset = (off) => {
      let lo = 0, hi = lineStarts.length - 1, ans = 0;
      while (lo <= hi) {
        const mid = lo + hi >> 1;
        if (lineStarts[mid] <= off) {
          ans = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      return ans;
    };
    const ANCHOR_ONLY = /^\s*%%cite:[\w-]+%%\s*$/;
    const isAlreadyAnchored = (off) => {
      const li = lineOfOffset(off);
      if (text.slice(lineStarts[li], off).includes("%%cite:")) return true;
      if (li > 0 && ANCHOR_ONLY.test(lines[li - 1])) return true;
      return false;
    };
    const lineIsBlockquote = (off) => /^\s*>/.test(lines[lineOfOffset(off)]);
    const hits = [];
    const reCite = /(?<![\w@])@(?!(?:fig|eq|tbl|sec|lst):)([A-Za-z][\w:.-]+)/g;
    let m;
    while ((m = reCite.exec(text)) !== null) {
      if (isAlreadyAnchored(m.index)) continue;
      hits.push({ index: m.index, token: m[0], kind: "citekey", citekey: m[1] });
    }
    const rePdf = /\[\[([^\]|#]+)\.pdf#page=(\d+)(?:\|[^\]]*)?\]\]/g;
    while ((m = rePdf.exec(text)) !== null) {
      if (isAlreadyAnchored(m.index)) continue;
      if (lineIsBlockquote(m.index)) continue;
      hits.push({
        index: m.index,
        token: m[0],
        kind: "pdf",
        stem: m[1],
        page: parseInt(m[2], 10) || null
      });
    }
    if (!hits.length) {
      new obsidian12.Notice("未发现可升级的已有引用（@citekey 或 [[…pdf#page=N]]）");
      return;
    }
    const lookupByCitekey = (citekey) => {
      var _a2, _b2, _c, _d, _e;
      const dmId = (_b2 = (_a2 = this.docMetaCache) == null ? void 0 : _a2.by_citekey) == null ? void 0 : _b2[citekey];
      if (dmId) {
        const dm = this._readDocMeta(dmId);
        if (dm) return dm;
      }
      const bib = (_e = (_d = (_c = this.bbtIndex) == null ? void 0 : _c.byCitekey) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, citekey);
      if (bib) return { csl: bib.csl || null, bbt: { citekey } };
      return null;
    };
    const lookupByStem = (stem) => {
      var _a2, _b2;
      const stemLower = String(stem || "").toLowerCase();
      const entries = ((_a2 = this.docMetaCache) == null ? void 0 : _a2.entries) || {};
      for (const k of Object.keys(entries)) {
        const e = entries[k];
        const keyStem = String(k).split(/[/\\]/).pop().replace(/\.pdf$/i, "").toLowerCase();
        if (keyStem === stemLower) return e;
        if (((_b2 = e == null ? void 0 : e.bbt) == null ? void 0 : _b2.citekey) && String(e.bbt.citekey).toLowerCase() === stemLower) return e;
      }
      return null;
    };
    let matched = 0;
    const unmatched = [];
    const anchored = [];
    const stagedCitations = [];
    for (const h of hits) {
      let docMeta = null;
      let citekey = "";
      let sourceDoc = "";
      if (h.kind === "citekey") {
        citekey = h.citekey;
        sourceDoc = h.citekey;
        docMeta = lookupByCitekey(h.citekey);
      } else {
        sourceDoc = h.stem;
        docMeta = lookupByStem(h.stem);
        citekey = ((_a = docMeta == null ? void 0 : docMeta.bbt) == null ? void 0 : _a.citekey) || "";
      }
      if (docMeta && (docMeta.csl || docMeta.bbt)) matched++;
      else unmatched.push(h.kind === "citekey" ? "@" + h.citekey : h.stem + ".pdf");
      const id = this._newCitationId();
      stagedCitations.push({
        id,
        document_path: ((_b = this.app.workspace.getActiveFile()) == null ? void 0 : _b.path) || "",
        anchor_state: "pending",
        source_chunk_id: "",
        source_quote: "",
        source_page: h.kind === "pdf" ? h.page || null : null,
        source_doc: sourceDoc,
        csl: (docMeta == null ? void 0 : docMeta.csl) || null,
        citekey,
        user_claim: "",
        transform: "data",
        fidelity: "unchecked",
        fidelity_note: "事后扫描：仅篇/页级可追溯，未绑定原文片段",
        created_at: Date.now()
      });
      anchored.push({ index: h.index, id });
    }
    const K = unmatched.length;
    const uniq = [...new Set(unmatched)];
    const unmatchedList = K ? "\n未匹配（建议补 BBT / 元数据）：\n" + uniq.slice(0, 20).join("\n") + (uniq.length > 20 ? "\n…（更多省略）" : "") : "";
    await new Promise((resolve) => {
      new ConfirmModal(this.app, {
        title: "已有引用检查结果",
        message: `共发现 ${hits.length} 处已有引用。
其中匹配到元数据 ${matched} 处，未匹配 ${K} 处。
可为这些位置记录出处；因未关联原文片段，只能追溯到文献和页码，暂不能进行 AI 证据核查。` + unmatchedList,
        confirmText: "知道了",
        cancelText: "关闭",
        onConfirm: () => resolve()
      }).open();
    });
    const doAnchor = await pbConfirm(this.app, {
      title: "为这些引用添加出处标记？",
      message: `是否为以上 ${hits.length} 处引用添加隐藏的出处标记？
标记不会显示在阅读视图中，原引用文字保持不变。`,
      confirmText: "添加标记",
      cancelText: "暂不处理"
    });
    if (!doAnchor) {
      new obsidian12.Notice("已取消：正文和引用记录均未改动");
      return;
    }
    if (editor.getValue() !== text) {
      new obsidian12.Notice("文档在确认期间已被修改，本次扫描已整体取消，正文和引用记录均未改动");
      return;
    }
    const before = editor.getValue();
    const previousItems = { ...this.citationIndex.items || {} };
    try {
      const withLine = anchored.map((a) => ({ id: a.id, line: editor.offsetToPos(a.index).line }));
      withLine.sort((x, y) => y.line - x.line);
      for (const a of withLine) {
        const lineStart = { line: a.line, ch: 0 };
        editor.replaceRange(`%%cite:${a.id}%%
`, lineStart, lineStart);
      }
      for (const citation of stagedCitations) {
        citation.anchor_state = "anchored";
        this.citationIndex.items[citation.id] = this._normalizeCitationIdentity(citation);
      }
      if (this._citSaveTimer) clearTimeout(this._citSaveTimer);
      this._citSaveTimer = null;
      this._citSaveScheduled = false;
      await this.saveSettings();
    } catch (error) {
      editor.setValue(before);
      this.citationIndex.items = previousItems;
      throw error;
    }
    new obsidian12.Notice(
      `已有引用检查完成：已为 ${hits.length} 处引用添加出处标记（匹配 ${matched} / 未匹配 ${K}）`
    );
  }
  // ════════════════════════════════════════════════════════
  //  多片段聚合成综述句（多引文）
  //  把若干来源片段用 AI 合成一句带编号引用标记的中文综述句，
  //  同时为每个来源落地独立可校验的 %%cite%% 锚定块。
  // ════════════════════════════════════════════════════════
  // LLM：把多段原文要点合成一句严格依据原文、带编号引用标记的中文综述句
  // quotes：string[]（按 1..n 顺序）；返回 { sentence }
  async _llmAggregateReview(quotes) {
    const s = this.settings;
    const sys = '你是文献综述助手，把多段原文要点合成一句严格依据所给原文、带编号引用标记的中文综述句，不夸大、不杜撰来源未含的结论。要求：准确保留原意与限定条件，不引入原文未提及的结论；在恰当处插入对应来源的引用标记，标记形如 [1]、[2]，编号严格对应所给原文序号；可在一处使用多个标记如 [1][3]；只输出一句话（可含分句，但语义为一句综述）。返回严格 JSON：{"sentence": "合成后的中文综述句（含 [n] 标记）"}。';
    const body = quotes.map((q, i) => `【来源 ${i + 1}】
${String(q || "（缺原文）").slice(0, 1200)}`).join("\n\n");
    const user = `请把以下 ${quotes.length} 段原文要点合成一句严格依据原文的中文综述句，并在恰当处插入对应来源的 [n] 引用标记：

${body}

请仅返回 JSON。`;
    const raw = await this._requestPaperbellCompletion({
      system: sys,
      messages: [{ role: "user", content: user }],
      temperature: 0.2,
      maxTokens: 800,
      responseFormat: { type: "json_object" }
    });
    const out = JSON.parse(raw || "{}");
    return { sentence: String(out.sentence || "").trim() };
  }
  // 把数字转成上标字符串（[1] → ¹），用于 _aggregateFromCitations 句中标记
  _pbSupNum(n) {
    const map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(n).split("").map((c) => map[c] || c).join("");
  }
  // 入口 A：从检索/拖拽卡片聚合
  // 对每个 card 新建 Citation（transform:'data'）写入索引，AI 合成综述句，
  // 正文插入：综述句 + 各来源锚定块；每条 user_claim 设为"（综述：）"+sentence
  async _aggregateCitations(view, pos, cards) {
    var _a;
    if (!this._paperbellPlugin() && !window.registerPPBplugin) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
      return;
    }
    const list = (cards || []).filter((d) => String((d == null ? void 0 : d.origFull) || "").replace(/<[^>]+>/g, "").trim());
    if (list.length < 2) {
      new obsidian12.Notice("至少需要 2 个带原文的片段才能聚合");
      return;
    }
    const sources = list.map((d) => {
      const stem = (d._sourceFile || d.title || "").replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_");
      const cy = d.paperTitle || d.title || stem;
      const page = parseInt(d.page) || "";
      const quote = String(d.origFull || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return { d, stem, cy, page, quote };
    });
    const ntc = new obsidian12.Notice("AI 合成综述句中…", 0);
    let sentence = "";
    try {
      const r = await this._llmAggregateReview(sources.map((s) => s.quote));
      sentence = r.sentence;
    } catch (e) {
      ntc.hide();
      new obsidian12.Notice(`合成失败：${e.message}`);
      return;
    }
    ntc.hide();
    if (!sentence) {
      new obsidian12.Notice("AI 未返回综述句");
      return;
    }
    const bundle = this._buildEvidenceBackedDraft({
      rows: sources.map((s) => ({ ...s.d, origFull: s.quote })),
      claims: [{ text: sentence, source_numbers: sources.map((_, i) => i + 1) }],
      library: this.settings.lastLibrary || "default"
    }, ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "");
    const text = "\n" + bundle.text;
    const from = Math.min(pos, view.state.doc.length);
    try {
      view.dispatch({
        changes: { from, insert: text },
        selection: { anchor: from + text.length }
      });
      view.focus();
    } catch (_) {
      new obsidian12.Notice("插入位置已失效，请重试");
      return;
    }
    try {
      await this._commitEvidenceBackedDraft(bundle);
    } catch (e) {
      try {
        view.dispatch({ changes: { from, to: from + text.length, insert: "" } });
      } catch (_) {
      }
      new obsidian12.Notice(`来源记录保存失败，已撤回正文：${e.message}`);
      return;
    }
    new obsidian12.Notice(`已生成综述句，并关联 ${sources.length} 条原文来源`);
  }
  // 入口 B：从已有 Citation 对象聚合（复用其 id，不新建）
  // 合成句（带上标 [1][2]…）插入光标，句后列出 [n] 对应出处；并更新各 cit.user_claim
  async _aggregateFromCitations(editor, cits) {
    var _a;
    if (!this._paperbellPlugin() && !window.registerPPBplugin) {
      new obsidian12.Notice("请先安装并启用 PaperBell 插件，并在其中完成 AI 配置");
      return;
    }
    const list = (cits || []).filter((c) => c && String(c.source_quote || "").trim());
    if (list.length < 2) {
      new obsidian12.Notice("至少需要 2 条带原文的引用才能聚合");
      return;
    }
    const ntc = new obsidian12.Notice("AI 合成综述句中…", 0);
    let sentence = "";
    try {
      const r = await this._llmAggregateReview(list.map((c) => c.source_quote));
      sentence = r.sentence;
    } catch (e) {
      ntc.hide();
      new obsidian12.Notice(`合成失败：${e.message}`);
      return;
    }
    ntc.hide();
    if (!sentence) {
      new obsidian12.Notice("AI 未返回综述句");
      return;
    }
    const supped = sentence.replace(/\[(\d+)\]/g, (whole, n) => {
      const i = parseInt(n, 10);
      return i >= 1 && i <= list.length ? this._pbSupNum(n) : whole;
    });
    const rows = list.map((c, i) => ({
      id: c.source_chunk_id || c.source_annotation_id || c.id || `source-${i + 1}`,
      origFull: c.source_quote,
      page: c.source_page,
      _docId: c.source_document_id || "",
      _sourceFile: c.source_file || c.source_doc || "",
      _library: c.source_library || this.settings.lastLibrary || "default",
      paperTitle: c.source_doc || `来源${i + 1}`,
      citekey: c.citekey || ""
    }));
    const bundle = this._buildEvidenceBackedDraft({
      rows,
      claims: [{ text: supped, source_numbers: rows.map((_, i) => i + 1) }],
      library: this.settings.lastLibrary || "default"
    }, ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "");
    const before = editor.getValue();
    editor.replaceSelection(bundle.text);
    try {
      await this._commitEvidenceBackedDraft(bundle);
    } catch (e) {
      editor.setValue(before);
      new obsidian12.Notice(`来源记录保存失败，已撤回正文：${e.message}`);
      return;
    }
    new obsidian12.Notice("已插入综述句，并保留整句与全部原文来源的关联");
  }
  async _smartCollect(pdfFile, selText) {
    const ok = await this._fileExcerptToNote({
      text: selText,
      pdfStem: pdfFile.basename,
      page: this._currentPdfPage(),
      nativePdfPath: pdfFile.path
    });
    new obsidian12.Notice(ok ? "已存入文献笔记 ✓" : "未写入（已取消建立文献笔记）");
  }
  // ── PDF 划词浮动工具条 ───────────────────────────────
  // 监听全局 selectionchange：当选区落在 PDF view 的文本层里，弹浮条
  _setupPdfSelectionToolbar() {
    this._pdfToolbarEl = null;
    const hide = () => {
      var _a;
      (_a = this._pdfToolbarEl) == null ? void 0 : _a.remove();
      this._pdfToolbarEl = null;
    };
    this._hidePdfToolbar = hide;
    const onSelChange = () => {
      var _a, _b, _c;
      if (!this.settings.pdfSelectionToolbar) return;
      const sel = window.getSelection();
      const text = (_a = sel == null ? void 0 : sel.toString()) == null ? void 0 : _a.trim();
      if (!text || text.length < 2) {
        hide();
        return;
      }
      const anchorEl = (_b = sel.anchorNode) == null ? void 0 : _b.parentElement;
      const inPdf = (_c = anchorEl == null ? void 0 : anchorEl.closest) == null ? void 0 : _c.call(anchorEl, ".pdf-viewer, .textLayer, .pdf-embed");
      const activeFile = this.app.workspace.getActiveFile();
      if (!inPdf || (activeFile == null ? void 0 : activeFile.extension) !== "pdf") {
        hide();
        return;
      }
      let rect;
      try {
        rect = sel.getRangeAt(0).getBoundingClientRect();
      } catch (_) {
        return;
      }
      if (!rect || !rect.width && !rect.height) return;
      this._showPdfToolbar(rect, activeFile, text);
    };
    this.registerDomEvent(document, "selectionchange", () => {
      clearTimeout(this._selTimer);
      this._selTimer = setTimeout(onSelChange, 250);
    });
    this.registerDomEvent(document, "mousedown", (e) => {
      if (this._pdfToolbarEl && !this._pdfToolbarEl.contains(e.target)) hide();
    });
  }
  _showPdfToolbar(rect, pdfFile, text) {
    var _a;
    (_a = this._hidePdfToolbar) == null ? void 0 : _a.call(this);
    const bar = document.body.createDiv({ cls: "pb-pdf-seltb" });
    const mk = (label, title, fn) => {
      const b = bar.createSpan({ cls: "pb-pdf-seltb-btn", text: label, attr: { title } });
      b.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
        this._hidePdfToolbar();
      };
    };
    const annoWrap = bar.createSpan({ cls: "pb-pdf-seltb-anno" });
    annoWrap.createSpan({ cls: "pb-pdf-seltb-anno-lbl", text: "标注" });
    for (const role of this._annoRoles()) {
      const dot = annoWrap.createSpan({ cls: "pb-pdf-seltb-swatch", attr: { title: role.label } });
      dot.style.background = role.color;
      dot.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      dot.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._annotateNativeSelection(pdfFile, text, role.color);
        this._hidePdfToolbar();
      };
    }
    mk("摘录", "存入这篇的文献笔记（没有笔记会按设置自动建）", () => this._smartCollect(pdfFile, text));
    mk("找相似", "用这段做向量检索（阅读反哺检索）", async () => {
      await this.activateView();
      const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
      if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) leaf.view.pushQuery(text.slice(0, 300));
    });
    const top = Math.min(rect.bottom + 6, window.innerHeight - 44);
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - 260);
    bar.style.top = `${top}px`;
    bar.style.left = `${left}px`;
    this._pdfToolbarEl = bar;
  }
  // ── 原生 PDF 标注：仅"记录角色标注"进索引（→ 悬浮面板 + 可转脚注/引用）。
  // 不在原生查看器上画彩色高亮——Obsidian 原生 PDF 文本层是 0 尺寸 + 百分比定位、
  // 滚动虚拟化，叠加高亮脆弱且难保证；彩色高亮在 PaperSearch 自己的渲染器里做（点原文 / pdf-embed）。
  _annotateNativeSelection(pdfFile, text, color) {
    var _a, _b, _c, _d, _e;
    const sel = window.getSelection();
    const stem = pdfFile.basename;
    let page = this._currentPdfPage() || 1;
    try {
      const r = (_a = sel == null ? void 0 : sel.getRangeAt) == null ? void 0 : _a.call(sel, 0);
      const startEl = r && (r.startContainer.nodeType === 3 ? r.startContainer.parentElement : r.startContainer);
      const pd = (_b = startEl == null ? void 0 : startEl.closest) == null ? void 0 : _b.call(startEl, ".page");
      page = parseInt(((_c = pd == null ? void 0 : pd.dataset) == null ? void 0 : _c.pageNumber) || ((_d = pd == null ? void 0 : pd.getAttribute) == null ? void 0 : _d.call(pd, "data-page-number"))) || page;
    } catch (_) {
    }
    const role = this._annoRoleOf(color);
    const id = this._newAnnoId();
    const paper = this._resolvePaperIdentity({ sourceFile: pdfFile.path, stem });
    this._writeAnno({
      id,
      evidence_id: `annotation:${id}`,
      paper_id: paper.paper_id,
      doc: stem,
      page,
      rects: [],
      color,
      text,
      role_id: (role == null ? void 0 : role.id) || "unspecified",
      role_label_snapshot: (role == null ? void 0 : role.label) || "未分类",
      native_pdf_path: pdfFile.path,
      created_at: Date.now()
    });
    try {
      (_e = sel == null ? void 0 : sel.removeAllRanges) == null ? void 0 : _e.call(sel);
    } catch (_) {
    }
    new obsidian12.Notice(`已标注「${(role == null ? void 0 : role.label) || "标注"}」`);
    this._fileExcerptToNote({
      text,
      pdfStem: stem,
      page,
      role: role == null ? void 0 : role.label,
      color,
      paperId: paper.paper_id,
      nativePdfPath: pdfFile.path
    }).catch(() => {
    });
  }
  async openPdfInObsidian(libName, docId, srcFile) {
    if (!libName) throw new Error("缺少文献库名");
    if (!docId && !srcFile) throw new Error("缺少 PDF 标识");
    const path = this._pdfCachePath(srcFile, docId);
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file && file.extension === "pdf")) {
      const buf = await this.api.pdfBytes(libName, docId, srcFile);
      file = await this._writePdfCache(path, buf);
    } else {
      this._touchPdfCache(path);
    }
    await this.app.workspace.getLeaf(true).openFile(file);
    return file;
  }
  // 从文献笔记的"定位"链接打开后端 PDF：弹 PDF.js 浮窗并跳到指定页。
  // 不把 .pdf 落地到 vault（避免 [[name.pdf]] 解析不到时生成鬼影 .md），与检索弹窗 _showPdfModal 同一套渲染。
  openPdfModalAt(spec) {
    var _a;
    const s = spec || {};
    if (!s.library) {
      new obsidian12.Notice("缺少文献库名");
      return;
    }
    if (!s.documentId && !s.sourceFile && !s.srcPath) {
      new obsidian12.Notice("缺少 PDF 标识，无法定位原文");
      return;
    }
    (_a = this._activePdfModalClose) == null ? void 0 : _a.call(this);
    const overlay = document.body.createDiv({ cls: "pb-pdf-modal pb-pdf-modal-body" });
    const panel = overlay.createDiv({ cls: "pb-pdf-modal-panel" });
    const bar = panel.createDiv({ cls: "pb-pdf-modal-bar" });
    bar.createSpan({ cls: "pb-pdf-modal-title", text: s.title || s.sourceFile || "原文 PDF" });
    const tools = bar.createDiv({ cls: "pb-pdf-tools" });
    const openExt = tools.createSpan({ cls: "pb-pdf-tool", text: "↗", attr: { title: "在 Obsidian 新标签页打开" } });
    const closeBtn = tools.createSpan({ cls: "pb-pdf-tool pb-pdf-modal-close", text: "✕", attr: { title: "关闭 (Esc)" } });
    const host = panel.createDiv({ cls: "pb-pdf-modal-host" });
    let viewer = this._mountPdfViewer(host, {
      library: s.library,
      documentId: s.documentId || "",
      sourceFile: s.sourceFile || "",
      srcPath: s.srcPath || "",
      page: parseInt(s.page) || 1,
      hitText: s.hitText || ""
    });
    let dock = this._mountPdfModalAnnoDock(panel, { srcPath: s.srcPath || "", sourceFile: s.sourceFile || "" }, viewer);
    const close = () => {
      try {
        dock == null ? void 0 : dock.destroy();
      } catch (_) {
      }
      try {
        viewer == null ? void 0 : viewer.destroy();
      } catch (_) {
      }
      dock = null;
      viewer = null;
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      if (this._activePdfModalClose === close) this._activePdfModalClose = null;
    };
    this._activePdfModalClose = close;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") viewer == null ? void 0 : viewer.prev();
      else if (e.key === "ArrowRight") viewer == null ? void 0 : viewer.next();
    };
    closeBtn.onclick = close;
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
    this.registerDomEvent(document, "keydown", onKey);
    this.register(close);
    openExt.onclick = async () => {
      try {
        await this.openPdfInObsidian(s.library, s.documentId, s.sourceFile);
        close();
      } catch (err) {
        new obsidian12.Notice(`打开失败：${err.message}`);
      }
    };
  }
  async _evictPdfCache() {
    var _a, _b;
    const max = (_a = this.settings.pdfCacheMax) != null ? _a : 10;
    if (max <= 0) return;
    const folder = this.app.vault.getAbstractFileByPath("PaperSearch缓存");
    if (!folder || !folder.children) return;
    const pdfs = folder.children.filter((c) => c.extension === "pdf");
    if (pdfs.length <= max) return;
    const touch = this._pdfCacheTouch || /* @__PURE__ */ new Map();
    const recency = (f) => {
      var _a2;
      return touch.has(f.path) ? 1e15 + touch.get(f.path) : ((_a2 = f.stat) == null ? void 0 : _a2.mtime) || 0;
    };
    pdfs.sort((a, b) => recency(a) - recency(b));
    const toDelete = pdfs.slice(0, pdfs.length - max);
    for (const f of toDelete) {
      try {
        await this.app.vault.delete(f);
        (_b = this._pdfCacheTouch) == null ? void 0 : _b.delete(f.path);
      } catch (_) {
      }
    }
  }
  // ── 数据源：Zotero 检测 + fs.watch ─────────────────────
  // 默认 Zotero PDF 存放位置（三平台都在 ~/Zotero/storage）
  _zoteroDefaultPath() {
    return nodePath5.join(nodeOs.homedir(), "Zotero", "storage");
  }
  // 同步检测：路径存在则视为 Zotero 安装
  _detectZoteroSync() {
    const p = this._zoteroDefaultPath();
    try {
      const st = nodeFs3.statSync(p);
      return st.isDirectory() ? p : null;
    } catch (_) {
      return null;
    }
  }
  // 起一个 fs.watcher 监听 dir 下的新增 PDF（新建文件 / 新建子目录后扫子目录）
  // 通过 _ingestQueue 累积 + 防抖通知用户
  _startSourceWatcher(libraryName, dirPath, source = "folder") {
    if (!this._watchers) this._watchers = /* @__PURE__ */ new Map();
    if (!this._ingestQueue) this._ingestQueue = /* @__PURE__ */ new Map();
    if (this._watchers.has(dirPath)) return;
    let timer = null;
    const flush = () => {
      const q = this._ingestQueue.get(libraryName);
      if (!q || q.size === 0) return;
      const files = [...q];
      q.clear();
      this._notifyPendingIngest(libraryName, files, source);
    };
    const debouncedFlush = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, 3e3);
    };
    const handleHit = (relPath) => {
      const full = nodePath5.join(dirPath, relPath);
      try {
        const st = nodeFs3.statSync(full);
        if (st.isDirectory()) {
          try {
            for (const f of nodeFs3.readdirSync(full)) {
              if (/\.pdf$/i.test(f)) {
                const p = nodePath5.join(full, f);
                if (!this._ingestQueue.get(libraryName)) this._ingestQueue.set(libraryName, /* @__PURE__ */ new Set());
                this._ingestQueue.get(libraryName).add(p);
              }
            }
          } catch (_) {
          }
        } else if (/\.pdf$/i.test(full)) {
          if (!this._ingestQueue.get(libraryName)) this._ingestQueue.set(libraryName, /* @__PURE__ */ new Set());
          this._ingestQueue.get(libraryName).add(full);
        }
      } catch (_) {
      }
      debouncedFlush();
    };
    try {
      const watcher = nodeFs3.watch(dirPath, { recursive: true }, (_evt, fname) => {
        if (fname) handleHit(fname);
      });
      watcher.on("error", (e) => console.warn("PaperSearch watcher error:", e));
      const clearTimer = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
      this._watchers.set(dirPath, { watcher, libraryName, source, clearTimer });
    } catch (e) {
      console.warn("PaperSearch: 无法启动监听", dirPath, e);
    }
  }
  _stopSourceWatcher(dirPath) {
    var _a, _b;
    const w = (_a = this._watchers) == null ? void 0 : _a.get(dirPath);
    if (!w) return;
    try {
      (_b = w.clearTimer) == null ? void 0 : _b.call(w);
    } catch (_) {
    }
    try {
      w.watcher.close();
    } catch (_) {
    }
    this._watchers.delete(dirPath);
  }
  _stopAllWatchers() {
    var _a;
    if (!this._watchers) return;
    for (const [p, w] of this._watchers) {
      try {
        (_a = w.clearTimer) == null ? void 0 : _a.call(w);
      } catch (_) {
      }
      try {
        w.watcher.close();
      } catch (_) {
      }
    }
    this._watchers.clear();
  }
  // 弹通知：「X 库检测到 N 篇新文献」，提供「加入 / 忽略」
  _notifyPendingIngest(libraryName, files, source) {
    if (!files.length) return;
    const frag = document.createDocumentFragment();
    const head = frag.createDiv();
    head.textContent = `${source === "zotero" ? "Zotero " : ""}「${libraryName}」检测到 ${files.length} 篇新 PDF`;
    const actions = frag.createDiv();
    actions.style.cssText = "margin-top:6px; display:flex; gap:8px;";
    const yes = actions.createEl("button", { text: "增量建库" });
    yes.style.cssText = "background:var(--interactive-accent); color:var(--on-accent); border:none; padding:3px 12px; border-radius:4px; cursor:pointer;";
    const no = actions.createEl("button", { text: "忽略" });
    no.style.cssText = "background:transparent; color:var(--text-muted); border:1px solid var(--background-modifier-border); padding:3px 12px; border-radius:4px; cursor:pointer;";
    const ntc = new obsidian12.Notice(frag, 12e3);
    yes.onclick = () => {
      ntc.hide();
      this._triggerAppendIngest(libraryName, files);
    };
    no.onclick = () => ntc.hide();
  }
  // 对 N 个绝对路径触发 append 建库（拼 multipart 字节体，复用现有 streamForm）
  async _triggerAppendIngest(libraryName, absPaths) {
    const fd = new FormData();
    fd.append("action", "append");
    fd.append("existing_library", libraryName);
    fd.append("ingest_mode", "raw");
    fd.append("ingest_preprocess_concurrency", "1");
    for (const p of absPaths) {
      try {
        const buf = nodeFs3.readFileSync(p);
        const blob = new Blob([buf], { type: "application/pdf" });
        const fname = nodePath5.basename(p);
        fd.append("files", blob, fname);
      } catch (e) {
        console.warn("PaperSearch: 读取失败", p, e);
      }
    }
    const job = this.buildManager.start(fd, {
      label: `向「${libraryName}」追加`,
      libName: libraryName,
      mode: "add"
    });
    await job.promise;
  }
  // 启动时按 settings.libSources 拉起 watcher
  _bootSourceWatchers() {
    var _a;
    this._stopAllWatchers();
    for (const src of (_a = this.settings.libSources) != null ? _a : []) {
      if (src.autoWatch && src.libraryName && src.path) {
        this._startSourceWatcher(src.libraryName, src.path, src.source || "folder");
      }
    }
  }
  // ── 将选中文本推送到 PaperSearch 面板 ───────────────
  _pushSelectionToPanel(text) {
    var _a;
    const editor = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor;
    if (editor) {
      this._lastEditor = editor;
      this._lastSelFrom = editor.getCursor("from");
      this._lastSelTo = editor.getCursor("to");
    }
    this.activateView().then(() => {
      const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
      if ((leaf == null ? void 0 : leaf.view) instanceof PaperSearchView) leaf.view.pushQuery(text);
    });
  }
  // ── 引注模式选择器（拖拽 drop 后触发，使用 Obsidian 原生 Menu）──
  // cards：始终为数组（单条时 length === 1）
  _showCitationPicker(x, y, cards, cmEditorView, pos) {
    const n = cards.length;
    const label = n > 1 ? `（${n} 条）` : "";
    const menu = new obsidian12.Menu();
    menu.addItem((item) => item.setTitle(`插入 AI 转述草稿${label}（未关联来源）`).setIcon("sparkles").onClick(() => this._insertCitation(cmEditorView, pos, cards, "ai")));
    menu.addItem((item) => item.setTitle(`原文引用${label}`).setIcon("quote-glyph").onClick(() => this._insertCitation(cmEditorView, pos, cards, "raw")));
    menu.addSeparator();
    menu.addItem((item) => item.setTitle(`插入原文${label}并关联出处`).setIcon("link").onClick(() => this._insertAnchoredCitation(cmEditorView, pos, cards)));
    menu.addItem((item) => item.setTitle(`AI 转述${label}并关联原文`).setIcon("wand").onClick(() => this._insertParaphrasedCitation(cmEditorView, pos, cards)));
    if (cards.length > 1) {
      menu.addItem((item) => item.setTitle("聚合成综述句（多引文）").setIcon("combine").onClick(() => this._aggregateCitations(cmEditorView, pos, cards).catch((e) => new obsidian12.Notice(`聚合失败：${e.message}`))));
    }
    menu.showAtPosition({ x, y });
  }
  // ── 锚定引用：插入带 source 锚的引用块 + 记入引注索引（可被校验）──
  _insertAnchoredCitation(view, pos, cards) {
    var _a, _b;
    const blocks = [];
    const citations = [];
    for (const d of cards) {
      const stem = (d._sourceFile || d.title || "").replace(/\.pdf$/i, "").replace(/[/\\:*?"<>|]/g, "_");
      const cy = d.paperTitle || d.title || stem;
      const page = parseInt(d.page) || "";
      const quote = String(d.origFull || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const id = this._newCitationId();
      const docMeta = this._readDocMeta(d._docId) || {};
      citations.push({
        id,
        document_path: ((_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.path) || "",
        anchor_state: "anchored",
        paper_id: this._resolvePaperIdentity({ row: d, library: d._library || this.settings.lastLibrary || "", meta: docMeta }).paper_id,
        evidence_id: `chunk:${d._library || this.settings.lastLibrary || "default"}:${d._docId || stem}:${d.id || id}`,
        source_kind: "chunk",
        source_chunk_id: d.id,
        source_quote: quote,
        source_page: page || null,
        source_doc: stem,
        source_library: d._library || this.settings.lastLibrary || "",
        source_document_id: d._docId || "",
        source_file: d._sourceFile || "",
        csl: docMeta.csl || null,
        citekey: ((_b = docMeta.bbt) == null ? void 0 : _b.citekey) || "",
        user_claim: "",
        // 用户写在块里的论断（事后可填）
        transform: "quote",
        fidelity: "unchecked",
        fidelity_note: "",
        created_at: Date.now()
      });
      const anchor = `[[${stem}.pdf${page ? `#page=${page}` : ""}|${cy}${page ? ` p.${page}` : ""}]]`;
      blocks.push(`%%cite:${id}%%
> ${quote}
> —— ${anchor}
`);
    }
    const text = "\n" + blocks.join("\n") + "\n";
    try {
      view.dispatch({
        changes: { from: pos, insert: text },
        selection: { anchor: pos + text.length }
      });
    } catch (_) {
      new obsidian12.Notice("插入位置已失效，请重试");
      return;
    }
    for (const cit of citations) this._writeCitation(cit);
    view.focus();
    new obsidian12.Notice(`已插入 ${cards.length} 条原文引用并关联出处；可在引用后写下论断，再运行 AI 核查`);
  }
  // ── 将引注文本写入编辑器 ──────────────────────────────
  // cards：始终为数组，逐条生成、顺序拼接，保持各条独立
  _insertCitation(view, pos, cards, mode) {
    var _a;
    const text = cards.map((d) => {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = CITE_TEMPLATES)[mode]) == null ? void 0 : _b.call(_a2, d)) != null ? _c : "";
    }).join("");
    if (!text) return;
    view.dispatch({
      changes: { from: pos, insert: text },
      selection: { anchor: pos + text.length }
    });
    view.focus();
    const n = cards.length;
    const modeLabel = (_a = { ai: "AI 转述草稿（未关联来源）", raw: "原文引用", mixed: "引用" }[mode]) != null ? _a : "内容";
    new obsidian12.Notice(n > 1 ? `${modeLabel}已插入（${n} 条，逐条排列）` : `${modeLabel}已插入`);
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
};
var main_default = PaperSearchPlugin;
