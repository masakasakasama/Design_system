import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const tokenPath = path.join(repoRoot, "tokens", "design-tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

const get = (obj, dotted) => dotted.split(".").reduce((acc, key) => acc?.[key], obj);
const resolve = (value) => {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const resolved = get(tokens, match[1]);
  if (resolved === undefined) throw new Error(`Unresolved token reference: ${value}`);
  return resolve(resolved);
};

const kebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const pascal = (value) => value.replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "");
const kotlinColor = (hex) => `Color(0xFF${hex.replace("#", "").toUpperCase()})`;

function validate() {
  const requiredAccents = ["ocean", "sage", "amethyst"];
  const requiredModes = ["light", "dark"];
  for (const accent of requiredAccents) {
    const theme = tokens.semantic?.themes?.[accent];
    if (!theme) throw new Error(`Missing accent theme: ${accent}`);
    for (const mode of requiredModes) {
      if (!theme[mode]) throw new Error(`Missing ${accent}/${mode} theme`);
      for (const key of [
        "background", "surface", "surfaceElevated", "border",
        "textPrimary", "textSecondary", "textMuted", "accent",
        "accentHover", "accentContainer", "onAccent",
        "success", "warning", "error", "info"
      ]) {
        resolve(theme[mode][key]);
      }
    }
  }
}

function webCss() {
  const lines = [
    "/* GENERATED FILE. Edit tokens/design-tokens.json, then run npm run generate. */",
    ":root {",
  ];

  const space = tokens.primitive.space;
  for (const [name, value] of Object.entries(space)) lines.push(`  --tatsu-space-${kebab(name)}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.primitive.radius)) lines.push(`  --tatsu-radius-${kebab(name)}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.primitive.motion)) lines.push(`  --tatsu-motion-${kebab(name)}: ${value}ms;`);
  for (const [name, value] of Object.entries(tokens.primitive.stroke)) lines.push(`  --tatsu-stroke-${kebab(name)}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.primitive.type)) {
    lines.push(`  --tatsu-type-${kebab(name)}-size: ${value.size}px;`);
    lines.push(`  --tatsu-type-${kebab(name)}-line-height: ${value.lineHeight}px;`);
    lines.push(`  --tatsu-type-${kebab(name)}-weight: ${value.weight};`);
  }
  const card = tokens.component.card;
  const button = tokens.component.button;
  const page = tokens.component.page;
  lines.push(`  --tatsu-card-radius: ${resolve(card.radius)}px;`);
  lines.push(`  --tatsu-card-padding: ${resolve(card.padding)}px;`);
  lines.push(`  --tatsu-card-gap: ${resolve(card.gap)}px;`);
  lines.push(`  --tatsu-card-border-width: ${resolve(card.borderWidth)}px;`);
  lines.push(`  --tatsu-button-radius: ${resolve(button.radius)}px;`);
  lines.push(`  --tatsu-button-height: ${resolve(button.height)}px;`);
  lines.push(`  --tatsu-button-padding-x: ${resolve(button.paddingX)}px;`);
  lines.push(`  --tatsu-page-padding-compact: ${resolve(page.paddingCompact)}px;`);
  lines.push(`  --tatsu-page-padding-wide: ${resolve(page.paddingWide)}px;`);
  lines.push(`  --tatsu-page-content-max-width: ${resolve(page.contentMaxWidth)}px;`);
  lines.push("}");

  const semanticKeys = Object.keys(tokens.semantic.themes.ocean.dark);
  for (const [accent, modes] of Object.entries(tokens.semantic.themes)) {
    for (const [mode, scheme] of Object.entries(modes)) {
      const selector = `[data-tatsu-accent="${accent}"][data-tatsu-theme="${mode}"]`;
      lines.push("", `${selector} {`);
      for (const key of semanticKeys) {
        lines.push(`  --tatsu-color-${kebab(key)}: ${resolve(scheme[key])};`);
      }
      lines.push("  color-scheme: " + mode + ";", "}");
    }
  }

  lines.push("", ":root {");
  for (const [key, value] of Object.entries(tokens.semantic.themes.ocean.dark)) {
    lines.push(`  --tatsu-color-${kebab(key)}: ${resolve(value)};`);
  }
  lines.push("  color-scheme: dark;", "}");
  return lines.join("\n") + "\n";
}

function webJs() {
  return `// GENERATED FILE. Edit tokens/design-tokens.json, then run npm run generate.\n` +
    `export const accents = ${JSON.stringify(Object.keys(tokens.semantic.themes))};\n` +
    `export const themes = ["light", "dark"];\n` +
    `export const designSystemVersion = ${JSON.stringify(tokens.meta.version)};\n` +
    `export function applyTatsuTheme({ accent = "ocean", theme = "dark" } = {}) {\n` +
    `  const root = document.documentElement;\n` +
    `  root.dataset.tatsuAccent = accent;\n` +
    `  root.dataset.tatsuTheme = theme;\n` +
    `}\n`;
}

function kotlin() {
  const themes = tokens.semantic.themes;
  const keys = Object.keys(themes.ocean.dark);
  const fields = keys.map(k => `    val ${k}: Color`).join(",\n");
  const schemeBlocks = [];
  for (const accent of Object.keys(themes)) {
    for (const mode of ["light", "dark"]) {
      const name = `${pascal(accent)}${pascal(mode)}`;
      const lines = keys.map(k => `        ${k} = ${kotlinColor(resolve(themes[accent][mode][k]))}`).join(",\n");
      schemeBlocks.push(`    val ${name} = TatsuColors(\n${lines}\n    )`);
    }
  }
  const spaceLines = Object.entries(tokens.primitive.space)
    .filter(([k]) => k !== "0")
    .map(([k,v]) => `    val ${pascal(k)} = ${v}.dp`).join("\n");
  const radiusLines = Object.entries(tokens.primitive.radius)
    .filter(([k]) => k !== "pill")
    .map(([k,v]) => `    val Radius${pascal(k)} = ${v}.dp`).join("\n");
  const typeLines = Object.entries(tokens.primitive.type)
    .map(([k,v]) => `    val ${pascal(k)}Size = ${v.size}.sp\n    val ${pascal(k)}LineHeight = ${v.lineHeight}.sp\n    const val ${pascal(k)}Weight = ${v.weight}`).join("\n");

  return `// GENERATED FILE. Edit tokens/design-tokens.json, then run npm run generate.\n` +
`package com.masakasakasama.designsystem.generated\n\n` +
`import androidx.compose.ui.graphics.Color\n` +
`import androidx.compose.ui.unit.dp\n` +
`import androidx.compose.ui.unit.sp\n\n` +
`enum class TatsuAccent { Ocean, Sage, Amethyst }\n\n` +
`data class TatsuColors(\n${fields}\n)\n\n` +
`object TatsuGeneratedColors {\n${schemeBlocks.join("\n\n")}\n\n` +
`    fun scheme(accent: TatsuAccent, dark: Boolean): TatsuColors = when (accent) {\n` +
`        TatsuAccent.Ocean -> if (dark) OceanDark else OceanLight\n` +
`        TatsuAccent.Sage -> if (dark) SageDark else SageLight\n` +
`        TatsuAccent.Amethyst -> if (dark) AmethystDark else AmethystLight\n` +
`    }\n}\n\n` +
`object TatsuDimens {\n${spaceLines}\n${radiusLines}\n` +
`    val CardRadius = ${resolve(tokens.component.card.radius)}.dp\n` +
`    val CardPadding = ${resolve(tokens.component.card.padding)}.dp\n` +
`    val CardGap = ${resolve(tokens.component.card.gap)}.dp\n` +
`    val CardBorderWidth = ${resolve(tokens.component.card.borderWidth)}.dp\n` +
`    val ButtonRadius = ${resolve(tokens.component.button.radius)}.dp\n` +
`    val ButtonHeight = ${resolve(tokens.component.button.height)}.dp\n` +
`}\n\n` +
`object TatsuType {\n${typeLines}\n}\n`;
}

validate();

const webDist = path.join(repoRoot, "dist", "web");
fs.mkdirSync(webDist, { recursive: true });
const componentCss = fs.readFileSync(path.join(repoRoot, "src", "web", "components.css"), "utf8");
const css = webCss();
fs.writeFileSync(path.join(webDist, "tokens.css"), css);
fs.writeFileSync(path.join(webDist, "index.css"), css + "\n" + componentCss);
fs.writeFileSync(path.join(webDist, "index.js"), webJs());

const androidOut = path.join(
  repoRoot,
  "android", "tatsu-design-system", "src", "main", "java",
  "com", "masakasakasama", "designsystem", "generated", "TatsuTokens.kt"
);
fs.mkdirSync(path.dirname(androidOut), { recursive: true });
fs.writeFileSync(androidOut, kotlin());

console.log(`Generated web + Android tokens from ${path.relative(repoRoot, tokenPath)}`);
