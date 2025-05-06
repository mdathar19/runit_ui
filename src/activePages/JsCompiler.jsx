"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MonacoEditor from "@monaco-editor/react";
import Split from "react-split";
import { CodeIcon, TerminalIcon } from "@heroicons/react/solid";
import { HeartIcon } from "@heroicons/react/solid";

// Component imports
import EditorNavbar from "../components/JsCompiler/EditorNavbar";
import QuestionAnswerBox from "../components/JsCompiler/QuestionAnswerBox";
import SearchIcon from "../components/JsCompiler/SearchIcon";
import FeedbackButton from "../components/JsCompiler/FeedbackButton";
import FeedbackForm from "../components/JsCompiler/FeedbackForm";

// Import from Redux slices and hooks
import { 
  setCode,
  setActiveTab,
  toggleFeedback,
  selectSelectedLanguage
} from "../redux/slices/compilerSlice";
import { useDeviceSetup, useMonacoSetup, useCompilerSelectors } from "../redux/hooks";
import { getFileExtension } from "../Utils";

const JsCompiler = () => {
  // Set up hooks
  const dispatch = useDispatch();
  
  // Initialize device detection
  useDeviceSetup();
  
  // Get the Monaco setup with editor mount handler
  const { handleEditorDidMount } = useMonacoSetup();
  
  // Get all required selectors from Redux store
  const {
    code,
    output,
    activeTab,
    isMobileView
  } = useCompilerSelectors();

  // Get the selected language from the Redux store
  const selectedLanguage = useSelector(selectSelectedLanguage);

  // Map the selected language to Monaco editor language
  const getMonacoLanguage = () => {
    switch (selectedLanguage) {
      case 'javascript':
        return 'javascript';
      case 'typescript':
        return 'typescript';
      case 'python':
        return 'python';
      case 'c':
        return 'c';
      case 'c++':
        return 'cpp';
      case 'go':
        return 'go';
      case 'java':
        return 'java';
      default:
        return 'javascript';
    }
  };

  const renderEditor = () => (
    <div className="w-full h-full">
      <div className="h-full">
        <MonacoEditor
          height="100vh"
          width="100%"
          language={getMonacoLanguage()}
          theme="vs-dark"
          value={code}
          onChange={(value) => dispatch(setCode(value))}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            minimap: { enabled: false },
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
    <div className="w-full h-full">
      <div className="h-full bg-gray-900 text-gray-100 rounded-lg shadow-xl overflow-hidden">
        <pre 
          className="p-4 h-full w-full max-h-full overflow-y-auto font-mono text-sm"
        >
          <h6 className="text-blue-400 mb-2 opacity-80 font-mono">// Output.{getFileExtension(selectedLanguage)}</h6>
          {output}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 overflow-hidden">
      {/* Heading */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-900 p-2 text-white shadow-lg">
        <div className="container mx-auto">
          <div className="font-light text-sm tracking-wide text-center">
            Made with <HeartIcon className="h-4 w-4 text-red-400 inline-block mx-1 animate-pulse" /> by <strong><a href="#" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline transition-all">RunIt team</a></strong>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="py-2">
        <EditorNavbar />
      </div>
      
      {/* Mobile Tabs Navigation */}
      {isMobileView && (
        <div className="flex">
          <ul className="flex w-full text-sm font-medium rounded-lg overflow-hidden bg-gray-800 shadow-md">
            <li className="flex-1">
              <button 
                className={`flex items-center justify-center w-full py-3 px-4 transition-colors ${
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
                className={`flex items-center justify-center w-full py-3 px-4 transition-colors ${
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
      <div className="flex-1">
        {isMobileView ? (
          <>
            {/* Mobile View: Show either editor or output based on active tab */}
            <div 
              className="relative h-full"
              style={{ display: activeTab !== 'editor' ? 'none' : 'block' }}
            >
              {renderEditor()}
              <QuestionAnswerBox />
              <SearchIcon />
            </div>
            <div 
              className="h-full"
              style={{ display: activeTab !== 'output' ? 'none' : 'block' }}
            >
              {renderOutput()}
            </div>
          </>
        ) : (
          /* Desktop View: Use Split panes for resizable interface */
          <div className="h-full">
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
                <SearchIcon />
              </div>
              <div className="h-full">
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

export default JsCompiler;