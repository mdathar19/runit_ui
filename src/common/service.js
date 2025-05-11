import apis from "../api";
import { encryptRequest } from "../cryptoUtils";


export const postFeedbackService = async (payload = {}) => {
    try {
        const encryptedBody = encryptRequest(payload);

        const response = await fetch(apis.postFeedBack, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedBody),
        });

        if (response.ok) {
        return {
            success: true,
            data: await response.json()
        };
        } else {
        const errorData = await response.json();
        if (errorData.encrypted) {
            const decrypted = decryptResponse(errorData);
            return {
            success: false,
            message: decrypted?.message || "Unknown encrypted error"
            };
        }
        return {
            success: false,
            message: "Failed to submit"
        };
        }
    } catch (err) {
        console.error("Request failed:", err);
        return {
        success: false,
        message: "Network error or unexpected failure"
        };
    }
};

export const codeExecuteService = async (payload = {}) => {
    try {
        const encryptedBody = encryptRequest(payload);

        const response = await fetch(apis.codeExecute, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(encryptedBody),
          });

        if (response.ok) {
        return {
            success: true,
            data: await response.json()
        };
        } else {
        const errorData = await response.json();
        if (errorData.encrypted) {
            const decrypted = decryptResponse(errorData);
            return {
            success: false,
            message: decrypted?.output || "Unknown encrypted error"
            };
        }
        return {
            success: false,
            message: "Failed to submit"
        };
        }
    } catch (err) {
        console.error("Request failed:", err);
        return {
        success: false,
        message: "Network error or unexpected failure"
        };
    }
};

export const getSnippetThemes = () => {
  return [
    {
      id: 'dark',
      name: 'Dark',
      background: 'linear-gradient(to right, #1e1e1e, #2d2d2d)',
      color: '#f8f8f8',
      fontFamily: 'Consolas, Monaco, monospace',
      dotColors: ['#ff5f56', '#ffbd2e', '#27c93f'],
      accentColor: '#ff5f56'
    },
    {
      id: 'monokai',
      name: 'Monokai',
      background: 'linear-gradient(to right, #272822, #3e3d32)',
      color: '#f8f8f2',
      fontFamily: 'Consolas, Monaco, monospace',
      dotColors: ['#fc618d', '#fce566', '#7bd88f'],
      accentColor: '#fce566'
    },
    {
      id: 'github',
      name: 'GitHub',
      background: 'linear-gradient(to right, #f6f8fa, #fff)',
      color: '#24292e',
      fontFamily: 'Consolas, Monaco, monospace',
      dotColors: ['#ea4a5a', '#ffdf5d', '#34d058'],
      accentColor: '#34d058'
    },
    {
      id: 'dracula',
      name: 'Dracula',
      background: 'linear-gradient(to right, #282a36, #44475a)',
      color: '#f8f8f2',
      fontFamily: 'Fira Code, monospace',
      dotColors: ['#ff5555', '#ffb86c', '#50fa7b'],
      accentColor: '#bd93f9'
    },
    {
      id: 'nord',
      name: 'Nord',
      background: 'linear-gradient(to right, #2e3440, #3b4252)',
      color: '#eceff4',
      fontFamily: 'Fira Code, monospace',
      dotColors: ['#bf616a', '#ebcb8b', '#a3be8c'],
      accentColor: '#88c0d0'
    },
    {
      id: 'solarized',
      name: 'Solarized',
      background: 'linear-gradient(to right, #002b36, #073642)',
      color: '#839496',
      fontFamily: 'Menlo, Monaco, monospace',
      dotColors: ['#dc322f', '#b58900', '#859900'],
      accentColor: '#2aa198'
    },
    {
      id: 'one-dark',
      name: 'One Dark',
      background: 'linear-gradient(to right, #282c34, #3a404c)',
      color: '#abb2bf',
      fontFamily: 'Menlo, Monaco, monospace',
      dotColors: ['#e06c75', '#e5c07b', '#98c379'],
      accentColor: '#61afef'
    },
    {
      id: 'synthwave',
      name: 'Synthwave',
      background: 'linear-gradient(135deg, #2b213a 0%, #444267 100%)',
      color: '#f9f9f9',
      fontFamily: 'IBM Plex Mono, monospace',
      textShadow: '0 0 5px #ff7edb',
      dotColors: ['#f97e72', '#fdca40', '#6bffa0'],
      accentColor: '#ff7edb'
    },
    {
      id: 'tokyo-night',
      name: 'Tokyo Night',
      background: 'linear-gradient(to right, #1a1b26, #24283b)',
      color: '#a9b1d6',
      fontFamily: 'JetBrains Mono, monospace',
      dotColors: ['#f7768e', '#ff9e64', '#9ece6a'],
      accentColor: '#7aa2f7'
    },
    {
      id: 'material',
      name: 'Material',
      background: 'linear-gradient(to right, #263238, #37474f)',
      color: '#eeffff',
      fontFamily: 'Roboto Mono, monospace',
      dotColors: ['#f07178', '#ffcb6b', '#c3e88d'],
      accentColor: '#82aaff'
    },
    {
      id: 'ayu-dark',
      name: 'Ayu Dark',
      background: 'linear-gradient(to right, #0a0e14, #1f2430)',
      color: '#b3b1ad',
      fontFamily: 'Source Code Pro, monospace',
      dotColors: ['#f07178', '#ffb454', '#b8cc52'],
      accentColor: '#39bae6'
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      background: 'linear-gradient(to right, #011627, #0d2741)',
      color: '#d6deeb',
      fontFamily: 'Dank Mono, Operator Mono, monospace',
      dotColors: ['#ef5350', '#addb67', '#80cbc4'],
      accentColor: '#7fdbca'
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