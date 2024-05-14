// ./AgentCard.tsx
import { Agent } from "@/types/types";
import React from "react";

type AgentCardProps = {
  agent: Agent;
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div>
      <h3>{agent.name}</h3>
    </div>
  );
};

export default AgentCard;
