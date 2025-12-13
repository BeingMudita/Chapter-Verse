def build_book_text(book) -> str:
    return f"""
    Title: {book.title}
    Author: {book.author}
    Genres: {book.genres}
    Vibes: {book.vibes}
    Themes: {book.themes}
    Description: {book.description or ""}
    """
