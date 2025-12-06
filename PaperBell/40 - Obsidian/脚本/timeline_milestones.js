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
const initialData = rawMilestones.map((m, i) => ({
    id: (i + 1).toString(),
    title: m.task || m.title || "未命名",
    startDate: m.date || m.time || new Date().toISOString().split('T')[0],
    endDate: m.endDate || m.date || new Date().toISOString().split('T')[0],
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

    const loadScript = () => new Promise((resolve, reject) => {
        if (window.ProjectTimeline && window.ProjectTimeline.renderTimeline) {
            return resolve();
        }

        // Check if script tag exists
        if (document.getElementById(scriptId)) {
             // Wait a bit or resolve? Assuming loaded.
             return resolve();
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = app.vault.getResourcePath(jsFile);
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
    });

    loadScript().then(() => {
        if (window.ProjectTimeline && window.ProjectTimeline.renderTimeline) {
            try {
                // Mount into Shadow DOM mountPoint
                window.ProjectTimeline.renderTimeline(mountPoint, {
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
            const errDiv = document.createElement("div");
            errDiv.textContent = "Error: Library loaded but 'ProjectTimeline' global not found.";
            shadow.appendChild(errDiv);
        }
    }).catch(e => {
        console.error(e);
        const errDiv = document.createElement("div");
        errDiv.textContent = "Failed to load timeline component.";
        shadow.appendChild(errDiv);
    });
} else {
    const errDiv = document.createElement("div");
    errDiv.textContent = `Library not found at ${jsPath}.`;
    shadow.appendChild(errDiv);
}
