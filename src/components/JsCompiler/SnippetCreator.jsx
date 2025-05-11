import React, { useState, useRef } from 'react';
import { FaDownload, FaCode, FaChevronLeft, FaChevronRight, FaCopy, FaImage, FaTimes } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import AppTooltip from '../global/AppTooltip';
import CodeSnippetBox from '../Snippet-creator/CodeSnippetBox';
import IconButton from '../global/IconButton';

// Mock theme data - typically would come from a separate file
const snippetThemes = [
  {
    id: 'dark',
    name: 'Dark',
    background: 'linear-gradient(to right, #1e1e1e, #2d2d2d)',
    color: '#f8f8f8',
    fontFamily: 'Consolas, Monaco, monospace',
    dotColors: ['#ff5f56', '#ffbd2e', '#27c93f'],
    accentColor: '#ff5f56'
  },
  {
    id: 'monokai',
    name: 'Monokai',
    background: 'linear-gradient(to right, #272822, #3e3d32)',
    color: '#f8f8f2',
    fontFamily: 'Consolas, Monaco, monospace',
    dotColors: ['#fc618d', '#fce566', '#7bd88f'],
    accentColor: '#fce566'
  },
  {
    id: 'github',
    name: 'GitHub',
    background: 'linear-gradient(to right, #f6f8fa, #fff)',
    color: '#24292e',
    fontFamily: 'Consolas, Monaco, monospace',
    dotColors: ['#ea4a5a', '#ffdf5d', '#34d058'],
    accentColor: '#34d058'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: 'linear-gradient(to right, #282a36, #44475a)',
    color: '#f8f8f2',
    fontFamily: 'Fira Code, monospace',
    dotColors: ['#ff5555', '#ffb86c', '#50fa7b'],
    accentColor: '#bd93f9'
  },
  {
    id: 'nord',
    name: 'Nord',
    background: 'linear-gradient(to right, #2e3440, #3b4252)',
    color: '#eceff4',
    fontFamily: 'Fira Code, monospace',
    dotColors: ['#bf616a', '#ebcb8b', '#a3be8c'],
    accentColor: '#88c0d0'
  },
  {
    id: 'solarized',
    name: 'Solarized',
    background: 'linear-gradient(to right, #002b36, #073642)',
    color: '#839496',
    fontFamily: 'Menlo, Monaco, monospace',
    dotColors: ['#dc322f', '#b58900', '#859900'],
    accentColor: '#2aa198'
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    background: 'linear-gradient(to right, #282c34, #3a404c)',
    color: '#abb2bf',
    fontFamily: 'Menlo, Monaco, monospace',
    dotColors: ['#e06c75', '#e5c07b', '#98c379'],
    accentColor: '#61afef'
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    background: 'linear-gradient(to right, #2b213a, #444267)',
    color: '#f9f9f9',
    fontFamily: 'IBM Plex Mono, monospace',
    textShadow: '0 0 5px #ff7edb',
    dotColors: ['#f97e72', '#fdca40', '#6bffa0'],
    accentColor: '#ff7edb'
  }
];

const SnippetCreator = ({ code, language }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [step, setStep] = useState('select-theme'); // 'select-theme' or 'preview'
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(600);
  const previewRef = useRef(null);

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
      <AppTooltip position="left" icon={true} text="Create Snippet">
        <IconButton 
          icon={<FaImage />}
          variant="dark" 
          onClick={handleShow}
        />
      </AppTooltip>
      
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={handleClose}></div>
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-6xl mx-4 border border-gray-700 relative z-50">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <FaCode className="mr-2" />
                  {step === 'select-theme' ? 'Select Snippet Design' : 'Customize Snippet'}
                </h3>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6">
                {step === 'select-theme' ? (
                  <div>
                    <p className="text-gray-400 mb-6">Select a theme for your code snippet:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {snippetThemes.map((theme) => (
                        <div 
                          key={theme.id}
                          onClick={() => handleThemeSelect(theme)}
                          className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden border ${
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
      )}
    </>
  );
};

export default SnippetCreator;