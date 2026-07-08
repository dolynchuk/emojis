// Basic data-integrity and API checks for the emoji dataset.
const assert = require("assert");
const cjs = require("./index.js");
const { emojis, categories, list, getCategory, search } = cjs;
const json = require("./emojis.json");

const EXPECTED_CATEGORIES = [
  "Smileys & People",
  "Animals & Nature",
  "Food & Drink",
  "Activity",
  "Travel & Places",
  "Objects",
  "Symbols",
  "Flags",
];

// index.js and emojis.json must be in sync.
assert.deepStrictEqual(emojis, json, "index.js and emojis.json differ");

// Categories present and in the expected order.
assert.deepStrictEqual(Object.keys(emojis), EXPECTED_CATEGORIES, "unexpected categories");
assert.deepStrictEqual(categories, EXPECTED_CATEGORIES, "categories export mismatch");

let total = 0;
const seen = new Set();
for (const cat of EXPECTED_CATEGORIES) {
  const items = emojis[cat];
  assert(Array.isArray(items) && items.length > 0, `empty category: ${cat}`);
  for (const e of items) {
    assert(typeof e.text === "string" && e.text.length > 0, `bad text in ${cat}`);
    assert(typeof e.label === "string" && e.label.length > 0, `bad label in ${cat}`);
    assert(!seen.has(e.text), `duplicate emoji: ${e.text} (${e.label})`);
    seen.add(e.text);
    total++;
  }
}

// Flat list export.
assert.strictEqual(list.length, total, "list length != total emojis");
assert(list.every((e) => e.category && e.text && e.label), "list entry missing fields");

// getCategory helper.
assert.strictEqual(getCategory("Flags").length, emojis["Flags"].length, "getCategory mismatch");
assert.deepStrictEqual(getCategory("Nope"), [], "getCategory unknown should be []");

// search helper.
const hits = search("grinning");
assert(hits.length > 0 && hits.every((e) => /grinning/i.test(e.label)), "search failed");

// ESM entry must expose the same data.
import("./index.mjs").then((esm) => {
  assert.deepStrictEqual(esm.emojis, emojis, "ESM emojis differ from CJS");
  assert.strictEqual(esm.list.length, list.length, "ESM list differs from CJS");
  assert.deepStrictEqual(esm.default, emojis, "ESM default export should be emojis");
  console.log(`OK: ${total} emojis across ${EXPECTED_CATEGORIES.length} categories; CJS + ESM + helpers verified.`);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
