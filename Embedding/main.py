from dotenv import load_dotenv
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.chroma import Chroma
load_dotenv()

embedding = OpenAIEmbeddings()
text_splitter = CharacterTextSplitter(separator="\n", chunk_size=200, chunk_overlap=100)
loader=TextLoader("facts.txt")
docs=loader.load_and_split(text_splitter=text_splitter)

db = Chroma.from_documents(docs, embedding, persist_directory="emb")
results = db.similarity_search_with_score("What is an interesting fact about english language")

for result in results:
    print(('\n'))
    print(result[1])
    print(result[0].page_content)
    print("----")