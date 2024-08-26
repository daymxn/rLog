const { readdir, createReadStream, writeFile } = require("fs-extra");
const { createInterface } = require("readline");
const { join, parse } = require("path");
const { mkdir } = require("fs/promises");

// https://github.com/microsoft/rushstack/issues/2986
function fixMarkdown(line) {
	return line.replace(/(\\(\*))|(\\(_))/g, "$2$4");
}

const [, , src, dest] = process.argv;

if (!src || !dest) {
	console.error("Error: Source and destination paths are required.");
	console.error("Usage: node copy-folder.js <source> <destination>");
	process.exit(1);
}

async function main() {
	const rootDir = src;
	const outputDir = dest;
	const files = await readdir(rootDir);
	for (const file of files) {
		const { name, ext } = parse(file);
		if (ext !== ".md") continue;

		const docPath = join(rootDir, file);

		const outputPath = join(outputDir, file);

		const input = createReadStream(docPath);
		const output = [];
		const lines = createInterface({
			input,
			crlfDelay: Infinity,
		});

		let title = "";
		lines.on("line", (line) => {
			if (line.startsWith("<!--")) return;
			line = fixMarkdown(line);
			if (!title) {
				const titleLine = line.match(/## (.*)/);
				if (titleLine) {
					title = titleLine[1];
				}
			}
			const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/);
			if (homeLink) {
				if (name !== "rlog") {
					output.push(homeLink[1]);
				}
				return;
			}

			if (line.startsWith("|")) {
				line = line.replace(/\\\|/g, "&#124;");
			}

			output.push(line);
		});

		await new Promise((resolve) => lines.once("close", resolve));
		input.close();

		const header = ["---", `id: ${name}`, `title: ${title}`, `hide_title: true`, "---"];

		await mkdir(outputDir, { recursive: true });
		await writeFile(outputPath, header.concat(output).join("\n"));
	}
}

main();
