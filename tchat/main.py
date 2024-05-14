from langchain.prompts import HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv;
from langchain.memory import ConversationSummaryMemory, FileChatMessageHistory

load_dotenv()

chat = ChatOpenAI(verbose=True)

# memory = ConversationBufferMemory(memory_key="messages", return_messages=True, chat_memory=FileChatMessageHistory("messages.json"))
memory = ConversationSummaryMemory(memory_key="messages", return_messages=True, llm=chat)

prompt = ChatPromptTemplate(
    input_variables=["content", "messages"],
    messages=[
        MessagesPlaceholder(variable_name="messages"),
        HumanMessagePromptTemplate.from_template("{content}")
    ]
)

chain = LLMChain(
    llm=chat,
    prompt=prompt,
    memory=memory,
    output_key="response",
)
while True:
    content = input(">> ")
    result = chain({"content": content})
    print(result["response"])