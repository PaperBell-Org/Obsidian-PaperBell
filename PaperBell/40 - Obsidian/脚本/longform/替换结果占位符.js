module.exports = {
  description: {
    name: "Replace placeholders from JSON",
    description: "Replace {{path.to.value}} placeholders in manuscript using a JSON file in the project folder.",
    availableKinds: ["Manuscript"],
    options: [
      {
        id: "json-file",
        name: "JSON file name",
        description: "JSON file in the project folder, e.g., results.json",
        type: "Text",
        default: "results.json",
      },
      {
        id: "start-delim",
        name: "Start delimiter",
        description: "Left delimiter of placeholders",
        type: "Text",
        default: "{{",
      },
      {
        id: "end-delim",
        name: "End delimiter",
        description: "Right delimiter of placeholders",
        type: "Text",
        default: "}}",
      },
      {
        id: "error-on-missing",
        name: "Error on missing",
        description: "If true, throw when a placeholder path is not found",
        type: "Boolean",
        default: false,
      },
      {
        id: "debug-log",
        name: "Enable debug log",
        description: "Print debug info to console for troubleshooting",
        type: "Boolean",
        default: true,
      },
    ],
  },

  /**
   * Compile step for Manuscript.
   * Reads JSON from the current project folder and replaces placeholders in the manuscript.
   *
   * @param input { contents: string }
   * @param context { kind, optionValues, projectPath, draft, app }
   * @returns { contents: string }
   */
  compile: async function (input, context) {
    const app = context.app;
    const projectPath = context.projectPath;
    const jsonFileName = String(context.optionValues["json-file"] || "results.json").trim();
    const startDelim = String(context.optionValues["start-delim"] || "{{");
    const endDelim = String(context.optionValues["end-delim"] || "}}");
    const errorOnMissing = Boolean(context.optionValues["error-on-missing"]);
    const debug = Boolean(context.optionValues["debug-log"]);

    const dlog = (...args) => { if (debug) console.log("[ReplaceJSON]", ...args); };
    dlog("Step start", { kind: context.kind, projectPath });
    dlog("Options", { jsonFileName, startDelim, endDelim, errorOnMissing });

    // Build the target file path and load JSON
    const jsonBaseName = jsonFileName.endsWith('.json') ? jsonFileName : jsonFileName + '.json';
    let jsonPath = `${projectPath}/${jsonBaseName}`;
    let file = app.vault.getAbstractFileByPath(jsonPath);
    dlog("Trying JSON path", jsonPath, Boolean(file));
    // Fallback: try projectPath/source/
    if (!file) {
      const altPath = `${projectPath}/source/${jsonBaseName}`;
      const alt = app.vault.getAbstractFileByPath(altPath);
      if (alt) {
        file = alt;
        jsonPath = altPath;
      }
      dlog("Fallback JSON path", altPath, Boolean(alt));
    }
    let data = {};
    if (file) {
      const raw = await app.vault.read(file);
      try {
        data = JSON.parse(raw);
        dlog("Loaded JSON ok", { jsonPath, topLevelKeys: Object.keys(data) });
      } catch (e) {
        throw new Error(`Invalid JSON in ${jsonPath}: ${e.message}`);
      }
    } else {
      throw new Error(`JSON file not found at ${jsonPath}`);
    }

    // Helper: resolve dot/bracket paths on an object
    function getByPath(root, pathExpr) {
      // Support a.b[0].c and a.b.c
      const tokens = [];
      let buf = "";
      for (let i = 0; i < pathExpr.length; i++) {
        const ch = pathExpr[i];
        if (ch === '.') {
          if (buf) { tokens.push(buf); buf = ""; }
        } else if (ch === '[') {
          if (buf) { tokens.push(buf); buf = ""; }
          let j = i + 1;
          let idx = "";
          while (j < pathExpr.length && pathExpr[j] !== ']') { idx += pathExpr[j++]; }
          i = j; // skip ']'
          const num = idx.trim();
          tokens.push(num);
        } else {
          buf += ch;
        }
      }
      if (buf) tokens.push(buf);

      let cur = root;
      for (const t of tokens) {
        if (cur == null) return undefined;
        // numeric index if looks like integer
        if (/^\d+$/.test(t)) {
          const idx = parseInt(t, 10);
          if (!Array.isArray(cur) || idx < 0 || idx >= cur.length) return undefined;
          cur = cur[idx];
        } else {
          cur = Object.prototype.hasOwnProperty.call(cur, t) ? cur[t] : undefined;
        }
      }
      return cur;
    }

    // Build a global regex for placeholders like {{ path.to.value }}
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${esc(startDelim)}\\s*([a-zA-Z0-9_.$\\[\\]-]+)\\s*${esc(endDelim)}`, 'g');

    // If no placeholders at all and user wants error, throw early to surface wiring issues
    dlog("Content len", input.contents.length);
    dlog("Has raw startDelim?", input.contents.indexOf(startDelim) >= 0);
    dlog("Sample head", input.contents.slice(0, 300));
    const allMatches = Array.from(input.contents.matchAll(pattern)).map(m => String(m[1] || '').trim());
    dlog("Found placeholders", { count: allMatches.length, samples: allMatches.slice(0, 10) });
    const hasAny = allMatches.length > 0;
    if (!hasAny && errorOnMissing) {
      throw new Error(`No placeholders found using delimiters ${startDelim} ... ${endDelim}`);
    }
    // reset lastIndex after test
    pattern.lastIndex = 0;

    // Replace all placeholders
    let replacementCount = 0;
    const replaced = input.contents.replace(pattern, (match, rawPath) => {
      const pathExpr = String(rawPath).trim();
      const value = getByPath(data, pathExpr);
      if (value === undefined) {
        if (errorOnMissing) {
          throw new Error(`Missing value for placeholder path: ${pathExpr}`);
        }
        dlog("Missing value", { path: pathExpr });
        return match; // leave as-is
      }
      if (value === null) return '';
      if (typeof value === 'object') {
        try { replacementCount++; dlog("Replace object", { path: pathExpr }); return JSON.stringify(value); } catch { replacementCount++; return String(value); }
      }
      replacementCount++;
      const str = String(value);
      dlog("Replace", { path: pathExpr, value: str.length > 100 ? str.slice(0, 100) + "…" : str });
      return str;
    });
    dlog("Done", { replacementCount });

    return { contents: replaced };
  },
};
