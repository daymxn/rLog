import fs from "fs-extra";

async function copyFolder(src: string, dest: string): Promise<void> {
  try {
    await fs.copy(src, dest, { overwrite: true });
    console.log(`Folder copied from ${src} to ${dest} successfully!`);
  } catch (err) {
    console.error("Error during copy:", err);
    process.exit(1);
  }
}

function validateArgs() {
  const [, , src, dest] = process.argv;

  if (!src || !dest) {
    console.error("Error: Source and destination paths are required.");
    process.exit(1);
  }

  return { src, dest };
}

/**
 * Script for copying the post-processed api files to the wiki page.
 *
 * @example
 * ```sh
 * npx tsx export-api-reference.ts ./src ./dst
 * ```
 */
async function main() {
  const { src, dest } = validateArgs();
  await copyFolder(src, dest);
}

main();
