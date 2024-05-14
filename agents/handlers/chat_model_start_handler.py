from typing import Any, Dict, List, Optional
from uuid import UUID
from langchain.callbacks.base import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from pyboxen import boxen

def boxen_print(*args, **kwargs):
    print(boxen(*args, **kwargs))

class ChatModelStartHandler(BaseCallbackHandler):
    def on_chat_model_start(self, serialized: Dict[str, Any], messages: List[List[BaseMessage]], **kwargs) :
        print("\n\n =============== Sending messages=============== \n\n")
        for message in messages[0]:
            if message.type == "system":
                boxen_print(message.content, title=message.type, border_style="double" ,color="yellow")
            elif message.type == "human":
                boxen_print(message.content, title=message.type, border_style="double", color="green")
            elif message.type == "ai" and "function_call" in message.additional_kwargs:
                call = message.additional_kwargs["function_call"]
                boxen_print(f"Running tool {call['name']} with args {call['arguments']}", title=message.type, border_style="double", color="blue")
            elif message.type == "ai":
                boxen_print(message.content, title=message.type, border_style="double", color="red")
            elif message.type == "function":
                boxen_print(message.content,title=message.type, border_style="double", color="cyan")
            else:
                boxen_print(message.content, title=message.type, border_style="double")