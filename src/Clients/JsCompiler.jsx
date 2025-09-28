"use client"

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Split from "react-split";
import { CodeIcon, TerminalIcon } from "@heroicons/react/solid";
import { HeartIcon } from "@heroicons/react/solid";

// Component imports
import EditorNavbar from "../components/JsCompiler/EditorNavbar";
import QuestionAnswerBox from "../components/JsCompiler/QuestionAnswerBox";
import FeedbackButton from "../components/JsCompiler/FeedbackButton";
import FeedbackForm from "../components/JsCompiler/FeedbackForm";
import CollaborativeEditor from "../components/JsCompiler/CollaborativeEditor";
import AudioManager from "../components/JsCompiler/AudioManager";

// Import from Redux slices and hooks
import { 
  setCode,
  setActiveTab,
  toggleFeedback,
  setSelectedLanguage
} from "../redux/slices/compilerSlice";
import { useMonacoSetup, useCompilerSelectors } from "../redux/hooks";
import { getFileExtension, getMonacoLanguage } from "../utils/Utils";
import useReduxStore from "@/hooks/useReduxStore";
import { portfolioUrl } from "@/api";
import { setPopupConfig } from "@/redux/slices/messagePopSlice";
import { setRemoteOutput, sendOutputUpdate } from "@/redux/slices/collaborativeSessionSlice";

const JsCompiler = ({ defaultLanguage = "javascript" }) => {
  // Set up hooks
  const dispatch = useDispatch();
  // Get the Monaco setup with editor mount handler
  const { handleEditorDidMount } = useMonacoSetup();
  // Get all required selectors from Redux store
  const {
    code,
    output,
    activeTab,
    isMobileView
  } = useCompilerSelectors();

  const { sessionCode, remoteOutput } = useSelector(state => state.collaborativeSession);
  const isLocalOutputUpdate = useRef(false);

  // Set the language based on the URL route when component mounts
  useEffect(() => {
    dispatch(setSelectedLanguage(defaultLanguage));
    dispatch(setPopupConfig({
      message: "Create your own portfolio (beta version)",
      imageUrl: "/favicon_io/android-chrome-192x192.png",
      linkText: "Create Portfolio",
      linkUrl: portfolioUrl,
    }));
  }, [defaultLanguage, dispatch]);

  useEffect(() => {
    // Only send output updates if we're in a session and output has changed locally
    if (sessionCode && output !== null && output !== undefined) {
      // Mark that we're sending a local update
      isLocalOutputUpdate.current = true;
      dispatch(sendOutputUpdate(output));

      // Reset flag after a short delay
      setTimeout(() => {
        isLocalOutputUpdate.current = false;
      }, 100);
    }
  }, [output, sessionCode, dispatch]);

  const renderEditor = () => (
    <div className="w-full h-full">
      <div className="h-full">
        <CollaborativeEditor
          height="100vh"
          language={getMonacoLanguage(defaultLanguage)}
          theme="vs-dark"
          value={code}
          onChange={(value) => dispatch(setCode(value))}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            minimap: { enabled: false },
            wordWrap: "on",
            fontSize: 16,
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: true,
            snippetSuggestions: "inline",
            fontFamily: "'Fira Code', monospace",
            fontLigatures: true,
            smoothScrolling: true
          }}
          className="rounded-lg shadow-xl"
        />
      </div>
    </div>
  );

  const renderOutput = () => (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="h-full bg-gray-900 text-gray-100 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <h6 className="text-blue-400 px-4 pt-4 pb-2 opacity-80 font-mono flex-shrink-0 border-b border-gray-800">
          // Output.{getFileExtension(defaultLanguage)}
        </h6>
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-words">
            {sessionCode && remoteOutput !== null ? remoteOutput : output}
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 overflow-hidden">
      {/* Audio Manager - stays mounted when session exists */}
      {sessionCode && <AudioManager />}

      {/* Heading */}

      {/* Navbar */}
      <div className="py-2 flex-shrink-0">
        <EditorNavbar />
      </div>
      
      {/* Mobile Tabs Navigation */}
      {isMobileView && (
        <div className="flex flex-shrink-0">
          <ul className="flex w-full text-sm font-medium rounded-lg overflow-hidden bg-gray-800 shadow-md">
            <li className="flex-1">
              <button 
                className={`flex items-center justify-center w-full py-3 px-4 transition-colors cursor-pointer ${
                  activeTab === 'editor' 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => dispatch(setActiveTab('editor'))}
              >
                <CodeIcon className="h-5 w-5 mr-2" />
                Editor
              </button>
            </li>
            <li className="flex-1">
              <button 
                className={`flex items-center justify-center w-full py-3 px-4 transition-colors cursor-pointer ${
                  activeTab === 'output' 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => dispatch(setActiveTab('output'))}
              >
                <TerminalIcon className="h-5 w-5 mr-2" />
                Output
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Editor and Output */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isMobileView ? (
          <>
            {/* Mobile View: Show either editor or output based on active tab */}
            <div
              className="relative h-full"
              style={{ display: activeTab !== 'editor' ? 'none' : 'block' }}
            >
              {renderEditor()}
              <QuestionAnswerBox />
              {/* <SearchIcon /> */}
            </div>
            <div
              className="h-full overflow-hidden"
              style={{ display: activeTab !== 'output' ? 'none' : 'block' }}
            >
              {renderOutput()}
            </div>
          </>
        ) : (
          /* Desktop View: Use Split panes for resizable interface */
          <div className="h-full overflow-hidden">
            <Split 
              className="flex h-full"
              sizes={[50, 50]} 
              minSize={100}
              expandToMin={false}
              gutterSize={10}
              gutterAlign="center"
              snapOffset={30}
              dragInterval={1}
              direction="horizontal"
              gutterStyle={() => ({
                backgroundColor: '#1e293b',
                width: '10px',
                cursor: 'col-resize'
              })}
            >
              <div className="h-full relative">
                {renderEditor()}
                <QuestionAnswerBox />
                {/* <SearchIcon /> */}
              </div>
              <div className="h-full overflow-hidden">
                {renderOutput()}
              </div>
            </Split>
          </div>
        )}
      </div>

      {/* Feedback Button */}
      <FeedbackButton onClick={() => dispatch(toggleFeedback(true))} />

      {/* Feedback Form */}
      <FeedbackForm handleClose={() => dispatch(toggleFeedback(false))} />
    </div>
  );
};

export default useReduxStore(JsCompiler);