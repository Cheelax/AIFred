"""Example of a chat server with persistence handled on the backend.

For simplicity, we're using file storage here -- to avoid the need to set up
a database. This is obviously not a good idea for a production environment,
but will help us to demonstrate the RunnableWithMessageHistory interface.

We'll use cookies to identify the user and/or session. This will help illustrate how to
fetch configuration from the request.
"""
import re
from pathlib import Path
from typing import Callable, Union

from fastapi import FastAPI, HTTPException
from langchain.chat_models import ChatAnthropic
from langchain.memory import FileChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from typing_extensions import TypedDict
from langchainlangchain_community.chat_models import ChatOpenAI

from langserve import add_routes


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


app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)


# Declare a chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You're an assistant by the name of Bob."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{human_input}"),
    ]
)

chain = prompt | ChatOpenAI( model="gpt-4-1106-preview")


class InputChat(TypedDict):
    """Input for the chat endpoint."""

    human_input: str
    """Human input"""


chain_with_history = RunnableWithMessageHistory(
    chain,
    create_session_factory("chat_histories"),
    input_messages_key="human_input",
    history_messages_key="history",
).with_types(input_type=InputChat)


add_routes(
    app,
    chain_with_history,
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8069)