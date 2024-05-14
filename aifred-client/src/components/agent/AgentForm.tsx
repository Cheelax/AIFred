import React, { useState } from "react";
import { Badge } from "../ui/badge";

interface AgentFormProps {
  onSubmit: (name: string, description: string) => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name && description) {
      setLoading(true);
      onSubmit(name, description);
      setName("");
      setDescription("");
      setLoading(false);
    } else {
      setErrors(["Both fields are required"]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-2 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Badge variant="outline">Agent </Badge>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add an Agent
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {loading && <div>Loading...</div>}
          {errors.length > 0 && <div>Error: {errors[0]}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
