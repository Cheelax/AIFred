from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from dotenv import load_dotenv;
load_dotenv()
import argparse 
parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--task', default="add two numbers")
parser.add_argument('--language', default="python")

args=parser.parse_args()


llm = OpenAI(
)

code_prompt = PromptTemplate(
   input_variables=["language", "task"],
   template="write a {language} function will {task}",
)
test_prompt = PromptTemplate(
    input_variables=["language", "task"],
    template="Write a test for the following {language} code: \n{code}",
)

code_chain = LLMChain(
    llm=llm,
    prompt=code_prompt,
    output_key="code",
)

test_chain = LLMChain(
    llm=llm,
    prompt=test_prompt,
    output_key="test",
)

chain = SequentialChain(
    chains=[code_chain, test_chain],
    input_variables=["language", "task"],
    output_variables=["code", "test"],
)

result = chain({
    "language": args.language,
    "task": args.task,
})

print('>>>>GENERTED CODE')
print(result["code"])
print('>>>>GENERTED Test')

print(result["test"])