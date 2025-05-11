import React from 'react'
import { FaPalette } from 'react-icons/fa'
import ColorPicker from './ColorPicker'

function SnippetControlPanel({
    setCustomTheme,
    customTheme,
    currentTheme,
    setWidth,
    width,
    setHeight,
    height,
    themes,
    handleThemeSelect,
    selectedTheme
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-fit sticky top-4">
      <h3 className="text-xl font-medium mb-4 flex items-center">
        <FaPalette className="mr-2" /> Customization
      </h3>
      
      <div className="space-y-6">
        {/* Colors */}
        <div>
          <h4 className="font-medium text-gray-200 mb-3 flex items-center">
            <FaPalette className="mr-2 text-sm" /> Colors
          </h4>
          
          <div className="space-y-4">
            <ColorPicker 
              color={customTheme?.background || currentTheme.background}
              onChange={(color) => setCustomTheme(prev => ({ ...prev || {}, background: color }))}
              label="Background Color"
              themes={themes}
              selectedTheme={selectedTheme}
              customTheme={customTheme}
              handleThemeSelect={handleThemeSelect}
              showThemes={true}
            />
            
            {/* Text Color */}
            <ColorPicker 
              color={customTheme?.color || currentTheme.color}
              onChange={(color) => setCustomTheme(prev => ({ ...prev || {}, color: color }))}
              label="Text Color"
              showThemes={false}
            />
          </div>
        </div>
        
        {/* Size */}
        <div>
          <h4 className="font-medium text-gray-200 mb-3">Size</h4>
          
          <div className="space-y-4">
            <div>
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
            
            <div>
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
          </div>
        </div>
        
        {/* Reset button */}
        <div className="pt-2">
          <button
            onClick={() => setCustomTheme(null)}
            disabled={!customTheme}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Theme Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

export default SnippetControlPanel