'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaLayerGroup, FaImage } from 'react-icons/fa';
import { ELEMENT_TYPES } from '@/utils/Utils';
import GradientButton from '@/components/global/GradientButton';
import { updateElementContent, setSavingStatus, selectSelectedElement, deleteSelectedElement } from '@/redux/slices/editorSlice';
import api, { publishedPortfolioUrl }  from '@/api';

const RenderElementEditor = ({ iframeRef }) => {
  const dispatch = useDispatch();
  const selectedElement = useSelector(selectSelectedElement);
  const {
    token
  } = useSelector((state) => state.auth);
  // Handle image upload
  const handleImageUpload = (callback) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // When a file is selected
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      dispatch(setSavingStatus('saving'));
      
      try {
        // Create form data
        const formData = new FormData();
        formData.append('image', file);

        // Upload image using the API
        const response = await fetch(api.uploadImage, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          callback(publishedPortfolioUrl+data.imageUrl);
          dispatch(setSavingStatus('saved'));
          setTimeout(() => dispatch(setSavingStatus('')), 2000);
        } else {
          throw new Error(data.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        dispatch(setSavingStatus('error'));
        setTimeout(() => dispatch(setSavingStatus('')), 2000);
      }
    };
    
    // Trigger the file selection dialog
    fileInput.click();
  };

  // Update element content with Redux
  const handleUpdateElementContent = (value) => {
    dispatch(updateElementContent(value));
    
    try {
      const iframe = iframeRef?.current;
      if (!iframe || !selectedElement) return;
      
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
      
      if (!element) return;
      
      // Update element based on type
      if (selectedElement.type === ELEMENT_TYPES.TEXT) {
        // For text elements, try innerText first, then textContent if that doesn't work
        try {
          element.innerText = value;
        } catch (e) {
          element.textContent = value;
        }
      } else if (selectedElement.type === ELEMENT_TYPES.IMAGE) {
        element.src = value;
      } else if (selectedElement.type === ELEMENT_TYPES.LINK) {
        if (typeof value === 'object') {
          if (value.href) element.href = value.href;
          if (value.text) {
            try {
              element.innerText = value.text;
            } catch (e) {
              element.textContent = value.text;
            }
          }
        }
      } else if (selectedElement.type === ELEMENT_TYPES.PROGRESS) {
        // Update progress bar width
        if (typeof value === 'object' && value.width) {
          element.style.width = value.width;
          element.setAttribute('data-width', value.width);
          
          // If the element has aria-valuenow, update that too
          if (element.hasAttribute('aria-valuenow')) {
            element.setAttribute('aria-valuenow', value.valueNow || value.width.replace('%', ''));
          }
          
          // Update nearest parent text that might show the percentage
          const parentContainer = element.closest('.skill, .progress-container');
          if (parentContainer) {
            const percentText = parentContainer.querySelector('.skill-name span:last-child, .percent');
            if (percentText) {
              percentText.innerText = value.width;
            }
          }
        }
      } else if (selectedElement.type === ELEMENT_TYPES.BACKGROUND) {
        // Update background image
        element.style.backgroundImage = `url('${value}')`;
      } else if (selectedElement.type === ELEMENT_TYPES.INPUT) {
        if (typeof value === 'object') {
          if (value.placeholder !== undefined) element.placeholder = value.placeholder;
          if (value.value !== undefined) element.value = value.value;
          if (value.name !== undefined) element.name = value.name;
        } else {
          // If not an object, treat as placeholder
          element.placeholder = value;
        }
      } else if (selectedElement.type === ELEMENT_TYPES.FORM) {
        if (typeof value === 'object') {
          if (value.formId !== undefined) element.id = value.formId;
          if (value.action !== undefined) element.action = value.action;
          if (value.method !== undefined) element.method = value.method;
        }
      }
      
      // Simulate saving
      dispatch(setSavingStatus('saving'));
      setTimeout(() => {
        dispatch(setSavingStatus('saved'));
        setTimeout(() => dispatch(setSavingStatus('')), 2000);
      }, 1000);
    } catch (error) {
      console.error('Error updating element:', error);
      dispatch(setSavingStatus('error'));
    }
  };

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FaLayerGroup className="text-gray-500 text-4xl mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No Element Selected</h3>
        <p className="text-gray-400">Click on any element in the template to edit its content</p>
      </div>
    );
  }

  // Render editor based on element type
  switch(selectedElement.type) {
    case ELEMENT_TYPES.TEXT:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Text</h3>
          <textarea
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
            value={selectedElement.content}
            onChange={(e) => handleUpdateElementContent(e.target.value)}
          />
        </div>
      );
    
    case ELEMENT_TYPES.INPUT:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Form Input</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Placeholder Text</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.placeholder : selectedElement.content) || ''}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, placeholder: e.target.value } : 
                  { placeholder: e.target.value };
                
                handleUpdateElementContent(currentContent);
                
                const iframe = iframeRef?.current;
                if (!iframe || !selectedElement) return;
                
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                
                if (element) {
                  element.placeholder = e.target.value;
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Default Value</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Default value for the field"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.value : '') || ''}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, value: e.target.value } : 
                  { value: e.target.value, placeholder: '' };
                
                handleUpdateElementContent(currentContent);
                
                const iframe = iframeRef?.current;
                if (!iframe || !selectedElement) return;
                
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                
                if (element) {
                  element.value = e.target.value;
                }
              }}
            />
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.FORM:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Form</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Form ID</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Form ID"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.formId : '') || ''}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, formId: e.target.value } : 
                  { formId: e.target.value };
                
                handleUpdateElementContent(currentContent);
                
                const iframe = iframeRef?.current;
                if (!iframe || !selectedElement) return;
                
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                
                if (element) {
                  element.id = e.target.value;
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Form Action</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Form submission URL"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.action : '') || ''}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, action: e.target.value } : 
                  { action: e.target.value };
                
                handleUpdateElementContent(currentContent);
                
                const iframe = iframeRef?.current;
                if (!iframe || !selectedElement) return;
                
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                
                if (element) {
                  element.action = e.target.value;
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Form Method</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.method : 'post') || 'post'}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, method: e.target.value } : 
                  { method: e.target.value };
                
                handleUpdateElementContent(currentContent);
                
                const iframe = iframeRef?.current;
                if (!iframe || !selectedElement) return;
                
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                
                if (element) {
                  element.method = e.target.value;
                }
              }}
            >
              <option value="post">POST</option>
              <option value="get">GET</option>
              <option value="put">PUT</option>
              <option value="delete">DELETE</option>
            </select>
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.IMAGE:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Image</h3>
          <div className="bg-gray-800 rounded-lg p-3 mb-4 overflow-hidden">
            <div className="w-full h-40 bg-gray-900 flex items-center justify-center rounded mb-3 overflow-hidden">
              {selectedElement.content && (
                <img 
                  src={selectedElement.content} 
                  alt="Selected" 
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
              type="text"
              placeholder="Image URL"
              value={selectedElement.content || ''}
              onChange={(e) => handleUpdateElementContent(e.target.value)}
            />
            <GradientButton
              onClick={() => handleImageUpload(url => handleUpdateElementContent(url))}
              className="w-full flex items-center justify-center"
            >
              <FaImage className="mr-2" /> Upload New Image
            </GradientButton>
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.LINK:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Link</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Text</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Link text"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.text : '') || ''}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, text: e.target.value } : 
                  { text: e.target.value, href: '#' };
                
                handleUpdateElementContent(currentContent);
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">URL</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Link URL (https://...)"
              value={(typeof selectedElement.content === 'object' ? selectedElement.content.href : '#') || '#'}
              onChange={(e) => {
                const currentContent = typeof selectedElement.content === 'object' ? 
                  { ...selectedElement.content, href: e.target.value } : 
                  { href: e.target.value, text: '' };
                
                handleUpdateElementContent(currentContent);
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Open in new tab</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-tab"
                className="mr-2"
                defaultChecked={false}
                onChange={(e) => {
                  const iframe = iframeRef?.current;
                  if (!iframe || !selectedElement) return;
                  
                  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                  const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                  
                  if (element) {
                    if (e.target.checked) {
                      element.setAttribute('target', '_blank');
                      element.setAttribute('rel', 'noopener noreferrer');
                    } else {
                      element.removeAttribute('target');
                      element.removeAttribute('rel');
                    }
                  }
                }}
              />
              <label htmlFor="new-tab" className="text-gray-300">Open link in new tab</label>
            </div>
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.PROGRESS:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Progress</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Value (%)</label>
            <input
              type="range"
              className="w-full accent-purple-500 bg-gray-800"
              min="0"
              max="100"
              value={typeof selectedElement.content === 'object' ? 
                selectedElement.content.valueNow || parseInt(selectedElement.content.width) || 0 :
                0
              }
              onChange={(e) => {
                const value = e.target.value;
                const width = `${value}%`;
                
                const newContent = {
                  width,
                  valueNow: value
                };
                
                handleUpdateElementContent(newContent);
              }}
            />
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>0%</span>
              <span>
                {typeof selectedElement.content === 'object' ? 
                  selectedElement.content.width || '0%' : 
                  '0%'
                }
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.BACKGROUND:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Background</h3>
          <div className="bg-gray-800 rounded-lg p-3 mb-4 overflow-hidden">
            <div className="w-full h-40 bg-gray-900 flex items-center justify-center rounded mb-3 overflow-hidden"
              style={{backgroundImage: `url('${selectedElement.content}')`, backgroundSize: 'cover', backgroundPosition: 'center'}}
            />
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
              type="text"
              placeholder="Background image URL"
              value={selectedElement.content || ''}
              onChange={(e) => handleUpdateElementContent(e.target.value)}
            />
            <GradientButton
              onClick={() => handleImageUpload(url => handleUpdateElementContent(url))}
              className="w-full flex items-center justify-center"
            >
              <FaImage className="mr-2" /> Upload New Background
            </GradientButton>
          </div>
        </div>
      );
    
    case ELEMENT_TYPES.SECTION:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Edit Section</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-gray-300 mb-3">
              This is a complete section of the template. You can delete the entire section if needed.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Section ID</label>
              <input
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="text"
                placeholder="Section ID"
                value={(typeof selectedElement.content === 'object' ? selectedElement.content.sectionId : '') || ''}
                onChange={(e) => {
                  const currentContent = typeof selectedElement.content === 'object' ? 
                    { ...selectedElement.content, sectionId: e.target.value } : 
                    { sectionId: e.target.value };
                  
                  handleUpdateElementContent(currentContent);
                  
                  const iframe = iframeRef?.current;
                  if (!iframe || !selectedElement) return;
                  
                  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                  const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                  
                  if (element) {
                    element.id = e.target.value;
                  }
                }}
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => {
                  const iframe = iframeRef?.current;
                  if (!iframe || !selectedElement) return;
                  
                  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                  const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
                  
                  if (element) {
                    element.style.display = 'none';
                    
                    // Dispatch delete action
                    dispatch(deleteSelectedElement());
                    
                    // Show feedback
                    dispatch(setSavingStatus('saving'));
                    setTimeout(() => {
                      dispatch(setSavingStatus('saved'));
                      setTimeout(() => dispatch(setSavingStatus('')), 2000);
                    }, 1000);
                  }
                }}
              >
                <FaLayerGroup className="mr-2" /> Delete Entire Section
              </button>
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="p-4">
          <h3 className="font-medium text-white mb-3">Element Properties</h3>
          <p className="text-gray-400">Select an element property to edit</p>
        </div>
      );
  }
};

export default RenderElementEditor;