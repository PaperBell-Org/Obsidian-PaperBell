// Main function to be called by QuickAdd
module.exports = async (params) => {
    const activeFile = app.workspace.getActiveFile();
    // 获取上一个活动文件并读取其内容
    const lastFilePath = app.workspace.getRecentFiles()[0];
    const lastFile = app.vault.getAbstractFileByPath(lastFilePath);
    // 日志
    if (!lastFile) {
        new Notice("没有找到上一个文件");
        return;
    }
    if (!activeFile) {
        new Notice("没有打开的文件");
        return;
    }
    console.log(`从上一个文件新建：${lastFile.basename}`);
    const lastFileContent = await app.vault.read(lastFile);

    // 只获取不带扩展名的文件名
    const filename = activeFile.basename;

    params.variables = {
        ...params.variables,
        filename: filename,
        lastContent: lastFileContent,
    };
};
