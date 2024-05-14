import os
import getpass
from langchain.document_loaders import TextLoader
from langchain_community.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma

class VectorDB:
    def __init__(self, document_path, chunk_size=1000, chunk_overlap=0):
        self.document_path = document_path
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.db = None

    def load_documents(self):
        raw_documents = TextLoader(self.document_path).load()
        text_splitter = CharacterTextSplitter(chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        documents = text_splitter.split_documents(raw_documents)
        self.db = Chroma.from_documents(documents, OpenAIEmbeddings())

    def similarity_search(self, query):
        docs = self.db.similarity_search(query)
        return docs[0].page_content

    def similarity_search_by_vector(self, query):
        embedding_vector = OpenAIEmbeddings().embed_query(query)
        docs = self.db.similarity_search_by_vector(embedding_vector)
        return docs[0].page_content
    
    def load_documents(self):
        for filename in os.listdir(self.document_path):
            if filename.endswith(".md") or filename.endswith(".py"):  # check for .md and .py files
                file_path = os.path.join(self.document_path, filename)
                raw_documents = TextLoader(file_path).load()
                text_splitter = CharacterTextSplitter(chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
                documents = text_splitter.split_documents(raw_documents)
                if self.db is None:
                    self.db = Chroma.from_documents(documents, OpenAIEmbeddings())
                else:
                    self.db.add_documents(documents, OpenAIEmbeddings())

if __name__ == "__main__":
    os.environ['OPENAI_API_KEY'] = getpass.getpass('OpenAI API Key:')
    vector_db = VectorDB('../../../state_of_the_union.txt')
    vector_db.load_documents()
    query = "What did the president say about Ketanji Brown Jackson"
    print(vector_db.similarity_search(query))
    print(vector_db.similarity_search_by_vector(query))