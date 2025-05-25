export type MessageType = 'user' | 'bot';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  reasoning?: string;
  reasoningComplete?: boolean;
  showReasoning?: boolean;
  pendingResponse?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface ChatAction {
  type: 'ADD_MESSAGE' | 'SET_TYPING' | 'CLEAR_CHAT' | 'UPDATE_LAST_BOT_MESSAGE' | 'UPDATE_BOT_REASONING' | 'TOGGLE_REASONING_DROPDOWN';
  payload?: any;
} 