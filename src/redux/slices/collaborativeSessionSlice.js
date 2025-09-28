import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  isAuthenticated: false,
  sessionCode: null,
  isOwner: false,
  participants: [],
  currentUser: null,
  sessionSettings: {
    allowParticipantEdit: false,
    showParticipantCursors: true
  },
  cursors: {},
  selections: {},
  isCreatingSession: false,
  isJoiningSession: false,
  error: null,
  showSessionModal: false,
  modalMode: 'create',
  remoteCode: null,
  remoteUserId: null,
  remoteOutput: null,
  isCodeSyncing: false,
  permissions: {},
  // Audio states
  audioEnabled: false,
  audioStates: {} // { userId: { isMuted: bool, isSpeaking: bool } }
};

const collaborativeSessionSlice = createSlice({
  name: 'collaborativeSession',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setSessionCode: (state, action) => {
      state.sessionCode = action.payload;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action) => {
      const exists = state.participants.find(p => p.userId === action.payload.userId);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p.userId !== action.payload);
      delete state.cursors[action.payload];
      delete state.selections[action.payload];
    },
    updateParticipant: (state, action) => {
      const index = state.participants.findIndex(p => p.userId === action.payload.userId);
      if (index !== -1) {
        state.participants[index] = { ...state.participants[index], ...action.payload };
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSessionSettings: (state, action) => {
      state.sessionSettings = { ...state.sessionSettings, ...action.payload };
    },
    updateCursor: (state, action) => {
      const { userId, cursor, color } = action.payload;
      state.cursors[userId] = { ...cursor, color };
    },
    removeCursor: (state, action) => {
      delete state.cursors[action.payload];
    },
    updateSelection: (state, action) => {
      const { userId, selection, color } = action.payload;
      if (selection) {
        state.selections[userId] = { ...selection, color };
      } else {
        delete state.selections[userId];
      }
    },
    removeSelection: (state, action) => {
      delete state.selections[action.payload];
    },
    setCreatingSession: (state, action) => {
      state.isCreatingSession = action.payload;
    },
    setJoiningSession: (state, action) => {
      state.isJoiningSession = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setShowSessionModal: (state, action) => {
      state.showSessionModal = action.payload;
    },
    setModalMode: (state, action) => {
      state.modalMode = action.payload;
    },
    setRemoteCode: (state, action) => {
      if (typeof action.payload === 'object' && action.payload !== null) {
        state.remoteCode = action.payload.code;
        state.remoteUserId = action.payload.userId;
      } else {
        state.remoteCode = action.payload;
        state.remoteUserId = null;
      }
      state.isCodeSyncing = false;
    },
    setRemoteOutput: (state, action) => {
      state.remoteOutput = action.payload;
    },
    setCodeSyncing: (state, action) => {
      state.isCodeSyncing = action.payload;
    },
    updatePermissions: (state, action) => {
      const { userId, canEdit } = action.payload;
      state.permissions[userId] = { canEdit };
      const participant = state.participants.find(p => p.userId === userId);
      if (participant) {
        participant.canEdit = canEdit;
      }
    },
    sessionCreated: (state, action) => {
      const { sessionCode, session } = action.payload;
      state.sessionCode = sessionCode;
      state.isOwner = true;
      state.participants = session.participants || [];
      state.sessionSettings = session.settings || state.sessionSettings;
      state.isCreatingSession = false;
      state.showSessionModal = false;
      state.error = null;
    },
    sessionJoined: (state, action) => {
      const { sessionCode, session } = action.payload;
      state.sessionCode = sessionCode;
      state.isOwner = false;
      state.participants = session.participants || [];
      state.sessionSettings = session.settings || state.sessionSettings;
      state.remoteCode = session.currentCode;
      state.remoteOutput = session.output;
      state.isJoiningSession = false;
      state.showSessionModal = false;
      state.error = null;

      session.participants.forEach(p => {
        if (p.canEdit !== undefined) {
          state.permissions[p.userId] = { canEdit: p.canEdit };
        }
      });
    },
    sessionLeft: (state) => {
      state.sessionCode = null;
      state.isOwner = false;
      state.participants = [];
      state.cursors = {};
      state.selections = {};
      state.remoteCode = null;
      state.remoteOutput = null;
      state.permissions = {};
      state.error = null;
    },
    sessionEnded: (state) => {
      state.sessionCode = null;
      state.isOwner = false;
      state.participants = [];
      state.cursors = {};
      state.selections = {};
      state.remoteCode = null;
      state.remoteOutput = null;
      state.permissions = {};
      state.showSessionModal = false;
      state.error = 'Session has been ended';
      state.audioStates = {};
      state.audioEnabled = false;
    },
    // Audio-related reducers
    setAudioEnabled: (state, action) => {
      state.audioEnabled = action.payload;
    },
    setUserSpeaking: (state, action) => {
      const { userId, isSpeaking } = action.payload;
      if (!state.audioStates[userId]) {
        state.audioStates[userId] = { isMuted: false, isSpeaking: false };
      }
      state.audioStates[userId].isSpeaking = isSpeaking;
    },
    setUserMuted: (state, action) => {
      const { userId, isMuted } = action.payload;
      if (!state.audioStates[userId]) {
        state.audioStates[userId] = { isMuted: false, isSpeaking: false };
      }
      state.audioStates[userId].isMuted = isMuted;
      // If muted, also set speaking to false
      if (isMuted) {
        state.audioStates[userId].isSpeaking = false;
      }
    },
    clearAudioStates: (state) => {
      state.audioStates = {};
      state.audioEnabled = false;
    },
    resetSession: () => initialState
  }
});

export const {
  setConnected,
  setAuthenticated,
  setSessionCode,
  setIsOwner,
  setParticipants,
  addParticipant,
  removeParticipant,
  updateParticipant,
  setCurrentUser,
  setSessionSettings,
  updateCursor,
  removeCursor,
  updateSelection,
  removeSelection,
  setCreatingSession,
  setJoiningSession,
  setError,
  clearError,
  setShowSessionModal,
  setModalMode,
  setRemoteCode,
  setRemoteOutput,
  setCodeSyncing,
  updatePermissions,
  sessionCreated,
  sessionJoined,
  sessionLeft,
  sessionEnded,
  resetSession,
  setAudioEnabled,
  setUserSpeaking,
  setUserMuted,
  clearAudioStates
} = collaborativeSessionSlice.actions;

// Action creators for socket middleware
export const createSession = () => ({
  type: 'collaborativeSession/createSession'
});

export const joinSession = (sessionCode) => ({
  type: 'collaborativeSession/joinSession',
  payload: { sessionCode }
});

export const leaveSession = () => ({
  type: 'collaborativeSession/leaveSession'
});

export const sendCodeChange = (code, language) => ({
  type: 'collaborativeSession/sendCodeChange',
  payload: { code, language }
});

export const sendOutputUpdate = (output) => ({
  type: 'collaborativeSession/sendOutputUpdate',
  payload: { output }
});

export const sendCursorPosition = (cursor, color) => ({
  type: 'collaborativeSession/sendCursorPosition',
  payload: { cursor, color }
});

export const sendSelectionChange = (selection, color) => ({
  type: 'collaborativeSession/sendSelectionChange',
  payload: { selection, color }
});

export const toggleParticipantEdit = (targetUserId) => ({
  type: 'collaborativeSession/toggleParticipantEdit',
  payload: { targetUserId }
});

export const kickParticipant = (targetUserId, reason) => ({
  type: 'collaborativeSession/kickParticipant',
  payload: { targetUserId, reason }
});

export const updateSettings = (settings) => ({
  type: 'collaborativeSession/updateSettings',
  payload: { settings }
});

export const forceMuteUser = (targetUserId) => ({
  type: 'collaborativeSession/forceMuteUser',
  payload: { targetUserId }
});

export const endSession = () => ({
  type: 'collaborativeSession/endSession'
});

export default collaborativeSessionSlice.reducer;