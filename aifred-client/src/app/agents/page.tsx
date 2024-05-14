"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentForm from "@/components/agent/AgentForm";
import AgentList from "@/components/agent/AgentList";
import { Agent } from "@/types/types";

const fetchAgents = async (): Promise<Agent[]> => {
  const { data } = await axios.get("/api/agents");
  return data;
};

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load agents");
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const addAgent = (name: string) => {
    // Create a new agent with a random id
    const newAgent: Agent = {
      id: Math.random().toString(),
      name,
      model: "",
      prompt: "",
      embeddings: "",
    };
    setAgents([...agents, newAgent]);
  };

  return (
    <div>
      <h1>Agents</h1>
      <AgentForm onSubmit={addAgent} />
      <AgentList agents={agents} />
    </div>
  );
};

export default AgentsPage;
