import React, { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import classNames from "classnames";
import { MdThumbUp, MdThumbDown } from "react-icons/md"; // Import des icônes
import { useChatStore } from "@/store/chat/store";
import { api } from "@/api/axios";

interface Props {
  content: string;
}

const AssistantMessage: React.FC<Props> = ({ content }) => {
  const [score, setScore] = useState(0);
  const [htmlContent, sethtmlContent] = useState<string>("");
  const { activeConversationId } = useChatStore();

  const klass =
    "border rounded-full inline-block cursor-pointer hover:bg-slate-200";
  const upKlass = classNames(klass, { "bg-slate-200": score === 1 });
  const downKlass = classNames(klass, { "bg-slate-200": score === -1 });

  const applyScore = async (_score: number) => {
    console.log("Score" + score);
    if (score !== 0) return;
    setScore(_score);
    console.log("activeConversationId===============");
    console.log(activeConversationId);

    const { data } = await api.post(
      `/scores?conversation_id=${activeConversationId}`,
      { score: _score }
    );

    sethtmlContent(
      await (async () => {
        return DOMPurify.sanitize(
          await marked(content, { breaks: true, gfm: true })
        );
      })()
    );

    // const scoreConversation = async (score: number) => {
    //   const conversationId = get(store).activeConversationId;

    //   return api.post(`/scores?conversation_id=${conversationId}`, { score });
    // };

    // Remplacez cette URL par l'URL de votre service Python
    // const url = "http://localhost:8069/api/scores?" + activeConversationId;

    // // Faites une requête HTTP POST à votre service Python
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ score: _score }),
    // });

    // if (!response.ok) {
    //   console.error("Failed to update score:", response);
    // } else {
    console.log("data===============");
    console.log(data);
    // const result = await data.json();
    // console.log("Score updated:", result);
    // }
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row flex-1 items-start gap-1 flex-wrap justify-center">
        {score >= 0 && (
          <div
            className={upKlass}
            style={{ lineHeight: "12px", padding: "6px" }}
            onClick={() => applyScore(1)}
          >
            <MdThumbUp />
          </div>
        )}
        {score <= 0 && (
          <div
            className={downKlass}
            style={{ lineHeight: "12px", padding: "6px" }}
            onClick={() => applyScore(-1)}
          >
            <MdThumbDown />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;
