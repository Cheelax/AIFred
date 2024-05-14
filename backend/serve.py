from typing import List

from fastapi import FastAPI
from langchain.llms.openai import OpenAI
from langchain.schema import HumanMessage
from langchain.prompts import ChatPromptTemplate
from langchainlangchain_community.chat_models import ChatOpenAI
from langchain.schema import BaseOutputParser
from langserve import add_routes
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.document_loaders import GitLoader
from langchain_community.vectorstores import FAISS
from github_clone import clone_github_repos
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain.memory import ConversationSummaryMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import FileChatMessageHistory
import re
from pathlib import Path
from typing import Callable, Union
from langchain_core.chat_history import BaseChatMessageHistory
from fastapi import FastAPI, HTTPException
from typing_extensions import TypedDict

# 1. Chain definition

class CommaSeparatedListOutputParser(BaseOutputParser[List[str]]):
    """Parse the output of an LLM call to a comma-separated list."""


    def parse(self, text: str) -> List[str]:
        """Parse the output of an LLM call."""
        return text.strip().split(", ")



loader = GitLoader(repo_path="./Code/AiFred/" ,branch="master")
   
data = loader.load()
db = Chroma.from_documents(data, OpenAIEmbeddings())
retriever = db.as_retriever(
    search_type="mmr",  # Also test "similarity"
    search_kwargs={"k": 8},
)

llm = ChatOpenAI( model="gpt-4-1106-preview")

embedding = OpenAIEmbeddings()
memory = ConversationSummaryMemory(
    llm=llm, memory_key="chat_history", return_messages=True
)
qa = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)



template = """Tu es mon developpeur prefere, tu dois m'aider a repondre a des questions. En utilisant les éléments dans le vectorstore Tu connais bien le projet AiFred et va m'aider à le faire évoluer. Si tu le peux, tu privilégiera de m'output des fichiers complets que je puisse les copier coller facilement"""
human_template = "{text}"

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", human_template),
])

category_chain = {"context": retriever, "question": RunnablePassthrough()} |chat_prompt | qa
chain = chat_prompt | qa
codechain = chat_prompt | qa 

def _is_valid_identifier(value: str) -> bool:
    """Check if the session ID is in a valid format."""
    # Use a regular expression to match the allowed characters
    valid_characters = re.compile(r"^[a-zA-Z0-9-_]+$")
    return bool(valid_characters.match(value))

def create_session_factory(
    base_dir: Union[str, Path],
) -> Callable[[str], BaseChatMessageHistory]:
    """Create a session ID factory that creates session IDs from a base dir.

    Args:
        base_dir: Base directory to use for storing the chat histories.

    Returns:
        A session ID factory that creates session IDs from a base path.
    """
    base_dir_ = Path(base_dir) if isinstance(base_dir, str) else base_dir
    if not base_dir_.exists():
        base_dir_.mkdir(parents=True)

    def get_chat_history(session_id: str) -> FileChatMessageHistory:
        """Get a chat history from a session ID."""
        if not _is_valid_identifier(session_id):
            raise HTTPException(
                status_code=400,
                detail=f"Session ID `{session_id}` is not in a valid format. "
                "Session ID must only contain alphanumeric characters, "
                "hyphens, and underscores.",
            )
        file_path = base_dir_ / f"{session_id}.json"
        return FileChatMessageHistory(str(file_path))

    return get_chat_history

class InputChat(TypedDict):
    """Input for the chat endpoint."""

    human_input: str
    """Human input"""

chain_with_history = RunnableWithMessageHistory(
    codechain,
    create_session_factory("chat_histories"),
    input_messages_key="human_input",
    history_messages_key="history",
).with_types(input_type=InputChat)
# 2. App definition
app = FastAPI(
  title="LangChain Server",
  version="1.0",
  description="A simple api server using Langchain's Runnable interfaces",
)

# 3. Adding chain route
add_routes(
    app,
    chain,
    path="/category_chain",
)

add_routes(
    app,
    codechain,
    path="/code",
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8069)