from sqlalchemy.orm import Session
import numpy as np

from app.db.models.user_signal import UserSignal
from app.vector.embedding import embed_text


SIGNAL_WEIGHTS = {
    "like": 1.0,
    "click": 0.3,
}


def build_user_taste_vector(
    db: Session,
    user_id,
    limit: int = 20,
):
    signals = (
        db.query(UserSignal)
        .filter(UserSignal.user_id == user_id)
        .order_by(UserSignal.created_at.desc())
        .limit(limit)
        .all()
    )

    if not signals:
        return None

    texts = []
    weights = []

    for s in signals:
        texts.append(s.book_id)  # temporary — we’ll improve this next
        weights.append(SIGNAL_WEIGHTS.get(s.signal, 0.1))

    vectors = embed_text(texts)

    weighted = np.average(vectors, axis=0, weights=weights)

    return weighted.tolist()

def blend_vectors(
    prompt_vector: list[float],
    taste_vector: list[float] | None,
    alpha: float = 0.7,
):
    if taste_vector is None:
        return prompt_vector

    prompt = np.array(prompt_vector)
    taste = np.array(taste_vector)

    blended = alpha * taste + (1 - alpha) * prompt
    return blended.tolist()