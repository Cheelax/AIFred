from langchain.prompts import ChatPromptTemplate

context_template = """..."""  # Votre template ici
history_template = """..."""  # Votre template ici

context_prompt = ChatPromptTemplate.from_template(context_template)
history_prompt = ChatPromptTemplate.from_template(history_template)
