// /app/create-snippet/page.js - Server Component
import { Metadata } from 'next';
// Import the client component directly - it's already wrapped with Redux
import CreateSnippetClient from '../../Clients/CreateSnippetClient';
import { FaCode } from 'react-icons/fa';

export const metadata = {
  title: 'Create Code Snippet | CodeShare',
  description: 'Create beautiful, shareable code snippets with various themes and customization options',
  openGraph: {
    title: 'Create Code Snippet | CodeShare',
    description: 'Create beautiful, shareable code snippets with various themes and customization options',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Code Snippet | CodeShare',
    description: 'Create beautiful, shareable code snippets with various themes and customization options',
  }
};

export default async function CreateSnippetPage() {
  // Here you can fetch any server-side data you need
  // For example, maybe you want to fetch available themes from an API or database
  const snippetThemes = [
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
      background: 'linear-gradient(to right, #2b213a, #444267)',
      color: '#f9f9f9',
      fontFamily: 'IBM Plex Mono, monospace',
      textShadow: '0 0 5px #ff7edb',
      dotColors: ['#f97e72', '#fdca40', '#6bffa0'],
      accentColor: '#ff7edb'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-2">
      <div className="container mx-auto py-8">
        {/* Client component that handles interactivity */}
        <CreateSnippetClient themes={snippetThemes} />
      </div>
    </div>
  );
}