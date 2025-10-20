// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Linting",
		description:
			"Performs simple linting, e.g. removing multiple blank lines or multiple spaces, and enforcing blank lines before headings.",
		availableKinds: ["Manuscript"],
		options: [],
	},

	/** @param {{ contents: string }} input */
	compile(input) {
		input.contents = input.contents
			.replace(/\n{3,}/g, "\n\n") // multiple blank lines
			.replace(/(?!^) {2,}(?!$)/g, " ") // multiple spaces (not at beginning or end)
			.replace(/\n+^(?=#+ )/gm, "\n\n"); // ensure blank line above heading
		return input;
	},
};
