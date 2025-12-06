// 脚本：navigation_buttons.js
// 路径：40 - Obsidian/脚本/navigation_buttons.js
// Last Updated: Fix Prompt Issue (Pure DOM)

const current = dv.current();
const nav = current.navigation || [];
const currentFile = app.vault.getAbstractFileByPath(current.file.path);

// ---------------------------------------------------------
// Helper: 自定义输入弹窗 (纯 DOM 实现，无依赖)
// ---------------------------------------------------------
function showInputModal(title, placeholder, callback) {
    const modal = document.createElement("div");
    Object.assign(modal.style, {
        position: "fixed", left: "0", top: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: "9999",
        display: "flex", justifyContent: "center", alignItems: "center"
    });

    const content = document.createElement("div");
    Object.assign(content.style, {
        backgroundColor: "var(--background-primary)", padding: "20px", borderRadius: "10px",
        width: "300px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", border: "1px solid var(--background-modifier-border)"
    });

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.style.marginTop = "0";

    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.placeholder = placeholder;

    const btnBox = document.createElement("div");
    btnBox.style.marginTop = "15px";
    btnBox.style.textAlign = "right";

    const okBtn = document.createElement("button");
    okBtn.textContent = "确定";
    okBtn.className = "mod-cta";
    okBtn.onclick = () => {
        if (callback) callback(input.value);
        document.body.removeChild(modal);
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "取消";
    cancelBtn.style.marginLeft = "10px";
    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    input.onkeydown = (e) => {
        if (e.key === "Enter") okBtn.click();
        if (e.key === "Escape") cancelBtn.click();
    };

    btnBox.appendChild(okBtn);
    btnBox.appendChild(cancelBtn);
    content.appendChild(titleEl);
    content.appendChild(input);
    content.appendChild(btnBox);
    modal.appendChild(content);
    document.body.appendChild(modal);
    setTimeout(() => input.focus(), 50);
}

// ---------------------------------------------------------
// Main Logic
// ---------------------------------------------------------

    const container = dv.el("div", "", { cls: "nav-buttons-container" });

    const style = document.createElement("style");
    style.textContent = `
    .nav-buttons-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px; }
        .nav-btn {
        display: inline-flex; align-items: center; padding: 6px 16px; border-radius: 20px;
        background-color: var(--interactive-accent); color: var(--text-on-accent) !important;
        text-decoration: none !important; font-weight: 600; font-size: 0.9em;
        transition: transform 0.2s, box-shadow 0.2s; border: 1px solid transparent; line-height: 1.4; cursor: pointer;
        }
    .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); color: var(--text-on-accent) !important; }
    .theme-dark .nav-btn { color: #ffffff !important; }
    .nav-btn.writing-btn { background-color: var(--color-purple); }
    .nav-btn.add-btn { background-color: var(--background-modifier-border); color: var(--text-normal) !important; }
    .nav-btn.add-btn:hover { background-color: var(--interactive-accent); color: var(--text-on-accent) !important; }
    `;
    container.appendChild(style);

// 1. 写作按钮
const { long_name, project, type } = current;
const targetName = long_name || project;
const writingTypes = ["论文", "书籍", "报告"];

if (targetName && type && writingTypes.includes(type)) {
    const jumpBtn = document.createElement("button");
    jumpBtn.className = "nav-btn writing-btn";
    jumpBtn.textContent = `✍️ 写作：${targetName}`;
    jumpBtn.onclick = async () => {
        const plugin = app.plugins.plugins['longform'];
        if (!plugin) { new Notice("未检测到 Longform 插件！"); return; }
        app.commands.executeCommandById("longform:longform-jump-to-project");

        let attempts = 0;
        const checkAndClick = setInterval(() => {
            attempts++;
            const el = document.querySelector(".suggestion-container") || document.querySelector(".prompt-results");
            if (el) {
                const items = el.querySelectorAll(".suggestion-item");
                for (const item of items) {
                    if (item.innerText.includes(targetName)) {
                        item.click();
                        new Notice(`已进入写作模式：${targetName}`);
                        clearInterval(checkAndClick);
                        return;
                    }
                }
            }
            if (attempts >= 20) clearInterval(checkAndClick);
        }, 100);
    };
    container.appendChild(jumpBtn);
}

// 2. 渲染现有链接
if (nav && nav.length > 0) {
    nav.forEach(item => {
        let text = item;
        let url = item;
        const match = item.match(/^\[(.*?)\]\((.*?)\)$/);
        if (match) { text = match[1]; url = match[2]; }
        const btn = document.createElement("a");
        btn.className = "nav-btn";
        btn.href = url;
        btn.textContent = text;
        if (url.startsWith("http")) { btn.target = "_blank"; btn.rel = "noopener noreferrer"; }
        container.appendChild(btn);
    });
}

// 3. 添加按钮 (修复 Prompt 问题)
const addBtn = document.createElement("button");
addBtn.className = "nav-btn add-btn";
addBtn.textContent = "+";
addBtn.title = "添加新导航链接";

addBtn.onclick = () => {
    showInputModal("请输入链接名称", "例如: Google", (name) => {
        if (!name) return;
        showInputModal("请输入链接地址", "例如: https://google.com", async (url) => {
            if (!url) return;
            const newLink = `[${name}](${url})`;
            try {
                await app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
                    if (!frontmatter.navigation) frontmatter.navigation = [];
                    frontmatter.navigation.push(newLink);
                });
                new Notice(`已添加导航链接：${name}`);
            } catch (e) {
                console.error(e);
                new Notice("添加失败，请查看控制台");
            }
        });
    });
};

container.appendChild(addBtn);
