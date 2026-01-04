def build_reasons(
    *,
    vector_score: float,
    genre_score: float,
    page_score: float,
    user_genres: list[str],
    book_genres: list[str],
    used_taste_vector: bool,
    pages: int | None,
):
    reasons =[]
    signals = []

    signals.append(("semantic", vector_score))
    signals.append(("genre", genre_score))
    signals.append(("length", page_score))

    signals.sort(key=lambda x: x[1], reverse=True)
    top_signal = signals[0][0]

    if top_signal == "semantic":
        reasons.append("Closely matches the mood and themes you’re exploring")
    elif top_signal == "genre":
        reasons.append("Strong overlap with genres you enjoy")
    elif top_signal == "length":
        reasons.append("Fits your preferred book length")

    return reasons