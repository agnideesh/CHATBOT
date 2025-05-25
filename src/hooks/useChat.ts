import { useReducer, useCallback, useState, useRef } from 'react';
import { Message, ChatState, ChatAction } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { getStreamingAIResponse } from '@/utils/ai-service';

// Mock response function for fallback
const getMockResponse = (message: string): string => {
  // Simple responses based on user input
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello there! How can I assist you today?";
  }
  
  if (message.toLowerCase().includes('help')) {
    return "I'm here to help! Please let me know what you need assistance with.";
  }
  
  if (message.toLowerCase().includes('thanks') || message.toLowerCase().includes('thank you')) {
    return "You're welcome! Is there anything else you'd like to know?";
  }
  
  // Default response
  return "Thanks for your message. Is there anything specific you'd like to know about?";
};

// Initial state
const initialState: ChatState = {
  messages: [],
  isTyping: false,
};

// Reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'UPDATE_LAST_BOT_MESSAGE': {
      // Set the bot message content and mark as not loading
      const updatedMessages = [...state.messages];
      const lastBotMessageIndex = updatedMessages
        .map((msg, i) => ({ ...msg, index: i }))
        .filter(msg => msg.type === 'bot')
        .pop();
      if (lastBotMessageIndex) {
        updatedMessages[lastBotMessageIndex.index] = {
          ...updatedMessages[lastBotMessageIndex.index],
          content: action.payload,
          isLoading: false,
          pendingResponse: undefined,
        };
      }
      return {
        ...state,
        messages: updatedMessages,
      };
    }
    case 'UPDATE_BOT_REASONING': {
      // Update reasoning and its completion status for the last bot message
      const updatedMessages = [...state.messages];
      const lastBotMessageIndex = updatedMessages
        .map((msg, i) => ({ ...msg, index: i }))
        .filter(msg => msg.type === 'bot')
        .pop();
      if (lastBotMessageIndex) {
        updatedMessages[lastBotMessageIndex.index] = {
          ...updatedMessages[lastBotMessageIndex.index],
          reasoning: action.payload.reasoning,
          reasoningComplete: action.payload.reasoningComplete,
        };
      }
      return {
        ...state,
        messages: updatedMessages,
      };
    }
    case 'TOGGLE_REASONING_DROPDOWN': {
      // Toggle the dropdown for the last bot message
      const updatedMessages = [...state.messages];
      const lastBotMessageIndex = updatedMessages
        .map((msg, i) => ({ ...msg, index: i }))
        .filter(msg => msg.type === 'bot')
        .pop();
      if (lastBotMessageIndex) {
        updatedMessages[lastBotMessageIndex.index] = {
          ...updatedMessages[lastBotMessageIndex.index],
          showReasoning: !updatedMessages[lastBotMessageIndex.index].showReasoning,
        };
      }
      return {
        ...state,
        messages: updatedMessages,
      };
    }
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'CLEAR_CHAT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const useChat = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [useMockResponse, setUseMockResponse] = useState(false);
  const [reasoning, setReasoning] = useState(true); // Add global reasoning state
  const shouldUpdateBotMessage = useRef(false);
  const lastBotMessageId = useRef<string | null>(null);

  // Add a user message
  const addUserMessage = useCallback((content: string) => {
    const message: Message = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
    dispatch({ type: 'SET_TYPING', payload: true });

    // Create an empty bot message with reasoning dropdown closed
    const botMessageId = uuidv4();
    const botMessage: Message = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isLoading: true,
      reasoning: '',
      reasoningComplete: false,
      showReasoning: false,
      pendingResponse: '',
    };
    lastBotMessageId.current = botMessageId;
    dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
    shouldUpdateBotMessage.current = true;

    // Use AI service with streaming response or fallback to mock
    let reasoningBuffer = '';
    let responseBuffer = '';
    let reasoningDone = false;
    const handleReasoning = (reasoningChunk: string) => {
      reasoningBuffer += reasoningChunk;
      dispatch({
        type: 'UPDATE_BOT_REASONING',
        payload: { reasoning: reasoningBuffer, reasoningComplete: false },
      });
    };
    const handleContent = (contentChunk: string) => {
      if (!reasoningDone) {
        // Buffer the response until reasoning is done
        responseBuffer += contentChunk;
        dispatch({
          type: 'UPDATE_LAST_BOT_MESSAGE',
          payload: '', // Don't show response yet
        });
        // Store pending response
        const updatedMessages = [...state.messages];
        const lastBotMessageIndex = updatedMessages
          .map((msg, i) => ({ ...msg, index: i }))
          .filter(msg => msg.type === 'bot')
          .pop();
        if (lastBotMessageIndex) {
          updatedMessages[lastBotMessageIndex.index] = {
            ...updatedMessages[lastBotMessageIndex.index],
            pendingResponse: responseBuffer,
          };
        }
      } else {
        // Now show the response
        dispatch({
          type: 'UPDATE_LAST_BOT_MESSAGE',
          payload: responseBuffer + contentChunk,
        });
      }
    };
    const handleComplete = () => {
      reasoningDone = true;
      dispatch({
        type: 'UPDATE_BOT_REASONING',
        payload: { reasoning: reasoningBuffer, reasoningComplete: true },
      });
      // Now show the response
      dispatch({
        type: 'UPDATE_LAST_BOT_MESSAGE',
        payload: responseBuffer,
      });
      dispatch({ type: 'SET_TYPING', payload: false });
      shouldUpdateBotMessage.current = false;
    };
    getStreamingAIResponse(
      content,
      handleContent,
      handleReasoning,
      handleComplete
    ).catch(() => {
      setUseMockResponse(true);
      dispatch({ type: 'SET_TYPING', payload: false });
      shouldUpdateBotMessage.current = false;
    });
  }, [state.messages]);

  // Toggle reasoning dropdown for the last bot message
  const toggleReasoningDropdown = useCallback(() => {
    dispatch({ type: 'TOGGLE_REASONING_DROPDOWN' });
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
    shouldUpdateBotMessage.current = false;
    lastBotMessageId.current = null;
  }, []);

  // Toggle between API and mock responses (for development)
  const toggleMockResponses = useCallback(() => {
    setUseMockResponse(prev => !prev);
  }, []);

  // Toggle reasoning mode
  const toggleReasoning = useCallback(() => {
    setReasoning(prev => !prev);
  }, []);

  return {
    messages: state.messages,
    isTyping: state.isTyping,
    reasoning, // Add this
    usingMockResponses: useMockResponse, // Add this (was useMockResponse internally)
    addUserMessage,
    clearChat,
    toggleMockResponses,
    toggleReasoningDropdown,
    toggleReasoning, // Add this new function
  };
};

export default useChat;