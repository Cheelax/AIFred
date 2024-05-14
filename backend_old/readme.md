l y a un soucis au niveau des blocs de code, cela ne m'output plus cela comme un bloc apres le premier morceau de code

# LangChain Quickstart

Pour commencer avec LangChain, consultez la documentation officielle [ici](https://python.langchain.com/docs/get_started/quickstart).

## State

-get repos from github
-pass them to a vector db

## todo:

    - improved UI
    - history chat
    - refacto code

## Installation

Installez les packages nécessaires via pip :

    pip install langchain
    pip install openai
    pip install "langserve[all]"

## Files resume

    - github_clone.py: This script is responsible for cloning or pulling updates from GitHub repositories. It uses the GitHub API to fetch repositories and updates them locally.

    - gitLib.py: This file contains the GitLoader class, which is used to load text files from a local Git repository. It only loads text files and ignores other file types.

    - main.py: This is the main script of your application. It initializes a conversation history, a language model, a vector store, and a retriever. It then enters a loop where it asks the user for a question, reformulates the question based on the conversation history, and gets a response from the model.

    - serve.py: This script defines a FastAPI application and adds routes to it. It defines a processing chain that includes a chat prompt, a language model, and a parser that parses the output to a comma-separated list.

    - serveknowledge.py: This script is similar to serve.py, but it uses a different processing chain. It also uses a GitLoader to load documents from a Git repository and a Chroma vector store to index the documents.

    -vectordb.py: This script defines a VectorDB class that loads documents from a text file, splits them into chunks, and indexes them in a Chroma vector store. It also provides methods to perform similarity searches on the indexed documents.

## Configuration de l'API OpenAI

Définissez votre clé d'API OpenAI comme variable d'environnement `OPEN_API_KEY_FRED`. Si vous préférez ne pas utiliser de variable d'environnement, vous pouvez passer la clé directement via le paramètre nommé `openai_api_key` lors de l'initialisation de la classe OpenAI LLM :

    from langchainlangchain_community.chat_models import ChatOpenAI
    llm = ChatOpenAI(openai_api_key="votre_clé_api")

## Description alfred.py

This Python script is for a FastAPI server that uses the LangChain library to create a conversational retrieval chain. Here's a detailed overview of what the code does:

Imports: The script imports necessary modules and packages from various libraries such as FastAPI, LangChain, and others.

Logging: It sets up logging with a basic configuration and creates a logger.

Session Identifier Validation: It defines a utility function \_is_valid_identifier to validate session identifiers. This function checks if the session identifier only contains alphanumeric characters, hyphens, and underscores.

Chat History Factory: It defines a factory function create_session_factory to create chat histories. This function takes a base directory as input and returns a function that creates a FileChatMessageHistory object for a given session ID.

Output Parser: It defines a custom output parser class CommaSeparatedListOutputParser that inherits from BaseOutputParser. This class has a parse method that splits a given text into a list of strings separated by commas.

Document Loaders: It creates a GitLoader object to load documents from a Git repository. The repository's path, clone URL, and branch are specified as arguments. The loaded documents are stored in the data1 variable.

Embeddings: It initializes an OpenAIEmbeddings object with an OpenAI API key.

Database: It creates a Chroma database from the loaded documents and the embeddings.

Retriever: It creates a retriever from the database with the search type set to "mmr" and the number of results set to 8.

Language Model: It initializes a ChatOpenAI language model with an OpenAI API key and a model name.

Memory: It creates a ConversationSummaryMemory object with the language model and a memory key.

Conversational Retrieval Chain: It creates a ConversationalRetrievalChain from the language model, the retriever, and the memory.

Chat Prompt Template: It creates a ChatPromptTemplate from a list of messages.

Processing Chain with Chat History: It creates a processing chain with chat history using the RunnableWithMessageHistory class. The chat history is created using the factory function defined earlier.

FastAPI Application: It creates a FastAPI application and adds routes to it. The routes use the conversational retrieval chain to process input and retrieve responses.

Server Start: If the script is run directly, it starts the FastAPI server using uvicorn. The server runs on localhost at port 8069.

## Indexation des Données

Voir si on charge en mémoire ou pas

Utilisez `DocArrayInMemorySearch` pour indexer vos données. Vous remplacerez l'argument de `from_texts` par votre propre liste de chaînes de texte (issues de vos documents ou base de connaissances sur le développement de jeux on-chain). Par exemple :

    my_texts = ["Texte 1 sur le développement de jeux", "Texte 2 sur la blockchain", ...]
    vectorstore = DocArrayInMemorySearch.from_texts(
        my_texts,
        embedding=OpenAIEmbeddings(),
    )

## Personnalisation du Template

Le template que vous avez dans votre code est un exemple générique. Vous pouvez le personnaliser pour mieux correspondre à votre domaine. Par exemple, vous pourriez modifier la partie `{context}` pour inclure des balises spécifiques ou des formats qui correspondent mieux à votre contenu.

## Test et Ajustements

Testez le système avec diverses requêtes liées à votre domaine. En fonction des résultats, vous pourriez avoir besoin d'ajuster le template de prompt ou d'affiner votre ensemble de données pour obtenir de meilleures réponses.

## Intégration avec des Projets On-Chain

Pour l'intégration avec des projets de jeux on-chain, vous pourriez envisager de connecter ce système à une interface API qui pourrait être consultée par des applications on-chain ou des smart contracts, si nécessaire. Cela nécessiterait une couche supplémentaire d'API qui n'est pas couverte directement par le code que vous avez partagé.

## Évaluation et Optimisation

Évaluez les performances du système en termes de pertinence et de précision des réponses. Vous pourriez avoir besoin d'itérer sur votre ensemble de données et le tuning du modèle pour obtenir les meilleures performances.
