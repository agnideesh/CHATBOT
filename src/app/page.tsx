'use client';

import { useState } from 'react';
import Header from '@/components/chat/Header';
import ChatContainer from '@/components/chat/ChatContainer';
import InputSection from '@/components/chat/InputSection';
import Sidebar from '@/components/chat/Sidebar';
import useChat from '@/hooks/useChat';
import useTheme from '@/hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { 
    messages, 
    isTyping, 
    reasoning, 
    usingMockResponses,
    addUserMessage, 
    clearChat,
    toggleMockResponses,
    toggleReasoningDropdown,
    toggleReasoning,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onClearChat={clearChat} 
      />
      
      {/* Header */}
      <Header 
        isDark={isDark} 
        onToggleTheme={toggleTheme} 
        onToggleSidebar={toggleSidebar} 
        onClearChat={clearChat}
        onToggleMockResponses={toggleMockResponses}
        usingMockResponses={usingMockResponses}
      />
      
      {/* Chat Messages */}
      <ChatContainer 
        messages={messages} 
        isTyping={isTyping} 
        toggleReasoningDropdown={toggleReasoningDropdown}
          />
      
      {/* Input Area */}
      <InputSection 
        onSendMessage={addUserMessage} 
        disabled={isTyping} 
          />
    </div>
  );
}
