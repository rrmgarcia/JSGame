"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useConversations } from "@/context/ConversationsContext";
import { CircleFadingPlus, LogOut, PanelLeftClose } from "lucide-react";

const Sidebar = (props: any) => {
  const { closeSidebar } = props;
  const { conversations } = useConversations();
  const [selectedConversationID, setSelectedConversationID] = useState<
    string | null
  >(null);
  const [sortedConversations, setSortedConversations] = useState(conversations);

  const router = useRouter();

  const handleNewConversation = () => {
    router.push("/chat");
    router.refresh(); // test
  };

  const handleConversationClick = (conversationID: string) => {
    setSelectedConversationID(conversationID);
    router.push(`/chat/${conversationID}`);
  };

  // Sort conversations by the createdAt of the last message
  useEffect(() => {
    const sorted = [...conversations].sort((a, b) => {
      const aLatestMessage = a.messages[a.messages.length - 1];
      const bLatestMessage = b.messages[b.messages.length - 1];
      const aCreatedAt = aLatestMessage
        ? new Date(aLatestMessage.createdAt).getTime()
        : 0;
      const bCreatedAt = bLatestMessage
        ? new Date(bLatestMessage.createdAt).getTime()
        : 0;
      return bCreatedAt - aCreatedAt;
    });
    setSortedConversations(sorted);
  }, [conversations]);
  return (
    <div className="fixed top-[72px] left-0 h-[90vh] max-md:h-[90vh]">
      <div className="flex flex-col h-full w-60 p-2 bg-[#1a1a1a] text-white border-r border-zinc-700">
        <div className="flex items-center justify-between mb-2">
          <div className="m-1 hover:bg-zinc-800 rounded-md">
            <PanelLeftClose
              onClick={closeSidebar}
              className="hover:cursor-pointer m-2"
            />
          </div>
          <h2 className="text-lg font-semibold ml-2">Conversations</h2>
          <div className="m-1 hover:bg-zinc-800 rounded-md">
            <CircleFadingPlus
              onClick={handleNewConversation}
              className="hover:cursor-pointer m-2"
            />
          </div>
        </div>
        <div className="flex-1 mt-10 overflow-y-auto">
          {sortedConversations.map((conversation: any) => (
            <div
              key={conversation._id}
              className={`p-2 cursor-pointer rounded text-sm truncate ${
                conversation.conversationID === selectedConversationID
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-800"
              }`}
              onClick={() =>
                handleConversationClick(conversation.conversationID)
              }
              title={
                conversation.messages.length > 0
                  ? conversation.messages[0].content
                  : "Unnamed Conversation"
              }
            >
              {conversation.messages.length > 0
                ? `${conversation.messages[0].content.split(".")[0]}...`
                : "Unnamed Conversation"}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full p-2 bg-[#1a1a1a] text-white cursor-pointer">
          <div
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition flex"
          >
            <LogOut /> <p className="px-2">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
