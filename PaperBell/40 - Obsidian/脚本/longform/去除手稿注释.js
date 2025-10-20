module.exports = {
    description: {
      name: "Remove Markdown Comments",
      description: "Removes all markdown and HTML comments from the manuscript.",
      availableKinds: ["Manuscript"],  // 这个步骤作用于整个手稿
      options: []
    },

    compile: async function (input, context) {
      // 手稿的内容
      let contents = input.contents;

      // 使用正则表达式删除 Markdown 注释 %% 注释 %%
      contents = contents.replace(/%%.*?%%/gs, '');

      // 使用正则表达式删除 HTML 注释 <!-- 注释 -->
      contents = contents.replace(/<!--.*?-->/gs, '');

      // 返回去掉注释的手稿
      return { contents };
    }
  };
