import { Message } from 'ai';

// Getting user conversation
export const getUserConversation = async (userID: string, conversationID: string) => {
  try {
    const res = await fetch(`/api/conversations?userID=${userID}&conversationID=${conversationID}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('response data: ', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Getting all user conversations
export const getUserConversations = async (userID: string) => {
  try {
    const res = await fetch(`/api/conversations?userID=${userID}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('response data: ', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

export interface NewMessage {
  userID: string;
  conversationID: string;
  chatContext: string;
  messages: Message[];
}

//Sending Message
export const sendMessage = async (newMessage: NewMessage) => {
  try {
    const res = await fetch(`/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });

    if (res.ok) {
      const assistantResponse = await res.json();
      console.log('updated conversation: ', assistantResponse);
      return assistantResponse;
    } else {
      console.error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};