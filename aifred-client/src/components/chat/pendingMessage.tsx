import React from "react";

const PendingMessage = () => {
  return (
    <div className="pending-message flex items-center justify-center p-2">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-sm text-gray-500 ml-3">
        Message en cours d&apos;envoi...
      </p>
    </div>
  );
};

export default PendingMessage;
