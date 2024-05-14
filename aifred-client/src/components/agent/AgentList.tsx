import React, { useState, useEffect } from "react";

import AgentCard from "./AgentCard";
import { Agent } from "@/types/types";

interface AgentListProps {
  agents: Agent[];
}

const AgentList: React.FC<AgentListProps> = ({ agents }) => {
  return (
    <div>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentList;
