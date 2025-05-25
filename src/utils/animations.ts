import { Variants } from 'framer-motion';

// Message bubble animations
export const messageBubbleVariants: Variants = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
  exit: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    transition: {
      duration: 0.2,
    },
  }),
};

// Typing indicator animation
export const typingIndicatorVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

// Dot animation for typing indicator
export const typingDotVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      times: [0, 0.5, 1],
      delay: 0.1,
    },
  },
};

// Button animations
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Container fade-in animation
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

// Staggered children animation
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

// Theme toggle animation
export const themeToggleVariants: Variants = {
  initial: {
    rotate: 0,
  },
  animate: (isDark: boolean) => ({
    rotate: isDark ? 180 : 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  }),
}; 