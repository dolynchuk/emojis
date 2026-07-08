# emojis-categorised

All emojis with human-readable descriptions, grouped by category. Data is
generated from the official Unicode **17.0** emoji set (UTS #51) — **1916
emojis** across 8 categories.

## Install

```sh
npm install emojis-categorised
```

## Usage

```js
const { emojis } = require('emojis-categorised');
// or: import { emojis } from 'emojis-categorised';

emojis['Smileys & People'][0]; // { text: '😀', label: 'Grinning Face' }
```

## Data structure

`emojis` is an object keyed by category, each value an array of
`{ text, label }`:

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

The raw data is also available as [`emojis.json`](./emojis.json).

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

Skin-tone and hair-colour variants are intentionally excluded so the list
stays one entry per distinct emoji.

## Regenerating the data

The dataset is built from `emoji-test.txt` (bundled from unicode.org):

```sh
npm run build   # regenerates emojis.json and index.js
npm test        # validates structure and checks for duplicates
```

To bump to a newer Unicode version, replace `emoji-test.txt` with the latest
from <https://unicode.org/Public/emoji/latest/emoji-test.txt> and re-run the
build. Existing labels are preserved; only new emojis get an auto-generated
title-cased label.

## License

ISC
