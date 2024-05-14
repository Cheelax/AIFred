import os
from pinecone import Pinecone as PineconeClient
from langchain_community.vectorstores.pinecone import Pinecone
from app.chat.embeddings.openai import embeddings

api_key = os.getenv("PINECONE_API_KEY")
env_name = os.getenv("PINECONE_ENV_NAME")
index_name = os.getenv("PINECONE_INDEX_NAME")

print("API Key:", api_key)
print("Environment Name:", env_name)
print("Index Name:", index_name)

pinecone = PineconeClient(api_key, env_name)

vector_store = Pinecone.from_existing_index(index_name, embeddings)

vector_store.as_retriever()

def build_retriever(chat_args, k):
    search_kwargs  = {"filter": { "pdf_id": chat_args.pdf_id }, "k": k}
    return vector_store.as_retriever(search_kwargs=search_kwargs)