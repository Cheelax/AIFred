import React, { useState, useEffect, useContext } from "react";
// import { useChat } from "@/providers/chatProvider"; // Ajustez selon votre implémentation
import { Alert } from "../../components/ui/alert";
import ChatInput from "./chatInput";
import ChatList from "./chatList";
import ConversationSelect from "./conversationSelect";
// import { sendMessage } from "@/store/chat";
import { useChatStore } from "@/store/chat/store";
import { useMessageSender } from "@/hooks/useMessageSender";
// Assurez-vous que les chemins d'importation sont corrects pour vos composants

interface ChatComponentProps {
  onSubmit: (content: string, useStreaming: boolean, id: string) => void;
  documentId: string;
}

const ChatPanel: React.FC<ChatComponentProps> = ({ onSubmit, documentId }) => {
  const [useStreaming, setUseStreaming] = useState<boolean>(true);
  const {
    getActiveConversation,
    activeConversationId,
    setActiveConversationId,
    conversations,
    error,
    fetchConversations,
    createConversation,
    resetError,
  } = useChatStore();

  const { sendMessage } = useMessageSender();

  const [activeConversation, setActiveConversation] = useState(
    getActiveConversation()
  );

  useEffect(() => {
    const storedUseStreaming = localStorage.getItem("streaming");
    if (storedUseStreaming !== null) {
      setUseStreaming(storedUseStreaming === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUseStreaming = window.localStorage.getItem("streaming");
      if (storedUseStreaming !== null) {
        setUseStreaming(storedUseStreaming === "true");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("streaming", useStreaming ? "true" : "");
    }
  }, [useStreaming]);

  useEffect(() => {
    console.log("useEffect for fetchConversations");
    if (documentId) {
      fetchConversations(documentId);
    }
  }, [documentId]);

  useEffect(() => {
    if (activeConversationId) {
      console.log("setActiveFromObject");
      console.log("activeConversation", getActiveConversation());
      console.log("conversations", conversations);
      console.log(activeConversationId);
      setActiveConversation(getActiveConversation());
    } else {
      setActiveConversationId("0");
    }
  }, [setActiveConversationId, setActiveConversationId, conversations]);

  const handleNewChat = () => {
    createConversation(documentId);
  };

  const handleSubmit = (text: string, id: string) => {
    onSubmit(text, useStreaming, id);
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-50 border rounded-xl shadow"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="rounded-lg border-b px-3 py-2 flex flex-row items-center justify-between">
        <div className="opacity-40">
          <input
            id="chat-type"
            type="checkbox"
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
          />
          <label htmlFor="chat-type" className="italic">
            Streaming
          </label>
        </div>
        <div className="flex gap-2">
          <ConversationSelect
            conversations={conversations}
            setActiveConversationId={setActiveConversationId}
            removeConversation={function (id: string): void {
              throw new Error("Function not implemented.");
            }}
          />
          <button
            className="rounded text-sm border border-blue-500 px-2 py-0.5"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-3 py-2 overflow-y-scroll">
        <ChatList
          messages={
            getActiveConversation()?.messages.map((message) => ({
              ...message,
              role: message.role ?? "user",
              content: message.content,
            })) || []
          }
        />
        <div className="relative">
          {error && error.length < 200 && (
            <div className="p-4">
              <p> error</p>
              {/* <Alert type="error" onDismiss={resetError}>
                {error}
              </Alert> */}
            </div>
          )}
          <ChatInput onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
