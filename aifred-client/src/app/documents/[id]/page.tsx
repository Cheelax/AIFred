"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, usePathname } from "next/navigation";
// import PdfViewer from "../../components/PdfViewer"; // Assurez-vous que le chemin vers PdfViewer est correct
import ChatPanel from "../../../components/chat/chatPanel"; // Assurez-vous que le chemin vers ChatPanel est correct
import { api, getErrorMessage } from "../../../api/axios"; // Mettez à jour avec le chemin réel de votre fonction api et getErrorMessage
import { useMessageSender } from "@/hooks/useMessageSender";
// import { useChat } from "@/providers/chatProvider";

const fetchDocument = async (id: string): Promise<any> => {
  const { data } = await api.get("/pdfs/" + id);
  return data;
};

const DocumentPage = () => {
  const { sendMessage } = useMessageSender();
  const path = usePathname();
  const segments = path.split("/");
  const documentId = segments[2];

  const [id, setId] = useState<string>("0");
  const [error, setError] = useState(undefined);

  // const { activeConversation } = useChat();

  useEffect(() => {
    fetchDocument(documentId)
      .then((data) => {
        setId(data.pdf.id);
      })
      .catch((error) => {
        setError(getErrorMessage(error));
      });
  }, [documentId]);

  // Remplacez cette fonction par votre logique d'envoi de message
  function handleSubmit(content: any, useStreaming: any, id: string) {
    sendMessage(
      { role: "user", content },
      {
        useStreaming,
        documentId: id,
      }
    );
  }

  // Appelé avant que l'utilisateur ne navigue hors de la page
  useEffect(() => {
    console.log("RENDERPAGE");
    // resetAll();

    // Retourne une fonction de nettoyage qui est appelée avant de démonter le composant
    return () => {
      // resetAll();
    };
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // if (!document) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div
      className="grid grid-cols-3 gap-2"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="col-span-1">
        <ChatPanel documentId={id} onSubmit={handleSubmit} />
      </div>
      <div className="col-span-2">{/* <PdfViewer url={documentUrl} /> */}</div>
    </div>
  );
};

export default DocumentPage;
