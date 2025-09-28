import React, { useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/solid';
import { VolumeOffIcon } from '@heroicons/react/outline';

const AudioWaveAnimation = ({ isSpeaking }) => {
  return (
    <div className="flex items-center gap-0.5 ml-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`w-0.5 bg-green-400 rounded-full transition-all duration-200 ${
            isSpeaking ? 'animate-pulse' : ''
          }`}
          style={{
            height: isSpeaking ? `${Math.random() * 8 + 4}px` : '2px',
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  );
};

const AudioControls = () => {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    if (window.webrtcManager) {
      const newMuted = !muted;
      const success = window.webrtcManager.mute(newMuted);
      if (success) {
        setMuted(newMuted);
      }
    }
  };

  // Show mic button only if audio is initialized
  if (!window.webrtcManager) {
    return (
      <div className="px-2 py-1 text-yellow-400 text-xs">
        Initializing...
      </div>
    );
  }

  return (
    <button
      onClick={toggleMute}
      className={`p-2 rounded-lg transition-all ${
        muted
          ? 'bg-red-600/20 hover:bg-red-600/30 border border-red-600/50'
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        <VolumeOffIcon className="h-5 w-5 text-red-400" />
      ) : (
        <MicrophoneIcon className="h-5 w-5 text-white" />
      )}
    </button>
  );
};

export { AudioControls, AudioWaveAnimation };