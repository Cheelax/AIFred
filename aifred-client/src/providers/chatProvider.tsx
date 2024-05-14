// "use client";
// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { api, getErrorMessage } from "@/api/axios";

// interface Message {
//   id: number;
//   text: string;
// }

// interface Conversation {
//   id: string;
//   messages: Message[];
// }

// interface ChatContextType {
//   conversations: Conversation[];
//   // activeConversation: Conversation | null;
//   error: string;
//   fetchConversations: (documentId: string) => Promise<void>;
//   createConversation: (documentId: string) => void;
//   setActiveConversationId: (id: string) => void;
//   addMessageToConversation: (conversationId: string, message: Message) => void;
//   resetError: () => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// interface ChatProviderProps {
//   children: ReactNode;
// }

// export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<
//     string | null
//   >(null);
//   // const { activeConversation, setActiveConversationId } = useChat();
//   const [error, setError] = useState<string>("");

//   // Fetch conversations from an API or other data source
//   const fetchConversations = async (documentId: string) => {
//     console.log("DOCUMENTID" + documentId);
//     if (documentId == "0") return;
//     const { data } = await api.get<Conversation[]>(
//       `/conversations?pdf_id=${documentId}`
//     );

//     console.log("Data", +JSON.stringify(data));

//     if (data.length) {
//       setConversations(data);
//       console.log("SET NEW conversationid");
//       setActiveConversationId(data[0].id);
//       // set({
//       //   conversations: data,
//       //   activeConversationId: data[0].id,
//       // });
//     } else {
//       await createConversation(documentId);
//     }
//     // try {
//     //   // Simulating a fetch call with setTimeout
//     //   const fetchedConversations = [
//     //     { id: "1", messages: [{ id: 1, text: "Hello World" }] },
//     //     // ... other conversations fetched
//     //   ];
//     //   setConversations(fetchedConversations);
//     // } catch (err) {
//     //   setError("An error occurred while fetching conversations.");
//     // }
//   };

//   const createConversation = async (documentId: string) => {
//     const { data } = await api.post<Conversation>(
//       `/conversations?pdf_id=${documentId}`
//     );

//     console.log("Created conversation: ", data);
//     console.log("Created conversation: ", conversations);

//     setConversations((prevConversations: Conversation[]) => {
//       return [data, ...prevConversations];
//       // const fetchedConversation = {
//       //   ...prevConversations,
//       //   activeConversationId: data.id,
//       //   conversations: [data, ...prevConversations],
//       // };
//       // return fetchConversations;
//     });
//     // set((state) => ({
//     //   ...state,
//     //   activeConversationId: data.id,
//     //   conversations: [data, ...state.conversations],
//     // }));

//     return data;
//   };

//   const resetError = () => {
//     setError("");
//   };
//   const addMessageToConversation = (
//     conversationId: string,
//     message: Message
//   ) => {
//     setConversations((prevConversations) => {
//       return prevConversations.map((conversation) => {
//         if (conversation.id === conversationId) {
//           return {
//             ...conversation,
//             messages: [...conversation.messages, message],
//           };
//         } else {
//           return conversation;
//         }
//       });
//     });
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         conversations,
//         error,
//         fetchConversations,
//         createConversation,
//         addMessageToConversation,
//         setActiveConversationId,
//         resetError,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };
