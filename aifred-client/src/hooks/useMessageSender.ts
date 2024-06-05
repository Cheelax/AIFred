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
// import { getPublicRepos } from '../utils/github';

export const useMessageSender = () => {
  const { sendMessage: sendStreamingMessage } = useStreaming();
  const { sendMessage: sendSyncMessage } = useSync();
  
  const sendMessage = (message: Message, opts: MessageOpts) => {
    return opts.useStreaming
      ? sendStreamingMessage(message, opts)
      : sendSyncMessage(message, opts);
  };

  // const fetchPublicRepos = async (username: string) => {
  //   return await getPublicRepos(username);
  // };

  const createConversationWithRepos = async (pdfId: string, repoUsernames: string[]) => {
    const allRepos = [];
    for (const username of repoUsernames) {
      // const repos = await fetchPublicRepos(username);
      // allRepos.push(...repos);
    }
    // return await createConversation(pdfId,allRepos);
  };

  return {
    sendMessage,
    resetAll,
    resetError,
    fetchConversations,
    createConversation,
    scoreConversation,
    // fetchPublicRepos,
    createConversationWithRepos,
  };
};
