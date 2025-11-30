// 脚本：project_participants.js
// 路径：40 - Obsidian/脚本/project_participants.js
// 用法：`$= dv.view("40 - Obsidian/脚本/project_participants")`

const current = dv.current();
const participants = current.participants;

if (participants && participants.length > 0) {
    const container = dv.el("div", "", { cls: "participants-container" });

    // 样式
    const style = document.createElement("style");
    style.textContent = `
        .participants-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .participant-card {
            display: flex;
            align-items: center;
            background-color: var(--background-secondary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            padding: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none !important;
            color: var(--text-normal) !important;
        }
        .participant-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-color: var(--interactive-accent);
        }
        .participant-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 12px;
            border: 2px solid var(--background-primary);
            background-color: var(--background-secondary-alt);
            flex-shrink: 0;
        }
        .participant-info {
            flex: 1;
            min-width: 0; /* 允许文本截断 */
        }
        .participant-name {
            font-weight: 700;
            font-size: 1em;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .participant-institute {
            font-size: 0.8em;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .participant-email {
            font-size: 0.75em;
            color: var(--text-faint);
            margin-top: 2px;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    container.appendChild(style);

    // 处理每一个参与者
    // participants 可能是链接列表 "[[Name]]" 或纯文本 "Name"
    participants.forEach(p => {
        let name = p;
        let path = "";

        // 尝试解析 Wiki Link [[Name]]
        if (typeof p === 'string' && p.includes('[[')) {
            const match = p.match(/\[\[(.*?)(\|.*?)?\]\]/);
            if (match) {
                name = match[1];
            }
        } else if (typeof p === 'object' && p.path) {
            // 如果是 DV 的 Link 对象
            name = p.display || p.path.split("/").pop().replace(".md", "");
            path = p.path;
        }

        // 查找对应的学者笔记
        // 假设学者笔记都在 Persons/Scholars/ 目录下，或者全库搜索 name
        let scholarPage = dv.pages(`"Persons/Scholars"`).where(page => page.file.name === name || page.name === name || (page.aliases && page.aliases.includes(name))).first();

        // 创建卡片链接
        // 如果找到了笔记，就链接到笔记；没找到就创建一个无链接的 div
        let card;
        if (scholarPage) {
            card = document.createElement("a");
            card.href = scholarPage.file.path;
            card.className = "participant-card internal-link";
            card.setAttribute("data-href", scholarPage.file.path);
        } else {
            card = document.createElement("div");
            card.className = "participant-card";
        }

        // 头像
        const img = document.createElement("img");
        img.className = "participant-avatar";
        // 优先使用笔记中的 photo 属性，否则使用默认头像
        if (scholarPage && scholarPage.photo) {
            img.src = scholarPage.photo;
        } else {
            // 默认头像占位符 (可以使用一个通用的 svg 或 base64)
            img.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random";
        }
        card.appendChild(img);

        // 信息区
        const infoDiv = document.createElement("div");
        infoDiv.className = "participant-info";

        // 姓名
        const nameDiv = document.createElement("div");
        nameDiv.className = "participant-name";
        nameDiv.textContent = scholarPage ? (scholarPage.name || scholarPage.file.name) : name;
        infoDiv.appendChild(nameDiv);

        // 机构
        if (scholarPage && scholarPage.institute) {
            const instDiv = document.createElement("div");
            instDiv.className = "participant-institute";
            // 机构可能是列表或字符串
            const inst = Array.isArray(scholarPage.institute) ? scholarPage.institute[0] : scholarPage.institute;
            instDiv.textContent = inst || "";
            infoDiv.appendChild(instDiv);
        }

        // 邮箱 (可选)
        if (scholarPage && scholarPage.email) {
             const emailDiv = document.createElement("div");
             emailDiv.className = "participant-email";
             const email = Array.isArray(scholarPage.email) ? scholarPage.email[0] : scholarPage.email;
             emailDiv.textContent = email || "";
             infoDiv.appendChild(emailDiv);
        }

        card.appendChild(infoDiv);
        container.appendChild(card);
    });

} else {
    dv.paragraph("*暂无参与者信息*");
}
