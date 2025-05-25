import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Mic } from 'lucide-react';
import { buttonVariants } from '@/utils/animations';

interface InputSectionProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const InputSection = ({ onSendMessage, disabled = false }: InputSectionProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);
  
  // Handle message submission
  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end rounded-lg border shadow-sm focus-within:ring-1 focus-within:ring-primary">
          {/* Attachment button */}
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="p-3"
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          </motion.div>
          
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 resize-none min-h-[44px] max-h-[150px] py-3 px-2"
            disabled={disabled}
          />
          
          {/* Voice input button */}
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="p-3"
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
          </motion.div>
          
          {/* Send button */}
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover={!disabled && message.trim() ? "hover" : "initial"}
            whileTap={!disabled && message.trim() ? "tap" : "initial"}
            className="p-3"
          >
            <Button
              onClick={handleSendMessage}
              type="button"
              size="icon"
              className={`h-8 w-8 rounded-full ${!message.trim() ? 'opacity-50' : 'opacity-100'}`}
              disabled={disabled || !message.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </motion.div>
        </div>
        
        {/* Character count (optional) */}
        {message.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {message.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection; 