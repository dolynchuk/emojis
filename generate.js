// Generates emojis.json + index.js from Unicode's emoji-test.txt (UTS #51).
// Base set only: excludes skin-tone / hair modifier sequences and the
// "Component" group, matching the package's original convention. Labels are
// title-cased to match the existing style.
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2] || path.join(__dirname, "emoji-test.txt");

// Unicode group -> package category (backwards-compatible with v1).
const GROUP_TO_CATEGORY = {
  "Smileys & Emotion": "Smileys & People",
  "People & Body": "Smileys & People",
  "Animals & Nature": "Animals & Nature",
  "Food & Drink": "Food & Drink",
  "Activities": "Activity",
  "Travel & Places": "Travel & Places",
  "Objects": "Objects",
  "Symbols": "Symbols",
  "Flags": "Flags",
  // "Component" is intentionally omitted (skin tones & hair modifiers).
};

// Category output order (matches v1).
const CATEGORY_ORDER = [
  "Smileys & People",
  "Animals & Nature",
  "Food & Drink",
  "Activity",
  "Travel & Places",
  "Objects",
  "Symbols",
  "Flags",
];

const SMALL_WORDS = new Set([
  "a", "an", "and", "the", "of", "in", "on", "at", "to", "from",
  "for", "or", "with", "as", "but", "nor", "per", "via",
]);

function capWord(w) {
  // Capitalize first letter of each hyphen-separated part, keep the rest as-is
  // so proper nouns / acronyms already capitalized in the source are preserved.
  return w
    .split("-")
    .map((p) => (p.length ? p[0].toUpperCase() + p.slice(1) : p))
    .join("-");
}

function titleCase(name) {
  const words = name.split(" ");
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      const afterColon = i > 0 && words[i - 1].endsWith(":");
      if (i !== 0 && !afterColon && SMALL_WORDS.has(lower)) return lower;
      return capWord(w);
    })
    .join(" ");
}

// Reuse curated labels from the previous release for emojis that already
// existed, so upgrading doesn't churn hand-tuned labels (acronyms, casing).
// New emojis fall back to a title-cased Unicode name. Defaults to the current
// emojis.json so re-running the build is idempotent and never churns labels.
const PREV = process.argv[3] || path.join(__dirname, "emojis.json");
const prevLabels = new Map();
if (fs.existsSync(PREV)) {
  const prev = JSON.parse(fs.readFileSync(PREV, "utf8"));
  for (const cat in prev) {
    for (const e of prev[cat]) prevLabels.set(e.text, e.label);
  }
}

const lines = fs.readFileSync(SRC, "utf8").split("\n");
const result = {};
for (const cat of CATEGORY_ORDER) result[cat] = [];

let currentCategory = null;
for (const raw of lines) {
  const line = raw.trim();
  if (line.startsWith("# group:")) {
    const group = line.slice("# group:".length).trim();
    currentCategory = GROUP_TO_CATEGORY[group] || null;
    continue;
  }
  if (!line || line.startsWith("#")) continue;
  if (!currentCategory) continue;

  // Format: <codepoints> ; <status> # <emoji> E<ver> <name>
  const semi = line.indexOf(";");
  const hash = line.indexOf("#");
  if (semi === -1 || hash === -1) continue;

  const codepoints = line.slice(0, semi).trim();
  const status = line.slice(semi + 1, hash).trim();
  if (status !== "fully-qualified") continue;

  // Skip skin-tone modifier sequences (1F3FB..1F3FF).
  if (/\b1F3F[B-F]\b/.test(codepoints)) continue;

  const comment = line.slice(hash + 1).trim(); // "😀 E1.0 grinning face"
  const parts = comment.split(/\s+/);
  const text = parts[0];
  // parts[1] is the E-version; the rest is the name.
  const name = parts.slice(2).join(" ");
  if (!text || !name) continue;

  const label = prevLabels.has(text) ? prevLabels.get(text) : titleCase(name);
  result[currentCategory].push({ text, label });
}

// Preserve any curated entries from the previous release that Unicode's data
// doesn't include (e.g. custom / subdivision flags), so upgrading never drops
// emojis that consumers may already depend on.
const seen = new Set();
for (const cat of CATEGORY_ORDER) for (const e of result[cat]) seen.add(e.text);
if (fs.existsSync(PREV)) {
  const prev = JSON.parse(fs.readFileSync(PREV, "utf8"));
  for (const cat in prev) {
    const dest = result[cat] ? cat : "Flags"; // prev already uses package categories
    for (const e of prev[cat]) {
      if (!seen.has(e.text)) {
        seen.add(e.text);
        (result[dest] || result["Flags"]).push(e);
      }
    }
  }
}

// Sanity report.
let total = 0;
for (const cat of CATEGORY_ORDER) {
  total += result[cat].length;
  console.error(cat.padEnd(20), result[cat].length);
}
console.error("TOTAL:", total);

fs.writeFileSync(
  path.join(__dirname, "emojis.json"),
  JSON.stringify(result),
  "utf8"
);

// Shared runtime: derived views and helpers built from `emojis`.
const HELPERS = `
// The list of category names, in display order.
const categories = Object.keys(emojis);

// A flat list of every emoji, each tagged with its category.
const list = categories.flatMap((category) =>
  emojis[category].map((e) => ({ category, text: e.text, label: e.label }))
);

// Get all emojis in a category (empty array if the category is unknown).
function getCategory(category) {
  return emojis[category] || [];
}

// Case-insensitive search over emoji labels. Returns flat entries.
function search(query) {
  const q = String(query).toLowerCase();
  return list.filter((e) => e.label.toLowerCase().includes(q));
}
`;

const DATA = "const emojis = " + JSON.stringify(result, null, 2) + ";\n";
const BANNER =
  "// Generated by generate.js from Unicode emoji-test.txt (UTS #51). Do not edit by hand.\n";

// CommonJS entry.
fs.writeFileSync(
  path.join(__dirname, "index.js"),
  BANNER +
    DATA +
    HELPERS +
    "\nmodule.exports = { emojis, categories, list, getCategory, search };\n",
  "utf8"
);

// ESM entry.
fs.writeFileSync(
  path.join(__dirname, "index.mjs"),
  BANNER +
    DATA +
    HELPERS +
    "\nexport { emojis, categories, list, getCategory, search };\nexport default emojis;\n",
  "utf8"
);

console.error("Wrote emojis.json, index.js and index.mjs");
