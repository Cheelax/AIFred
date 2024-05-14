import React, { useState, useCallback } from "react";

const ChatInput = ({ onSubmit }: any) => {
  const [value, setValue] = useState("");

  const handleKeyDown = useCallback(
    (event: any) => {
      const isCombo =
        event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
      if (event.key !== "Enter" || isCombo) {
        return;
      }

      if (event.key === "Enter" && !isCombo && value.trim() === "") {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      onSubmit(value.trim()); // Supposant que `onSubmit` est la fonction passée en prop pour gérer la soumission.
      setValue("");
    },
    [value, onSubmit]
  );

  // Calcul dynamique de la hauteur basé sur le nombre de lignes dans `value`
  const height = (value.match(/\n/g)?.length || 0) * 25 + 72;

  return (
    <textarea
      className="w-full mx-auto py-1.5 px-2.5 resize-none border rounded max-h-40"
      style={{ height: `${height}px` }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ChatInput;
