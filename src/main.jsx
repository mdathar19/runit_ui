import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import JsCompiler from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JsCompiler />
  </StrictMode>,
)
