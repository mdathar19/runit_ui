import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserGroupIcon,
  LinkIcon,
  XIcon,
  ChevronDownIcon,
  MicrophoneIcon,
  UsersIcon
} from '@heroicons/react/solid';
import {
  LockClosedIcon,
  LockOpenIcon,
  VolumeOffIcon,
  VolumeUpIcon
} from '@heroicons/react/outline';
import {
  setShowSessionModal,
  setModalMode,
  setCreatingSession,
  setJoiningSession,
  sessionLeft,
  clearError,
  createSession,
  joinSession,
  leaveSession as leaveSessionAction,
  toggleParticipantEdit as toggleParticipantEditAction,
  kickParticipant as kickParticipantAction,
  forceMuteUser,
  setUserMuted,
  endSession,
  sessionEnded
} from '../../redux/slices/collaborativeSessionSlice';
import { AudioControls, AudioWaveAnimation } from './AudioControls';
import Login from '../Login';

const SessionPanel = () => {
  const dispatch = useDispatch();
  const [showPanel, setShowPanel] = useState(false);
  const [sessionCodeInput, setSessionCodeInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [localMuted, setLocalMuted] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const panelRef = useRef(null);

  const {
    isAuthenticated: sessionAuth,
    sessionCode,
    isOwner,
    participants,
    showSessionModal,
    modalMode,
    isCreatingSession,
    isJoiningSession,
    error,
    audioStates,
    audioEnabled
  } = useSelector(state => state.collaborativeSession);

  const { isAuthenticated: userAuth, user: authUser } = useSelector(state => state.auth);

  // Enhanced user object
  const user = React.useMemo(() => {
    if (authUser && !authUser.userName && authUser.email) {
      return {
        ...authUser,
        userName: authUser.email.split('@')[0]
      };
    }
    return authUser;
  }, [authUser]);

  const currentUserId = user?.userId || user?._id || user?.id;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPanel]);

  // Clean up WebRTC when session ends
  useEffect(() => {
    if (!sessionCode && window.webrtcManager) {
      window.webrtcManager.cleanup();
      window.webrtcManager = null;
    }
  }, [sessionCode]);

  // Handle auth and pending actions
  useEffect(() => {
    if (userAuth && pendingAction) {
      if (pendingAction === 'create') {
        handleCreateSession();
      } else if (pendingAction === 'join') {
        setShowJoinInput(true);
      }
      setPendingAction(null);
    }
  }, [userAuth, pendingAction]);

  const handleCreateSession = () => {
    if (!userAuth) {
      setShowLoginModal(true);
      setPendingAction('create');
      return;
    }
    dispatch(setCreatingSession(true));
    dispatch(createSession());
  };

  const handleJoinClick = () => {
    if (!userAuth) {
      setShowLoginModal(true);
      setPendingAction('join');
      return;
    }
    setShowJoinInput(true);
  };

  const handleJoinSession = () => {
    if (!sessionCodeInput.trim() || sessionCodeInput.length !== 6) {
      return;
    }
    dispatch(setJoiningSession(true));
    dispatch(joinSession(sessionCodeInput.toUpperCase()));
    setSessionCodeInput('');
    setShowJoinInput(false);
  };

  const handleLeaveSession = () => {
    if (isOwner) {
      if (confirm('Are you sure you want to END this session? This will disconnect all participants.')) {
        dispatch(endSession());
        dispatch(sessionEnded());
        setShowPanel(false);
      }
    } else {
      if (confirm('Are you sure you want to leave this session?')) {
        dispatch(leaveSessionAction());
        dispatch(sessionLeft());
        setShowPanel(false);
      }
    }
  };

  const handleCopySessionCode = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      // Show brief feedback
      const btn = event.currentTarget;
      const originalTitle = btn.title;
      btn.title = 'Copied!';
      setTimeout(() => {
        btn.title = originalTitle;
      }, 2000);
    }
  };

  const toggleLocalMute = () => {
    const newMutedState = !localMuted;
    setLocalMuted(newMutedState);

    // Handle WebRTC mute
    if (window.webrtcManager) {
      window.webrtcManager.mute(newMutedState);
    }

    dispatch(setUserMuted({ userId: currentUserId, isMuted: newMutedState }));
  };

  const handleToggleParticipantEdit = (userId) => {
    dispatch(toggleParticipantEditAction(userId));
  };

  const handleToggleParticipantMute = (userId) => {
    const currentMuted = audioStates[userId]?.isMuted || false;

    if (currentMuted) {
      // Allow unmute - send unmute request
      const socket = window.collaborativeSocket;
      if (socket) {
        socket.emit('collaborative:allow_unmute', { targetUserId: userId });
      }
    } else {
      // Force mute
      dispatch(forceMuteUser(userId));
    }
  };

  const handleKickParticipant = (userId, userName) => {
    if (confirm(`Are you sure you want to remove ${userName} from the session?`)) {
      dispatch(kickParticipantAction(userId, 'Removed by session owner'));
    }
  };

  // Render participant count badge
  const renderParticipantCount = () => {
    if (!sessionCode) return null;

    const activeParticipants = participants.filter(p => {
      const audioState = audioStates[p.userId];
      return audioState?.isSpeaking;
    });

    return (
      <div className="flex items-center gap-1.5">
        <UsersIcon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-300">{participants.length}</span>
        {activeParticipants.length > 0 && (
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Main Toggle Button */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            sessionCode
              ? 'bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <UserGroupIcon className="h-4 w-4 text-white" />

          {sessionCode ? (
            <>
              <span className="text-sm font-mono text-purple-300">{sessionCode}</span>
              {renderParticipantCount()}
            </>
          ) : (
            <span className="text-sm text-white">Collaborate</span>
          )}

          <ChevronDownIcon
            className={`h-4 w-4 text-gray-400 transition-transform ${
              showPanel ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Panel */}
        {showPanel && (
          <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-700 overflow-hidden">

            {/* Session Header */}
            {sessionCode ? (
              <div className="p-4 bg-gray-900/50 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Active Session</h3>
                  <button
                    onClick={handleLeaveSession}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      isOwner
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                    }`}
                  >
                    {isOwner ? 'End Session' : 'Leave'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-900 rounded text-purple-400 font-mono text-center">
                    {sessionCode}
                  </code>
                  <button
                    onClick={handleCopySessionCode}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Copy session code"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Audio Controls */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Audio Chat</span>
                  <div className="flex items-center gap-2">
                    {!window.webrtcManager ? (
                      <div className="px-2 py-1 text-yellow-400 text-xs animate-pulse">
                        Initializing audio...
                      </div>
                    ) : (
                      <button
                        onClick={toggleLocalMute}
                        className={`p-2 rounded transition-colors ${
                          localMuted
                            ? 'bg-red-600/20 hover:bg-red-600/30'
                            : 'bg-green-600/20 hover:bg-green-600/30'
                        }`}
                        title={localMuted ? 'Unmute microphone' : 'Mute microphone'}
                      >
                        {localMuted ? (
                          <VolumeOffIcon className="h-4 w-4 text-red-400" />
                        ) : (
                          <MicrophoneIcon className="h-4 w-4 text-green-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-900/50 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-3">Start Collaborating</h3>

                {!showJoinInput ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateSession}
                      disabled={isCreatingSession}
                      className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      {isCreatingSession ? 'Creating...' : 'Create Session'}
                    </button>
                    <button
                      onClick={handleJoinClick}
                      className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Join Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sessionCodeInput}
                        onChange={(e) => setSessionCodeInput(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                        placeholder="Enter 6-character code"
                        maxLength={6}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-center"
                        autoFocus
                      />
                      <button
                        onClick={handleJoinSession}
                        disabled={isJoiningSession || sessionCodeInput.length !== 6}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {isJoiningSession ? 'Joining...' : 'Join'}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowJoinInput(false);
                        setSessionCodeInput('');
                      }}
                      className="w-full px-3 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Participants List */}
            {sessionCode && participants.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">
                    Participants ({participants.length})
                  </h4>
                </div>

                <div className="p-2">
                  {participants.map(participant => {
                    const audioState = audioStates[participant.userId] || { isMuted: false, isSpeaking: false };
                    const isCurrentUser = participant.userId === currentUserId;

                    let displayName = participant.fullName ||
                                    participant.userName ||
                                    participant.name ||
                                    (participant.email ? participant.email.split('@')[0] : null) ||
                                    'User';

                    return (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between py-2 px-2 hover:bg-gray-700/50 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* User Color Indicator */}
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: participant.color }}
                          />

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm text-gray-200 truncate">
                                {displayName}
                              </span>

                              {/* Badges */}
                              <div className="flex items-center gap-1">
                                {participant.isOwner && (
                                  <span className="px-1 py-0.5 text-xs bg-purple-600 text-white rounded">
                                    Host
                                  </span>
                                )}
                                {isCurrentUser && (
                                  <span className="px-1 py-0.5 text-xs bg-blue-600 text-white rounded">
                                    You
                                  </span>
                                )}
                              </div>

                              {/* Audio Status */}
                              <div className="flex items-center">
                                {audioState.isMuted ? (
                                  <VolumeOffIcon className="h-3.5 w-3.5 text-gray-500" />
                                ) : audioState.isSpeaking ? (
                                  <div className="flex items-center">
                                    <MicrophoneIcon className="h-3.5 w-3.5 text-green-400" />
                                    <AudioWaveAnimation isSpeaking={true} />
                                  </div>
                                ) : (
                                  <MicrophoneIcon className="h-3.5 w-3.5 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Permissions */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {participant.canEdit ? (
                                <span className="text-xs text-green-400 flex items-center gap-0.5">
                                  <LockOpenIcon className="h-2.5 w-2.5" />
                                  Can edit
                                </span>
                              ) : (
                                <span className="text-xs text-orange-400 flex items-center gap-0.5">
                                  <LockClosedIcon className="h-2.5 w-2.5" />
                                  View only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Owner Controls */}
                        {!participant.isOwner && isOwner && (
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {/* Audio Control */}
                            <button
                              onClick={() => handleToggleParticipantMute(participant.userId)}
                              className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                              title={audioState.isMuted ? 'Allow unmute' : 'Force mute'}
                            >
                              {audioState.isMuted ? (
                                <VolumeUpIcon className="h-4 w-4 text-green-400" />
                              ) : (
                                <VolumeOffIcon className="h-4 w-4 text-orange-400" />
                              )}
                            </button>

                            {/* Edit Permission */}
                            <button
                              onClick={() => handleToggleParticipantEdit(participant.userId)}
                              className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                              title={participant.canEdit ? 'Revoke edit permission' : 'Grant edit permission'}
                            >
                              {participant.canEdit ? (
                                <LockOpenIcon className="h-4 w-4 text-green-400" />
                              ) : (
                                <LockClosedIcon className="h-4 w-4 text-orange-400" />
                              )}
                            </button>

                            {/* Remove User */}
                            <button
                              onClick={() => handleKickParticipant(participant.userId, displayName)}
                              className="p-1.5 hover:bg-red-600/20 rounded transition-colors"
                              title="Remove from session"
                            >
                              <XIcon className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Login Required</h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setPendingAction(null);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <XIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Please login to create or join collaborative sessions
            </p>
            <Login
              isOpen={true}
              onClose={() => {
                setShowLoginModal(false);
                setPendingAction(null);
              }}
              onLoginSuccess={() => {
                setShowLoginModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SessionPanel;