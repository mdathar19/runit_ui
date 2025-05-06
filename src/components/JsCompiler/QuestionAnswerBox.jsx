"use client"
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  toggleQuestionInput, 
  toggleAnswer, 
  setQuestion, 
  askQuestion,
  selectIsLoading,
  selectShowAnswer,
  selectIsQuestionInputVisible,
  selectCursorPosition,
  selectQuestion,
  selectIsMobileView,
  selectCodeAnswer,
  selectAnswer,
  selectAnswerPosition,
  selectEditorInstance,
  getEditorInstance,
  selectSelectedLanguage
} from '../../redux/slices/compilerSlice';
import { insertCodeIntoEditor } from '../../redux/hooks';
import { KEYBOARD_SHORTCUTS } from '../../Utils';

const QuestionAnswerBox = () => {
  // Redux hooks
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const isLoading = useSelector(selectIsLoading);
  const showAnswer = useSelector(selectShowAnswer);
  const isQuestionInputVisible = useSelector(selectIsQuestionInputVisible);
  const cursorPosition = useSelector(selectCursorPosition);
  const question = useSelector(selectQuestion);
  const isMobileView = useSelector(selectIsMobileView);
  const editor = getEditorInstance();
  const codeAnswer = useSelector(selectCodeAnswer);
  const answer = useSelector(selectAnswer);
  const answerPosition = useSelector(selectAnswerPosition);
  const selectedLanguage = useSelector(selectSelectedLanguage);
  
  // Refs
  const questionInputRef = useRef(null);
  const boxRef = useRef(null); // Ref for the entire question box
  
  // Action dispatchers
  const handleShowQuestionBox = () => {
    dispatch(toggleQuestionInput(true));
  };
  
  const handleAskQuestion = () => {
    if (question.trim()) {
      dispatch(askQuestion());
    }
  };
  
  const handleInsertCodeIntoEditor = () => {
    if (editor) {
      insertCodeIntoEditor(editor, cursorPosition, codeAnswer);
      dispatch(toggleAnswer(false))
    }
  };
  
  // Focus on question input when it becomes visible
  useEffect(() => {
    if (isQuestionInputVisible && questionInputRef.current) {
      setTimeout(() => {
        questionInputRef.current.focus();
      }, 50);
    }
  }, [isQuestionInputVisible]);
  
  // Handle click outside to close question box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        if (isQuestionInputVisible) {
          dispatch(toggleQuestionInput(false));
        }
        if (showAnswer) {
          dispatch(toggleAnswer(false));
        }
      }
    };
    
    // Only add the listener if the box is visible
    if ((isQuestionInputVisible || showAnswer) && boxRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isQuestionInputVisible, showAnswer, dispatch]);
  
  // Handle Escape key to close question box and answer
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isQuestionInputVisible) {
          dispatch(toggleQuestionInput(false));
        } else if (showAnswer) {
          dispatch(toggleAnswer(false));
        }
      }
      
      if (event.ctrlKey && event.code === 'Enter' && showAnswer) {
        event.preventDefault();
        handleInsertCodeIntoEditor();
      }
      
      // Global shortcut for question box (Ctrl+Space)
      if (event.ctrlKey && event.code === 'Space' && !isQuestionInputVisible) {
        event.preventDefault();
        handleShowQuestionBox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuestionInputVisible, showAnswer, dispatch]);
  
  // Don't render if no position or not visible
  if ((!isQuestionInputVisible && !showAnswer) || !cursorPosition) {
    return null;
  }

  return (
    <div
      ref={boxRef}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-2/5 max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      style={isMobileView ? { width: '90%' } : {}}
    >
      {/* Question Input - Only shown when asking */}
      {isQuestionInputVisible && (
        <div className="flex flex-col p-4 space-y-4">
          <textarea
            id="ai_question_box1"
            name="ai_question_box"
            ref={questionInputRef}
            value={question}
            onChange={(e) => dispatch(setQuestion(e.target.value))}
            className="w-full h-32 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={`Ask your ${selectedLanguage} question...`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
          />
          <button
            onClick={handleAskQuestion}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Ask Question 
                <span className="ml-2 py-0.5 px-1.5 text-xs bg-white bg-opacity-20 rounded">
                  {KEYBOARD_SHORTCUTS.SUBMIT_QUESTION}
                </span>
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Answer Section - Shown when answer is available */}
      {showAnswer && (
        <div className={isQuestionInputVisible ? "mt-3" : ""}>
          <div className="bg-gray-900 text-gray-100 overflow-auto max-h-[50vh]">
            <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
              {codeAnswer !== answer ? codeAnswer : answer}
            </pre>
          </div>
          
          <div className="flex p-4 space-x-2 bg-gray-100 dark:bg-gray-800">
            <button 
              onClick={handleInsertCodeIntoEditor}
              className="flex-grow py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Insert Code at Cursor
            </button>
            <button 
              onClick={() => dispatch(toggleAnswer(false))}
              className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
            <button 
              onClick={handleShowQuestionBox}
              className="py-2 px-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              New Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerBox;