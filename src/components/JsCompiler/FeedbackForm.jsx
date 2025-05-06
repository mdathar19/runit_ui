"use client"
import React, { useState } from "react";
import { FaStar, FaRegStar, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { postFeedbackService } from "../../common/service";
import { useSelector } from "react-redux";
import { selectDeviceInfo, selectShowFeedback } from "../../redux/slices/compilerSlice";

const FeedbackForm = ({ handleClose }) => {
  const show = useSelector(selectShowFeedback);
  const deviceInfo = useSelector(selectDeviceInfo);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare feedback data with device info
      const feedbackData = {
        name,
        rating,
        comment,
        deviceInfo: {
          ...deviceInfo,
          timestamp: new Date().toISOString() // Update timestamp
        }
      };

      const response = await postFeedbackService(feedbackData)
      if (response.success) {
        setSubmitSuccess(true);
        
        // Reset form
        setName("");
        setComment("");
        setRating(0);
        
        // Close after delay
        setTimeout(() => {
          handleClose();
          setSubmitSuccess(false);
        }, 1500);
      } else {
        alert(response?.message)
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          className="cursor-pointer p-1"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {i <= (hoverRating || rating) ? 
            <FaStar className="text-yellow-400 text-xl" /> : 
            <FaRegStar className="text-xl" />
          }
        </span>
      );
    }
    
    return stars;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-900 px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Send Feedback</h3>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <IoMdClose className="w-5 h-5" />
          </button>
        </div>
        
        {submitSuccess ? (
          <div className="py-12 px-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500 p-2 mb-4">
                <svg 
                  className="w-8 h-8 text-white"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h4 className="text-xl font-medium text-white mb-2">Thank you for your feedback!</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-white">
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Rating
                </label>
                <div className="flex">
                  {renderStars()}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="comment">
                  Comments
                </label>
                <textarea 
                  id="comment"
                  rows={4} 
                  placeholder="Share your thoughts with us..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-900 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || rating === 0 || !name || !comment}
                className={`px-4 py-2 rounded-md flex items-center justify-center ${
                  isSubmitting || rating === 0 || !name || !comment
                    ? 'bg-purple-500 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-violet-900 hover:from-purple-700 hover:to-violet-800'
                } text-white transition-colors`}
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : null}
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;