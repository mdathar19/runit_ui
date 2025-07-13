import React from 'react';
import { FaRegCommentDots } from 'react-icons/fa';

const FeedbackButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed cursor-pointer bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
      aria-label="Submit feedback"
    >
      <FaRegCommentDots size={24} />
    </button>
  );
};

export default FeedbackButton;