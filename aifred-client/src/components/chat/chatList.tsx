import React, { useEffect, useRef } from "react";
import AssistantMessage from "./assistantMessage"; // Ajustez le chemin selon votre structure de dossier
import UserMessage from "./userMessage"; // Ajustez le chemin selon votre structure de dossier
import PendingMessage from "./pendingMessage"; // Ajustez le chemin selon votre structure de dossier

interface Message {
  role: "user" | "system" | "assistant" | "pending" | "human" | "ai";
  content: string;
}

interface ChatListProps {
  messages: Message[];
}

const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Assurez le défilement automatique vers le nouveau message
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex flex-col flex-1">
      <div className="flex flex-col flex-1 gap-3 px-1.5 py-1">
        {messages.map((message, index) => (
          <div key={index}>
            {(message.role === "user" || message.role === "human") && (
              <UserMessage content={message.content} />
            )}
            {(message.role === "assistant" || message.role === "ai") && (
              <AssistantMessage content={message.content} />
            )}
            {message.role === "pending" && <PendingMessage />}
          </div>
        ))}
      </div>
      <div ref={endOfMessagesRef} className="pt-4" />
    </div>
  );
};

export default ChatList;
