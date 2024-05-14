import create from "zustand";

interface ApiError {
  message: string;
  contentType?: string;
}

interface Document {
  id: string;
  file_id: string;
  name: string;
}

interface AppState {
  documents: Document[];
  errors: ApiError[];
  uploadProgress: number;
  addDocument: (document: Document) => void;
  addError: (error: ApiError) => void;
  setUploadProgress: (progress: number) => void;
  clearErrors: () => void;
  addDocuments: (documents: Document[]) => void;
}

export const useStore = create<AppState>((set) => ({
  documents: [],
  errors: [],
  uploadProgress: 0,
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  clearErrors: () => set({ errors: [], uploadProgress: 0 }),
  addDocuments: (newDocuments) =>
    set((state) => ({ documents: [...state.documents, ...newDocuments] })),
}));
