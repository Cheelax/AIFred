"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { api, getErrorMessage } from "@/api/axios";

const fetchDocuments = async (): Promise<Document[]> => {
  const { data } = await api.get("/pdfs");
  return data;
};

// Définissez le type si vous utilisez TypeScript
interface Document {
  id: string;
  name: string;
}

interface DocumentPageProps {
  documents: Document[];
}

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments();
        console.log("DATA", data);
        setDocuments(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load documents");
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between items-center my-4">
        <h2 className="text-3xl font-bold m-2">Your Documents</h2>
        <div>
          <Link
            href="/documents/new"
            passHref
            className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
          >
            New
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {documents &&
                    documents.map((document) => (
                      <tr
                        key={document.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          {document.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {document.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/documents/${document.id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPage;
