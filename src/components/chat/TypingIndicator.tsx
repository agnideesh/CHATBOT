import React from 'react';
import { motion } from 'framer-motion';
import { typingIndicatorVariants, typingDotVariants } from '@/utils/animations';

const TypingIndicator = () => {
  return (
    <motion.div 
      className="flex items-center px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit"
      variants={typingIndicatorVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex space-x-1 px-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
            variants={typingDotVariants}
            initial="initial"
            animate="animate"
            custom={i}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
        Typing...
      </span>
    </motion.div>
  );
};

export default TypingIndicator; 