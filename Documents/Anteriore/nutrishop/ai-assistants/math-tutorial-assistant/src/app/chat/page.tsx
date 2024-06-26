"use client";

import React, { useEffect, useState } from "react";
import EnterNameModal from "@/components/EnterNameModal";
import { useName } from "@/hooks/useName";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/Loading";
import { useRouter } from "next/navigation";
import ChatMessagesList from "@/components/ChatMessagesList";
import ChatMessageForm from "@/components/ChatMessageForm";
import TopicSelection from "@/components/TopicSelection";
import { useConversations } from "@/context/ConversationsContext";
import { CircleChevronUp } from "lucide-react";
import CommandsMenu from "@/components/CommandsMenu";
import { useChat } from "@ai-sdk/react";
import Intro from "@/components/Intro";
import { Message, useAssistant } from "@ai-sdk/react";

export type Conversation = {
  _id: string;
  conversationID: string;
  userID: string;
  messages: Message[];
};

const ChatPage = () => {
  const router = useRouter();
  const { data: session, status: SessionStatus } = useSession();
  const userID = session?.user.id;
  const userName = session?.user.name;

  const {
    messages,
    input,
    submitMessage,
    handleInputChange,
    setInput,
    threadId,
    status: AssistantStatus,
    append,
    setMessages,
  } = useAssistant({ api: "/api/assistants", body: { userId: userID } });

  const { refreshConversations } = useConversations();
  const { onOpen, onClose } = useName();
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showTopicSelectionAndIntro, setShowTopicSelectionAndIntro] =
    useState<boolean>(true);
  const [showCommandsMenu, setShowCommandsMenu] = useState<boolean>(false);

  useEffect(() => {
    if (SessionStatus === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.provider === "email" && !session.user.name) {
      setShouldOpenModal(true);
    }
  }, [session, SessionStatus, router]);

  useEffect(() => {
    if (shouldOpenModal) {
      onOpen();
    }
  }, [shouldOpenModal, onOpen]);

  useEffect(() => {
    const initializeChat = async () => {
      const systemMessage: Message = {
        id: "",
        role: "system",
        content:
          "You are a Math tutorial assistant, an expert in any Math related lessons, topics. Please answer only in a given context. Otherwise, note that you don't have enough information.",
      };

      const initialConversation: Conversation = {
        _id: "initial",
        conversationID: "",
        userID: userID!,
        messages: [systemMessage],
      };
      setConversation(initialConversation);
    };
    // Initialize chat if no conversation is present and user has a name
    if (!conversation && userID && userName) {
      initializeChat();
    }
  }, [conversation, userID, userName]);

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(input);
    handleInputChange(e);
  };

  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowTopicSelectionAndIntro(false);
    append({ role: "user", content: input });
  };

  useEffect(() => {
    if (AssistantStatus === "awaiting_message" && threadId) {
      setTimeout(() => {
        router.push(`/chat/${threadId}`);
      }, 500);
    }
  }, [AssistantStatus, threadId, router]);

  useEffect(() => {
    if (AssistantStatus === "awaiting_message" && threadId) {
      setTimeout(() => {
        router.push(`/chat/${threadId}`);
      }, 500);
    }
  }, [AssistantStatus, threadId, router]);

  const handleTopicSelection = (topic: string) => {
    setInput(topic);
    setShowTopicSelectionAndIntro(false);
    submitMessage({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  if (SessionStatus === "loading") {
    return <LoadingScreen />;
  }

  const handleGenerateTest = () => {
    setShowTopicSelectionAndIntro(false);
    append({
      role: "user",
      content: "Generate a math question based on the topic discussed.",
    });
  };

  const handleCommandsMenuButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowCommandsMenu((prevState) => !prevState);
  };

  return (
    <div
      className={`bg-[#1a1a1a] w-full h-full flex flex-col items-center justify-start max-md:h-[100vh]`}
    >
      <div className="flex flex-col items-center w-4/5 h-4/5 rounded-md">
        {showTopicSelectionAndIntro && <Intro userName={userName!} />}
        {conversation && conversation.messages.length > 0 && (
          <ChatMessagesList
            conversation={conversation}
            messages={messages}
            AssistantStatus={AssistantStatus}
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
        {showTopicSelectionAndIntro && (
          <TopicSelection onSelectTopic={handleTopicSelection} />
        )}
      </div>
      {shouldOpenModal && (
        <EnterNameModal
          onClose={async () => {
            onClose();
            router.refresh();
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
