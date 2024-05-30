import { create } from "zustand";
import { api } from "@/api/axios";

const INITIAL_STATE: ChatState = {
  error: "",
  loading: false,
  activeConversationId: null,
  conversations: [],
};

export const useChatStore = create<
  ChatState & {
    // Ajouter des méthodes pour agir sur l'état
    fetchConversations: (documentId: string) => Promise<void>;
    createConversation: (documentId: string, repos?: any[]) => Promise<Conversation>;
    setActiveConversationId: (id: string) => void;
    insertMessageToActive: (message: Message) => void;
    removeMessageFromActive: (id: number) => void;
    getActiveConversation: () => Conversation | undefined;
    resetAll: () => void;
    resetError: () => void;
    scoreConversation: (score: number) => Promise<any>;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    appendResponse: (id: number, text: string) => void;
  }
>((set, get) => ({
  // Votre état initial
  ...INITIAL_STATE,

  // Actions Zustand basées sur vos méthodes actuelles
  fetchConversations: async (documentId) => {
    console.log("Fetching conversations...");
    if (documentId === "0") return;
    const { data } = await api.get<Conversation[]>(
      `/conversations?pdf_id=${documentId}`
    );
    console.log("DATA CALL", JSON.stringify(data));
    console.log("DATA CALL", data.length);
    console.log("DATA CALL", JSON.stringify(data[0].id));

    if (data.length) {
      console.log("ifpassed");
      set({
        conversations: data,
        activeConversationId: data[0].id,
      });
      console.log(
        "Updated state:",
        get().conversations,
        get().activeConversationId
      );
    } else {
      await get().createConversation(documentId);
    }
  },
  getActiveConversation: () => {
    const state = get();
    // console.log(state);
    // console.log("CONVS======", state.conversations);
    // console.log("ID=========", state.activeConversationId);
    const activeConversation = state.conversations.find(
      (c) => c.id === state.activeConversationId
    );
    // console.log(activeConversation);
    return activeConversation;
  },
  createConversation: async (documentId, repos = []) => {
    const { data } = await api.post<Conversation>(
      `/conversations?pdf_id=${documentId}`, { repos }
    );

    set((state) => ({
      ...state,
      conversations: [data, ...state.conversations],
    }));

    return data;
  },
  setActiveConversationId: (id) => {
    // console.log("SETTTTTT" + id);
    set((state) => {
      return {
        ...state,
        activeConversationId: id,
      };
    });
  },
  // setActiveConversation: (conversation: Conversation) => {
  //   // console.log("SETTTTTT" + conversation);
  //   set((state) => {
  //     return {
  //       ...state,
  //       activeConversation: conversation,
  //     };
  //   });
  // },
  removeMessageFromActive: (id) => {
    set((state) => {
      const conv = state.conversations.find(
        (c) => c.id === state.activeConversationId
      );
      if (!conv) {
        return state; // retourner l'état actuel non modifié
      }
      conv.messages = conv.messages.filter((m) => m.id != id);
      return state;
    });
  },
  insertMessageToActive: (message) => {
    console.log("message");
    console.log(message);
    set((state) => {
      // console.log("Initial state:", JSON.stringify(state));

      const convIndex = state.conversations.findIndex(
        (c) => c.id === state.activeConversationId
      );
      // console.log("Index of active conversation:", convIndex);

      if (convIndex === -1) {
        console.log("No active conversation found.");
        return state;
      }

      // Create a copy of the state
      const newState = { ...state };

      // Modify the copy
      newState.conversations[convIndex] = {
        ...newState.conversations[convIndex],
        messages: [...newState.conversations[convIndex].messages, message],
      };

      return newState;
    });
  },
  appendResponse: (id: number, text: string) => {
    set((state) => {
      const convIndex = state.conversations.findIndex(
        (c) => c.id === state.activeConversationId
      );

      if (convIndex === -1) {
        console.log("No active conversation found.");
        return state;
      }

      // Create a copy of the state
      const newState = { ...state };

      // Modify the copy
      newState.conversations[convIndex].messages = newState.conversations[
        convIndex
      ].messages.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            content: message.content + text,
            role: "assistant",
          };
        }
        return message;
      });

      return newState;
    });
  },
  resetAll: () => {
    set(INITIAL_STATE);
  },
  resetError: () => {
    set({ error: "" });
  },
  scoreConversation: async (score) => {
    const conversationId: any = useChatStore.getState().activeConversationId;

    return api.post(`/scores?conversation_id=${conversationId}`, { score });
  },

  setLoading: (loading) => set((state) => ({ ...state, loading })),
  setError: (error) => set((state) => ({ ...state, error })),

  // getActiveConversation: () => {
  //   const state = get();
  //   console.log("State conversations:", state);
  //   console.log("State conversations:", state.conversations);
  //   console.log("State conversations:", state.activeConversationId); //null
  //   return state.conversations.find((c) => c.id === state.activeConversationId);
  // },
}));

export interface Message {
  id?: number;
  role: "user" | "assistant" | "system" | "pending";
  content: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface MessageOpts {
  useStreaming?: boolean;
  documentId?: string;
}

export interface ChatState {
  error: string;
  loading: boolean;
  activeConversationId: string | null;
  conversations: Conversation[];
}

// const stuff = [
// 	{
// 		role: 'user',
// 		content: 'can the national guard provide transportation to the special olympics?'
// 	},
// 	{
// 		role: 'assistant',
// 		content:
// 			'Yes, the National Guard may provide transportation to the Special Olympics under the eligible organizations listed in section (d)(9) of the statute, which includes the Special Olympics. The facilities and equipment of the National Guard, including vehicles leased to the Department of Defense, may be used to provide services to any eligible organization listed in this section, which the Special Olympics is a part of. However, it is important to note that this assistance may be subject to funding availability and other logistical considerations.'
// 	},
// 	{
// 		role: 'user',
// 		content: 'what other organizations can they provide transportation for?'
// 	},
// 	{
// 		role: 'assistant',
// 		content:
// 			"The National Guard may provide transportation to the following organizations under section (d)(1) to (d)(14) of the statute:\nThe Boy Scouts of America.\nThe Girl Scouts of America.\nThe Boys Clubs of America.\nThe Girls Clubs of America.\nThe Young Men's Christian Association.\nThe Young Women's Christian Association.\nThe Civil Air Patrol.\nThe United States Olympic Committee.\nThe Special Olympics.\nThe Campfire Boys.\nThe Campfire Girls.\nThe 4–H Club.\nThe Police Athletic League.\nAny other youth or charitable organization designated by the Secretary of Defense."
// 	},
// 	{
// 		role: 'pending',
// 		content: 'asdf'
// 	}
// ] as Message[];

export const {
  activeConversationId,
  conversations,
  setLoading,
  setError,
  fetchConversations,
  createConversation,
  setActiveConversationId,
  insertMessageToActive,
  removeMessageFromActive,
  resetAll,
  resetError,
  scoreConversation,
  appendResponse,
} = useChatStore.getState();
