# File: backend/app/services/ai_service.py

from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

class AIService:
    """
    Singleton class to manage AI models and database connections.
    Ensures we only load the models once.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Initializing AI Service (loading models, connecting to DB)...")
            cls._instance = super(AIService, cls).__new__(cls)

            # 1. Load the Embedding Model
            model_name = "sentence-transformers/all-MiniLM-L6-v2"
            model_kwargs = {'device': 'cpu'}
            encode_kwargs = {'normalize_embeddings': False}

            cls._instance.embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )

            # 2. Connect to Pinecone
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            cls._instance.index = pc.Index(host=settings.PINECONE_HOST)

            # 3. Load the GenAI Model (Groq)
            cls._instance.llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model="llama-3.1-8b-instant",
                temperature=0.7
            )

            # 4. Prepare a chat prompt template
            cls._instance.prompt = ChatPromptTemplate.from_template(
                """
                You are a witty and creative marketing assistant.
                A user is looking for a product. Your job is to write a short,
                catchy product description (1-2 sentences) for a product with the
                following title: {title}.
                Do not just repeat the title. Be creative.
                """
            )

            print("AI Service initialized.")
        return cls._instance

    def get_embeddings_model(self):
        return self.embeddings

    def get_vector_index(self):
        return self.index
    
    def get_llm(self):
        return self.llm
    
    def get_prompt(self):
        return self.prompt

# Create the single instance that the rest of our app will import
ai_service = AIService()

def get_ai_service():
    """FastAPI dependency to get the singleton instance."""
    return ai_service