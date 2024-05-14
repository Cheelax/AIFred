from langchain.document_loaders import TextLoader

loader = TextLoader("./data.txt")
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS

documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(texts, embeddings)
retriever = db.as_retriever()

from langchain.agents.agent_toolkits import create_retriever_tool

tool = create_retriever_tool(
    retriever,
    "search_state_of_union",
    "Searches and returns documents regarding the state-of-the-union.",
)
tools = [tool]

from langchain.agents.agent_toolkits import create_conversational_retrieval_agent

from langchainlangchain_community.chat_models import ChatOpenAI

llm = ChatOpenAI(temperature=0)

agent_executor = create_conversational_retrieval_agent(llm, tools, verbose=True)

result = agent_executor({"input": "hi, im bob"})

result = agent_executor(
    {
        "input": "what did the president say about kentaji brown jackson in the most recent state of the union?"
    }
)