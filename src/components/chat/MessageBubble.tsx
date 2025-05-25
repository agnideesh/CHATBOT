import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '@/types/chat';
import { messageBubbleVariants, typingDotVariants } from '@/utils/animations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
  message: Message;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (inline) {
    return <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>;
  }
  return (
    <div className="relative group">
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match ? match[1] : undefined}
        PreTag="div"
        className="rounded-lg text-xs !bg-zinc-900/90 !p-4"
        {...props}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-zinc-800/80 hover:bg-zinc-700 text-xs px-2 py-1 rounded transition-opacity opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  const isLoading = message.isLoading;
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Copy message content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };
  
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 w-full`}
      variants={messageBubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={isUser}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {/* Avatar (only for bot) */}
        {!isUser && (
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src="/api/bot-avatar" alt="Bot" />
            <AvatarFallback className="bg-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Message content */}
        <div className={`relative group ${isUser ? 'mr-3' : ''}`}>
          <div 
            className={`
              px-4 py-3 rounded-2xl shadow-sm transition-shadow duration-200
              ${isUser 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-muted rounded-tl-none'
              }
              group-hover:shadow-md
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-1 min-h-[24px] min-w-[60px]">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground/40"
                    variants={typingDotVariants}
                    initial="initial"
                    animate="animate"
                    custom={i}
                  />
                ))}
              </div>
            ) : (
              <div className="prose prose-invert dark:prose-invert max-w-none whitespace-pre-wrap break-words">
                <ReactMarkdown components={{ code: CodeBlock }}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            <div className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
          
          {/* Action buttons on hover */}
          {!isLoading && (
            <div 
              className={`
                absolute -top-8 ${isUser ? 'left-0' : 'right-0'}
                bg-background shadow-md rounded-full px-2 py-1
                opacity-0 group-hover:opacity-100 transition-opacity
                flex items-center space-x-1
              `}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={copyToClipboard}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded-full transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded-full transition-colors">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dislike</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble; 