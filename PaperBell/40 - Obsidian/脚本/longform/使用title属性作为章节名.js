module.exports = {
    description: {
      name: "Rename scenes to aliases",
      description: "Retitles scenes to their frontmatter property, if present",
      availableKinds: ["Scene"],
      options: [
        {
          id: "property_name",
          name: "Property Name",
          description: "The frontmatter property to use as scene title",
          type: "Text",
          default: "scene_alias",
        },
      ],
    },
    compile(scenes, options) {
      const propertyName = options?.property_name || "scene_alias";
      return scenes.map((scene) => {
        const fm = scene.metadata.frontmatter;
        if (!fm) {
          return scene;
        }
        return {
          ...scene,
          name: fm[propertyName] || scene.name,
        };
      });
    },
  };
