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