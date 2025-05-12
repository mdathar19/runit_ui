'use client';

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { FaDownload, FaCode, FaCopy, FaUndo, FaRedo, FaEye, FaKeyboard } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectCode, selectIsMobileView, selectSelectedLanguage, setCode } from '@/redux/slices/compilerSlice';
import useReduxStore from '@/hooks/useReduxStore';
import { debounce } from 'lodash';
import { CodeEditor, CodeSnippetBox, SnippetControlPanel, LanguageSelector } from '@/components';

const CreateSnippetClient = ({ themes }) => {
  // Redux state
  const language = useSelector(selectSelectedLanguage);
  const reduxCode = useSelector(selectCode);
  const dispatch = useDispatch();
  const isMobileView = useSelector(selectIsMobileView);
  // Local state for theme customization and UI
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [customTheme, setCustomTheme] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(600);
  const [localCode, setLocalCode] = useState(reduxCode || 'console.log("Hello, world!");');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'editor'
  const previewRef = useRef(null);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Effect to set localCode when reduxCode changes
  useEffect(() => {
    if (reduxCode) {
      setLocalCode(reduxCode);
    }
  }, [reduxCode]);

  // Update history when code changes
  const updateHistory = useMemo(() => debounce((code) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), code];
      if (newHistory.length > 50) newHistory.shift(); // Limit history size
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49)); // Update index
  }, 500), [historyIndex]);

  // Apply theme and customizations
  const currentTheme = useMemo(() => {
    if (!selectedTheme) return themes[0];
    if (!customTheme) return selectedTheme;
    
    return {
      ...selectedTheme,
      ...customTheme
    };
  }, [selectedTheme, customTheme, themes]);

  // Update code in Redux store with debounce
  const debouncedUpdateReduxCode = useMemo(() => 
    debounce((code) => {
      dispatch(setCode(code));
    }, 300)
  , [dispatch]);

  // Handle code change
  const handleCodeChange = (newCode) => {
    setLocalCode(newCode);
    debouncedUpdateReduxCode(newCode);
    updateHistory(newCode);
  };

  // Handle theme select
  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCustomTheme(null); // Reset customizations
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(localCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevCode = history[newIndex];
      setLocalCode(prevCode);
      dispatch(setCode(prevCode));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextCode = history[newIndex];
      setLocalCode(nextCode);
      dispatch(setCode(nextCode));
    }
  };

  // Download as image function
const downloadAsImage = async () => {
  setDownloading(true);
  try {
    const [html2canvas, fileSaver] = await Promise.all([
      import('html2canvas').then(module => module.default),
      import('file-saver').then(module => module.default),
    ]);

    const saveAs = fileSaver.saveAs;
    const element = document.getElementById('snippet-preview');

    // Create a temporary container with position absolute
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = `${width}px`;
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    // Clone the element and modify its styles for proper rendering
    const clone = element.cloneNode(true);
    clone.style.width = `${width}px`;
    clone.style.maxHeight = 'none';
    clone.style.height = 'auto';
    clone.style.paddingBottom = '40px'; // Increased padding at bottom
    clone.style.overflow = 'visible';
    clone.style.visibility = 'visible';
    clone.style.boxSizing = 'border-box';
    
    // Find the code content element inside the clone and add extra padding
    const codeElement = clone.querySelector('pre') || clone.querySelector('code');
    if (codeElement) {
      codeElement.style.paddingBottom = '10px'; // Add extra padding to code element
    }
    
    tempContainer.appendChild(clone);

    // Force browser recalculation of styles and trigger a repaint
    clone.offsetHeight;
    
    // Wait longer for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate actual required height and add extra buffer
    const actualHeight = clone.scrollHeight;
    const renderHeight = actualHeight + 10; // Add extra buffer height
    clone.style.height = `${renderHeight}px`;

    // Wait again after height adjustment
    await new Promise(resolve => setTimeout(resolve, 200));

    const canvas = await html2canvas(clone, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
      width: width,
      height: renderHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('snippet-preview');
        if (clonedElement) {
          clonedElement.style.width = `${width}px`;
          clonedElement.style.maxHeight = 'none';
          clonedElement.style.height = `${renderHeight}px`;
          clonedElement.style.overflow = 'visible';
          clonedElement.style.background = currentTheme?.background || '#1e1e1e';
          
          // Ensure text is fully visible
          const textElements = clonedElement.querySelectorAll('span, code, pre');
          textElements.forEach(el => {
            el.style.overflow = 'visible';
            el.style.textOverflow = 'clip';
          });
        }
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `runit-snippet-${language}.png`);
      }
      document.body.removeChild(tempContainer);
      setDownloading(false);
    });
  } catch (error) {
    console.error("Error generating image:", error);
    setDownloading(false);
  }
};

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 flex items-center"><FaCode className="mr-2" />Create Code Snippet</h1>
      <div>
        <p className="text-gray-300 mb-6">
          Create beautiful, shareable code snippets with various themes and customization options. 
          Choose from a variety of themes, customize size and colors, then download your snippet as an image.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center px-4 py-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === 'editor' 
                  ? 'text-purple-400 border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {!isMobileView && <span className='mr-2'> Code Editor </span>}<FaKeyboard className="mr-2" />
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center px-4 py-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === 'preview' 
                  ? 'text-purple-400 border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {!isMobileView && <span className='mr-2'> Preview </span>}<FaEye className="mr-2" />
            </button>
            
            {activeTab === 'preview' && (
              <div className="ml-auto">
                <button
                  onClick={downloadAsImage}
                  disabled={downloading}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded flex items-center transition-colors disabled:bg-purple-800 disabled:opacity-70"
                >
                  {!isMobileView && <span className='mr-2'> Save as Image </span>}<FaDownload className="mr-2" />
                </button>
              </div>
            )}
            
            {activeTab === 'editor' && (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isMobileView && <span className='mr-2'> Undo </span>}<FaUndo className="mr-1" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isMobileView && <span className='mr-2'> Redo </span>}<FaRedo className="mr-1" />
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center transition-colors"
                >
                  {!isMobileView && <span className='mr-2'> Copy </span>}<FaCopy className="mr-1" />
                </button>
              </div>
            )}
          </div>

          {/* Preview Tab Content */}
          {activeTab === 'preview' && (
            <Suspense fallback={<div className="animate-pulse bg-gray-800 rounded-lg w-full h-64"></div>}>
              <CodeSnippetBox 
                previewRef={previewRef}
                selectedTheme={currentTheme}
                language={language}
                code={localCode}
                width={width}
                height={height}
              />
            </Suspense>
          )}

          {/* Editor Tab Content */}
          {activeTab === 'editor' && (
            <>
              <div className="mb-4">
                <LanguageSelector 
                  selectedLanguage={language} 
                  // Language selector component will connect to redux
                />
              </div>
              <Suspense fallback={<div className="animate-pulse bg-gray-800 rounded-lg w-full h-64"></div>}>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <CodeEditor
                    language={language}
                    value={localCode}
                    onChange={handleCodeChange}
                    theme={currentTheme}
                    height="400px"
                  />
                </div>
              </Suspense>
            </>
          )}
        </div>
        
        {/* Controls Panel */}
        <SnippetControlPanel 
          setCustomTheme={setCustomTheme}
          customTheme={customTheme}
          currentTheme={currentTheme}
          setWidth={setWidth}
          width={width}
          setHeight={setHeight}
          height={height}
          themes={themes}
          handleThemeSelect={handleThemeSelect}
          selectedTheme={selectedTheme}
        />
      </div>
    </>
  );
};

export default useReduxStore(CreateSnippetClient);