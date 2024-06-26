"use client";

import React, { useEffect, useRef, useState } from "react";
import EnterNameModal from "@/components/EnterNameModal";
import { useName } from "@/hooks/useName";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/Loading";
import { useRouter } from "next/navigation";
import { getUserConversation } from "@/lib/data";
import ChatMessagesList from "@/components/ChatMessagesList";
import ChatMessageForm from "@/components/ChatMessageForm";
import { useConversations } from "@/context/ConversationsContext";
import { CircleChevronUp } from "lucide-react";
import { Message, useAssistant } from "@ai-sdk/react";
import CommandsMenu from "@/components/CommandsMenu";

export type Conversation = {
  _id: string;
  conversationID: string;
  userID: string;
  messages: Message[];
};

const ChatPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const userID = session?.user.id;
  const conversationID = params.id;

  const {
    messages,
    input,
    handleInputChange,
    setInput,
    append,
    setMessages,
    threadId,
    status: AssistantStatus,
  } = useAssistant({
    api: "../../api/assistants",
    body: { conversationID: conversationID, userID: userID },
  });

  const { refreshConversations } = useConversations();
  const { onOpen, onClose } = useName();
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showCommandsMenu, setShowCommandsMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const conversationEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.provider === "email" && !session.user.name) {
      setShouldOpenModal(true);
    }
  }, [session, router]);

  useEffect(() => {
    if (shouldOpenModal) {
      onOpen();
    }
  }, [shouldOpenModal, onOpen]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await getUserConversation(userID!, conversationID);
        if (data) {
          setConversation(data);
          setMessages(data.messages);
          console.log("/chat/[id] data.messages", data.messages);
        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };
    if (userID) {
      fetchConversation();
    }
  }, [userID, conversationID]);

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(input);
    handleInputChange(e);
  };

  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    append({ role: "user", content: input });
  };

  if (status === "loading") {
    return <LoadingScreen />;
  }

  const handleCommandsMenuButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowCommandsMenu((prevState) => !prevState);
  };

  const handleGenerateTest = () => {
    append({
      role: "user",
      content: "Generate a math question based on the topic discussed.",
    });
  };

  console.log(conversation, messages);

  return (
    <div className="bg-[#1a1a1a] w-full h-full flex flex-col items-center">
      <div className="flex flex-col items-center w-4/5 h-4/5 rounded-md max-md:w-full max-md:h-full">
        {conversation && conversation.messages.length > 0 && (
          <ChatMessagesList
            conversation={conversation}
            AssistantStatus={AssistantStatus}
            messages={messages}
          />
        )}
        <div className="fixed bottom-10 ">
          <div className="flex items-center">
            <button title="Show commands menu">
              <CircleChevronUp
                className="w-[50px]"
                onClick={handleCommandsMenuButtonClick}
              />
            </button>
            {showCommandsMenu && (
              <CommandsMenu handleGenerateTest={handleGenerateTest} />
            )}
            <ChatMessageForm
              handleSendMessage={handleSendMessage}
              handleInputChange={handleChatInputChange}
              input={input}
              AssistantStatus={AssistantStatus}
            />
          </div>
        </div>
        <div ref={conversationEndRef} />
      </div>
      {shouldOpenModal && <EnterNameModal onClose={onClose} />}
    </div>
  );
};

export default ChatPage;
