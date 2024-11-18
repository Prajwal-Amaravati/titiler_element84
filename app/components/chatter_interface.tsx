'use client'

import { useState } from 'react';
import MessageList from './message_list';
import MessageInput from './message_input';
import { Message } from '../message/core';

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSendMessage = async (content: string) => {
      setIsLoading(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
  
      try {
        const response = await fetch('/llm_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
  
        const { assistantMessage } = await response.json();
        const aiMessage: Message = {
          ...assistantMessage,
          timestamp: new Date(assistantMessage.timestamp),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <MessageList messages={messages} />
        </div>
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    );
  }