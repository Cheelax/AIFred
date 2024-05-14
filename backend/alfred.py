import os
import re
from typing import List, Callable, Union
from pathlib import Path
from fastapi import FastAPI, HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import BaseOutputParser
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import GitLoader
from langchain_community.vectorstores import FAISS, Chroma, DocArrayInMemorySearch
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain.memory import ConversationSummaryMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import FileChatMessageHistory
from langserve import add_routes
from typing_extensions import TypedDict
from langchain_core.chat_history import BaseChatMessageHistory
import logging
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter

# Configuration de base du logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)
# Utilitaire pour valider l'identifiant de session
def _is_valid_identifier(value: str) -> bool:
    valid_characters = re.compile(r"^[a-zA-Z0-9-_]+$")
    return bool(valid_characters.match(value))

# Factory pour créer des historiques de chat
def create_session_factory(base_dir: Union[str, Path]) -> Callable[[str], BaseChatMessageHistory]:
    base_dir_ = Path(base_dir) if isinstance(base_dir, str) else base_dir
    if not base_dir_.exists():
        base_dir_.mkdir(parents=True)

    def get_chat_history(session_id: str) -> FileChatMessageHistory:
        if not _is_valid_identifier(session_id):
            raise HTTPException(
                status_code=400,
                detail=f"Session ID `{session_id}` is not in a valid format. "
                "Session ID must only contain alphanumeric characters, "
                "hyphens, and underscores."
            )
        file_path = base_dir_ / f"{session_id}.json"
        return FileChatMessageHistory(str(file_path))

    return get_chat_history

# Parser de sortie personnalisé
class CommaSeparatedListOutputParser(BaseOutputParser[List[str]]):
    def parse(self, text: str) -> List[str]:
        return text.strip().split(", ")

# Création du premier loader
data1 = loader1.load()

logger.info(f"Nombre de documents chargés du premier dépôt : {len(data1)}")
for doc in data1:
    file_path = doc.metadata.get('file_path', 'Chemin non disponible') if hasattr(doc, 'metadata') else 'Metadata non disponible'
    logger.info(f"Chemin du fichier chargé : {file_path}")

# # Création du deuxième loader
# loader2 = GitLoader(repo_path="./", clone_url="https://github.com/YourSecondRepo/Repo.git",branch="main")  # Remplacez par l'URL de votre deuxième dépôt
# data2 = loader2.load()

# logger.info(f"Nombre de documents chargés du deuxième dépôt : {len(data2)}")
# for doc in data2:
#     file_path = doc.metadata.get('file_path', 'Chemin non disponible') if hasattr(doc, 'metadata') else 'Metadata non disponible'
#     logger.info(f"Chemin du fichier chargé : {file_path}")

# Fusion des données des deux dépôts
data = data1

# Création du loader

data = loader1.load()

logger.info(f"Nombre de documents chargés : {len(data)}")
for doc in data:
    # Supposons que 'metadata' est un attribut de l'objet Document et qu'il est un dictionnaire
    file_path = doc.metadata.get('file_path', 'Chemin non disponible') if hasattr(doc, 'metadata') else 'Metadata non disponible'
    logger.info(f"Chemin du fichier chargé : {file_path}")

# Initialisation de divers composants LangChain
embedding = OpenAIEmbeddings()

logger.info(f"Embedding chargé : {embedding}")

db = Chroma.from_documents(data, embedding)
# logger.info(f"Nombre de documents dans la base de données : {len(db)}")

        # Si les documents sont de petite taille, vous pouvez choisir de logger quelques exemples
# for i, doc in enumerate(db[:5]):  # Log les 5 premiers documents
#     logger.info(f"Document {i}: {doc}")

retriever = db.as_retriever(search_type="mmr", search_kwargs={"k": 8})
llm = ChatOpenAI( model="gpt-4-1106-preview")
memory = ConversationSummaryMemory(llm=llm, memory_key="chat_history", return_messages=True)
# Création de chaînes de traitement LangChain
qa = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "Tu es mon développeur préféré, aide-moi à répondre aux questions."),
    ("human", "{text}")
])

# Chaîne de traitement avec historique de chat
chain_with_history = RunnableWithMessageHistory(
    qa,
    create_session_factory("chat_histories"),
    input_messages_key="human_input",
    history_messages_key="history",
).with_types(input_type=TypedDict('InputChat', {'human_input': str}))

# Définition et lancement de l'application FastAPI
app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple API server using Langchain's Runnable interfaces"
)

# Ajout de routes à l'application
add_routes(app, qa, path="/")
add_routes(app, qa, path="/code")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8069)