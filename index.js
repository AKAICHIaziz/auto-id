#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");

function printSignature() {
  console.log("\n================================================");
  console.log("  Auto-ID Buttons CLI");
  console.log("  Developed by Med Aziz Akaichi For Industry X.0");
  console.log("================================================\n");
}
printSignature();

const args = process.argv.slice(2);
if (!args[0]) {
  console.error("Please provide a component name or HTML file: auto-id <component-name|file.html>");
  process.exit(1);
}

const target = args[0];
let idCounter = 1;

// Select pattern
let pattern = target.endsWith(".html") ? target : "**/*.html";

glob(pattern, { ignore: "node_modules/**" }, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("No HTML files found!");
    return;
  }

  files.forEach((file) => {
    let html = fs.readFileSync(file, "utf8");

    // Regex for <button ...>...</button>
    html = html.replace(/<button([^>]*)>([\s\S]*?)<\/button>/gi, (match, attrs, inner) => {
      if (/id\s*=/.test(attrs)) return match; // skip if already has id

      // Clean inner text for ID
      let functionality = inner
        .replace(/{{.*?}}/g, "") // remove Angular expressions
        .replace(/<.*?>/g, "") // remove HTML tags
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "") // remove illegal chars
        .toLowerCase();

      const prefix = target.endsWith(".html") ? path.basename(file, ".html") : target;
      const uniqueId = `${prefix}-${functionality || "btn"}-${idCounter++}`;

      return `<button${attrs} id="${uniqueId}">${inner}</button>`;
    });

    fs.writeFileSync(file, html, "utf8");
    console.log(`Updated: ${file}`);
  });

  console.log("✅ Buttons updated with unique IDs.");
});
