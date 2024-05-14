from langchainlangchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

def get_model():
    return ChatOpenAI(openai_api_key=api_key)

def get_vectorstore():
    return FAISS.from_texts(
        ["harrison worked at kensho"],
        embedding=OpenAIEmbeddings(openai_api_key=api_key)
    )
