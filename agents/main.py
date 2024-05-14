from langchain.chat_models import ChatOpenAI
from langchain.prompts import (ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder)
from langchain.agents import OpenAIFunctionsAgent,AgentExecutor
from langchain.schema import SystemMessage
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
from tools.sql import run_query_tool, list_tables, describe_tables_tool
from tools.report import write_report_tool
from handlers.chat_model_start_handler import ChatModelStartHandler
load_dotenv()

handler = ChatModelStartHandler()
chat= ChatOpenAI(
    callbacks=[handler]
)

tables = list_tables()
prompt = ChatPromptTemplate(
    messages=[
        SystemMessage(content=(
            "You are an AI that has to a sqlite database\n"
            f"the tables in the database are {tables} \n"
            "do no make any assumptions about the tables in the database\n"
            "or what columns exist, use describe_tables_tool instead\n")),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
tools = [run_query_tool, describe_tables_tool, write_report_tool]
agent=OpenAIFunctionsAgent(llm=chat, prompt=prompt, tools=tools)

agent_executor=AgentExecutor(agent=agent,verbose=True, tools=tools, handle_parsing_errors=True, memory=memory)

# agent_executor("How many users have provided a shipping address?")
agent_executor("Summarize the top 5 most popular proudcts. Write the results to a report file.")