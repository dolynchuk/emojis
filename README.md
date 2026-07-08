# emojis-categorised

[![npm version](https://img.shields.io/npm/v/emojis-categorised.svg)](https://www.npmjs.com/package/emojis-categorised)
[![types included](https://img.shields.io/npm/types/emojis-categorised.svg)](https://www.npmjs.com/package/emojis-categorised)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/emojis-categorised?activeTab=dependencies)
[![license](https://img.shields.io/npm/l/emojis-categorised.svg)](./LICENSE)

**All emojis, grouped by category, with human-readable labels.** A tiny,
zero-dependency dataset for building emoji pickers, autocompletes, and anywhere
you need emojis organised into categories.

- 🗂️ **Ready-to-use categories** — emojis come grouped under readable names like
  `"Smileys & People"` and `"Food & Drink"`. No numeric Unicode group IDs to map
  yourself.
- 📇 **Human-readable labels** — every emoji has a title-cased name
  (`"Grinning Face"`), handy for search and accessibility.
- 🌐 **Complete & current** — the full **Unicode 17.0** base set (1916 emojis),
  generated straight from the official Unicode data.
- 📦 **Zero dependencies**, **TypeScript types included**, ships **ESM + CommonJS**.
- 🔎 Built-in `search()`, a flat `list`, and per-category helpers.

## Install

```sh
npm install emojis-categorised
```

## Quick start

```js
// ESM
import { emojis } from 'emojis-categorised';

// CommonJS
const { emojis } = require('emojis-categorised');

emojis['Smileys & People'][0]; // { text: '😀', label: 'Grinning Face' }
Object.keys(emojis);           // ['Smileys & People', 'Animals & Nature', ...]
```

That's it — the emojis are **already categorised**. Compare that with generic
Unicode datasets, where you have to map numeric group IDs to category names
before you can render anything.

## API

```js
import { emojis, categories, list, getCategory, search } from 'emojis-categorised';
```

| Export                | Type                              | Description                                                    |
| --------------------- | --------------------------------- | -------------------------------------------------------------- |
| `emojis`              | `Record<Category, Emoji[]>`       | Every emoji grouped by category.                               |
| `categories`          | `Category[]`                      | The category names, in display order.                          |
| `list`                | `CategorizedEmoji[]`              | Flat list of all emojis, each tagged with its `category`.      |
| `getCategory(name)`   | `(string) => Emoji[]`             | All emojis in a category (`[]` if unknown).                    |
| `search(query)`       | `(string) => CategorizedEmoji[]`  | Case-insensitive match over labels.                            |

```js
search('heart').slice(0, 3);
// [ { category: 'Smileys & People', text: '❤️', label: 'Red Heart' }, ... ]

getCategory('Food & Drink').length; // 131
list.length;                        // 1916
```

Where `Emoji` is `{ text: string; label: string }`.

## Data structure

```js
{
  "Smileys & People": [
    { "text": "😀", "label": "Grinning Face" },
    { "text": "😃", "label": "Grinning Face with Big Eyes" }
  ],
  "Animals & Nature": [ /* … */ ],
  "Food & Drink":     [ /* … */ ],
  "Activity":         [ /* … */ ],
  "Travel & Places":  [ /* … */ ],
  "Objects":          [ /* … */ ],
  "Symbols":          [ /* … */ ],
  "Flags":            [ /* … */ ]
}
```

You can also import the raw JSON directly:

```js
import emojis from 'emojis-categorised/emojis.json';
```

## Categories

| Category          | Count |
| ----------------- | ----- |
| Smileys & People  | 559   |
| Animals & Nature  | 160   |
| Food & Drink      | 131   |
| Activity          | 85    |
| Travel & Places   | 219   |
| Objects           | 266   |
| Symbols           | 224   |
| Flags             | 272   |

Skin-tone and hair-colour variants are intentionally excluded, so the list is
one clean entry per distinct emoji.

## Example: a category-tabbed picker

```jsx
import { categories, emojis } from 'emojis-categorised';

function EmojiPicker({ onPick }) {
  return categories.map((category) => (
    <section key={category}>
      <h3>{category}</h3>
      {emojis[category].map((e) => (
        <button key={e.text} title={e.label} onClick={() => onPick(e.text)}>
          {e.text}
        </button>
      ))}
    </section>
  ));
}
```

## Regenerating the data

The dataset is generated from `emoji-test.txt` (bundled from unicode.org):

```sh
npm run build   # regenerates emojis.json, index.js and index.mjs
npm test        # validates structure, exports, and checks for duplicates
```

To move to a newer Unicode version, replace `emoji-test.txt` with the latest
from <https://unicode.org/Public/emoji/latest/emoji-test.txt> and re-run the
build. Existing labels are preserved; only new emojis get an auto-generated,
title-cased label.

## License

ISC © Maksym Dolynchuk
