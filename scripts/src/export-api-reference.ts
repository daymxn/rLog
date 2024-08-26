import fs from "fs-extra";

const [, , src, dest] = process.argv;

if (!src || !dest) {
  console.error("Error: Source and destination paths are required.");
  process.exit(1);
}

fs.copy(src, dest, { overwrite: true }, (err) => {
  if (err) {
    console.error("Error during copy:", err);
    process.exit(1);
  }
  console.log(`Folder copied from ${src} to ${dest} successfully!`);
});
