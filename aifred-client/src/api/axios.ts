import axios from "axios";

// Interface pour vos erreurs d'API
interface ApiError {
  message: string;
  error: string;
}

// Créer une instance axios avec la configuration de base
export const api = axios.create({
  baseURL: "http://localhost:8069/api/",
});
//TODO use env var as baseurl

// Fonction pour obtenir un message d'erreur d'une réponse d'erreur
export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data;
    if (typeof apiError === "string") {
      return apiError;
    }
    return apiError?.message || apiError?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return (error as any).message;
  }

  return "Something went wrong";
};

// Fonction pour extraire l'erreur d'une réponse d'erreur
export const getError = (error: unknown): ApiError | null => {
  if (axios.isAxiosError(error)) {
    return error.response?.data as ApiError;
  }
  return null;
};
