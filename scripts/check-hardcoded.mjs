import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error("Usage: node scripts/check-hardcoded.mjs <path> [path...]");
  process.exit(2);
}

const allowed = [
  /generated[\\/]/,
  /design-tokens\.json$/,
  /ic_launcher/,
];

const sourceExt = /\.(kt|kts|css|tsx|ts|jsx|js)$/;
const colorPattern = /#[0-9a-fA-F]{3,8}\b|Color\(0x[0-9a-fA-F]+\)/;
const composeDimenPattern = /\b\d+(?:\.\d+)?\.(?:dp|sp)\b/;

const violations = [];

function walk(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) walk(path.join(target, entry));
    return;
  }
  if (!sourceExt.test(target) || allowed.some((p) => p.test(target))) return;
  const lines = fs.readFileSync(target, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (colorPattern.test(line) || composeDimenPattern.test(line)) {
      violations.push(`${target}:${i + 1}: ${line.trim()}`);
    }
  });
}

roots.forEach(walk);
if (violations.length) {
  console.error("Hard-coded design values found. Use shared semantic tokens instead:\n");
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log("No hard-coded color/dp/sp values found in checked authored sources.");
