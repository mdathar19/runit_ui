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
  CLOSE_QUESTION: "Escape",
  INSERT_CODE_AT_CURSOR: "Ctrl+Enter"
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

export const getSnippetThemes = () => {
  return [
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
      textShadow: '0 0 5px #00ff95, 0 0 10pxrgb(23, 26, 25)'
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
    },
    {
      id: 'sunset-vibes',
      name: 'Sunset Vibes',
      background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 100%, rgba(252, 176, 69, 1) 100%)',
      color: 'white',
      accentColor: '#7159c1',
      secondaryColor: '#ff6b6b',
      tertiaryColor: '#48dbfb',
      fontFamily: '"Roboto Mono", monospace'
    },
    {
      id: 'ocean-breeze',
      name: 'Ocean Breeze',
      background: 'linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)',
      color: '#ffffff',
      accentColor: '#ff9ff3',
      secondaryColor: '#feca57',
      tertiaryColor: '#1dd1a1',
      fontFamily: '"Fira Code", monospace'
    },
    {
      id: 'aurora-borealis',
      name: 'Aurora Borealis',
      background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      color: '#ffffff',
      accentColor: '#ff6b6b',
      secondaryColor: '#feca57',
      tertiaryColor: '#ff9ff3',
      fontFamily: '"Source Code Pro", monospace'
    },
    {
      id: 'royal-raspberry',
      name: 'Royal Raspberry',
      background: 'linear-gradient(to right, #753a88, #cc2b5e)',
      color: '#ffffff',
      accentColor: '#f39c12',
      secondaryColor: '#3498db',
      tertiaryColor: '#2ecc71',
      fontFamily: '"Fira Code", monospace'
    },
    {
      id: 'crimson-night',
      name: 'Crimson Night',
      background: 'linear-gradient(to right, #240b36, #c31432)',
      color: '#ffffff',
      accentColor: '#f1c40f',
      secondaryColor: '#3498db',
      tertiaryColor: '#2ecc71',
      fontFamily: '"Roboto Mono", monospace'
    },
    {
      id: 'ember',
      name: 'Ember',
      background: 'linear-gradient(to right, #dd1818, #333333)',
      color: '#ffffff',
      accentColor: '#f1c40f',
      secondaryColor: '#3498db',
      tertiaryColor: '#2ecc71',
      fontFamily: '"Fira Code", monospace'
    }
  ];
};

export function getContrastColor(hexColor) {
  // For gradients or non-hex colors, return white
  if (!hexColor.startsWith('#')) return '#ffffff';
  
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors and black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export const getMonacoLanguage = (selectedLanguage) => {
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

export const LanguageIcon = ({ language, selected }) => {
  const getLanguageColor = (lang) => {
    switch(lang) {
      case 'javascript': return selected ? "text-white" : "text-yellow-400";
      case 'typescript': return selected ? "text-white" : "text-blue-500";
      case 'python': return selected ? "text-white" : "text-blue-600";
      case 'c': return selected ? "text-white" : "text-gray-400";
      case 'c++': return selected ? "text-white" : "text-blue-700";
      case 'go': return selected ? "text-white" : "text-blue-400";
      case 'java': return selected ? "text-white" : "text-orange-600";
      default: return selected ? "text-white" : "text-gray-400";
    }
  };

  const getLanguageSymbol = (lang) => {
    switch(lang) {
      case 'javascript': return "JS";
      case 'typescript': return "TS";
      case 'python': return "PY";
      case 'c': return "C";
      case 'c++': return "C++";
      case 'go': return "GO";
      case 'java': return "JV";
      default: return "?";
    }
  };

return (
  <div className={`h-5 w-5 mr-2 font-mono font-bold ${getLanguageColor(language)}`}>
    {getLanguageSymbol(language)}
  </div>
);
};

  // Language options with their display names and route paths
export const languageOptions = [
    { id: 'javascript', name: 'JavaScript', path: '/' },
    { id: 'typescript', name: 'TypeScript', path: '/typescript' },
    { id: 'python', name: 'Python', path: '/python' },
    { id: 'c', name: 'C', path: '/c' },
    { id: 'c++', name: 'C++', path: '/cpp' },
    { id: 'go', name: 'Go', path: '/go' },
    { id: 'java', name: 'Java', path: '/java' }
  ];
  // Map URL params to language IDs in our application
export const languagePathMap = {
    'typescript': 'typescript',
    'python': 'python',
    'c': 'c',
    'cpp': 'c++',
    'go': 'go',
    'java': 'java'
  };
  
export function getDefaultCodeForLanguage(language) {
    switch(language) {
      case 'javascript':
        return 'console.log("Hello from JavaScript!");\n';
      case 'typescript':
        return 'const message: string = "Hello from TypeScript!";\nconsole.log(message);\n';
      case 'python':
        return 'print("Hello from Python!")\n';
      case 'c':
        return '#include <stdio.h>\n\nint main() {\n  printf("Hello from C!\\n");\n  return 0;\n}\n';
      case 'c++':
        return '#include <iostream>\n\nint main() {\n  std::cout << "Hello from C++!" << std::endl;\n  return 0;\n}\n';
      case 'go':
        return 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello from Go!")\n}\n';
      case 'java':
        return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}\n';
      default:
        return 'console.log("Hello World!");\n';
    }
  }

 
// Map our language identifiers to class names
export const prismLanguageMap = {
    javascript: 'javascript',
    typescript: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    css: 'css',
    html: 'markup',
    python: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    sql: 'sql',
    bash: 'bash',
    shell: 'bash',
    powershell: 'powershell',
    json: 'json',
    yaml: 'yaml',
    markdown: 'markdown',
    graphql: 'graphql',
    plaintext: 'none',
  };
export const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'js' },
  { id: 'typescript', name: 'TypeScript', icon: 'ts' },
  { id: 'python', name: 'Python', icon: 'py' },
  { id: 'java', name: 'Java', icon: 'java' },
  { id: 'csharp', name: 'C#', icon: 'cs' },
  { id: 'cpp', name: 'C++', icon: 'cpp' },
  { id: 'go', name: 'Go', icon: 'go' },
  { id: 'ruby', name: 'Ruby', icon: 'rb' },
  { id: 'php', name: 'PHP', icon: 'php' },
  { id: 'swift', name: 'Swift', icon: 'swift' },
  { id: 'rust', name: 'Rust', icon: 'rs' },
  { id: 'kotlin', name: 'Kotlin', icon: 'kt' },
  { id: 'html', name: 'HTML', icon: 'html' },
  { id: 'css', name: 'CSS', icon: 'css' },
  { id: 'sql', name: 'SQL', icon: 'sql' },
  { id: 'bash', name: 'Bash', icon: 'sh' },
  { id: 'markdown', name: 'Markdown', icon: 'md' },
  { id: 'json', name: 'JSON', icon: 'json' },
  { id: 'xml', name: 'XML', icon: 'xml' },
  { id: 'yaml', name: 'YAML', icon: 'yaml' },
];

// Editor panel tabs
export const TABS = {
  ELEMENTS: 'elements',
  STYLE: 'style',
  SETTINGS: 'settings'
};

// Editable element types
export const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  LINK: 'link',
  BUTTON: 'button',
  SECTION: 'section',
  PROGRESS: 'progress',
  BACKGROUND: 'background',
  INPUT: 'input',
  FORM: 'form'
};

// Responsive preview modes
export const PREVIEW_MODES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
};

  // Get saving status indicator
export const getSavingStatusIndicator = (savingStatus) => {
    switch(savingStatus) {
      case 'saving':
        return <span className="text-yellow-400 text-sm">Saving...</span>;
      case 'saved':
        return <span className="text-green-400 text-sm">Saved</span>;
      case 'exporting':
        return <span className="text-yellow-400 text-sm">Exporting template...</span>;
      case 'preparing':
        return <span className="text-yellow-400 text-sm">Preparing ZIP file...</span>;
      case 'exported':
        return <span className="text-green-400 text-sm">Template exported!</span>;
      case 'publishing':
        return <span className="text-yellow-400 text-sm">Publishing website...</span>;
      case 'published':
        return <span className="text-green-400 text-sm">Website published!</span>;
      case 'error':
        return <span className="text-red-400 text-sm">Error saving</span>;
      default:
        return null;
    }
  };