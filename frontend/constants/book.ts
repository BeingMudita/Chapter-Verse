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
    id: "1",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    genres: ["Contemporary", "Historical", "Romance"],
    vibes: ["Emotional & Deep", "Romantic & Swoony"],
    themes: ["Love Triangle", "Self Discovery", "Betrayal"],
    description: "A reclusive Hollywood icon opens up about her glamorous and scandalous life.",
    pages: 400,
  },
  {
    id: "2",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    genres: ["Fantasy", "Romance"],
    vibes: ["Whimsical & Magical", "Romantic & Swoony", "Slow & Contemplative"],
    themes: ["Enemies to Lovers", "Adventure"],
    description: "A magical competition between two young illusionists at a mysterious circus.",
    pages: 387,
  },
  {
    id: "3",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    genres: ["Thriller", "Mystery"],
    vibes: ["Dark & Mysterious", "Fast-Paced & Action"],
    themes: ["Betrayal", "Redemption"],
    description: "A woman's act of violence and a therapist's obsession to uncover why.",
    pages: 336,
  },
  {
    id: "4",
    title: "Beach Read",
    author: "Emily Henry",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    genres: ["Romance", "Contemporary"],
    vibes: ["Light & Funny", "Romantic & Swoony", "Cozy & Comforting"],
    themes: ["Enemies to Lovers", "Self Discovery"],
    description: "Two writers challenge each other to swap genres for the summer.",
    pages: 368,
  },
  {
    id: "5",
    title: "Mexican Gothic",
    author: "Silvia Moreno-Garcia",
    coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop",
    genres: ["Horror", "Mystery", "Historical"],
    vibes: ["Spooky & Eerie", "Dark & Mysterious"],
    themes: ["Self Discovery", "Betrayal"],
    description: "A young woman travels to a decaying mansion in the Mexican countryside.",
    pages: 301,
  },
  {
    id: "6",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
    genres: ["Science Fiction"],
    vibes: ["Fast-Paced & Action", "Light & Funny"],
    themes: ["Adventure", "Friendship", "Redemption"],
    description: "A lone astronaut must save Earth from an extinction-level threat.",
    pages: 476,
  },
  {
    id: "7",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    genres: ["Fantasy", "Contemporary"],
    vibes: ["Cozy & Comforting", "Whimsical & Magical", "Romantic & Swoony"],
    themes: ["Found Family", "Self Discovery"],
    description: "A caseworker discovers a magical orphanage and its unusual residents.",
    pages: 394,
  },
  {
    id: "8",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=600&fit=crop",
    genres: ["Fantasy", "Historical", "Romance"],
    vibes: ["Emotional & Deep", "Romantic & Swoony"],
    themes: ["Friendship", "Love Triangle", "Betrayal"],
    description: "A retelling of the Trojan War through the eyes of Patroclus.",
    pages: 352,
  },
  {
    id: "9",
    title: "Daisy Jones & The Six",
    author: "Taylor Jenkins Reid",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop",
    genres: ["Contemporary", "Historical"],
    vibes: ["Emotional & Deep", "Gritty & Raw"],
    themes: ["Self Discovery", "Betrayal", "Friendship"],
    description: "The rise and fall of a legendary 1970s rock band.",
    pages: 368,
  },
  {
    id: "10",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    genres: ["Fantasy", "Romance", "Historical"],
    vibes: ["Emotional & Deep", "Romantic & Swoony", "Slow & Contemplative"],
    themes: ["Self Discovery", "Love Triangle"],
    description: "A woman who can't be remembered makes a deal for immortality.",
    pages: 448,
  },
];
