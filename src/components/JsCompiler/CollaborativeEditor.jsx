import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MonacoEditor from '@monaco-editor/react';
import { setCode } from '../../redux/slices/compilerSlice';
import {
  setCodeSyncing,
  sendCodeChange,
  sendCursorPosition,
  sendSelectionChange
} from '../../redux/slices/collaborativeSessionSlice';

const CollaborativeEditor = ({
  height = "100vh",
  language = "javascript",
  theme = "vs-dark",
  value,
  onChange,
  onMount,
  options,
  className
}) => {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const isLocalChangeRef = useRef(false);


  const {
    sessionCode,
    participants,
    remoteCode,
    isCodeSyncing,
    currentUser,
    remoteUserId
  } = useSelector(state => state.collaborativeSession);

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const authUser = useSelector(state => state.auth.user);
  const collaborativeUser = useSelector(state => state.collaborativeSession.currentUser);

  // Enhanced user object with proper userName
  const user = React.useMemo(() => {
    const baseUser = collaborativeUser || authUser;
    if (baseUser && !baseUser.userName && baseUser.email) {
      return {
        ...baseUser,
        userName: baseUser.email.split('@')[0]
      };
    }
    return baseUser;
  }, [collaborativeUser, authUser]);

  useEffect(() => {
    // Check if this is truly a remote update (not from current user)
    const currentUserId = user?.userId || user?._id || user?.id;
    const isFromCurrentUser = remoteUserId === currentUserId;

    if (remoteCode !== null && remoteCode !== value && !isLocalChangeRef.current && !isFromCurrentUser) {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        const currentPosition = editorRef.current.getPosition();
        const currentSelection = editorRef.current.getSelection();

        // Use pushEditOperations for better undo/redo support
        const fullRange = model.getFullModelRange();
        model.pushEditOperations(
          [],
          [{ range: fullRange, text: remoteCode }],
          () => null
        );

        // Restore cursor position and selection
        if (currentPosition) {
          // Adjust position if it's beyond the new text length
          const lineCount = model.getLineCount();
          const adjustedLine = Math.min(currentPosition.lineNumber, lineCount);
          const lineLength = model.getLineMaxColumn(adjustedLine);
          const adjustedColumn = Math.min(currentPosition.column, lineLength);

          editorRef.current.setPosition({
            lineNumber: adjustedLine,
            column: adjustedColumn
          });
        }

        if (currentSelection && !currentSelection.isEmpty()) {
          // Try to restore selection if it's still valid
          const startLine = Math.min(currentSelection.startLineNumber, model.getLineCount());
          const endLine = Math.min(currentSelection.endLineNumber, model.getLineCount());

          editorRef.current.setSelection({
            startLineNumber: startLine,
            startColumn: Math.min(currentSelection.startColumn, model.getLineMaxColumn(startLine)),
            endLineNumber: endLine,
            endColumn: Math.min(currentSelection.endColumn, model.getLineMaxColumn(endLine))
          });
        }
      }
      dispatch(setCode(remoteCode));
      dispatch(setCodeSyncing(false));
      lastSentCodeRef.current = remoteCode; // Update last sent to avoid re-sending
    }
  }, [remoteCode, value, dispatch]);

  // Debounce timer ref for code changes
  const codeChangeTimerRef = useRef(null);
  const lastSentCodeRef = useRef('');
  const periodicSyncRef = useRef(null);
  const currentCodeRef = useRef('');

  // Update current code ref when value changes
  useEffect(() => {
    currentCodeRef.current = value || '';
  }, [value]);

  // Set up periodic synchronization every 3 seconds
  useEffect(() => {
    if (sessionCode) {
      // Clear any existing interval
      if (periodicSyncRef.current) {
        clearInterval(periodicSyncRef.current);
      }

      // Start periodic sync interval
      periodicSyncRef.current = setInterval(() => {
        // Send current code state if it has changed
        const currentCode = currentCodeRef.current;
        const lastSentCode = lastSentCodeRef.current;

        if (currentCode !== lastSentCode && currentCode !== undefined) {
          dispatch(sendCodeChange(currentCode, language));
          lastSentCodeRef.current = currentCode;
        }
      }, 3000); // Sync every 3 seconds

      return () => {
        if (periodicSyncRef.current) {
          clearInterval(periodicSyncRef.current);
          periodicSyncRef.current = null;
        }
      };
    } else {
      // Clear interval if no session
      if (periodicSyncRef.current) {
        clearInterval(periodicSyncRef.current);
        periodicSyncRef.current = null;
      }
    }
  }, [sessionCode, language, dispatch]);

  const handleEditorChange = useCallback((newValue) => {
    // Mark as local change
    isLocalChangeRef.current = true;

    // Update local state first
    onChange(newValue);
    dispatch(setCode(newValue));
    currentCodeRef.current = newValue || '';

    if (sessionCode) {
      // Clear any previous timer
      if (codeChangeTimerRef.current) {
        clearTimeout(codeChangeTimerRef.current);
      }

      // Determine sync timing based on input
      const lastChar = newValue ? newValue[newValue.length - 1] : '';
      const prevLength = lastSentCodeRef.current ? lastSentCodeRef.current.length : 0;
      const isDeletion = newValue.length < prevLength;

      const shouldSyncImmediately =
        lastChar === '\n' || // New line
        lastChar === ' ' || // Space (end of word)
        lastChar === ';' || // Statement end
        lastChar === '}' || // Block end
        lastChar === ')' || // Function call end
        lastChar === '.' || // Method chaining
        isDeletion; // Any deletion

      const syncDelay = shouldSyncImmediately ? 100 : 500;

      // Schedule sync
      codeChangeTimerRef.current = setTimeout(() => {
        const currentValue = currentCodeRef.current;
        const lastSentValue = lastSentCodeRef.current;

        if (currentValue !== lastSentValue) {
          dispatch(sendCodeChange(currentValue, language));
          lastSentCodeRef.current = currentValue;
        }
      }, syncDelay);
    }

    // Reset local change flag
    setTimeout(() => {
      isLocalChangeRef.current = false;
    }, 150);
  }, [sessionCode, language, onChange, dispatch]);


  // Cleanup timers on unmount or session change
  useEffect(() => {
    return () => {
      if (codeChangeTimerRef.current) {
        clearTimeout(codeChangeTimerRef.current);
        codeChangeTimerRef.current = null;
      }
      if (periodicSyncRef.current) {
        clearInterval(periodicSyncRef.current);
        periodicSyncRef.current = null;
      }
    };
  }, []);

  // Send immediate sync when session starts
  useEffect(() => {
    if (sessionCode && value !== undefined) {
      // Send current code immediately when joining a session
      dispatch(sendCodeChange(value || '', language));
      lastSentCodeRef.current = value || '';
      currentCodeRef.current = value || '';
    }
  }, [sessionCode]);





  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyCode.F11, () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
          // Silently handle fullscreen errors
        });
      } else {
        document.exitFullscreen();
      }
    });

    if (onMount) {
      onMount(editor, monaco);
    }
  }, [onMount]);

  return (
    <MonacoEditor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        ...options,
        readOnly: sessionCode && !participants.find(p => {
          const currentUserId = user?.userId || user?._id || user?.id;
          return p.userId === currentUserId;
        })?.canEdit
      }}
      className={className}
    />
  );
};

export default CollaborativeEditor;