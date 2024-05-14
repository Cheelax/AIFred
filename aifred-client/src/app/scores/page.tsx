"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api, getErrorMessage } from "@/api/axios";
import BarChart from "@/components/BarChart";

// Fetch scores from the API
const fetchScores = async (): Promise<any> => {
  const { data } = await api.get("/scores");
  return data;
};

const ScorePage: React.FC = () => {
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const data = await fetchScores();
        setScores(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load scores");
        setLoading(false);
      }
    };

    loadScores();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="w-1/2">
        <h2 className="text-3xl font-bold m-3">LLM Scores</h2>
        {scores && scores.llm && (
          <BarChart startingColor={{ r: 0, g: 99, b: 132 }} data={scores.llm} />
        )}
      </div>

      <hr className="m-10" />

      <div className="w-1/2">
        <h2 className="text-3xl font-bold m-3">Retriever Scores</h2>
        {scores && scores.retriever && (
          <BarChart
            startingColor={{ r: 255, g: 99, b: 132 }}
            data={scores.retriever}
          />
        )}
      </div>

      <hr className="m-10" />

      <div className="w-1/2">
        <h2 className="text-3xl font-bold m-3">Memory Scores</h2>
        {scores && Array.isArray(scores.llm) && (
          <BarChart startingColor={{ r: 0, g: 99, b: 132 }} data={scores.llm} />
        )}
      </div>
    </>
  );
};

export default ScorePage;
