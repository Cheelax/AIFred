from prompts import context_prompt, history_prompt
from conversation_history import ConversationHistory


def combine_documents(docs):
    # Assurez-vous que le corps de la fonction est correctement indenté
    # Ici, ajoutez votre logique pour combiner les documents
    combined_docs = "\n\n".join(docs)  # Exemple de base
    return combined_docs

def process_history(question, chat_history):
    # Utilisez la méthode get_history_string de l'instance chat_history
    history_string = chat_history.get_history_string()
    return f"Question based on history: {history_string}\nQuestion: {question}"

def ask_question(question, chat_history, model, vectorstore):
    # Encore une fois, assurez-vous que cette fonction est correctement indentée
    # Implémentez la logique pour poser une question et obtenir une réponse
    standalone_question = process_history(question, chat_history)
    # ... (reste de votre logique pour ask_question)
