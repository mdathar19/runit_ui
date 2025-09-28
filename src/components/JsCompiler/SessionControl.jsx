import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserGroupIcon, LinkIcon, XIcon, UserIcon, ChevronDownIcon, MicrophoneIcon } from '@heroicons/react/solid';
import { LockClosedIcon, LockOpenIcon, VolumeOffIcon } from '@heroicons/react/outline';
import { AudioWaveAnimation } from './AudioControls';
import AppTooltip from '../global/AppTooltip';
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
  forceMuteUser
} from '../../redux/slices/collaborativeSessionSlice';
import Login from '../Login';

const SessionControl = () => {
  const dispatch = useDispatch();
  const [sessionCodeInput, setSessionCodeInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const dropdownRef = useRef(null);

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
    sessionSettings,
    cursors,
    audioStates
  } = useSelector(state => state.collaborativeSession);

  const { isAuthenticated: userAuth, user: authUser } = useSelector(state => state.auth);

  // Enhanced user object with proper userName
  const user = React.useMemo(() => {
    if (authUser && !authUser.userName && authUser.email) {
      return {
        ...authUser,
        userName: authUser.email.split('@')[0]
      };
    }
    return authUser;
  }, [authUser]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowParticipants(false);
      }
    };

    if (showParticipants) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showParticipants]);

  useEffect(() => {
    if (userAuth && pendingAction) {
      if (pendingAction === 'create') {
        handleCreateSession();
      } else if (pendingAction === 'join') {
        dispatch(setShowSessionModal(true));
        dispatch(setModalMode('join'));
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

    dispatch(setShowSessionModal(true));
    dispatch(setModalMode('join'));
  };

  const handleJoinSession = () => {
    if (!sessionCodeInput.trim()) {
      dispatch(setError('Please enter a session code'));
      return;
    }

    dispatch(setJoiningSession(true));
    dispatch(joinSession(sessionCodeInput.toUpperCase()));
  };

  const handleLeaveSession = () => {
    dispatch(leaveSessionAction());
    dispatch(sessionLeft());
  };

  const handleCopySessionCode = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
    }
  };

  const handleToggleParticipantEdit = (userId) => {
    dispatch(toggleParticipantEditAction(userId));
    // Don't close dropdown when toggling permissions
  };

  const handleKickParticipant = (userId, userName) => {
    if (confirm(`Are you sure you want to remove ${userName} from the session?`)) {
      dispatch(kickParticipantAction(userId, 'Removed by session owner'));
    }
  };

  if (sessionCode) {
    const currentUserId = user?.userId || user?._id || user?.id;
    const currentParticipant = participants.find(p => p.userId === currentUserId);
    const canEdit = currentParticipant?.canEdit || false;

    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-gray-300">Session:</span>
          <code className="px-2 py-1 bg-gray-900 rounded text-purple-400 font-mono text-sm">
            {sessionCode}
          </code>
          <AppTooltip text="Copy session code" position="top">
            <button
              onClick={handleCopySessionCode}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <LinkIcon className="h-4 w-4 text-gray-400" />
            </button>
          </AppTooltip>

          {/* Sync Status Indicator */}
          <AppTooltip text="Auto-sync every 3 seconds" position="top">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">Live Sync</span>
            </div>
          </AppTooltip>
        </div>

        {/* Permission Status Badge */}
        {!isOwner && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
            {canEdit ? (
              <>
                <LockOpenIcon className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">Can Edit</span>
              </>
            ) : (
              <>
                <LockClosedIcon className="h-3 w-3 text-orange-400" />
                <span className="text-xs text-orange-400">View Only</span>
              </>
            )}
          </div>
        )}

        {/* Participant Count and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
              showParticipants ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              {participants.length} {participants.length === 1 ? 'user' : 'users'}
            </span>
            <ChevronDownIcon
              className={`h-3 w-3 text-gray-400 transition-transform ${
                showParticipants ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showParticipants && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-700 max-h-96 overflow-hidden flex flex-col transition-all duration-200 ease-out transform origin-top-right">
            <div className="flex-shrink-0 bg-gray-800 p-3 border-b border-gray-700">
              <h4 className="text-sm font-semibold text-white">Session Participants</h4>
              <p className="text-xs text-gray-400 mt-1">
                {isOwner ? 'You are the session owner' : `Hosted by ${participants.find(p => p.isOwner)?.fullName || participants.find(p => p.isOwner)?.userName || participants.find(p => p.isOwner)?.email?.split('@')[0] || 'Unknown'}`}
              </p>
            </div>

            <div className="p-2 overflow-y-auto scrollbar-thin flex-1">
              {participants.map(participant => {
                // Check if this participant has recent cursor activity
                const isActive = cursors && cursors[participant.userId];

                // Get audio state for this participant
                const audioState = audioStates[participant.userId] || { isMuted: false, isSpeaking: false };

                // Extract username with full name support
                let displayName = participant.fullName ||
                                participant.userName ||
                                participant.name ||
                                (participant.email ? participant.email.split('@')[0] : null) ||
                                'User';

                return (
                  <div key={participant.userId} className="flex items-center justify-between py-2 px-2 hover:bg-gray-700 rounded transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: participant.color }}
                        />
                        {isActive && (
                          <div
                            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: participant.color }}
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-200">
                            {displayName}
                          </span>
                          {participant.isOwner && (
                            <span className="px-1 py-0.5 text-xs bg-purple-600 text-white rounded">Host</span>
                          )}
                          {participant.userId === currentUserId && (
                            <span className="px-1 py-0.5 text-xs bg-blue-600 text-white rounded">You</span>
                          )}
                        </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {/* Audio indicator */}
                        <div className="flex items-center">
                          {audioState.isMuted ? (
                            <VolumeOffIcon className="h-3 w-3 text-gray-500" title="Microphone muted" />
                          ) : audioState.isSpeaking ? (
                            <div className="flex items-center">
                              <MicrophoneIcon className="h-3 w-3 text-green-400" />
                              <AudioWaveAnimation isSpeaking={true} />
                            </div>
                          ) : (
                            <MicrophoneIcon className="h-3 w-3 text-gray-400" title="Microphone on" />
                          )}
                        </div>
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

                  {!participant.isOwner && isOwner && (
                    <div className="flex items-center gap-1 ml-2">
                      {/* Mute button for owner */}
                      {!audioState.isMuted && (
                        <button
                          onClick={() => dispatch(forceMuteUser(participant.userId))}
                          className="p-1.5 hover:bg-orange-600/20 rounded transition-colors group/btn"
                          title="Mute participant"
                        >
                          <VolumeOffIcon className="h-4 w-4 text-orange-400 group-hover/btn:text-orange-300" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleParticipantEdit(participant.userId)}
                        className="p-1.5 hover:bg-gray-600 rounded transition-colors group/btn"
                        title={participant.canEdit ? 'Revoke edit permission' : 'Grant edit permission'}
                      >
                        {participant.canEdit ? (
                          <LockOpenIcon className="h-4 w-4 text-green-400 group-hover/btn:text-green-300" />
                        ) : (
                          <LockClosedIcon className="h-4 w-4 text-orange-400 group-hover/btn:text-orange-300" />
                        )}
                      </button>
                      <button
                        onClick={() => handleKickParticipant(participant.userId, displayName)}
                        className="p-1.5 hover:bg-red-600/20 rounded transition-colors group/btn"
                        title="Remove from session"
                      >
                        <XIcon className="h-4 w-4 text-red-400 group-hover/btn:text-red-300" />
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

        <button
          onClick={handleLeaveSession}
          className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleCreateSession}
          disabled={isCreatingSession}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <UserGroupIcon className="h-4 w-4" />
          <span className="text-sm">Create Session</span>
        </button>

        <button
          onClick={handleJoinClick}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <LinkIcon className="h-4 w-4" />
          <span className="text-sm">Join Session</span>
        </button>
      </div>

      {showSessionModal && modalMode === 'join' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Join Collaborative Session</h3>
              <button
                onClick={() => {
                  dispatch(setShowSessionModal(false));
                  dispatch(clearError());
                  setSessionCodeInput('');
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <XIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Code
              </label>
              <input
                type="text"
                value={sessionCodeInput}
                onChange={(e) => setSessionCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  dispatch(setShowSessionModal(false));
                  dispatch(clearError());
                  setSessionCodeInput('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinSession}
                disabled={isJoiningSession || !sessionCodeInput}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isJoiningSession ? 'Joining...' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sessionCode && !showSessionModal && (
        <div className="fixed top-20 right-4 bg-gray-800 rounded-lg p-4 shadow-xl z-40 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">Session Created!</h4>
            <button
              onClick={() => dispatch(setShowSessionModal(false))}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <XIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">Share this code with others:</p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 bg-gray-900 rounded text-lg font-mono text-purple-400">
              {sessionCode}
            </code>
            <AppTooltip text="Copy code" position="top">
              <button
                onClick={handleCopySessionCode}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              >
                <LinkIcon className="h-4 w-4 text-white" />
              </button>
            </AppTooltip>
          </div>
        </div>
      )}

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

export default SessionControl;