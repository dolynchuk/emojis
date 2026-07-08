// Basic data-integrity checks for the emoji dataset.
const assert = require("assert");
const { emojis } = require("./index.js");
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
assert.deepStrictEqual(
  Object.keys(emojis),
  EXPECTED_CATEGORIES,
  "unexpected categories"
);

let total = 0;
const seen = new Set();
for (const cat of EXPECTED_CATEGORIES) {
  const list = emojis[cat];
  assert(Array.isArray(list) && list.length > 0, `empty category: ${cat}`);
  for (const e of list) {
    assert(typeof e.text === "string" && e.text.length > 0, `bad text in ${cat}`);
    assert(typeof e.label === "string" && e.label.length > 0, `bad label in ${cat}`);
    assert(!seen.has(e.text), `duplicate emoji: ${e.text} (${e.label})`);
    seen.add(e.text);
    total++;
  }
}

console.log(`OK: ${total} emojis across ${EXPECTED_CATEGORIES.length} categories, no duplicates.`);
