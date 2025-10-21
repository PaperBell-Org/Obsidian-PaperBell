/**
 * 获取上一个打开的文件信息
 * @param {Object} tp - Templater 对象
 * @returns {string} 来源文件信息
 */
function getSourceFile(tp) {
    try {
        // 获取最近文件列表
        const recentFiles = tp.app.workspace.getRecentFiles();

        console.log("获取最近文件列表:", recentFiles);

        if (recentFiles.length > 1) {
            const lastFilePath = recentFiles[1];
            console.log("上一个文件路径:", lastFilePath);

            const sourceFile = tp.app.vault.getAbstractFileByPath(lastFilePath);

            if (sourceFile) {
                console.log("成功获取来源文件:", sourceFile.basename);
                return `💡 **本概念由 [[${sourceFile.basename}]] 笔记创建而来**`;
            } else {
                console.warn("无法找到来源文件:", lastFilePath);
                throw new Error("无法获取来源文件信息，请确保之前打开过其他文件");
            }
        } else {
            console.warn("最近文件列表为空或只有一个文件");
            throw new Error("无法获取来源文件，请确保之前打开过其他文件");
        }
    } catch (error) {
        console.error("获取来源文件时出错:", error);
        // 抛出错误让 Templater 显示给用户
        throw new Error(`获取来源文件失败: ${error.message}`);
    }
}

module.exports = getSourceFile;
