// src/redux/middleware/socketMiddleware.js
import { io } from "socket.io-client";
import { appendOutput, setSocketId } from "../slices/compilerSlice";
import { setTemplateHtml } from "../slices/editorSlice";
import {
  setHtmlEnhancementProgress,
  setHtmlEnhancementError,
  setHtmlEnhancementComplete
} from "../slices/resumeSlice";
import {
  handlePaymentSuccess,
  handlePaymentFailure,
  handleRefundNotification,
  handlePaymentDispute
} from "../slices/paymentAlertSlice";
import { publishedPortfolioUrl } from "@/api";
import { setPortfolioCreditInfo } from "../slices/usageSlice";
import {
  setConnected,
  setAuthenticated,
  sessionCreated,
  sessionJoined,
  addParticipant,
  removeParticipant,
  updateCursor,
  updateSelection,
  setRemoteCode,
  setRemoteOutput,
  updatePermissions,
  sessionEnded,
  setError as setSessionError,
  setCodeSyncing,
  setCurrentUser
} from "../slices/collaborativeSessionSlice";

// Socket.io middleware for Redux
const socketMiddleware = () => {
  let socket = null;

  // Make socket accessible globally for WebRTC
  if (typeof window !== 'undefined') {
    window.collaborativeSocket = null;
  }

  return store => next => action => {
    // Initialize socket connection if not already established
    if (!socket) {
      socket = io(publishedPortfolioUrl);

      // Make socket accessible globally
      if (typeof window !== 'undefined') {
        window.collaborativeSocket = socket;
      }

      // Set socket ID when connected
      socket.on("connect", () => {
        store.dispatch(setSocketId(socket.id));
        store.dispatch(setConnected(true));

        // Join user room if authenticated
        const state = store.getState();
        if (state.auth.isAuthenticated && state.auth.user?._id) {
          socket.emit('join_user_room', state.auth.user._id);

          // Authenticate for collaborative sessions if needed
          if (state.auth.token) {
            socket.emit('collaborative:authenticate', state.auth.token);
          }
        }
      });
      
      // Handle delayed outputs from async code execution
      socket.on("delayed-output", (data) => {
        store.dispatch(appendOutput(data.output));
      });

      // HTML Enhancement Progress Events
      socket.on("html-enhancement-progress", (data) => {
        store.dispatch(setHtmlEnhancementProgress({
          status: data.status,
          message: data.message,
          progress: data.progress,
          currentSection: data.currentSection || null,
          totalSections: data.totalSections || null
        }));

        // Update template HTML progressively if available
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Section Complete Events - Progressive HTML Update
      socket.on("html-enhancement-section-complete", (data) => {
        
        // Update progress
        store.dispatch(setHtmlEnhancementProgress({
          status: data.status,
          message: data.message,
          progress: data.progress,
          currentSection: data.sectionIndex,
          totalSections: data.totalSections
        }));

        // Update template HTML with cumulative content
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Sub-section progress for large sections
      socket.on("html-enhancement-subsection-progress", (data) => {
        
        // Update template HTML with cumulative content including sub-sections
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Warning events
      socket.on("html-enhancement-warning", (data) => {
        // You can dispatch a warning action if needed
      });

      // Error events
      socket.on("html-enhancement-error", (data) => {
        store.dispatch(setHtmlEnhancementError(data.message));
      });

      // Final completion
      socket.on("html-enhancement-complete", (data) => {
        store.dispatch(setHtmlEnhancementComplete());
        
        if(data.usageInfo){
          // If usage info is provided, dispatch it to the store
          store.dispatch(setPortfolioCreditInfo(data.usageInfo));
        }
        // Ensure final HTML is set
        if (data.enhancedHtml) {
          store.dispatch(setTemplateHtml(data.enhancedHtml));
        }
      });

      // Payment Success Event
      socket.on("payment_captured", (data) => {
        store.dispatch(handlePaymentSuccess({
          paymentId: data.paymentId,
          amount: data.amount,
          currency: data.currency,
          method: data.method,
          orderId: data.orderId
        }));
      });

      // Payment Failure Event
      socket.on("payment_failed", (data) => {
        store.dispatch(handlePaymentFailure({
          paymentId: data.paymentId,
          orderId: data.orderId,
          error: data.error,
          errorCode: data.errorCode
        }));
      });

      // Refund Events
      socket.on("refund_processed", (data) => {
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_processed'
        }));
      });

      socket.on("refund_completed", (data) => {
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_completed'
        }));
      });

      socket.on("refund_failed", (data) => {
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_failed'
        }));
      });

      // Payment Dispute Event
      socket.on("payment_dispute", (data) => {
        store.dispatch(handlePaymentDispute({
          disputeId: data.disputeId,
          paymentId: data.paymentId,
          amount: data.amount,
          reason: data.reason
        }));
      });

      // Subscription Events (you can extend these as needed)
      socket.on("subscription_created", (data) => {
        // Handle subscription creation notification
      });

      socket.on("subscription_cancelled", (data) => {
        // Handle subscription cancellation notification
      });
      
      // Collaborative Session Events
      socket.on('collaborative:authenticated', (data) => {
        if (data.success) {
          store.dispatch(setAuthenticated(true));
          // Store current user info for collaborative sessions
          if (data.user) {
            store.dispatch(setCurrentUser(data.user));
          }
        }
      });

      socket.on('collaborative:error', (data) => {
        store.dispatch(setSessionError(data.message));
      });

      socket.on('collaborative:session_created', (data) => {
        store.dispatch(sessionCreated(data));
      });

      socket.on('collaborative:session_joined', (data) => {
        store.dispatch(sessionJoined(data));
      });

      socket.on('collaborative:participant_joined', (data) => {
        store.dispatch(addParticipant(data.participant));
      });

      socket.on('collaborative:participant_left', (data) => {
        store.dispatch(removeParticipant(data.userId));
      });

      socket.on('collaborative:participant_disconnected', (data) => {
        store.dispatch(removeParticipant(data.userId));
      });

      socket.on('collaborative:participant_removed', (data) => {
        store.dispatch(removeParticipant(data.userId));
      });

      socket.on('collaborative:code_updated', (data) => {
        store.dispatch(setCodeSyncing(true));
        store.dispatch(setRemoteCode({ code: data.code, userId: data.userId }));
      });

      socket.on('collaborative:output_updated', (data) => {
        store.dispatch(setRemoteOutput(data.output));
      });

      socket.on('collaborative:cursor_updated', (data) => {
        store.dispatch(updateCursor(data));
      });

      socket.on('collaborative:selection_updated', (data) => {
        store.dispatch(updateSelection(data));
      });

      socket.on('collaborative:permissions_updated', (data) => {
        store.dispatch(updatePermissions(data));
      });

      socket.on('collaborative:kicked', (data) => {
        store.dispatch(sessionEnded());
        store.dispatch(setSessionError(data.reason));
      });

      socket.on('collaborative:session_ended', (data) => {
        store.dispatch(sessionEnded());
      });

      // Audio-related events are handled directly by WebRTCManager

      // Reconnect logic
      socket.on("disconnect", () => {
        store.dispatch(setConnected(false));
      });
      
      socket.on("reconnect", () => {
        store.dispatch(setSocketId(socket.id));

        // Rejoin user room on reconnect
        const state = store.getState();
        if (state.auth.isAuthenticated && state.auth.user?._id) {
          socket.emit('join_user_room', state.auth.user._id);

          // Re-authenticate for collaborative sessions
          if (state.auth.token) {
            socket.emit('collaborative:authenticate', state.auth.token);
          }
        }
      });

      socket.on("template-generation-progress", (data) => {
      if(data.progress==100){
        store.dispatch(setHtmlEnhancementComplete())
      }else{
        store.dispatch(setHtmlEnhancementProgress({
          status: data.status,
          message: data.message,
          progress: data.progress,
          currentSection: data.currentSection || null,
          totalSections: data.totalSections || null
        }));
      }
      });
      // Credit info
      socket.on("user-credit-info", (data) => {
      if(data.usageInfo){
        store.dispatch(setPortfolioCreditInfo(data.usageInfo));
      }
      });
    }
    
    // Special actions for socket management
    if (action?.type === 'socket/connect' && !socket.connected) {
      socket.connect();
    }
    
    if (action?.type === 'socket/disconnect') {
      if (socket.connected) {
        socket.disconnect();
      }
    }

    // Handle authentication state changes
    if (action?.type === 'auth/loginUser/fulfilled' || action?.type === 'auth/verifyOtp/fulfilled') {
      // User just logged in, join their room
      const userId = action.payload.user?._id;
      const token = action.payload.token;
      if (userId && socket?.connected) {
        socket.emit('join_user_room', userId);

        // Authenticate for collaborative sessions
        if (token) {
          socket.emit('collaborative:authenticate', token);
        }
      }
    }

    if (action?.type === 'auth/logout') {
      // User logged out, leave their room
      if (socket?.connected) {
        socket.emit('leave_user_room');
        socket.emit('collaborative:leave_session');
      }
    }

    // Handle collaborative session actions
    if (action?.type === 'collaborativeSession/createSession' && socket?.connected) {
      socket.emit('collaborative:create_session');
    }

    if (action?.type === 'collaborativeSession/joinSession' && socket?.connected) {
      socket.emit('collaborative:join_session', action.payload);
    }

    if (action?.type === 'collaborativeSession/leaveSession' && socket?.connected) {
      socket.emit('collaborative:leave_session');
    }

    if (action?.type === 'collaborativeSession/sendCodeChange' && socket?.connected) {
      socket.emit('collaborative:code_change', action.payload);
    }

    if (action?.type === 'collaborativeSession/sendOutputUpdate' && socket?.connected) {
      socket.emit('collaborative:output_update', action.payload);
    }

    if (action?.type === 'collaborativeSession/sendCursorPosition' && socket?.connected) {
      socket.emit('collaborative:cursor_move', action.payload);
    }

    if (action?.type === 'collaborativeSession/sendSelectionChange' && socket?.connected) {
      socket.emit('collaborative:selection_change', action.payload);
    }

    if (action?.type === 'collaborativeSession/toggleParticipantEdit' && socket?.connected) {
      socket.emit('collaborative:toggle_participant_edit', action.payload);
    }

    if (action?.type === 'collaborativeSession/kickParticipant' && socket?.connected) {
      socket.emit('collaborative:kick_participant', action.payload);
    }

    if (action?.type === 'collaborativeSession/updateSettings' && socket?.connected) {
      socket.emit('collaborative:update_settings', action.payload);
    }

    if (action?.type === 'collaborativeSession/forceMuteUser' && socket?.connected) {
      socket.emit('collaborative:force_mute_user', action.payload);
    }

    if (action?.type === 'collaborativeSession/endSession' && socket?.connected) {
      socket.emit('collaborative:end_session');
    }

    return next(action);
  };
};

export default socketMiddleware;