from langchain.llms import OpenAI
from langchainlangchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser

llm = OpenAI()
chat_model = ChatOpenAI()

from langchain.schema import HumanMessage

text = "What would be a good company name for a company that makes colorful socks?"
messages = [HumanMessage(content=text)]

llm.invoke(text)
# >> Feetful of Fun

chat_model.invoke(messages)
# >> AIMessage(content="Socks O'Color")

prompt = PromptTemplate.from_template("What is a good name for a company that makes {product}?")
prompt.format(product="colorful socks")
# >>What is a good name for a company that makes colorful socks?

# template
template = "You are a helpful assistant that translates {input_language} to {output_language}."
human_template = "{text}"

#complex prompt
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", human_template),
])

chat_prompt.format_messages(input_language="English", output_language="French", text="I love programming.")

# [
#     SystemMessage(content="You are a helpful assistant that translates English to French.", additional_kwargs={}),
#     HumanMessage(content="I love programming.")
# ]

# process output
class CommaSeparatedListOutputParser(BaseOutputParser):
    """Parse the output of an LLM call to a comma-separated list."""


    def parse(self, text: str):
        """Parse the output of an LLM call."""
        return text.strip().split(", ")

CommaSeparatedListOutputParser().parse("hi, bye")