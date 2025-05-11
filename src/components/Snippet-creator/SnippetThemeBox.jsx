import React from 'react'

function SnippetThemeBox({
  themes,
  selectedTheme,
  customTheme,
  handleThemeSelect
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => (
        <div 
          key={theme.id}
          onClick={() => handleThemeSelect(theme)}
          className={`cursor-pointer transition-all duration-200 rounded-lg border ${
            (selectedTheme?.id === theme.id && !customTheme) 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
              : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <div 
            style={{ 
              background: theme.background,
              color: theme.color
            }}
            className="p-2 h-20 flex flex-col"
          >
            <div className="flex mb-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.dotColors?.[0] || '#ff5555' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.dotColors?.[1] || '#50fa7b' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.dotColors?.[2] || '#bd93f9' }}></div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="text-xs opacity-70 truncate">code</div>
            </div>
          </div>
          <div className="bg-gray-800 py-1 px-2 text-center text-xs font-medium text-white truncate">
            {theme.name}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SnippetThemeBox