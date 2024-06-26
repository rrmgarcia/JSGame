import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ResponseLoader from "./ResponseLoader";
import { Conversation } from "@/app/chat/[id]/page";
import { Message } from "ai";

interface ChatMessagesListProps {
  conversation: Conversation | null;
  AssistantStatus: string;
  messages: Message[];
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  conversation,
  AssistantStatus,
  messages,
}) => {
  const latestAssistantMessage = useMemo(() => {
    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );
    if (assistantMessages.length === 0) {
      return null;
    }
    assistantMessages.reverse();
    return assistantMessages[0];
  }, [messages]);

  return (
    <div className="flex flex-col bg-[#1a1a1a] w-full h-full p-4 mt-20 pb-32 max-md:h-auto">
      {messages.map((m: Message, index: number) => (
        <div
          key={m.id}
          className={`flex ${
            m.role === "assistant" ? "justify-start" : "justify-end"
          } mb-2`}
        >
          <div className="bg-[#202020] p-3 rounded-lg max-w-xl text-white">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              className="prose prose-invert text-white"
              components={{
                hr: ({ node, ...props }) => (
                  <hr className="border-[#202020] my-4" {...props} />
                ),
              }}
            >
              {m.content ===
                "Generate a math question based on the topic discussed." ||
              m.content === "Generate a random general math question."
                ? null
                : m.content}
            </ReactMarkdown>
            {m === latestAssistantMessage &&
              AssistantStatus === "in_progress" && <ResponseLoader />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ChatMessagesList);
