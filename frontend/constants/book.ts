// constants/books.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string; // required for rendering cover image
  description?: string;
  genres: string[];
  vibes: string[];
  themes: string[];
  pages?: number;
  reasons?: string[];
}

export interface UserPreferences {
  genres: string[];
  vibes: string[];
  themes: string[];
  pacePreference?: string;
  lengthPreference?: string;
}

export const GENRES = [
  "Romance",
  "Fantasy",
  "Mystery",
  "Sci-fi",
  "Contemporary",
  "Historical",
  "Non-fiction",
] as const;

export const VIBES = [
  "Cozy",
  "Dark",
  "Dreamy",
  "Spicy",
  "Cottagecore",
  "Melancholy",
  "Feel-good",
] as const;

export const THEMES = [
  "Healing",
  "Found family",
  "Enemies-to-lovers",
  "Coming-of-age",
  "Grief",
  "Adventure",
  "Self-discovery",
] as const;

