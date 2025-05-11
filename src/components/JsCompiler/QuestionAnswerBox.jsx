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
  getEditorInstance,
  selectSelectedLanguage
} from '../../redux/slices/compilerSlice';
import { insertCodeIntoEditor } from '../../redux/hooks';
import { KEYBOARD_SHORTCUTS } from '../../Utils';
import SpinnerLoading from '../global/SpinnerLoading';
import CrossButton from '../global/CrossButton';

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
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className={`bg-gray-800 w-full max-w-md rounded-lg shadow-xl overflow-hidden border border-gray-700 ${isMobileView ? 'mx-4' : ''}`}>
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-900 px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">
            {isQuestionInputVisible ? `Ask ${selectedLanguage} Question` : 'Code Solution'}
          </h3>
          <CrossButton onClick={() => isQuestionInputVisible ? dispatch(toggleQuestionInput(false)) : dispatch(toggleAnswer(false))}/>
        </div>
        
        {/* Question Input - Only shown when asking */}
        {isQuestionInputVisible && (
          <div className="p-4 text-white">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="ai_question_box1">
                Your Question
              </label>
              <textarea
                id="ai_question_box1"
                name="ai_question_box"
                ref={questionInputRef}
                value={question}
                onChange={(e) => dispatch(setQuestion(e.target.value))}
                className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder={`Ask your ${selectedLanguage} question...`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
              />
            </div>
            
            <div className="px-0 py-0 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => dispatch(toggleQuestionInput(false))}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={isLoading || !question.trim()}
                className={`px-4 py-2 rounded-md flex items-center justify-center ${
                  isLoading || !question.trim()
                    ? 'bg-purple-500 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-violet-900 hover:from-purple-700 hover:to-violet-800'
                } text-white transition-colors cursor-pointer`}
              >
                {isLoading ? (
                  <SpinnerLoading />
                ) : (
                  <>
                    Ask Question 
                    <span className="ml-2 text-xs bg-opacity-20 rounded px-1.5 py-0.5">
                      {KEYBOARD_SHORTCUTS.SUBMIT_QUESTION}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Answer Section - Shown when answer is available */}
        {showAnswer && (
          <>
            <div className="text-white max-h-[50vh] overflow-auto">
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap bg-gray-900 text-gray-100">
                {codeAnswer !== answer ? codeAnswer : answer}
              </pre>
            </div>
            
            <div className="px-4 py-3 bg-gray-900 flex justify-end space-x-3">
              <button 
                onClick={() => dispatch(toggleAnswer(false))}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleShowQuestionBox}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                New Question
              </button>
              <button 
                onClick={handleInsertCodeIntoEditor}
                className="px-4 py-2 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-violet-900 hover:from-purple-700 hover:to-violet-800 text-white transition-colors"
              >
                Insert Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswerBox;