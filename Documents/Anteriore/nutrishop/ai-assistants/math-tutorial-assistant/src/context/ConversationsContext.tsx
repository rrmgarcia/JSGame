'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type Conversation = {
  _id: string;
  conversationID: string;
  messages: {
    createdAt: string | number | Date; role: string; content: string 
}[];
};

type ConversationsContextType = {
  conversations: Conversation[];
  refreshConversations: () => void;
};

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { data: session } = useSession();

  const fetchConversations = async () => {
    if (!session?.user?.id) return;

    const res = await fetch(`/api/conversations?userID=${session.user.id}`);
    if (!res.ok) {
      console.error('Failed to fetch conversations');
      return;
    }

    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session]);

  const refreshConversations = () => {
    fetchConversations();
  };

  return <ConversationsContext.Provider value={{ conversations, refreshConversations }}>{children}</ConversationsContext.Provider>;
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};
