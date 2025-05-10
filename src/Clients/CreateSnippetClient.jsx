'use client';

import React, { useState, useRef } from 'react';
import { FaDownload, FaCode, FaChevronLeft, FaChevronRight, FaCopy, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { selectCode, selectSelectedLanguage } from '@/redux/slices/compilerSlice';
import useReduxStore from '@/hooks/useReduxStore';

// Dynamically import components that use browser APIs
const CodeSnippetBox = dynamic(() => import('../components/global/CodeSnippetBox'), { ssr: false });

const CreateSnippetClient = ({ themes }) => {
  const [showModal, setShowModal] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [step, setStep] = useState('select-theme'); // 'select-theme' or 'preview'
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(600);
  const previewRef = useRef(null);
  const language = useSelector(selectSelectedLanguage);
  const code = useSelector(selectCode);

  const handleClose = () => {
    setShowModal(false);
    setStep('select-theme');
    setSelectedTheme(null);
    setCopied(false);
    setHeight(400);
    setWidth(600);
  };

  const handleShow = () => setShowModal(true);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const goToPreview = () => {
    if (selectedTheme) {
      setStep('preview');
    }
  };

  const goBackToThemes = () => {
    setStep('select-theme');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsImage = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2canvas and file-saver only when needed
      const [html2canvas, { saveAs }] = await Promise.all([
        import('html2canvas').then(module => module.default),
        import('file-saver')
      ]);
      
      const element = document.getElementById('snippet-preview');
      
      // Create a temporary container to render the entire snippet
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = `${width}px`;
      document.body.appendChild(tempContainer);
      
      // Clone the element to the temporary container
      const clone = element.cloneNode(true);
      clone.style.width = `${width}px`;
      clone.style.height = 'auto'; // Let it expand to show all content
      clone.style.maxHeight = 'none'; // Remove max-height restriction
      tempContainer.appendChild(clone);
      
      // Generate canvas from the cloned element
      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        width: width,
        height: clone.offsetHeight,
        windowWidth: width,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('snippet-preview');
          if (clonedElement) {
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.background = selectedTheme?.background || '#1e1e1e';
          }
        }
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, `code-snippet-${language}-${Date.now()}.png`);
        // Clean up
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
        <p className="text-gray-300">
            Create beautiful, shareable code snippets with various themes and customization options. 
            Choose from a variety of themes, customize size, and download your snippet as an image. Select a theme for your code snippet:
        </p>
        </div>
        <div className="overflow-y-auto mt-4">
          {/* Modal */}
          <div className="flex items-center justify-center">
            <div className="rounded-lg shadow-xl w-full">
              {/* Body */}
              <div>
                {step === 'select-theme' ? (
                  <div>
                    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {themes.map((theme) => (
                        <div 
                          key={theme.id}
                          onClick={() => handleThemeSelect(theme)}
                          className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 rounded-lg border ${
                            selectedTheme?.id === theme.id 
                              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <div 
                            style={{ 
                              background: theme.background,
                              color: theme.color
                            }}
                            className="p-4 h-32 flex flex-col"
                          >
                            <div className="flex mb-2">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.dotColors[0] }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.dotColors[1] }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.dotColors[2] }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-800 py-2 px-3 text-center text-sm font-medium text-white">
                            {theme.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview */}
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">Preview</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center transition-colors"
                          >
                            <FaCopy className="mr-2" />
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={downloadAsImage}
                            disabled={downloading}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded flex items-center transition-colors disabled:bg-purple-800 disabled:opacity-70"
                          >
                            <FaDownload className="mr-2" />
                            {downloading ? 'Generating...' : 'Save as Image'}
                          </button>
                        </div>
                      </div>
                      
                      <CodeSnippetBox 
                        previewRef={previewRef}
                        selectedTheme={selectedTheme}
                        language={language}
                        code={code}
                        width={width}
                        height={height}
                      />
                    </div>
                    
                    {/* Controls */}
                    <div className="w-full md:w-64 bg-gray-800 rounded-lg p-4 flex-shrink-0">
                      <h4 className="text-white font-medium mb-4">Customize Size</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Width (px)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={width}
                            min={300}
                            max={1200}
                            step={10}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="block w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <span className="ml-2 text-gray-400">px</span>
                        </div>
                        <input
                          type="range"
                          value={width}
                          min={300}
                          max={1200}
                          step={10}
                          onChange={(e) => setWidth(Number(e.target.value))}
                          className="w-full mt-2 accent-purple-500"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Max Height (px)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={height}
                            min={200}
                            max={800}
                            step={10}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="block w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <span className="ml-2 text-gray-400">px</span>
                        </div>
                        <input
                          type="range"
                          value={height}
                          min={200}
                          max={800}
                          step={10}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full mt-2 accent-purple-500"
                        />
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-white font-medium mb-2">Note</h5>
                        <p className="text-sm text-gray-400">
                          When saving as image, the entire content will be captured regardless of the preview height.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex justify-end items-center p-4 border-t border-gray-700">
                {step === 'select-theme' ? (
                  <button 
                    onClick={goToPreview}
                    disabled={!selectedTheme}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center transition-colors disabled:bg-gray-700 disabled:text-gray-400"
                  >
                    Next <FaChevronRight className="ml-2" />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={goBackToThemes}
                      className="px-4 py-2 mr-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-md flex items-center transition-colors"
                    >
                      <FaChevronLeft className="mr-2" /> Back to Themes
                    </button>
                    <button 
                      onClick={downloadAsImage}
                      disabled={downloading}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center transition-colors disabled:bg-purple-800 disabled:opacity-70"
                    >
                      {downloading ? 'Generating...' : 'Save as Image'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default useReduxStore(CreateSnippetClient);