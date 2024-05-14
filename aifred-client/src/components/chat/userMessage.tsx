import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify"; // Pour la sécurisation du HTML

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = async ({ content }) => {
  // Utiliser marked pour convertir le contenu markdown en HTML
  if (content) {
    const convertContent = async (content: string) => {
      const htmlContent = marked(content, { breaks: true, gfm: true });
      const resolvedHTMLContent = await Promise.resolve(htmlContent);
      const safeHTML = DOMPurify.sanitize(resolvedHTMLContent);
      return safeHTML;
    };

    if (content) {
      const convertContent = async (content: string) => {
        // Add 'async' keyword here
        const htmlContent = marked(content, { breaks: true, gfm: true });
        const resolvedHTMLContent = await Promise.resolve(htmlContent);
        const safeHTML = DOMPurify.sanitize(resolvedHTMLContent);
        return safeHTML;
      };
      const safeHTML = await convertContent(content);
      return (
        <div
          className="message border rounded-md py-1 px-2.5 my-0.25 break-words self-end bg-slate-200"
          style={{ maxWidth: "80%" }}
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        ></div>
      );
    }
  }
};

export default UserMessage;
