import axios from "axios";
import type { Message, MessageOpts } from "./store";
import { useChatStore } from "./store";

import { api, getErrorMessage } from "@/api/axios";

export const useStreaming = () => {
  const {
    insertMessageToActive,
    appendResponse,
    setLoading,
    setError,
    getActiveConversation,
  } = useChatStore();

  const _addMessage = (message: Message) => {
    insertMessageToActive(message);
  };

  const _appendResponse = (id: number, text: string) => {
    appendResponse(id, text);
  };

  const sendMessage = async (userMessage: Message, id: MessageOpts) => {
    const conversation = getActiveConversation();
    if (!conversation) return;

    console.log("conversation" + conversation);
    console.log("message" + userMessage.content);
    if (!id) return;

    setLoading(true);

    const responseMessage = {
      role: "pending",
      content: "",
      id: Math.random(), // Assurez-vous que c'est suffisamment unique pour votre cas d'utilisation
    };

    try {
      _addMessage(userMessage);
      _addMessage({
        id: responseMessage.id,
        role: "pending",
        content: responseMessage.content,
      });

      const response = await fetch(
        `http://localhost:8069/api/conversations/${conversation.id}/messages?stream=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: userMessage.content }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok.");

      const reader = response.body?.getReader(); // Add null check for response.body

      if (reader) {
        readResponse(reader, responseMessage as Message).then(() => {
          console.log("All data has been read");
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const readResponse = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    responseMessage: Message
  ) => {
    let inProgress = true;

    while (inProgress) {
      const { done, value } = await reader.read();
      if (done) {
        inProgress = false;
        break;
      }
      const text = new TextDecoder().decode(value);

      if (responseMessage.id) {
        _appendResponse(responseMessage.id, text);
      }
    }
  };

  return {
    readResponse,
    sendMessage,
  };
};
