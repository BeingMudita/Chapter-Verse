export type RecommendRequest = {
  user_id: string;
  genres: string[];
  vibes: string[];
  themes: string[];
  pacePreference?: string | null;
  lengthPreference?: string | null;
  limit?: number;
};

export type RecommendedBook = {
  id: string;
  title: string;
  author: string;
  description?: string;
  genres: string[];
  pages?: number;
  cover_url?: string;
  score: number;
  reasons: string[];
};

export async function fetchRecommendations(
  payload: RecommendRequest
): Promise<RecommendedBook[]> {
  const res = await fetch("http://127.0.0.1:8000/api/v1/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
}
