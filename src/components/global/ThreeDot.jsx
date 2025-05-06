import React from 'react'

function ThreeDot({theme}) {
  return (
    <>
      <span style={{ 
        height: '12px', 
        width: '12px', 
        borderRadius: '50%', 
        backgroundColor: theme.accentColor,
        marginRight: '8px'
        }}></span>
        <span style={{ 
        height: '12px', 
        width: '12px', 
        borderRadius: '50%', 
        backgroundColor: theme.secondaryColor,
        marginRight: '8px'
        }}></span>
        <span style={{ 
        height: '12px', 
        width: '12px', 
        borderRadius: '50%', 
        backgroundColor: theme.tertiaryColor
        }}></span>
    </>
  )
}

export default ThreeDot
