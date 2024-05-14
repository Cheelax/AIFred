from typing import List

from fastapi import FastAPI
from langchain.llms.openai import OpenAI
from langchain.schema import HumanMessage
from langchain.prompts import ChatPromptTemplate
from langchainlangchain_community.chat_models import ChatOpenAI
from langchain.schema import BaseOutputParser
from langserve import add_routes
import os
from langchainlangchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.document_loaders import GitLoader
from langchain_community.vectorstores import FAISS
from github_clone import clone_github_repos
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_core.runnables import RunnablePassthrough

# 1. Chain definition

class CommaSeparatedListOutputParser(BaseOutputParser[List[str]]):
    """Parse the output of an LLM call to a comma-separated list."""


    def parse(self, text: str) -> List[str]:
        """Parse the output of an LLM call."""
        return text.strip().split(", ")

template = """You are a helpful assistant who generates comma separated lists.
A user will pass in a category, and you should generate 5 objects in that category in a comma separated list.
ONLY return a comma separated list, and nothing more."""
human_template = "{text}"

loader = GitLoader(repo_path="./Code/AiFred/" ,branch="master")
   
data = loader.load()
db = Chroma.from_documents(data, OpenAIEmbeddings())
embedding = OpenAIEmbeddings()
vectorstore = DocArrayInMemorySearch(db, embedding=embedding)
retriever = vectorstore.as_retriever()

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", human_template),
])

llm = OpenAI()
category_chain = category_chain = {"context": retriever, "question": RunnablePassthrough()} |chat_prompt | llm

# 2. App definition
app = FastAPI(
  title="LangChain Server",
  version="1.0",
  description="A simple api server using Langchain's Runnable interfaces",
)

# 3. Adding chain route
add_routes(
    app,
    category_chain,
    path="/category_chain",
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8069)