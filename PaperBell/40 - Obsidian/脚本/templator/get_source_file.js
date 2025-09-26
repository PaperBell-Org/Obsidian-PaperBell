/**
 * 获取上一个打开的文件信息
 * @param {Object} tp - Templater 对象
 * @returns {string} 来源文件信息或空字符串
 */
function getSourceFile(tp) {
    try {
        // 获取最近文件列表
        const recentFiles = tp.app.workspace.getRecentFiles();

        if (recentFiles.length > 1) {
            const lastFilePath = recentFiles[1];
            const sourceFile = tp.app.vault.getAbstractFileByPath(lastFilePath);

            if (sourceFile) {
                return `💡 **本概念由 [[${sourceFile.basename}]] 笔记创建而来**`;
            }
        }

        return "";
    } catch (error) {
        console.error("获取来源文件时出错:", error);
        return "";
    }
}

module.exports = getSourceFile;
