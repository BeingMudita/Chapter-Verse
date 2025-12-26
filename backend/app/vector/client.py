from qdrant_client import QdrantClient

qdrant = QdrantClient(
    url="http://localhost:6333",
    timeout=60
)
