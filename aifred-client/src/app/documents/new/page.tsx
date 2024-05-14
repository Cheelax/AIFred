"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "../../../components/ui/alert";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { useStore } from "@/store/store"; // Importez votre store Zustand

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress] = useState(0);
  const { uploadDocument } = useDocumentOperations();
  const router = useRouter();
  const { errors, clearErrors } = useStore((state) => state); // Utilisez votre store pour accéder aux erreurs

  useEffect(() => {
    // Effacer les erreurs quand le composant est monté
    return () => clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (file) {
      setLoading(true);
      console.log("file", file);
      await uploadDocument(file); // Passer setUploadProgress si votre fonction uploadDocument est adaptée pour l'accepter
      setLoading(false);
      if (errors.length > 0) {
        router.push("/documents");
      }
    }
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-3xl font-bold m-10">Upload a Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="w-42">
          <label htmlFor="file-input" className="sr-only">
            Choose file
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            name="file-input"
            id="file-input"
            className="block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:m-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        <div className="my-4" />

        {loading && uploadProgress < 100 && <Progress value={uploadProgress} />}
        {loading && uploadProgress === 100 && (
          <Alert>Upload Complete! Returning to list...</Alert>
        )}
        {errors.length > 0 && <Alert>Error: {errors[0].message}</Alert>}

        <Button type="submit" className="w-full my-3" disabled={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UploadDocument;
