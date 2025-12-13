import json
from app.db.session import SessionLocal
from app.db.models.book import Book
from app.ml.embedding import embed_text
from app.ml.builders import build_book_text

BOOKS = [
    {
    "id": "1",
    "title": "The Seven Husbands of Evelyn Hugo",
    "author": "Taylor Jenkins Reid",
    "genres": ["Contemporary", "Historical", "Romance"],
    "vibes": ["Emotional & Deep", "Romantic & Swoony"],
    "themes": ["Love Triangle", "Self Discovery", "Betrayal"],
    "description": "A reclusive Hollywood icon opens up about her glamorous and scandalous life.",
   " pages": 400,
  },
  {
    "id": "2",
    "title": "The Night Circus",
    "author": "Erin Morgenstern",
    "genres": ["Fantasy", "Romance"],
    "vibes": ["Whimsical & Magical", "Romantic & Swoony", "Slow & Contemplative"],
    "themes": ["Enemies to Lovers", "Adventure"],
    "description": "A magical competition between two young illusionists at a mysterious circus.",
    "pages": 387,
  },
  {
    "id": "3",
    "title": "The Silent Patient",
    "author": "Alex Michaelides",
    "genres": ["Thriller", "Mystery"],
    "vibes": ["Dark & Mysterious", "Fast-Paced & Action"],
    "themes": ["Betrayal", "Redemption"],
    "description": "A woman's act of violence and a therapist's obsession to uncover why.",
    "pages": 336,
  },
  {
    "id": "4",
    "title": "Beach Read",
    "author": "Emily Henry",
    "genres": ["Romance", "Contemporary"],
    "vibes": ["Light & Funny", "Romantic & Swoony", "Cozy & Comforting"],
    "themes": ["Enemies to Lovers", "Self Discovery"],
    "description": "Two writers challenge each other to swap genres for the summer.",
    "pages": 368,
  },
  {
    "id": "5",
    "title": "Mexican Gothic",
    "author": "Silvia Moreno-Garcia",
    "genres": ["Horror", "Mystery", "Historical"],
    "vibes": ["Spooky & Eerie", "Dark & Mysterious"],
    "themes": ["Self Discovery", "Betrayal"],
    "description": "A young woman travels to a decaying mansion in the Mexican countryside.",
    "pages": 301,
  },
  {
    "id": "6",
    "title": "Project Hail Mary",
    "author": "Andy Weir",
    "genres": ["Science Fiction"],
    "vibes": ["Fast-Paced & Action", "Light & Funny"],
    "themes": ["Adventure", "Friendship", "Redemption"],
    "description": "A lone astronaut must save Earth from an extinction-level threat.",
    "pages": 476,
  },
  {
    "id": "7",
    "title": "The House in the Cerulean Sea",
    "author": "TJ Klune",
    "genres": ["Fantasy", "Contemporary"],
    "vibes": ["Cozy & Comforting", "Whimsical & Magical", "Romantic & Swoony"],
    "themes": ["Found Family", "Self Discovery"],
    "description": "A caseworker discovers a magical orphanage and its unusual residents.",
    "pages": 394,
  },
  {
    "id": "8",
    "title": "The Song of Achilles",
    "author": "Madeline Miller",
    "genres": ["Fantasy", "Historical", "Romance"],
    "vibes": ["Emotional & Deep", "Romantic & Swoony"],
    "themes": ["Friendship", "Love Triangle", "Betrayal"],
   " description": "A retelling of the Trojan War through the eyes of Patroclus.",
    "pages": 352,
  },
  {
    "id": "9",
    "title": "Daisy Jones & The Six",
    "author": "Taylor Jenkins Reid",
    "genres": ["Contemporary", "Historical"],
    "vibes": ["Emotional & Deep", "Gritty & Raw"],
    "themes": ["Self Discovery", "Betrayal", "Friendship"],
    "description": "The rise and fall of a legendary 1970s rock band.",
    "pages": 368,
  },
  {
    "id": "10",
    "title": "The Invisible Life of Addie LaRue",
    "author": "V.E. Schwab",
    "genres": ["Fantasy", "Romance", "Historical"],
    "vibes": ["Emotional & Deep", "Romantic & Swoony", "Slow & Contemplative"],
    "themes": ["Self Discovery", "Love Triangle"],
    "description": "A woman who can't be remembered makes a deal for immortality.",
    "pages": 448,
  },
]

def run():
    db = SessionLocal()

    for data in BOOKS:
        text = build_book_text(type("Obj", (), data))
        embedding = embed_text(text)

        book = Book(**data, embedding=json.dumps(embedding))
        db.merge(book)

    db.commit()
    db.close()

if __name__ == "__main__":
    run()
