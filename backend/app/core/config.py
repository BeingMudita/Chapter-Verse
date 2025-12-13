from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://localhost:5432/chapterverse"
    ENV: str = "dev"

    class Config:
        env_file = ".env"

settings = Settings()
