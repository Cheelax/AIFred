import { useEffect } from "react";
import axios from "axios";
import { useStore } from "@/store/store";
import { getErrorMessage } from "@/api/axios";

export const useApi = () => {
  const { addError, errors } = useStore((state) => state);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Votre logique pour traiter l'erreur
        if (error.response && error.response.status >= 500) {
          const message = getErrorMessage(error);
          if (message) {
            addError({
              contentType:
                error.response.headers["Content-Type"] ||
                error.response.headers["content-type"],
              message,
            });
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [errors, addError]);

  return axios;
};
