// 脚本：timeline_milestones.js
// 路径：40 - Obsidian/脚本/timeline_milestones.js
// Last Updated: Shadow DOM Isolation & Style Fix

const container = dv.el("div", "", { cls: "project-timeline-react-wrapper" });
container.style.minHeight = "500px";
container.style.width = "100%";
container.style.display = "block";
container.style.contain = "content"; // Optimization

// ---------------------------------------------------------
// Shadow DOM Setup (Style Isolation)
// ---------------------------------------------------------
const shadow = container.attachShadow({ mode: 'open' });
const mountPoint = document.createElement('div');
mountPoint.style.width = '100%';
mountPoint.style.height = '100%';
// Ensure Tailwind defaults (box-sizing) apply
mountPoint.style.boxSizing = 'border-box';
shadow.appendChild(mountPoint);

const current = dv.current();
const currentFile = app.vault.getAbstractFileByPath(current.file.path);

// Normalize Data
const rawMilestones = current.milestones || current.timeline || [];

// Helper function to convert date to string (handles Dataview DateTime objects)
function dateToString(date) {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'string') return date;
    // Handle Dataview/Luxon DateTime objects
    if (date.toISOString && typeof date.toISOString === 'function') {
        return date.toISOString().split('T')[0];
    }
    if (date.toFormat && typeof date.toFormat === 'function') {
        return date.toFormat('yyyy-MM-dd');
    }
    // Fallback: try to convert to Date and then to string
    try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
    } catch (e) {
        console.warn('Failed to convert date:', date, e);
    }
    return new Date().toISOString().split('T')[0];
}

const initialData = rawMilestones.map((m, i) => ({
    id: (i + 1).toString(),
    title: m.task || m.title || "未命名",
    startDate: dateToString(m.date || m.time),
    endDate: dateToString(m.endDate || m.date || m.time),
    status: (m.done || m.completed || m.status === 'done') ? 'completed' : (m.progress > 0 ? 'in_progress' : 'pending'),
    progress: m.progress || (m.done ? 100 : 0),
    description: m.desc || m.description || ""
}));

// Load CSS into Shadow DOM
const cssPath = "40 - Obsidian/脚本/libs/timeline-style.css";
const cssFile = app.vault.getAbstractFileByPath(cssPath);

    if (cssFile) {
        app.vault.read(cssFile).then(content => {
    const style = document.createElement("style");

            // 1. Scope Tailwind Styles (Replace :root and body with :host)
            let scopedContent = content
                .replace(/:root/g, ':host')
                .replace(/body/g, ':host');

            // 2. Map Tailwind variables to Obsidian variables
            // IMPORTANT: Append this AFTER the Tailwind content to override defaults!
            const themeOverride = `
                :host {
                    --background: var(--background-primary);
                    --foreground: var(--text-normal);

                    --card: var(--background-primary);
                    --card-foreground: var(--text-normal);

                    --popover: var(--background-secondary);
                    --popover-foreground: var(--text-normal);

                    --primary: var(--interactive-accent);
                    --primary-foreground: var(--text-on-accent);

                    --secondary: var(--background-secondary);
                    --secondary-foreground: var(--text-normal);

                    --muted: var(--background-modifier-border);
                    --muted-foreground: var(--text-muted);

                    --accent: var(--interactive-accent);
                    --accent-foreground: var(--text-on-accent);

                    --destructive: var(--text-error);
                    --destructive-foreground: var(--text-on-accent);

                    --border: var(--background-modifier-border);
                    --input: var(--background-modifier-form-field);
                    --ring: var(--interactive-accent);

                    /* Force transparent background on the host itself */
                    background-color: transparent !important;
                }

                /* Force wrapper to be transparent */
                .project-timeline-react-wrapper, .project-timeline-wrapper {
                    background-color: transparent !important;
                }

                /* Ensure text visibility in dark mode if Tailwind defaults interfere */
                :host {
                    color: var(--text-normal);
                }
            `;

            style.textContent = scopedContent + "\n" + themeOverride;
            shadow.appendChild(style);
        }).catch(err => {
            console.error("Failed to load CSS", err);
        });
    } else {
    const err = document.createElement("div");
    err.textContent = "⚠️ CSS file missing: " + cssPath;
    err.style.color = "red";
    shadow.appendChild(err);
}

// Debounce Helper
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Save Handler
const handleSave = debounce(async (newData) => {
    const newMilestones = newData.map(m => {
        const item = {
            task: m.title,
            date: m.startDate,
            done: m.status === 'completed',
            progress: m.progress
        };
        if (m.description) item.desc = m.description;
        if (m.endDate && m.endDate !== m.startDate) item.endDate = m.endDate;
        return item;
    });

    try {
        await app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
            frontmatter.milestones = newMilestones;
        });
    } catch (e) {
        console.error("Save failed", e);
    }
}, 1000);

// Load Library and Mount
const jsPath = "40 - Obsidian/脚本/libs/timeline-bundle.js";
const jsFile = app.vault.getAbstractFileByPath(jsPath);

if (jsFile) {
    const scriptId = "project-timeline-lib-umd";

    // Helper function to wait for global variable
    const waitForGlobal = (maxAttempts = 100, interval = 50) => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const check = () => {
                attempts++;

                // Try multiple access methods
                let lib = null;

                // Method 1: Direct window access
                if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
                    lib = window.ProjectTimeline;
                }
                // Method 2: globalThis access
                else if (typeof globalThis !== 'undefined' && globalThis.ProjectTimeline && typeof globalThis.ProjectTimeline.renderTimeline === 'function') {
                    lib = globalThis.ProjectTimeline;
                }
                // Method 3: Check if it's an object with default property (UMD module export)
                else if (window.ProjectTimeline && typeof window.ProjectTimeline === 'object') {
                    if (window.ProjectTimeline.default && typeof window.ProjectTimeline.default.renderTimeline === 'function') {
                        lib = window.ProjectTimeline.default;
                    } else if (typeof window.ProjectTimeline.renderTimeline === 'function') {
                        lib = window.ProjectTimeline;
                    }
                }

                if (lib && typeof lib.renderTimeline === 'function') {
                    // Ensure it's also on window for consistency
                    if (!window.ProjectTimeline || typeof window.ProjectTimeline.renderTimeline !== 'function') {
                        window.ProjectTimeline = lib;
                    }
                    resolve();
                } else if (attempts >= maxAttempts) {
                    const debugInfo = {
                        window: !!window.ProjectTimeline,
                        globalThis: typeof globalThis !== 'undefined' ? !!globalThis.ProjectTimeline : 'N/A',
                        windowType: typeof window.ProjectTimeline,
                        globalThisType: typeof globalThis !== 'undefined' ? typeof globalThis.ProjectTimeline : 'N/A',
                        windowKeys: window.ProjectTimeline ? Object.keys(window.ProjectTimeline) : [],
                        windowValue: window.ProjectTimeline ? JSON.stringify(window.ProjectTimeline).substring(0, 200) : 'null'
                    };
                    console.error("ProjectTimeline debug info:", debugInfo);
                    reject(new Error(`ProjectTimeline not found after ${maxAttempts} attempts. Debug: ${JSON.stringify(debugInfo)}`));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    };

    const loadScript = () => new Promise((resolve, reject) => {
        // Check if already loaded
        const lib = window.ProjectTimeline || (typeof globalThis !== 'undefined' ? globalThis.ProjectTimeline : null);
        if (lib && typeof lib.renderTimeline === 'function') {
            return resolve();
        }

        // Check if script tag exists
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            // Script already exists, wait for global to be set
            return waitForGlobal().then(resolve).catch(reject);
        }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = app.vault.getResourcePath(jsFile);
    script.onload = () => {
        // Script loaded - the footer injection should have set the global immediately
        // Check synchronously first (no delay needed)
        if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
            return resolve();
        }

        // If not found, wait a tiny bit (just for the footer to execute, should be instant)
        // Use requestAnimationFrame for minimal delay (one frame, ~16ms)
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => {
                if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
                    resolve();
                } else {
                    // Fallback: use waitForGlobal with shorter timeout
                    waitForGlobal(20, 10).then(resolve).catch(reject);
                }
            });
        } else {
            // No requestAnimationFrame, use minimal setTimeout
            setTimeout(() => {
                if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
                    resolve();
                } else {
                    waitForGlobal(20, 10).then(resolve).catch(reject);
                }
            }, 0);
        }
    };
    script.onerror = (e) => reject(new Error(`Failed to load script: ${e}`));
    document.head.appendChild(script);
    });

    loadScript().then(() => {
        // Try multiple ways to access the global
        let lib = null;

        // Method 1: Direct window access
        if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
            lib = window.ProjectTimeline;
        }
        // Method 2: globalThis access
        else if (typeof globalThis !== 'undefined' && globalThis.ProjectTimeline && typeof globalThis.ProjectTimeline.renderTimeline === 'function') {
            lib = globalThis.ProjectTimeline;
        }
        // Method 3: Check if it's an object with empty keys (UMD wrapper issue)
        // Try to manually populate it from the module exports
        else if (window.ProjectTimeline && typeof window.ProjectTimeline === 'object') {
            const keys = Object.keys(window.ProjectTimeline);
            console.log("ProjectTimeline keys:", keys);
            console.log("ProjectTimeline object:", window.ProjectTimeline);

            // Try to access renderTimeline from the module exports
            if (window.ProjectTimeline.default && typeof window.ProjectTimeline.default.renderTimeline === 'function') {
                lib = window.ProjectTimeline.default;
                // Also populate the main object
                Object.assign(window.ProjectTimeline, window.ProjectTimeline.default);
            } else if (window.ProjectTimeline.renderTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
                lib = window.ProjectTimeline;
            } else {
                // Last resort: try to find renderTimeline in the global scope
                // UMD wrapper might have set it as Qe.renderTimeline
                // Check if we can access it via the script's execution context
                console.warn("ProjectTimeline object is empty, attempting manual fix...");

                // Wait for setTimeout(0) in entry.tsx to execute (Object.assign fix)
                // Try multiple times with increasing delays
                let retryCount = 0;
                const maxRetries = 10;
                const retryInterval = 50;

                const retryCheck = () => {
                    retryCount++;
                    if (window.ProjectTimeline && typeof window.ProjectTimeline.renderTimeline === 'function') {
                        lib = window.ProjectTimeline;
                        mountComponent();
                    } else if (retryCount < maxRetries) {
                        setTimeout(retryCheck, retryInterval);
                    } else {
                        // Final attempt: try to manually populate from default export
                        console.error("Failed to find ProjectTimeline after retries, attempting manual population");
                        if (window.ProjectTimeline && typeof window.ProjectTimeline === 'object') {
                            // Try to get renderTimeline from the module's default export
                            // This is a last resort hack
                            try {
                                const scriptElement = document.getElementById(scriptId);
                                if (scriptElement) {
                                    // The UMD wrapper sets Qe.default and Qe.renderTimeline
                                    // We can't directly access Qe, but we can try to access via eval
                                    // Actually, let's just show an error with instructions
                                    showError();
                                } else {
                                    showError();
                                }
                            } catch (e) {
                                showError();
                            }
                        } else {
                            showError();
                        }
                    }
                };

                setTimeout(retryCheck, retryInterval);
                return; // Exit early, will retry in setTimeout
            }
        }

        mountComponent();

        function mountComponent() {
            if (lib && typeof lib.renderTimeline === 'function') {
                try {
                    // Mount into Shadow DOM mountPoint
                    lib.renderTimeline(mountPoint, {
                        initialData: initialData,
                        onSave: handleSave
                    });
                } catch (err) {
                    console.error("Error mounting React component:", err);
                    const errDiv = document.createElement("div");
                    errDiv.textContent = `Error mounting component: ${err.message}`;
                    shadow.appendChild(errDiv);
                }
            } else {
                showError();
            }
        }

        function showError() {
            const errDiv = document.createElement("div");
            errDiv.innerHTML = `Error: Library loaded but 'ProjectTimeline' global not found.<br>
                Debug info:<br>
                - window.ProjectTimeline exists: ${!!window.ProjectTimeline}<br>
                - window.ProjectTimeline type: ${typeof window.ProjectTimeline}<br>
                - window.ProjectTimeline keys: ${window.ProjectTimeline ? Object.keys(window.ProjectTimeline).join(', ') : 'N/A'}<br>
                - globalThis.ProjectTimeline exists: ${typeof globalThis !== 'undefined' ? !!globalThis.ProjectTimeline : 'N/A'}<br>
                - Attempting to manually fix...`;
            shadow.appendChild(errDiv);
        }
    }).catch(e => {
        console.error(e);
        const errDiv = document.createElement("div");
        errDiv.textContent = `Failed to load timeline component: ${e.message || e}`;
        shadow.appendChild(errDiv);
    });
} else {
    const errDiv = document.createElement("div");
    errDiv.textContent = `Library not found at ${jsPath}.`;
    shadow.appendChild(errDiv);
}
