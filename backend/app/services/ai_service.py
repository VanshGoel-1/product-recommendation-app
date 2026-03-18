# File: backend/app/services/ai_service.py

from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEndpointEmbeddings
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
            print("Initializing AI Service (API-based, connecting to DB)...")
            cls._instance = super(AIService, cls).__new__(cls)

            # 1. Load the Embedding Model (API-based via HF Inference API)
            # This uses the SAME model as before (384 dim) but via API 
            # to avoid loading torch/transformers locally.
            cls._instance.embeddings = HuggingFaceEndpointEmbeddings(
                model="sentence-transformers/all-MiniLM-L6-v2",
                huggingfacehub_api_token=settings.HUGGINGFACEHUB_API_TOKEN
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
                You are a sophisticated AI shopping assistant for a premium furniture and lifestyle brand.
                
                Product Details:
                Title: {title}
                Brand: {brand}
                Price: {price}
                Categories: {categories}
                
                Task:
                Write a compelling, concise, and conversion-driven product description (2 sentences max).
                Focus on the benefits, lifestyle appeal, and quality. 
                Do NOT use "Introduce..." or "Here is...". Just give the description.
                Make it sound like a high-end catalog description.
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