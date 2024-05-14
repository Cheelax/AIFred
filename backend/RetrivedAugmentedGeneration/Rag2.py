from langchainlangchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

# Amélioration de la gestion de l'historique des conversations
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

# Initialisation de l'historique
conversation_history = ConversationHistory()

# Fonction pour reformuler les questions
def reformulate_question(question, history):
    # Ici, ajoutez votre logique pour reformuler la question
    return question

# Configuration du modèle
model = ChatOpenAI()

def ask_question(question):
    # Ajouter la question à l'historique
    conversation_history.add_message(f"Human: {question}")

    # Reformuler la question en fonction de l'historique
    standalone_question = reformulate_question(question, conversation_history.get_history_string())

    # Générer la réponse
    response = model.invoke(standalone_question)

    # Ajouter la réponse à l'historique
    conversation_history.add_message(f"AI: {response}")

    return response

# Exemple d'utilisation
response = ask_question("where did harrison work?")
print(response)

response = ask_question("I think he works at zkorp?")
print(response)

# Suivi avec une autre question
response = ask_question("where did he work?")
print(response)
