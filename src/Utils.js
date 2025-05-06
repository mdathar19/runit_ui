/**
 * Utils.js - Utility functions and constants for JsCompiler component
 */

// Default code to display in the editor on load
export const DEFAULT_CODE = '// Write your JavaScript code here\nconsole.log("Hello, World!");';

/**
 * Extracts code blocks from API response text
 * @param {string} text - The full text response
 * @returns {string} - Extracted code blocks or original text
 */
export const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```(?:\w+)?\n?([^`]+?)```/gs;
  const matches = [...text.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    return matches.map(match => match[1].trim()).join('\n\n');
  }
  return text.trim();
};


/**
 * Calculate editor position for search icon and question box
 * @param {Object} editor - Monaco editor instance
 * @param {Object} position - Current cursor position
 * @returns {Object} - Calculated position coordinates
 */
export const calculateEditorPosition = (editor, position) => {
  const editorCoords = editor.getScrolledVisiblePosition(position);
  const editorDomNode = editor.getDomNode();
  
  if (editorDomNode) {
    const editorRect = editorDomNode.getBoundingClientRect();
    return {
      top: editorRect.top + editorCoords.top, // 30px above cursor
      left: editorRect.left + editorCoords.left
    };
  }
  
  return { top: 0, left: 0 };
};

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_QUESTION: "Ctrl+Space",
  SUBMIT_QUESTION: "Ctrl+Enter",
  CLOSE_QUESTION: "Escape"
};

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Running in browser
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    } else {
      return ''; // Empty base URL, use relative path in production
    }
  } else {
    // Running in server-side rendering (optional handling)
    return '';
  }
};
// Generate a unique device ID
export const generateDeviceId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getFileExtension = (language) => {
  const map = {
    python: "py",
    python3: "py",
    javascript: "js",
    typescript: "ts",
    "c++": "cpp",
    c: "c",
    java: "java",
    ruby: "rb",
    php: "php",
    bash: "sh",
    rust: "rs",
    go: "go",
    swift: "swift",
    kotlin: "kt"
  };
  return map[language] || "txt";
};
export const sanitizeErrorTrace = (errorOutput) => {
  if (typeof errorOutput !== "string") return errorOutput;

  const extensions = [
    "py", "js", "ts", "cpp", "c", "java",
    "rb", "php", "sh", "rs", "go", "swift", "kt"
  ];
  const extPattern = extensions.join("|");

  let cleanedOutput = errorOutput;
  cleanedOutput = cleanedOutput.replace(
    /at\s+file:\/\/\/piston\/jobs\/[a-z0-9-]+\/main\.(?:py|js|ts|cpp|c|java|rb|php|sh|rs|go|swift|kt):\d+:\d+/gi,
    'at main.<js>:<line>:<col>'
  );
  cleanedOutput = cleanedOutput.replace(
    /File\s+"\/piston\/jobs\/[a-z0-9-]+\/main\.(?:py|js|ts|cpp|c|java|rb|php|sh|rs|go|swift|kt)",\s+line\s+\d+/gi,
    'File "main.<py>", line <line>'
  );
  cleanedOutput = cleanedOutput.replace(
    new RegExp(`main\\.(${extPattern}):(\\d+):(\\d+)`, 'gi'),
    'main.<ext>:<line>:<col>'
  );
  cleanedOutput = cleanedOutput.replace(
    new RegExp(`main\\.(${extPattern}):(\\d+)`, 'gi'),
    'main.<ext>:<line>'
  );

  return cleanedOutput;
};

export const snippetThemes = [
  {
    id: 'dark-terminal',
    name: 'Dark Terminal',
    background: '#1e1e1e',
    color: '#f8f8f8',
    accentColor: '#ff5f56',
    secondaryColor: '#ffbd2e',
    tertiaryColor: '#27c93f',
    fontFamily: 'monospace'
  },
  {
    id: 'gradient-purple',
    name: 'Gradient Purple',
    background: 'linear-gradient(135deg, #4a0083 0%, #7928ca 100%)',
    color: '#ffffff',
    accentColor: '#ff6b6b',
    secondaryColor: '#fbff00',
    tertiaryColor: '#00ff95',
    fontFamily: '"Fira Code", monospace'
  },
  {
    id: 'light-minimal',
    name: 'Light Minimal',
    background: '#f7f7f7',
    color: '#333333',
    accentColor: '#4285f4',
    secondaryColor: '#ea4335',
    tertiaryColor: '#34a853',
    fontFamily: '"Roboto Mono", monospace'
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    background: '#000000',
    color: '#00ff95',
    accentColor: '#ff00ff',
    secondaryColor: '#00ffff',
    tertiaryColor: '#ffff00',
    fontFamily: '"Source Code Pro", monospace',
    textShadow: '0 0 5px #00ff95, 0 0 10px #00ff95'
  },
  {
    id: 'vintage-code',
    name: 'Vintage Code',
    background: '#2b2b2b',
    color: '#f8f8f2',
    accentColor: '#ff5555',
    secondaryColor: '#f1fa8c',
    tertiaryColor: '#50fa7b',
    fontFamily: '"IBM Plex Mono", monospace'
  }
];

export const getMonacoLanguage = () => {
  switch (selectedLanguage) {
    case 'javascript':
      return 'javascript';
    case 'typescript':
      return 'typescript';
    case 'python':
      return 'python';
    case 'c':
      return 'c';
    case 'c++':
      return 'cpp';
    case 'go':
      return 'go';
    case 'java':
      return 'java';
    default:
      return 'javascript';
  }
};



