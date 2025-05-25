import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message as MessageType } from '@/types/chat';
import MessageBubble from './MessageBubble';
import { containerVariants, staggerContainerVariants } from '@/utils/animations';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChatContainerProps {
  messages: MessageType[];
  isTyping: boolean;
  toggleReasoningDropdown: () => void;
}

const ChatContainer = ({ messages, isTyping, toggleReasoningDropdown }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <motion.div 
      className="flex-1 overflow-y-auto px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to spicyllm</h2>
              <p className="text-muted-foreground mb-6">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2"
          >
            {messages.map((message, idx) => (
              <div key={message.id}>
                {/* Reasoning dropdown for bot messages */}
                {message.type === 'bot' && message.reasoning && (
                  <div className="mb-2">
                    <button
                      className="flex items-center gap-2 text-xs font-mono bg-muted/50 border rounded-md px-3 py-2 w-full text-left hover:bg-muted"
                      onClick={toggleReasoningDropdown}
                    >
                      {message.showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="font-semibold">Show Reasoning</span>
                    </button>
                    {message.showReasoning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-muted/50 border rounded-md p-3 mt-1 overflow-auto max-h-64 text-xs font-mono"
                      >
                        <pre
                          className={`whitespace-pre-wrap ${!message.reasoningComplete ? 'shimmer' : ''}`}
                          style={!message.reasoningComplete ? {
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          } : {}}
                        >
                          {message.reasoning}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                )}
                {/* Only show the response after reasoning is complete */}
                {message.type === 'bot' && !message.reasoningComplete ? null : (
                  <MessageBubble message={message} />
                )}
              </div>
            ))}
          </motion.div>
        )}
        {/* No typing indicator */}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
};

export default ChatContainer; 