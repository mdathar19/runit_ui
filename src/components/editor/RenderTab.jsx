'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaLayerGroup, FaFont, FaImage } from 'react-icons/fa';
import { TABS, ELEMENT_TYPES } from '@/utils/Utils';
import RenderElementEditor from './RenderElement';
import { selectSelectedElement, selectActiveTab } from '@/redux/slices/editorSlice';

const RenderTab = ({ iframeRef }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const selectedElement = useSelector(selectSelectedElement);
  
  // Style tab render
  const renderStyleTab = () => {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <h3 className="font-medium text-white mb-3">Style Editor</h3>
        
        {!selectedElement ? (
          <p className="text-gray-400 mb-4">Select an element to edit its style</p>
        ) : (
          <>
            <div className="bg-gray-800 rounded-md p-3 mb-4 text-sm text-gray-300">
              Editing: <span className="text-purple-400">{selectedElement.type}</span> element
            </div>
            
            <div className="space-y-4">
              {/* Text styling options */}
              {[ELEMENT_TYPES.TEXT, ELEMENT_TYPES.BUTTON, ELEMENT_TYPES.LINK].includes(selectedElement.type) && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Text Color</label>
                    <div className="flex">
                      <input
                        type="color"
                        className="h-10 w-10 rounded bg-transparent cursor-pointer"
                        defaultValue="#ffffff"
                        onChange={(e) => {
                          const iframe = iframeRef.current;
                          if (!iframe) return;
                          
                          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                          const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                          
                          if (element) {
                            element.style.color = e.target.value;
                          }
                        }}
                      />
                      <div className="ml-2 flex-1">
                        <select 
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onChange={(e) => {
                            const iframe = iframeRef.current;
                            if (!iframe) return;
                            
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                            
                            if (element) {
                              element.style.color = e.target.value;
                            }
                          }}
                        >
                          <option value="">Select a preset</option>
                          <option value="#ffffff">White</option>
                          <option value="#a855f7">Purple</option>
                          <option value="#2563eb">Blue</option>
                          <option value="#65a30d">Green</option>
                          <option value="#eab308">Yellow</option>
                          <option value="#ef4444">Red</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Font Size</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const iframe = iframeRef.current;
                        if (!iframe) return;
                        
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                        
                        if (element) {
                          element.style.fontSize = e.target.value;
                        }
                      }}
                    >
                      <option value="">Select size</option>
                      <option value="0.75rem">Extra Small</option>
                      <option value="0.875rem">Small</option>
                      <option value="1rem">Normal</option>
                      <option value="1.25rem">Large</option>
                      <option value="1.5rem">Extra Large</option>
                      <option value="2rem">Heading 2</option>
                      <option value="2.5rem">Heading 1</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Font Weight</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const iframe = iframeRef.current;
                        if (!iframe) return;
                        
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                        
                        if (element) {
                          element.style.fontWeight = e.target.value;
                        }
                      }}
                    >
                      <option value="">Select weight</option>
                      <option value="300">Light</option>
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi-Bold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Text Alignment</label>
                    <div className="flex gap-2">
                      {['left', 'center', 'right', 'justify'].map(align => (
                        <button
                          key={align}
                          className="flex-1 py-2 px-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 text-gray-300"
                          onClick={() => {
                            const iframe = iframeRef.current;
                            if (!iframe) return;
                            
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                            
                            if (element) {
                              element.style.textAlign = align;
                            }
                          }}
                        >
                          {align.charAt(0).toUpperCase() + align.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Background options for any element */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Background Color</label>
                <div className="flex">
                  <input
                    type="color"
                    className="h-10 w-10 rounded bg-transparent cursor-pointer"
                    defaultValue="#000000"
                    onChange={(e) => {
                      const iframe = iframeRef.current;
                      if (!iframe) return;
                      
                      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                      const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                      
                      if (element) {
                        element.style.backgroundColor = e.target.value;
                      }
                    }}
                  />
                  <div className="ml-2 flex-1">
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const iframe = iframeRef.current;
                        if (!iframe) return;
                        
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                        
                        if (element) {
                          element.style.backgroundColor = e.target.value;
                        }
                      }}
                    >
                      <option value="">Select a preset</option>
                      <option value="#000000">Black</option>
                      <option value="#1e1e1e">Dark Gray</option>
                      <option value="#a855f7">Purple</option>
                      <option value="#2563eb">Blue</option>
                      <option value="#65a30d">Green</option>
                      <option value="#eab308">Yellow</option>
                      <option value="#ef4444">Red</option>
                      <option value="#ffffff">White</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Spacing controls */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Padding</label>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => {
                      const iframe = iframeRef.current;
                      if (!iframe) return;
                      
                      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                      const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                      
                      if (element) {
                        element.style.padding = e.target.value;
                      }
                    }}
                  >
                    <option value="">Padding All</option>
                    <option value="0">None</option>
                    <option value="4px">Tiny</option>
                    <option value="8px">Small</option>
                    <option value="16px">Medium</option>
                    <option value="24px">Large</option>
                    <option value="32px">Extra Large</option>
                  </select>
                  
                  <select 
                    className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => {
                      const iframe = iframeRef.current;
                      if (!iframe) return;
                      
                      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                      const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                      
                      if (element) {
                        element.style.margin = e.target.value;
                      }
                    }}
                  >
                    <option value="">Margin All</option>
                    <option value="0">None</option>
                    <option value="4px">Tiny</option>
                    <option value="8px">Small</option>
                    <option value="16px">Medium</option>
                    <option value="24px">Large</option>
                    <option value="32px">Extra Large</option>
                  </select>
                </div>
              </div>
              
              {/* Specific controls for progress elements */}
              {selectedElement.type === ELEMENT_TYPES.PROGRESS && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Progress Bar Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      className="h-10 w-10 rounded bg-transparent cursor-pointer"
                      defaultValue="#a855f7"
                      onChange={(e) => {
                        const iframe = iframeRef.current;
                        if (!iframe) return;
                        
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                        
                        if (element) {
                          element.style.backgroundColor = e.target.value;
                        }
                      }}
                    />
                    <div className="ml-2 flex-1">
                      <select 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                          const iframe = iframeRef.current;
                          if (!iframe) return;
                          
                          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                          const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                          
                          if (element) {
                            element.style.backgroundColor = e.target.value;
                          }
                        }}
                      >
                        <option value="">Select a preset</option>
                        <option value="#a855f7">Purple</option>
                        <option value="#2563eb">Blue</option>
                        <option value="#65a30d">Green</option>
                        <option value="#eab308">Yellow</option>
                        <option value="#ef4444">Red</option>
                        <option value="#ffffff">White</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Settings tab render
  const renderSettingsTab = () => {
    return (
      <div className="p-4">
        <h3 className="font-medium text-white mb-3">Template Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Template Name</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue="My Custom Template"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">SEO Title</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue="My Professional Portfolio"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">SEO Description</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
              defaultValue="A stunning portfolio website showcasing my professional work and skills."
            />
          </div>
        </div>
      </div>
    );
  };

  // Render tab content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case TABS.ELEMENTS:
        return (
          <div className="h-full overflow-y-auto">
            <RenderElementEditor iframeRef={iframeRef} />
          </div>
        );
      
      case TABS.STYLE:
        return renderStyleTab();
      
      case TABS.SETTINGS:
        return renderSettingsTab();
      
      default:
        return null;
    }
  };

  return renderContent();
};

export default RenderTab;