"use client";

import { Messages } from "openai/resources/beta/threads/messages.mjs";
import React, { ChangeEvent, FormEvent } from "react";

interface ChatMessageFormProps {
  handleSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  AssistantStatus: string;
  input: string;
}

const ChatMessageForm: React.FC<ChatMessageFormProps> = ({
  handleSendMessage,
  handleInputChange,
  AssistantStatus,
  input
}) => {
  return (
    <div className="w-[800px] border-2 border-[#363636] rounded-full p-1 bg-[#363636] max-md:w-[300px]">
      <form className="flex w-full" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="w-full h-full p-4 bg-[#2c2c2c] placeholder-white rounded-full text-white max-sm:p-2"
          placeholder="Type your message here..."
          onChange={handleInputChange}
          value={input}
          disabled={AssistantStatus === "in_progress"}
        />
        <button
          type="submit"
          className="bg-[#363636] text-white px-4 mx-1 rounded-full"
          disabled={AssistantStatus === "in_progress"}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatMessageForm;
