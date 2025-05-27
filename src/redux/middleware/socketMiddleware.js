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

// Socket.io middleware for Redux
const socketMiddleware = () => {
  let socket = null;

  return store => next => action => {
    // Initialize socket connection if not already established
    if (!socket) {
      socket = io(publishedPortfolioUrl);
      
      // Set socket ID when connected
      socket.on("connect", () => {
        store.dispatch(setSocketId(socket.id));
        console.log("Socket connected with ID:", socket.id);

        // Join user room if authenticated
        const state = store.getState();
        if (state.auth.isAuthenticated && state.auth.user?._id) {
          socket.emit('join_user_room', state.auth.user._id);
          console.log(`Joined user room: user_${state.auth.user._id}`);
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
        console.log(`Section ${data.sectionIndex}/${data.totalSections} completed`);
        
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
        console.log(`Sub-section ${data.subSectionIndex}/${data.totalSubSections} completed for section ${data.sectionNumber}`);
        
        // Update template HTML with cumulative content including sub-sections
        if (data.cumulativeHtml) {
          store.dispatch(setTemplateHtml(data.cumulativeHtml));
        }
      });

      // Warning events
      socket.on("html-enhancement-warning", (data) => {
        console.warn("HTML Enhancement Warning:", data.message);
        // You can dispatch a warning action if needed
      });

      // Error events
      socket.on("html-enhancement-error", (data) => {
        console.error("HTML Enhancement Error:", data.message);
        store.dispatch(setHtmlEnhancementError(data.message));
      });

      // Final completion
      socket.on("html-enhancement-complete", (data) => {
        console.log("HTML Enhancement completed successfully");
        store.dispatch(setHtmlEnhancementComplete());
        
        // Ensure final HTML is set
        if (data.finalHtml) {
          store.dispatch(setTemplateHtml(data.finalHtml));
        }
      });

      // Payment Success Event
      socket.on("payment_captured", (data) => {
        console.log("Payment captured:", data);
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
        console.log("Payment failed:", data);
        store.dispatch(handlePaymentFailure({
          paymentId: data.paymentId,
          orderId: data.orderId,
          error: data.error,
          errorCode: data.errorCode
        }));
      });

      // Refund Events
      socket.on("refund_processed", (data) => {
        console.log("Refund processed:", data);
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_processed'
        }));
      });

      socket.on("refund_completed", (data) => {
        console.log("Refund completed:", data);
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_completed'
        }));
      });

      socket.on("refund_failed", (data) => {
        console.log("Refund failed:", data);
        store.dispatch(handleRefundNotification({
          ...data,
          type: 'refund_failed'
        }));
      });

      // Payment Dispute Event
      socket.on("payment_dispute", (data) => {
        console.log("Payment dispute:", data);
        store.dispatch(handlePaymentDispute({
          disputeId: data.disputeId,
          paymentId: data.paymentId,
          amount: data.amount,
          reason: data.reason
        }));
      });

      // Subscription Events (you can extend these as needed)
      socket.on("subscription_created", (data) => {
        console.log("Subscription created:", data);
        // Handle subscription creation notification
      });

      socket.on("subscription_cancelled", (data) => {
        console.log("Subscription cancelled:", data);
        // Handle subscription cancellation notification
      });
      
      // Reconnect logic
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      
      socket.on("reconnect", () => {
        console.log("Socket reconnected with ID:", socket.id);
        store.dispatch(setSocketId(socket.id));

        // Rejoin user room on reconnect
        const state = store.getState();
        if (state.auth.isAuthenticated && state.auth.user?._id) {
          socket.emit('join_user_room', state.auth.user._id);
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
      if (userId && socket?.connected) {
        socket.emit('join_user_room', userId);
        console.log(`Joined user room after login: user_${userId}`);
      }
    }

    if (action?.type === 'auth/logout') {
      // User logged out, leave their room
      if (socket?.connected) {
        socket.emit('leave_user_room');
        console.log('Left user room after logout');
      }
    }
    
    return next(action);
  };
};

export default socketMiddleware;