'use client'

import React, { useRef, useEffect } from 'react'
import SnippetThemeBox from './SnippetThemeBox';
import { getContrastColor } from '@/utils/Utils';

const ColorPicker = ({ 
  color, 
  onChange, 
  label, 
  themes, 
  selectedTheme, 
  customTheme, 
  handleThemeSelect,
  showThemes = false 
}) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div 
        className="w-full h-10 rounded-md cursor-pointer border border-gray-600 flex items-center px-3"
        onClick={() => setShowPicker(!showPicker)}
        style={{ background: color }}
      >
        <span className="ml-2 text-sm" style={{ 
          color: color.startsWith('linear-gradient') ? 'white' : getContrastColor(color),
          textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
        }}>
          {color}
        </span>
      </div>
      
      {showPicker && (
        <div className="absolute z-50 mt-2 bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700 w-80 md:w-80 lg:w-70 xl:w-80 max-h-96 overflow-y-auto">
          {showThemes && themes ? (
            <SnippetThemeBox 
              themes={themes}
              selectedTheme={selectedTheme}
              customTheme={customTheme}
              handleThemeSelect={handleThemeSelect}
            />
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {['#1e1e1e', '#282a36', '#002b36', '#2e3440', '#272822', 
                  '#f6f8fa', '#000000', '#ffffff', '#6272a4', '#44475a', 
                  '#ff5555', '#50fa7b', '#f1fa8c', '#bd93f9', '#ff79c6',
                  '#8be9fd', '#ffb86c', '#f8f8f2', '#6c71c4', '#268bd2'].map((presetColor) => (
                  <div
                    key={presetColor}
                    className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-600"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      onChange(presetColor);
                      setShowPicker(false);
                    }}
                  />
                ))}
              </div>
              {/* Color choose Input */}
              <div className="mb-3">
                <input
                  type="color"
                  value={color.startsWith('#') ? color : '#1e1e1e'}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </>
          )}
          
          <button 
            className="w-full mt-3 bg-gray-700 hover:bg-gray-600 py-1 rounded text-sm"
            onClick={() => setShowPicker(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker