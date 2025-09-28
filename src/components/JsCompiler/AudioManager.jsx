import { useEffect, useRef } from 'react';
import { useSelector, useStore } from 'react-redux';
import WebRTCManager from '../../utils/webrtcManager';

// This component manages audio but doesn't render anything
// It stays mounted as long as a session exists
const AudioManager = () => {
  const webrtcRef = useRef(null);
  const initRef = useRef(false);
  const store = useStore();

  const { sessionCode, participants } = useSelector(state => state.collaborativeSession);
  const { user } = useSelector(state => state.auth);
  const userId = user?.userId || user?._id || user?.id;

  useEffect(() => {
    if (!sessionCode || !userId || !window.collaborativeSocket) {
      // Clean up if session ends
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
        webrtcRef.current = null;
        window.webrtcManager = null;
        initRef.current = false;
      }
      return;
    }

    // Initialize only once per session
    if (initRef.current) {
      return;
    }
    initRef.current = true;

    const initializeAudio = async () => {
      try {
        // Make Redux store globally available for webrtcManager
        window.reduxStore = store;

        const rtc = new WebRTCManager(window.collaborativeSocket, userId);
        const success = await rtc.init();

        if (success) {
          webrtcRef.current = rtc;
          window.webrtcManager = rtc;

          // Set proper user ID for local monitoring
          rtc.localUserId = userId;

          // Connect to existing participants after a delay
          if (participants.length > 1) {
            setTimeout(() => {
              participants.forEach(p => {
                if (p.userId !== userId) {
                  rtc.connectToPeer(p.userId);
                }
              });
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Audio initialization error:', error);
      }
    };

    initializeAudio();

    // Cleanup on unmount
    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
        webrtcRef.current = null;
        window.webrtcManager = null;
      }
      initRef.current = false;
    };
  }, [sessionCode, userId]);

  return null; // This component doesn't render anything
};

export default AudioManager;