import { Book } from "@/constants/book";
import { RecommendedBook } from "../api/recommend";

export function mapRecommendedBook(b: RecommendedBook): Book {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    coverUrl: b.cover_url ?? "",
    genres: b.genres ?? [],
    pages: b.pages,
    vibes: [],   // backend doesn’t send these yet
    themes: [],  // backend doesn’t send these yet
  };
}
