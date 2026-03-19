from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Config
    PROJECT_NAME: str = "ProdRecommendationApp"
    SECRET_KEY: str
    DATABASE_URL: str = "sqlite:///./test.db"
    BACKEND_CORS_ORIGINS: list[str] = ["https://product-recommendation-app-wine.vercel.app", "http://localhost:5173"]
    CLERK_SECRET_KEY: str
    # Pinecone & AI Keys
    PINECONE_API_KEY: str
    PINECONE_HOST: str
    GROQ_API_KEY: str
    HUGGINGFACEHUB_API_TOKEN: str

    class Config:
        # This tells Pydantic to load the variables from a .env file
        env_file = ".env"

settings = Settings()