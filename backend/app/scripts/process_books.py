import pandas as pd
import json
import re
from itertools import cycle
from pathlib import Path

RAW_PATH = Path("data/raw/google_books.csv")
OUT_PATH = Path("data/processed/books_clean.json")

FALLBACK_COVERS = [
    "https://i.pinimg.com/736x/77/0f/0d/770f0d8f18ae23ddb49bed419da98621.jpg",
    "https://i.pinimg.com/736x/6a/26/c1/6a26c1d86188cdbf4d703548be77851b.jpg",
    "https://pin.it/60T3VX0tM",
    "https://i.pinimg.com/736x/b4/2c/b3/b42cb3164a4375c487e1ff69ac5a9c28.jpg",
]

fallback_cycle = cycle(FALLBACK_COVERS)

def clean_title(title: str) -> str:
    title = title.strip()
    title = re.sub(r"\s*[\(\[].*?[\)\]]$", "", title)
    return title

def parse_genres(raw: str):
    if not isinstance(raw, str):
        return []
    raw = raw.replace("/", ",")
    return [g.strip().title() for g in raw.split(",") if g.strip()]

def get_cover(thumbnail):
    if isinstance(thumbnail, str) and thumbnail.strip():
        return thumbnail
    return next(fallback_cycle)

def main():
    df = pd.read_csv(RAW_PATH)

    books = []

    for _, row in df.iterrows():
        if not isinstance(row.get("description"), str):
            continue

        book = {
            "id": str(row.get("book_id")),
            "title": clean_title(str(row.get("title", ""))),
            "author": str(row.get("authors", "")).strip(),
            "description": row.get("description").strip(),
            "genres": parse_genres(row.get("categories")),
            "pages": int(row.get("page_count")) if not pd.isna(row.get("page_count")) else None,
            "language": row.get("language"),
            "rating": float(row.get("average_rating")) if not pd.isna(row.get("average_rating")) else None,
            "rating_count": int(row.get("ratings_count")) if not pd.isna(row.get("ratings_count")) else None,
            "cover_url": get_cover(row.get("thumbnail")),
        }

        books.append(book)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

    print(f"Processed {len(books)} books → {OUT_PATH}")

if __name__ == "__main__":
    main()
