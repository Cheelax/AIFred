from langchain.vectorstores.chroma import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI;
from redundant_filter_retriver import RedundantFilterRetriver
from dotenv import load_dotenv
load_dotenv()

chat = ChatOpenAI() 

embedding = OpenAIEmbeddings()
db = Chroma(
    persist_directory="emb",
    embedding_function=embedding
)

retriever = RedundantFilterRetriver(
    embeddings=embedding,
    chroma=db
)

chain=RetrievalQA.from_chain_type(llm=chat, retriever = retriever, chain_type="stuff")
result = chain.run("What is an interesting fact about english language")