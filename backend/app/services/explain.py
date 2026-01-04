from typing import List, Optional


def build_reasons(
    *,
    vector_score: float,
    genre_score: float,
    page_score: float,
    user_genres: List[str],
    book_genres: List[str],
    used_taste_vector: bool,
    pages: Optional[int],
) -> List[str]:

    reasons: List[str] = []

    # 🥇 1. Taste-first (highest trust)
    if used_taste_vector:
        reasons.append(
            "Recommended because it’s similar to books you’ve interacted with"
        )

    # 🥈 2. Semantic / mood match
    elif vector_score >= 0.45:
        reasons.append(
            "Matches the mood, themes, and emotional tone you’re exploring"
        )

    # 🥉 3. Genre overlap
    elif genre_score > 0:
        overlap = set(g.lower() for g in user_genres) & set(
            g.lower() for g in book_genres
        )
        if overlap:
            reasons.append(
                f"Shares genres you like such as {', '.join(list(overlap)[:2])}"
            )

    # 🧩 4. Length preference (supporting reason)
    if page_score == 1 and pages:
        reasons.append("Fits your preferred reading length")

    # 🧼 Safety fallback
    if not reasons:
        reasons.append("Recommended based on overall relevance")

    return reasons
