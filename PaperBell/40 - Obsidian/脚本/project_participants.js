// 脚本：project_participants.js
// 路径：40 - Obsidian/脚本/project_participants.js
// 用法：`$= dv.view("40 - Obsidian/脚本/project_participants")`

const current = dv.current();
const participants = current.participants;

if (participants && participants.length > 0) {
    const wrapper = dv.el("div", "");

    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Tinos:wght@700&display=swap');

        .participants-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .scholar-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            width: 100%;
            min-height: 72px;

            /* Glassmorphism Background */
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 14px;

            box-shadow: 0px 4px 10px -2px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;

            text-decoration: none !important;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
        }

        /* Dark mode compatibility: if background is light, these white texts might disappear.
           But the design explicitly requests this style.
           We add a fallback background for light mode if needed, but sticking to design request first. */
        .theme-light .scholar-card {
             background: rgba(0, 0, 0, 0.05);
             border-color: rgba(0, 0, 0, 0.1);
        }

        .scholar-card:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0px 8px 15px -3px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
        }
        .theme-light .scholar-card:hover {
            background: rgba(0, 0, 0, 0.08);
            border-color: rgba(0, 0, 0, 0.2);
        }

        .scholar-avatar-container {
            position: relative;
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: border-color 0.2s;
        }
        .scholar-card:hover .scholar-avatar-container {
            border-color: rgba(255, 255, 255, 0.4);
        }
        .theme-light .scholar-avatar-container {
            border-color: rgba(0, 0, 0, 0.1);
        }

        .scholar-avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .scholar-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .scholar-content p {
            margin: 0;
            padding: 0;
        }

        .scholar-name {
            font-family: 'Tinos', serif;
            font-weight: 700;
            font-size: 15px;
            line-height: 1.2;
            color: white;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .theme-light .scholar-name {
            color: var(--text-normal);
        }

        .scholar-title {
            font-family: 'Inter', sans-serif;
            font-size: 9px;
            line-height: 1.2;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .theme-light .scholar-title {
            color: var(--text-muted);
        }

        .scholar-subtext {
            font-family: 'Inter', sans-serif;
            font-size: 9px;
            line-height: 1.2;
            color: rgba(255, 255, 255, 0.45);
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .theme-light .scholar-subtext {
             color: var(--text-faint);
        }

        .scholar-arrow {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: 0.4;
            transition: all 0.2s;
            stroke: white;
        }
        .theme-light .scholar-arrow {
            stroke: var(--text-muted);
        }

        .scholar-card:hover .scholar-arrow {
            opacity: 0.8;
            transform: translateX(2px);
        }
    `;
    wrapper.appendChild(style);

    const container = document.createElement("div");
    container.className = "participants-container";
    wrapper.appendChild(container);

    // 处理每一个参与者
    participants.forEach(p => {
        let name = p;

        // 尝试解析 Wiki Link [[Name]]
        if (typeof p === 'string' && p.includes('[[')) {
            const match = p.match(/\[\[(.*?)(\|.*?)?\]\]/);
            if (match) {
                name = match[1];
            }
        } else if (typeof p === 'object' && p.path) {
            name = p.display || p.path.split("/").pop().replace(".md", "");
        }

        // 查找对应的学者笔记
        let scholarPage = dv.pages(`"Persons/Scholars"`).where(page => page.file.name === name || page.name === name || (page.aliases && page.aliases.includes(name))).first();

        // 创建卡片容器
        let card;
        if (scholarPage) {
            card = document.createElement("a");
            card.href = scholarPage.file.path;
            card.className = "scholar-card internal-link";
            card.setAttribute("data-href", scholarPage.file.path);
        } else {
            card = document.createElement("div");
            card.className = "scholar-card";
            // 点击创建新笔记逻辑
            card.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation(); // 防止事件冒泡

                const targetFolder = "Persons/Scholars";
                const targetPath = `${targetFolder}/${name}.md`;

                // 再次检查文件是否存在
                const existing = app.vault.getAbstractFileByPath(targetPath);
                if (existing) {
                    app.workspace.openLinkText(targetPath, "", true);
                    return;
                }

                try {
                    // 确保目录存在
                    if (!app.vault.getAbstractFileByPath(targetFolder)) {
                        await app.vault.createFolder(targetFolder);
                    }

                    // 读取模板
                    const tplFile = app.vault.getAbstractFileByPath("40 - Obsidian/模板/学者模板.md");
                    let content = "";
                    if (tplFile) {
                        content = await app.vault.read(tplFile);
                    } else {
                        content = "---\nname: {{name}}\n---\n# {{name}}\n";
                    }

                    // 替换变量
                    content = content.replace(/{{name}}/g, name);
                    // 简单的日期替换，假设 moment 可用 (Obsidian 环境通常可用)
                    if (window.moment) {
                        content = content.replace(/{{date}}/g, moment().format("YYYY-MM-DD"));
                    } else {
                         content = content.replace(/{{date}}/g, new Date().toISOString().split('T')[0]);
                    }

                    // 创建文件
                    await app.vault.create(targetPath, content);
                    new Notice(`已创建学者档案: ${name}`);

                    // 打开文件
                    app.workspace.openLinkText(targetPath, "", true);
                } catch (err) {
                    console.error("创建学者档案失败", err);
                    new Notice("创建失败: " + err.message);
                }
            };
        }

        // 1. 头像区域
        const avatarContainer = document.createElement("div");
        avatarContainer.className = "scholar-avatar-container";

        const img = document.createElement("img");
        img.className = "scholar-avatar";
        if (scholarPage && scholarPage.photo) {
            img.src = scholarPage.photo;
        } else {
            img.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random&color=fff";
        }
        avatarContainer.appendChild(img);
        card.appendChild(avatarContainer);

        // 2. 内容区域
        const contentDiv = document.createElement("div");
        contentDiv.className = "scholar-content";

        // Name (Line 1)
        const nameP = document.createElement("p");
        nameP.className = "scholar-name";
        nameP.textContent = scholarPage ? (scholarPage.name || scholarPage.file.name) : name;
        contentDiv.appendChild(nameP);

        // Title (Line 2) - 对应 institute
        const titleP = document.createElement("p");
        titleP.className = "scholar-title";
        let instituteText = "";
        if (scholarPage && scholarPage.institute) {
            instituteText = Array.isArray(scholarPage.institute) ? scholarPage.institute[0] : scholarPage.institute;
        } else if (!scholarPage) {
            instituteText = "暂无信息";
        }
        titleP.textContent = instituteText || ""; // 如果有 page 但没有 institute，留空比显示默认值好
        contentDiv.appendChild(titleP);

        // Subtext (Line 3) - 对应 email 或其他信息
        const subtextP = document.createElement("p");
        subtextP.className = "scholar-subtext";
        let emailText = "";
        if (scholarPage && scholarPage.email) {
            emailText = Array.isArray(scholarPage.email) ? scholarPage.email[0] : scholarPage.email;
        }
        subtextP.textContent = emailText || "";
        contentDiv.appendChild(subtextP);

        card.appendChild(contentDiv);

        // 3. 箭头图标
        const arrowDiv = document.createElement("div");
        arrowDiv.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="scholar-arrow">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        `;
        // SVG class applied inside innerHTML won't work directly on container unless we select it
        // Better to just append the SVG directly or use the wrapper
        card.appendChild(arrowDiv.firstElementChild);

        container.appendChild(card);
    });

} else {
    dv.paragraph("*暂无参与者信息*");
}
