import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sun, Moon, Settings, Menu, Bot, User } from 'lucide-react';
import { themeToggleVariants } from '@/utils/animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
  onClearChat?: () => void;
  onToggleMockResponses?: () => void;
  usingMockResponses?: boolean;
  title?: string;
}

const Header = ({ 
  isDark, 
  onToggleTheme, 
  onToggleSidebar,
  onClearChat,
  onToggleMockResponses,
  usingMockResponses = false,
  title = "spicyllm" 
}: HeaderProps) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm py-3 px-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left side - Title and menu */}
        <div className="flex items-center">
          {onToggleSidebar && (
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              size="icon"
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <h1 className="font-semibold text-lg">{title}</h1>
          
          {/* Show API mode indicator */}
          {onToggleMockResponses && (
            <div className="ml-3 flex items-center">
              <span className="text-xs text-muted-foreground mr-2">Mode:</span>
              <Button
                onClick={onToggleMockResponses}
                variant="outline"
                size="sm"
                className={`text-xs h-7 px-2 ${usingMockResponses ? 'bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200' : 'bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200'}`}
              >
                {usingMockResponses ? (
                  <User className="h-3 w-3 mr-1" />
                ) : (
                  <Bot className="h-3 w-3 mr-1" />
                )}
                {usingMockResponses ? 'Mock' : 'API'}
              </Button>
            </div>
          )}
        </div>
        
        {/* Right side - Theme toggle and settings */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <motion.div
            initial="initial"
            animate="animate"
            custom={isDark}
            variants={themeToggleVariants}
          >
            <Button
              onClick={onToggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {isDark ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>
          
          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onClearChat && (
                <DropdownMenuItem onClick={onClearChat}>Clear Chat</DropdownMenuItem>
              )}
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="https://spicyllm.com/?i=1" target="_blank" rel="noopener noreferrer">Help</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header; 