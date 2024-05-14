import create from "zustand";

interface ApiError {
  message: string;
  contentType?: string;
}

interface ErrorStore {
  errors: ApiError[];
  addError: (error: ApiError) => void;
  removeError: (error: ApiError) => void;
  reset: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  removeError: (error) =>
    set((state) => ({ errors: state.errors.filter((e) => e !== error) })),
  reset: () => set({ errors: [] }),
}));
