import os
from langchainlangchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.document_loaders import GitLoader
from langchain_community.vectorstores import FAISS
from github_clone import clone_github_repos
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import DocArrayInMemorySearch

class ConversationHistory:
    def __init__(self, max_length=5):
        self.max_length = max_length
        self.history = []

    def add_message(self, message):
        self.history.append(message)
        if len(self.history) > self.max_length:
            self.history.pop(0)

    def get_history_string(self):
        return "\n".join([str(msg) for msg in self.history])

def reformulate_question(question, history):
    # Add your logic to reformulate the question here
    return question

def main():
    print("Welcome to AiFred, the AI assistant for Fred!")
    chat_history = ConversationHistory()
    model = ChatOpenAI()
    print("Model loaded")
    vectorstore = FAISS.from_texts(
    ["harrison worked at kensho"], embedding=OpenAIEmbeddings()
)
    retriever = vectorstore.as_retriever()
    print("Vectorstore loaded")
        # Load the files from the repository
    loader = GitLoader(repo_path="./Code/AiFred/" ,branch="master")
   
    data = loader.load()
    print("data" , data)
    # Initialize the document array

   

    db = Chroma.from_documents(data, OpenAIEmbeddings())

    # Initialize the embedding
    embedding = OpenAIEmbeddings()

    # Initialize the vector store
    vectorstore = DocArrayInMemorySearch(db, embedding=embedding)

    retriever = vectorstore.as_retriever()
    print("Vectorstore loaded")
    


    while True:
        question = input("Please enter your question: ")
        if question.lower() == 'quit':
            break

        chat_history.add_message(f"Human: {question}")
        standalone_question = reformulate_question(question, chat_history.get_history_string())
        print("Question worked on history: {chat_history.get_history_string() \n}")
        response = model.invoke(standalone_question)
        print(response)

        # Continue with the conversation
        chat_history.add_message(f"AI: {response}")

if __name__ == "__main__":
    main()