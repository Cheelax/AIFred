import type { Message, MessageOpts, Conversation } from "../store/chat/store";
import {
  resetAll,
  resetError,
  fetchConversations,
  createConversation,
  setActiveConversationId,
  scoreConversation,
} from "../store/chat/store";
import { useStreaming } from "../store/chat/stream";
import { useSync } from "../store/chat/sync";
// import { sendMessage as sendSyncMessage } from "../store/chat/sync";

export const useMessageSender = () => {
  const { sendMessage: sendStreamingMessage } = useStreaming();
  const { sendMessage: sendSyncMessage } = useSync();
  // const { sendMessage: sendSyncMessage } = useSync();
  const sendMessage = (message: Message, opts: MessageOpts) => {
    return opts.useStreaming
      ? sendStreamingMessage(message, opts)
      : sendSyncMessage(message, opts);
  };

  return {
    sendMessage,
    resetAll,
    resetError,
    fetchConversations,
    createConversation,
    scoreConversation,
  };
};
