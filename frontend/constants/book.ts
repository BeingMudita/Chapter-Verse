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

export const MOCK_BOOKS: Book[] = [
  {
    id: "b1",
    title: "The Rose & The Lantern",
    author: "A. Winslow",
    coverUrl:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc",
    description: "A dreamy slow-burn cottagecore romance.",
    genres: ["Romance", "Historical"],
    vibes: ["Cottagecore", "Dreamy"],
    themes: ["Coming-of-age", "Healing"],
    pages: 360,
  },
  {
    id: "b2",
    title: "Embers in Ashes",
    author: "R. Noir",
    coverUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=def",
    description: "A moody, dark academia mystery with fragile hearts.",
    genres: ["Mystery", "Contemporary"],
    vibes: ["Dark", "Melancholy"],
    themes: ["Grief", "Self-discovery"],
    pages: 420,
  },
  {
    id: "b3",
    title: "Stardust Latte",
    author: "J. Harlow",
    coverUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=ghi",
    description: "A light feel-good romcom for rainy afternoons.",
    genres: ["Romance", "Contemporary"],
    vibes: ["Feel-good", "Cozy"],
    themes: ["Found family", "Self-discovery"],
    pages: 280,
  },
];
