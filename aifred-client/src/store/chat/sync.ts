import type { Message, MessageOpts } from "./store";
import { useChatStore } from "./store";
import { api, getErrorMessage } from "@/api/axios";

export const useSync = () => {
  const {
    setError,
    setLoading,
    insertMessageToActive,
    getActiveConversation,
    removeMessageFromActive,
  } = useChatStore();

  const _addPendingMessage = (message: Message, pendingId: number) => {
    console.log("AddSyncPending");
    insertMessageToActive(message);
    insertMessageToActive({
      id: pendingId,
      role: "pending",
      content: "...",
    });
  };

  const sendMessage = async (message: Message, id: MessageOpts) => {
    const conversation = getActiveConversation();

    setLoading(true);
    const pendingId = Math.random();
    try {
      _addPendingMessage(message, pendingId);
      console.log("activeConversation");
      // console.log(activeConversation);
      const { data: responseMessage } = await api.post<Message>(
        `/conversations/${conversation?.id}/messages`,
        // {
        //   input: message.content,
        // }
        {
          method: "POST",
          body: JSON.stringify({
            input: message.content,
          }),
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "stream",
        }
      );

      removeMessageFromActive(pendingId);
      insertMessageToActive(responseMessage);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  return {
    sendMessage,
  };
};
