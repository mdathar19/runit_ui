import React from 'react'

function ThreeDot({theme}) {
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: theme?.dotColors?.[0] || '#ff5f56' }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: theme?.dotColors?.[1] || '#ffbd2e' }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: theme?.dotColors?.[2] || '#27c93f' }}
          ></div>
        </div>
      </div>
    </>
  )
}

export default ThreeDot
