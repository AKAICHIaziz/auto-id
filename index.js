#!/usr/bin/env node

function printSignature() {
    console.log("\n================================================");
    console.log("  Auto-ID Buttons CLI");
    console.log("  Developed by Med Aziz Akaichi For Industry X.0");
    console.log("================================================\n");
}
printSignature();

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const args = process.argv.slice(2);
if (!args[0]) {
    console.error("Please provide a component name or HTML file: auto-id <component-name|file.html>");
    process.exit(1);
}

const target = args[0];
let idCounter = 1;

// Determine if the argument is a specific HTML file or a component name
let pattern;
if (target.endsWith('.html')) {
    pattern = target; // Only this file
} else {
    pattern = "**/*.html"; // All HTML files
}

glob(pattern, { ignore: "node_modules/**" }, (err, files) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    if (files.length === 0) {
        console.log("No HTML files found!");
        return;
    }

    files.forEach(file => {
        const html = fs.readFileSync(file, 'utf8');
        const $ = cheerio.load(html);

        $('button').each((_, button) => {
            const $btn = $(button);
            if (!$btn.attr('id')) {
                let functionality = $btn.attr('name') || $btn.text().trim();

                functionality = functionality
                    .replace(/{{.*?}}/g, '') 
                    .replace(/[^a-zA-Z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .toLowerCase();

                const prefix = target.endsWith('.html') ? path.basename(file, '.html') : target;
                const uniqueId = `${prefix}-${functionality || 'btn'}-${idCounter++}`;
                $btn.attr('id', uniqueId);
            }
        });

        fs.writeFileSync(file, $.html(), 'utf8');
        console.log(`Updated: ${file}`);
    });

    console.log("✅ Buttons updated with unique IDs.");
});
