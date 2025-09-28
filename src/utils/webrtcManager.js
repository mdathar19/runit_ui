// Custom WebRTC implementation without external libraries
class WebRTCManager {
  constructor(socket, userId) {
    this.socket = socket;
    this.userId = userId;
    this.localUserId = userId; // Store for local audio monitoring
    this.localStream = null;
    this.peerConnections = new Map();
    this.audioElements = new Map();
    this.audioLevels = new Map();
    this.audioSenders = new Map(); // Store audio senders for each peer
    this.isInitialized = false;
    this.pendingOffers = []; // Queue for offers received before initialization
    this.processingPeers = new Set(); // Track peers being processed to avoid duplicates
    this.muteStates = new Map(); // Track mute states for all users

    // ICE servers configuration
    this.iceServers = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    this.setupSocketListeners();
  }

  async init() {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        },
        video: false
      });

      this.isInitialized = true;

      // Start monitoring local audio level with actual user ID
      const localUserId = this.localUserId || this.userId;
      this.monitorAudioLevel(localUserId, this.localStream);

      // Process any pending offers
      if (this.pendingOffers.length > 0) {
        for (const { fromUserId, offer } of this.pendingOffers) {
          await this.handleOffer(fromUserId, offer);
        }
        this.pendingOffers = [];
      }

      return true;
    } catch (error) {
      console.error('Failed to get microphone:', error);
      return false;
    }
  }

  async createPeerConnection(targetUserId, isInitiator) {
    // Check if connection already exists and close it
    const existingPc = this.peerConnections.get(targetUserId);
    if (existingPc) {
      existingPc.close();
      this.peerConnections.delete(targetUserId);
    }

    // Create peer connection
    const pc = new RTCPeerConnection(this.iceServers);
    this.peerConnections.set(targetUserId, pc);

    // Add local stream tracks and store audio sender
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        const sender = pc.addTrack(track, this.localStream);
        if (track.kind === 'audio') {
          this.audioSenders.set(targetUserId, sender);
        }
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          to: targetUserId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      this.handleRemoteStream(targetUserId, event.streams[0]);
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        this.removePeerConnection(targetUserId);
      }
    };

    // Handle connection close
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
        this.removePeerConnection(targetUserId);
      }
    };

    return pc;
  }

  async initiateCall(targetUserId) {
    if (!this.isInitialized) {
      console.error('WebRTC not initialized');
      return;
    }

    // Check if connection already exists or is being processed
    if (this.peerConnections.has(targetUserId) || this.processingPeers.has(targetUserId)) {
      return;
    }

    // Mark as processing
    this.processingPeers.add(targetUserId);

    try {
      const pc = await this.createPeerConnection(targetUserId, true);

      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });

      await pc.setLocalDescription(offer);

      // Send offer through socket
      this.socket.emit('webrtc-offer', {
        to: targetUserId,
        offer: offer
      });

      // Remove from processing after a delay
      setTimeout(() => this.processingPeers.delete(targetUserId), 1000);

    } catch (error) {
      console.error('Error initiating call:', error);
      this.processingPeers.delete(targetUserId);
    }
  }

  async handleOffer(fromUserId, offer) {
    if (!this.isInitialized) {
      // Queue the offer to process after initialization
      this.pendingOffers.push({ fromUserId, offer });
      return;
    }

    // Check if we're already processing this peer
    if (this.processingPeers.has(fromUserId)) {
      return;
    }

    this.processingPeers.add(fromUserId);

    try {
      const pc = await this.createPeerConnection(fromUserId, false);

      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer through socket
      this.socket.emit('webrtc-answer', {
        to: fromUserId,
        answer: answer
      });

      // Remove from processing
      setTimeout(() => this.processingPeers.delete(fromUserId), 1000);

    } catch (error) {
      console.error('Error handling offer:', error);
      this.processingPeers.delete(fromUserId);
    }
  }

  async handleAnswer(fromUserId, answer) {
    try {
      const pc = this.peerConnections.get(fromUserId);
      if (!pc) {
        // Silently ignore - connection might have been cleaned up
        return;
      }

      // Check if we're in the right state to accept an answer
      if (pc.signalingState !== 'have-local-offer') {
        // Silently ignore answers in wrong state (this is normal during reconnections)
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      // Only log if it's not a state error (which we expect sometimes)
      if (!error.message.includes('wrong state')) {
        console.error('Error handling answer:', error);
      }
    }
  }

  async handleIceCandidate(fromUserId, candidate) {
    try {
      const pc = this.peerConnections.get(fromUserId);
      if (!pc) {
        return;
      }

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  handleRemoteStream(userId, stream) {

    // Remove any existing audio element
    this.removeAudioElement(userId);

    // Create audio element
    const audio = document.createElement('audio');
    audio.id = `audio-${userId}`;
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.playsInline = true;

    // Add to DOM (hidden)
    audio.style.display = 'none';
    document.body.appendChild(audio);
    this.audioElements.set(userId, audio);

    // Play audio
    audio.play()
      .then(() => {
        // Start monitoring audio level
        this.monitorAudioLevel(userId, stream);
      })
      .catch(error => {
        // Try to play on user interaction
        const playOnClick = () => {
          audio.play()
            .then(() => {
              this.monitorAudioLevel(userId, stream);
            })
            .catch(e => console.error('Play failed:', e));
          document.removeEventListener('click', playOnClick);
        };
        document.addEventListener('click', playOnClick);
      });
  }

  monitorAudioLevel(userId, stream) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastSpeakingState = false;

      const checkAudioLevel = () => {
        const localUserId = this.localUserId || this.userId;
        if (!this.audioLevels.has(userId) && userId !== localUserId) {
          // Stop monitoring if user disconnected
          return;
        }

        // Always check Redux store for current mute state
        let isMuted = false;
        if (window.reduxStore) {
          const state = window.reduxStore.getState();
          const audioStates = state.collaborativeSession.audioStates;
          if (audioStates && audioStates[userId]) {
            isMuted = audioStates[userId].isMuted || false;
          }
        }

        // Also check local mute state as backup
        if (!isMuted) {
          isMuted = this.muteStates.get(userId) || false;
        }

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Update audio level
        this.audioLevels.set(userId, average);

        // Speaking threshold detection - NEVER show speaking if muted
        const isSpeaking = !isMuted && average > 20;

        // Debug log for mute state
        if (average > 20 && isMuted) {
          console.log(`User ${userId} is speaking but muted, not showing indicator`);
        }

        // Only dispatch if speaking state changed OR if muted (to ensure it's false)
        if (isSpeaking !== lastSpeakingState || (isMuted && lastSpeakingState)) {
          lastSpeakingState = isSpeaking;

          // Dispatch to Redux store if available
          if (window.reduxStore && window.reduxStore.dispatch) {
            window.reduxStore.dispatch({
              type: 'collaborativeSession/setUserSpeaking',
              payload: { userId, isSpeaking: isSpeaking } // Use the actual isSpeaking value (which is false when muted)
            });
          }
        }

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (error) {
      console.error('Error monitoring audio level:', error);
    }
  }

  removeAudioElement(userId) {
    const audio = this.audioElements.get(userId);
    if (audio) {
      audio.srcObject = null;
      audio.remove();
      this.audioElements.delete(userId);
    }
    this.audioLevels.delete(userId);
  }

  removePeerConnection(userId) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }
    this.audioSenders.delete(userId);
    this.removeAudioElement(userId);
  }

  connectToPeer(targetUserId) {
    if (targetUserId === this.userId) return;

    // Check if connection already exists or is being processed
    const pc = this.peerConnections.get(targetUserId);
    if (pc) {
      // Check if connection is already established
      if (pc.connectionState === 'connected' || pc.connectionState === 'connecting') {
        return;
      }
    }

    // Check if we're already processing this peer
    if (this.processingPeers.has(targetUserId)) {
      return;
    }

    // Check if we should initiate (deterministic based on ID comparison)
    if (this.userId < targetUserId) {
      this.initiateCall(targetUserId);
    }
  }

  setupSocketListeners() {
    // Handle WebRTC signaling
    this.socket.on('webrtc-offer', async (data) => {
      await this.handleOffer(data.from, data.offer);
    });

    this.socket.on('webrtc-answer', async (data) => {
      await this.handleAnswer(data.from, data.answer);
    });

    this.socket.on('ice-candidate', async (data) => {
      await this.handleIceCandidate(data.from, data.candidate);
    });

    // Handle audio mute status from other users
    this.socket.on('collaborative:audio_muted', (data) => {
      if (data.userId && data.isMuted !== undefined) {
        this.muteStates.set(data.userId, data.isMuted);

        // Update Redux state for remote user mute status
        if (window.reduxStore && window.reduxStore.dispatch) {
          window.reduxStore.dispatch({
            type: 'collaborativeSession/setUserMuted',
            payload: { userId: data.userId, isMuted: data.isMuted }
          });

          // Force speaking to false if muted
          if (data.isMuted) {
            window.reduxStore.dispatch({
              type: 'collaborativeSession/setUserSpeaking',
              payload: { userId: data.userId, isSpeaking: false }
            });
          }
        }
      }
    });

    // Handle participant events
    this.socket.on('collaborative:participant_joined', (data) => {
      if (data.participant && data.participant.userId !== this.userId) {
        // Only initiate if we don't have a connection already
        if (!this.peerConnections.has(data.participant.userId)) {
          // Wait for initialization before connecting
          const tryConnect = () => {
            if (this.isInitialized) {
              this.connectToPeer(data.participant.userId);
            } else {
              // Retry after a short delay
              setTimeout(tryConnect, 500);
            }
          };
          // Give the new participant time to initialize their audio
          setTimeout(tryConnect, 3000);
        }
      }
    });

    this.socket.on('collaborative:participant_left', (data) => {
      if (data.userId) {
        this.removePeerConnection(data.userId);
      }
    });

    this.socket.on('collaborative:participant_disconnected', (data) => {
      if (data.userId) {
        this.removePeerConnection(data.userId);
      }
    });
  }

  async createSilentAudioTrack() {
    // Create a silent audio track using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    // Set gain to 0 for silence
    gain.gain.value = 0;
    oscillator.connect(gain);

    const dest = audioContext.createMediaStreamDestination();
    gain.connect(dest);
    oscillator.start();

    return dest.stream.getAudioTracks()[0];
  }

  mute(muted) {
    if (!this.localStream) {
      return false;
    }

    const userId = this.localUserId || this.userId;
    console.log(`Setting mute for ${userId}: ${muted}`);

    // Store mute state FIRST
    this.muteStates.set(userId, muted);

    // Get the audio track
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length === 0) return false;

    const audioTrack = audioTracks[0];

    // SIMPLE APPROACH: Just disable/enable the track
    audioTrack.enabled = !muted;
    console.log(`Track enabled: ${audioTrack.enabled}`);

    // Also go through each peer connection and find audio senders manually
    console.log(`Checking ${this.peerConnections.size} peer connections`);
    this.peerConnections.forEach((pc, peerId) => {
      console.log(`Checking peer ${peerId}`);
      const senders = pc.getSenders();
      console.log(`Found ${senders.length} senders`);

      senders.forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          console.log(`Found audio sender for ${peerId}`);
          // Simply disable/enable the track that's being sent
          sender.track.enabled = !muted;
          console.log(`Set sender track enabled to ${sender.track.enabled}`);
        }
      });
    });

    // Immediately update Redux state to force UI update
    if (window.reduxStore && window.reduxStore.dispatch) {
      // Force speaking to false immediately when muted
      window.reduxStore.dispatch({
        type: 'collaborativeSession/setUserSpeaking',
        payload: { userId, isSpeaking: false }
      });

      // Update mute state
      window.reduxStore.dispatch({
        type: 'collaborativeSession/setUserMuted',
        payload: { userId, isMuted: muted }
      });
    }

    // Notify server about mute status
    if (this.socket) {
      this.socket.emit('collaborative:audio_mute', { isMuted: muted });
    }

    return true;
  }

  cleanup() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Stop silent track if it exists
    if (this.silentTrack) {
      this.silentTrack.stop();
      this.silentTrack = null;
    }

    // Close all peer connections
    this.peerConnections.forEach((pc, userId) => {
      this.removePeerConnection(userId);
    });

    // Clear all maps and sets
    this.peerConnections.clear();
    this.audioElements.clear();
    this.audioLevels.clear();
    this.audioSenders.clear();
    this.processingPeers.clear();
    this.muteStates.clear();
    this.pendingOffers = [];

    this.isInitialized = false;
  }

  // Get current audio levels for UI
  getAudioLevels() {
    return this.audioLevels;
  }
}

export default WebRTCManager;