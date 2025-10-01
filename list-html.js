#!/usr/bin/env node

function printSignature() {
    console.log("\n================================================");
    console.log("              Auto-ID Buttons CLI");
    console.log("  Developed by Med Aziz Akaichi For Industry X.0");
    console.log("================================================\n");
}
printSignature();

const glob = require('glob');
const path = require('path');

glob("**/*.html", { ignore: "node_modules/**" }, (err, files) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    if (files.length === 0) {
        console.log("No HTML files found.");
        return;
    }

    console.log("HTML files found:");
    files.forEach(file => {
        console.log("- " + file);
    });
});
