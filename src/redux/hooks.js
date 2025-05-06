// src/redux/hooks.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  collectDeviceInfo, 
  setMobileView,
  setCursorPosition,
  setAnswerPosition,
  selectIsMobileView,
  selectCursorPosition,
  selectDeviceInfo,
  selectCode,
  selectOutput,
  selectQuestion,
  selectAnswer,
  selectCodeAnswer,
  selectShowAnswer,
  selectIsQuestionInputVisible,
  selectAnswerPosition,
  selectActiveTab,
  selectIsLoading,
  selectShowFeedback,
  selectEditorInstance,
  setEditor,
  setEditorInstance,
  toggleQuestionInput,
  fetchRuntimes
} from './slices/compilerSlice';
import { calculateEditorPosition } from '../Utils';


// Custom hook for device information and mobile view detection
export const useDeviceSetup = () => {
  const dispatch = useDispatch();
  const isMobileView = useSelector(selectIsMobileView);
  
  useEffect(()=>{
    dispatch(fetchRuntimes());
  },[])
  useEffect(() => {
    // Collect device info on component mount
    dispatch(collectDeviceInfo());
    
    // Check for mobile view
    const checkMobileView = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setMobileView(isMobile));
    };
    
    // Initial check
    checkMobileView();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, [dispatch]);
  
  return { isMobileView };
};
// Custom hook for Monaco editor setup
export const useMonacoSetup = (monaco) => {
  const dispatch = useDispatch();
  const cursorPosition = useSelector(selectCursorPosition);
  const showAnswer = useSelector(selectShowAnswer);
  const codeAnswer = useSelector(selectCodeAnswer);
  
  // Editor mount handler
  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor)
    // Track cursor position for floating search button and answer box
    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      dispatch(setCursorPosition({
        lineNumber: position.lineNumber,
        column: position.column
      }));
      
      
      // Calculate position for answer box
      const editorDomNode = editor.getDomNode();
      if (editorDomNode) {
        const { top, left } = calculateEditorPosition(editor, position);
        dispatch(setAnswerPosition({ top, left }));
      }
    });
    
    // Register completion provider for code suggestions
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        if (codeAnswer && showAnswer) {
          return {
            suggestions: [
              {
                label: "Insert code suggestion",
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: codeAnswer,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column
                }
              }
            ]
          };
        }
        
        return { suggestions: [] };
      }
    });
    
    // Add keyboard shortcut to toggle search
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      dispatch(toggleQuestionInput(true));
    });
    
    return editor;
  };
  
  return { handleEditorDidMount, cursorPosition };
};

// Helper for inserting code answer into editor
export const insertCodeIntoEditor = (editor, cursorPosition, codeAnswer) => {
  if (editor && cursorPosition && codeAnswer) {
    const model = editor.getModel();
    editor.executeEdits('insert-answer', [{
      range: {
        startLineNumber: cursorPosition.lineNumber,
        startColumn: cursorPosition.column,
        endLineNumber: cursorPosition.lineNumber,
        endColumn: cursorPosition.column
      },
      text: codeAnswer
    }]);
    
    return true;
  }
  return false;
};

// Export selectors for easy access
export const useCompilerSelectors = () => {
  const code = useSelector(selectCode);
  const output = useSelector(selectOutput);
  const question = useSelector(selectQuestion);
  const answer = useSelector(selectAnswer);
  const codeAnswer = useSelector(selectCodeAnswer);
  const showAnswer = useSelector(selectShowAnswer);
  const isQuestionInputVisible = useSelector(selectIsQuestionInputVisible);
  const answerPosition = useSelector(selectAnswerPosition);
  const activeTab = useSelector(selectActiveTab);
  const isLoading = useSelector(selectIsLoading);
  const isMobileView = useSelector(selectIsMobileView);
  const showFeedback = useSelector(selectShowFeedback);
  const deviceInfo = useSelector(selectDeviceInfo);
  const editor = useSelector(selectEditorInstance);
  
  return {
    code,
    output,
    question,
    answer,
    codeAnswer,
    showAnswer,
    isQuestionInputVisible,
    answerPosition,
    activeTab,
    isLoading,
    isMobileView,
    showFeedback,
    deviceInfo,
    editor
  };
};