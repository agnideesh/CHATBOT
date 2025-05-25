import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onClearChat: () => void;
}

const Sidebar = ({ isOpen, onClose, onClearChat }: SidebarProps) => {
  const sidebarVariants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={backdropVariants}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-20 ${!isOpen && 'pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar panel */}
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed left-0 top-0 bottom-0 w-72 bg-background border-r shadow-lg z-30 flex flex-col"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Conversations</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {/* New chat button */}
          <Button variant="outline" className="w-full mb-4 justify-start" onClick={onClearChat}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          
          {/* Sample conversations */}
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-left font-normal h-auto py-2">
              <div>
                <div className="truncate">Product Questions</div>
                <div className="text-xs text-muted-foreground truncate">How do I reset my password?</div>
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left font-normal h-auto py-2">
              <div>
                <div className="truncate">Troubleshooting</div>
                <div className="text-xs text-muted-foreground truncate">App keeps crashing on startup</div>
              </div>
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={onClearChat}>
            <Trash className="mr-2 h-4 w-4" />
            Clear All Chats
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar; 