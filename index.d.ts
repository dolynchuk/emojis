export interface Emoji {
  /** The emoji character, e.g. "😀". */
  text: string;
  /** Human-readable, title-cased name, e.g. "Grinning Face". */
  label: string;
}

/** An {@link Emoji} together with the category it belongs to. */
export interface CategorizedEmoji extends Emoji {
  category: Category;
}

/** The eight human-readable category names used by this package. */
export type Category =
  | "Smileys & People"
  | "Animals & Nature"
  | "Food & Drink"
  | "Activity"
  | "Travel & Places"
  | "Objects"
  | "Symbols"
  | "Flags";

/** Every emoji grouped by category. */
export declare const emojis: Record<Category, Emoji[]>;

/** The category names, in display order. */
export declare const categories: Category[];

/** A flat list of every emoji, each tagged with its category. */
export declare const list: CategorizedEmoji[];

/** Get all emojis in a category (empty array if the category is unknown). */
export declare function getCategory(category: string): Emoji[];

/** Case-insensitive search over emoji labels. */
export declare function search(query: string): CategorizedEmoji[];

declare const _default: Record<Category, Emoji[]>;
export default _default;
