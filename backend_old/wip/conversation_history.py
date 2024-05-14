class ConversationHistory:
    def __init__(self, max_length=5):
        self.max_length = max_length
        self.history = []

    def add_message(self, human_message, ai_message):
        if len(self.history) >= self.max_length:
            # Supprimer les messages les plus anciens pour garder la taille de l'historique gérable
            self.history = self.history[-(self.max_length - 1):]

        # Ajouter les nouveaux messages
        self.history.append(("Human", human_message))
        self.history.append(("AI", ai_message))

    def get_history_string(self):
        # Formatte l'historique des conversations en une seule chaîne de caractères
        return "\n".join([f"{speaker}: {message}" for speaker, message in self.history])
