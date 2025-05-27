// src/redux/slices/paymentAlertSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [], // Array of payment alerts
  isVisible: false,
  activeAlert: null,
  soundEnabled: true,
  autoHide: true,
  autoHideDelay: 5000, // 5 seconds
};

const paymentAlertSlice = createSlice({
  name: 'paymentAlert',
  initialState,
  reducers: {
    // Add new payment alert
    addPaymentAlert: (state, action) => {
      const alert = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      
      state.alerts.unshift(alert); // Add to beginning
      state.activeAlert = alert;
      state.isVisible = true;
      
      // Keep only last 50 alerts
      if (state.alerts.length > 50) {
        state.alerts = state.alerts.slice(0, 50);
      }
    },

    // Handle successful payment
    handlePaymentSuccess: (state, action) => {
      const { paymentId, amount, currency, method, orderId } = action.payload;
      
      const alert = {
        id: Date.now() + Math.random(),
        type: 'success',
        title: 'Payment Successful!',
        message: `Payment of ${currency} ${(amount / 100).toFixed(2)} received successfully`,
        details: {
          paymentId,
          amount: amount / 100,
          currency,
          method,
          orderId,
        },
        timestamp: new Date().toISOString(),
        icon: 'check-circle',
        duration: 6000,
      };
      
      state.alerts.unshift(alert);
      state.activeAlert = alert;
      state.isVisible = true;
    },

    // Handle failed payment
    handlePaymentFailure: (state, action) => {
      const { paymentId, orderId, error, errorCode } = action.payload;
      
      const alert = {
        id: Date.now() + Math.random(),
        type: 'error',
        title: 'Payment Failed',
        message: error || 'Payment could not be processed',
        details: {
          paymentId,
          orderId,
          errorCode,
          error,
        },
        timestamp: new Date().toISOString(),
        icon: 'x-circle',
        duration: 8000,
      };
      
      state.alerts.unshift(alert);
      state.activeAlert = alert;
      state.isVisible = true;
    },

    // Handle refund notifications
    handleRefundNotification: (state, action) => {
      const { refundId, paymentId, amount, status, type } = action.payload;
      
      let title, message, alertType, icon;
      
      switch (type) {
        case 'refund_processed':
          title = 'Refund Created';
          message = `Refund of ₹${(amount / 100).toFixed(2)} has been initiated`;
          alertType = 'info';
          icon = 'arrow-left-circle';
          break;
        case 'refund_completed':
          title = 'Refund Completed';
          message = `Refund of ₹${(amount / 100).toFixed(2)} has been processed successfully`;
          alertType = 'success';
          icon = 'check-circle';
          break;
        case 'refund_failed':
          title = 'Refund Failed';
          message = `Refund of ₹${(amount / 100).toFixed(2)} could not be processed`;
          alertType = 'error';
          icon = 'x-circle';
          break;
        default:
          title = 'Refund Update';
          message = `Refund status updated: ${status}`;
          alertType = 'info';
          icon = 'info';
      }
      
      const alert = {
        id: Date.now() + Math.random(),
        type: alertType,
        title,
        message,
        details: {
          refundId,
          paymentId,
          amount: amount / 100,
          status,
        },
        timestamp: new Date().toISOString(),
        icon,
        duration: 6000,
      };
      
      state.alerts.unshift(alert);
      state.activeAlert = alert;
      state.isVisible = true;
    },

    // Handle payment dispute
    handlePaymentDispute: (state, action) => {
      const { disputeId, paymentId, amount, reason } = action.payload;
      
      const alert = {
        id: Date.now() + Math.random(),
        type: 'warning',
        title: 'Payment Disputed',
        message: `A dispute has been raised for payment of ₹${(amount / 100).toFixed(2)}`,
        details: {
          disputeId,
          paymentId,
          amount: amount / 100,
          reason,
        },
        timestamp: new Date().toISOString(),
        icon: 'alert-triangle',
        duration: 10000, // Longer duration for disputes
      };
      
      state.alerts.unshift(alert);
      state.activeAlert = alert;
      state.isVisible = true;
    },

    // Hide current alert
    hideAlert: (state) => {
      state.isVisible = false;
      state.activeAlert = null;
    },

    // Remove specific alert
    removeAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter(alert => alert.id !== alertId);
      
      if (state.activeAlert?.id === alertId) {
        state.activeAlert = null;
        state.isVisible = false;
      }
    },

    // Clear all alerts
    clearAllAlerts: (state) => {
      state.alerts = [];
      state.activeAlert = null;
      state.isVisible = false;
    },

    // Mark alert as read
    markAlertAsRead: (state, action) => {
      const alertId = action.payload;
      const alert = state.alerts.find(alert => alert.id === alertId);
      if (alert) {
        alert.read = true;
      }
    },

    // Toggle sound setting
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    // Toggle auto-hide setting
    toggleAutoHide: (state) => {
      state.autoHide = !state.autoHide;
    },

    // Set auto-hide delay
    setAutoHideDelay: (state, action) => {
      state.autoHideDelay = action.payload;
    },

    // Show specific alert
    showAlert: (state, action) => {
      const alert = state.alerts.find(alert => alert.id === action.payload);
      if (alert) {
        state.activeAlert = alert;
        state.isVisible = true;
      }
    },
  },
});

export const {
  addPaymentAlert,
  handlePaymentSuccess,
  handlePaymentFailure,
  handleRefundNotification,
  handlePaymentDispute,
  hideAlert,
  removeAlert,
  clearAllAlerts,
  markAlertAsRead,
  toggleSound,
  toggleAutoHide,
  setAutoHideDelay,
  showAlert,
} = paymentAlertSlice.actions;

// Selectors
export const selectPaymentAlerts = (state) => state.paymentAlert.alerts;
export const selectActiveAlert = (state) => state.paymentAlert.activeAlert;
export const selectIsAlertVisible = (state) => state.paymentAlert.isVisible;
export const selectUnreadAlerts = (state) => 
  state.paymentAlert.alerts.filter(alert => !alert.read);
export const selectAlertSettings = (state) => ({
  soundEnabled: state.paymentAlert.soundEnabled,
  autoHide: state.paymentAlert.autoHide,
  autoHideDelay: state.paymentAlert.autoHideDelay,
});

export default paymentAlertSlice.reducer;