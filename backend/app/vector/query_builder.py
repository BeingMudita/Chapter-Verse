def build_user_query(preferences: dict) -> str:
    parts = []

    if preferences.get("genres"):
        parts.append(
            "Genres: " + ", ".join(preferences["genres"])
        )

    if preferences.get("vibes"):
        parts.append(
            "Vibes: " + ", ".join(preferences["vibes"])
        )

    if preferences.get("themes"):
        parts.append(
            "Themes: " + ", ".join(preferences["themes"])
        )

    if preferences.get("pacePreference"):
        parts.append(
            f"Reading pace: {preferences['pacePreference']}"
        )

    if preferences.get("lengthPreference"):
        parts.append(
            f"Book length: {preferences['lengthPreference']}"
        )

    return ". ".join(parts)
