import { useCallback } from "react";
import { useStore } from "@/store/store";
import { api, getErrorMessage } from "../api/axios";

export const useDocumentOperations = () => {
  const addError = useStore((state) => state.addError);
  const addDocuments = useStore((state) => state.addDocuments);
  const setUploadProgress = useStore((state) => state.setUploadProgress);
  const clearErrors = useStore((state) => state.clearErrors);

  const uploadDocument = useCallback(
    async (file: File) => {
      clearErrors();

      try {
        console.log("CHELOU");
        const formData = new FormData();
        formData.append("file", file);
        console.log("API", api);
        const response = await api.post("/pdfs", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
            );
            setUploadProgress(progress);
          },
        });

        console.log("response");
        console.log(response);
        addDocuments([response.data]);
      } catch (error) {
        addError(getErrorMessage(error));
      }
    },
    [addError, addDocuments, setUploadProgress, clearErrors]
  );

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await api.get("/pdfs");
      addDocuments(response.data); // Ajoute tous les documents à l'état
    } catch (error) {
      addError(getErrorMessage(error));
    }
  }, [addError, addDocuments]);

  return {
    uploadDocument,
    fetchDocuments,
  };
};
