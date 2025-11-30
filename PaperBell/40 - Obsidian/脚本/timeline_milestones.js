// 脚本：timeline_milestones.js
// 路径：40 - Obsidian/脚本/timeline_milestones.js
// Last Updated: Smooth Animation & Deferred Save

const current = dv.current();
const currentFile = app.vault.getAbstractFileByPath(current.file.path);
const milestones = current.milestones || current.timeline || [];

// ---------------------------------------------------------
// Helper: 自定义里程碑表单 (纯 DOM 实现)
// ---------------------------------------------------------
function showMilestoneForm(callback) {
    const modal = document.createElement("div");
    Object.assign(modal.style, {
        position: "fixed", left: "0", top: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: "9999",
        display: "flex", justifyContent: "center", alignItems: "center"
    });

    const content = document.createElement("div");
    Object.assign(content.style, {
        backgroundColor: "var(--background-primary)", padding: "20px", borderRadius: "10px",
        width: "350px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", border: "1px solid var(--background-modifier-border)",
        display: "flex", flexDirection: "column", gap: "10px"
    });

    const titleEl = document.createElement("h3");
    titleEl.textContent = "添加里程碑";
    titleEl.style.marginTop = "0";

    // Inputs
    const createInput = (placeholder, value = "") => {
        const i = document.createElement("input");
        i.type = "text"; i.style.width = "100%"; i.placeholder = placeholder; i.value = value;
        return i;
    };

    const nameInput = createInput("任务名称 (必填)");
    const dateInput = createInput("日期 (YYYY-MM-DD)", new Date().toISOString().split('T')[0]);
    const descInput = createInput("描述 (可选)");

    // Buttons
    const btnBox = document.createElement("div");
    btnBox.style.marginTop = "10px"; btnBox.style.textAlign = "right";

    const okBtn = document.createElement("button");
    okBtn.textContent = "确定"; okBtn.className = "mod-cta";
    okBtn.onclick = () => {
        if (callback) callback(nameInput.value, dateInput.value, descInput.value);
        document.body.removeChild(modal);
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "取消"; cancelBtn.style.marginLeft = "10px";
    cancelBtn.onclick = () => document.body.removeChild(modal);

    // Assembly
    content.appendChild(titleEl);
    content.appendChild(document.createTextNode("名称:"));
    content.appendChild(nameInput);
    content.appendChild(document.createTextNode("日期:"));
    content.appendChild(dateInput);
    content.appendChild(document.createTextNode("描述:"));
    content.appendChild(descInput);

    btnBox.appendChild(okBtn);
    btnBox.appendChild(cancelBtn);
    content.appendChild(btnBox);
    modal.appendChild(content);
    document.body.appendChild(modal);
    setTimeout(() => nameInput.focus(), 50);
}

// ---------------------------------------------------------
// Main Logic
// ---------------------------------------------------------

const container = dv.el("div", "", { cls: "timeline-container" });

const style = document.createElement("style");
style.textContent = `
    .timeline-container { position: relative; margin: 20px 0 30px 20px; padding-left: 20px; border-left: 2px solid var(--interactive-accent); }
    .timeline-item { position: relative; margin-bottom: 20px; user-select: none; }
    .timeline-item:last-child { margin-bottom: 0; }

    /* Dot Logic */
    .timeline-dot {
        position: absolute; left: -29px; top: 5px; width: 16px; height: 16px;
        border-radius: 50%; background-color: var(--background-primary);
        border: 3px solid var(--text-muted); z-index: 1; transition: all 0.3s ease;
        cursor: pointer;
    }
    .timeline-dot:hover { transform: scale(1.2); }

    /* Content Logic */
    .timeline-content {
        background-color: var(--background-secondary); padding: 12px 16px;
        border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border: 1px solid var(--background-modifier-border); transition: all 0.2s;
        position: relative; overflow: hidden; cursor: pointer;
    }
    .timeline-item:hover .timeline-content { transform: translateX(5px); border-color: var(--interactive-accent); }

    /* Progress Bar Background */
    .timeline-progress-bg {
        position: absolute; left: 0; top: 0; height: 100%; width: 0%;
        background-color: var(--interactive-accent); opacity: 0.1;
        transition: width 0.05s linear; pointer-events: none;
    }

    /* States */
    .timeline-item.not-started .timeline-dot { border-color: var(--text-muted); background-color: var(--background-primary); }

    .timeline-item.in-progress .timeline-dot { border-color: var(--interactive-accent); background-color: var(--background-primary); }
    .timeline-item.in-progress .timeline-content { border-left: 4px solid var(--interactive-accent); }

    .timeline-item.completed .timeline-dot { border-color: var(--interactive-accent); background-color: var(--interactive-accent); }
    .timeline-item.completed .timeline-title { text-decoration: line-through; opacity: 0.8; }
    .timeline-item.completed .timeline-progress-bg { width: 100% !important; opacity: 0.2; }

    .timeline-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; gap: 8px; position: relative; z-index: 2; }
    .timeline-title { font-weight: 700; font-size: 1.05em; color: var(--text-normal); }
    .timeline-date {
        font-size: 0.85em; color: var(--text-muted); font-family: var(--font-monospace);
        background-color: var(--background-primary); padding: 2px 6px; border-radius: 4px;
    }
    .timeline-desc { font-size: 0.95em; color: var(--text-muted); line-height: 1.5; margin: 0; position: relative; z-index: 2; }
    .timeline-add-btn {
        margin-top: 15px; padding: 5px 12px; border-radius: 15px;
        background-color: var(--background-secondary); border: 1px dashed var(--text-muted);
        color: var(--text-muted); font-size: 0.85em; cursor: pointer;
        transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px;
    }
    .timeline-add-btn:hover { background-color: var(--interactive-accent); border-color: var(--interactive-accent); color: var(--text-on-accent); }
`;
container.appendChild(style);

// Helper to update frontmatter
async function updateMilestone(index, updates) {
    try {
        await app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
            const list = frontmatter.milestones || frontmatter.timeline;
            if (list && list[index]) {
                Object.assign(list[index], updates);

                // Normalize logic
                if (list[index].progress >= 100) {
                    list[index].done = true;
                    list[index].progress = 100;
                } else if (list[index].progress < 100 && list[index].progress > 0) {
                    list[index].done = false;
                } else if (list[index].progress <= 0) {
                    list[index].done = false;
                    list[index].progress = 0;
                }
            }
        });
    } catch (e) {
        console.error("Failed to update milestone", e);
        new Notice("更新失败");
    }
}

if (milestones.length > 0) {
    milestones.forEach((item, index) => {
        // Normalize Item Data
        let title = item.task || item.title || "未命名";
        let date = item.date || item.time || "";
        let desc = item.desc || item.description || "";
        let progress = item.progress || 0;
        let isDone = item.done === true || item.completed === true || item.status === 'done';

        // Determine Initial State
        let state = 'not-started';
        if (isDone) {
            state = 'completed';
            progress = 100;
        } else if (progress > 0) {
            state = 'in-progress';
        }

        // Create DOM
        const itemDiv = document.createElement("div");
        itemDiv.className = `timeline-item ${state}`;

        const dot = document.createElement("div");
        dot.className = "timeline-dot";

        const contentDiv = document.createElement("div");
        contentDiv.className = "timeline-content";

        const progressBg = document.createElement("div");
        progressBg.className = "timeline-progress-bg";
        progressBg.style.width = `${progress}%`;
        contentDiv.appendChild(progressBg);

        contentDiv.innerHTML += `
            <div class="timeline-header">
                <span class="timeline-title">${title}</span>
                ${date ? `<span class="timeline-date">${date}</span>` : ''}
            </div>
            ${desc ? `<p class="timeline-desc">${desc}</p>` : ''}
        `;

        // ---------------- Helper: Update Visuals Immediately ----------------
        const updateVisuals = () => {
            itemDiv.className = `timeline-item ${state}`;
            progressBg.style.width = `${progress}%`;
        };

        // ---------------- Interactions ----------------
        let pressTimer = null;
        let startProgress = progress;
        let isPressing = false;

        const startPress = (e) => {
            if (e.button !== 0) return;
            if (state === 'completed') return;

            isPressing = true;
            startProgress = progress;

            // If starting from scratch, immediate visual update
            if (state === 'not-started') {
                state = 'in-progress';
                progress = 10;
                updateVisuals();
            }

            // Faster animation loop (30ms)
            pressTimer = setInterval(() => {
                if (progress < 100) {
                    progress += 1.5; // 1.5% per 30ms = 50% per second (approx 2s to fill)

                    if (progress >= 100) {
                         progress = 100;
                         state = 'completed';
                         clearInterval(pressTimer);
                         updateVisuals();
                         // Completion saves immediately
                         updateMilestone(index, { progress: 100, done: true });
                         new Notice("🎉 里程碑完成！");
                         isPressing = false;
                    } else {
                        updateVisuals();
                    }
                }
            }, 30);
        };

        const endPress = () => {
            if (!isPressing) return;
            isPressing = false;
            clearInterval(pressTimer);

            // Only save if progress changed and not completed (completed handled in interval)
            if (state !== 'completed' && progress !== startProgress) {
                 // Round to integer to keep YAML clean
                 progress = Math.floor(progress);
                 updateMilestone(index, { progress: progress, done: false });
            }
        };

        const handleRightClick = (e) => {
            e.preventDefault();
            if (state === 'in-progress') {
                progress = Math.max(0, progress - 10);
                if (progress === 0) state = 'not-started';
                updateVisuals();
                updateMilestone(index, { progress: progress, done: false });
                new Notice(`进度回退: ${progress}%`);
            } else if (state === 'completed') {
                progress = 90;
                state = 'in-progress';
                updateVisuals();
                updateMilestone(index, { progress: 90, done: false });
                new Notice("已撤销完成状态");
            }
        };

        let lastRightClick = 0;
        const handleContext = (e) => {
            e.preventDefault();
            const now = Date.now();
            // Double Right Click: Reset to 0
            if (now - lastRightClick < 300) {
                progress = 0;
                state = 'not-started';
                updateVisuals();
                updateMilestone(index, { progress: 0, done: false });
                new Notice("已重置为未开始");
            } else {
                handleRightClick(e);
            }
            lastRightClick = now;
        };

        // Bind Events
        contentDiv.onmousedown = startPress;
        contentDiv.onmouseup = endPress;
        contentDiv.onmouseleave = endPress;
        contentDiv.oncontextmenu = handleContext;

        itemDiv.appendChild(dot);
        itemDiv.appendChild(contentDiv);
        container.appendChild(itemDiv);
    });
} else {
    const emptyTip = dv.el("div", "*暂无里程碑，点击下方按钮添加*", { cls: "timeline-empty" });
    emptyTip.style.color = "var(--text-muted)"; emptyTip.style.fontStyle = "italic"; emptyTip.style.marginBottom = "10px";
    container.appendChild(emptyTip);
}

// 添加 "+" 按钮
const addBtn = document.createElement("button");
addBtn.className = "timeline-add-btn";
addBtn.innerHTML = "<span>+</span> 添加里程碑";
addBtn.onclick = () => {
    showMilestoneForm(async (name, date, desc) => {
        if (!name) return;
        const newMilestone = { task: name, date: date, done: false, progress: 0 };
        if (desc) newMilestone.desc = desc;
        try {
            await app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
                if (!frontmatter.milestones) frontmatter.milestones = [];
                frontmatter.milestones.push(newMilestone);
            });
            new Notice(`已添加里程碑：${name}`);
        } catch (e) { console.error(e); new Notice("添加失败"); }
    });
};

container.appendChild(addBtn);
