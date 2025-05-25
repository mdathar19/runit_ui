import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';

// Async thunks for plans
export const fetchAllPlans = createAsyncThunk(
  'payment/fetchAllPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(apis.getAllPlans);
      const data = await response.json();
      console.log("fetchAllPlans_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch plans');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'payment/fetchPlanById',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await fetch(apis.getPlanById(planId));
      const data = await response.json();
      console.log("data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch plan');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async ({ planId, currency = 'INR' }, { rejectWithValue, getState }) => {
    try {
        console.log("createOrder_planId",planId);
      const { auth } = getState();
      const token = auth.token;
      const encryptedPayload = encryptRequest({ planId, currency });
      const response = await fetch(apis.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(encryptedPayload),
      });
      
      const data = await response.json();
      console.log("data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to create order');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const encryptedPayload = encryptRequest({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
      const response = await fetch(apis.verifyPayment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedPayload),
      });
      
      const data = await response.json();
      console.log("verifyPayment_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Payment verification failed');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);


export const fetchMySubscriptions = createAsyncThunk(
  'payment/fetchMySubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(apis.getMySubscriptions);
      const data = await response.json();
      console.log("data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch subscriptions');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchPaymentHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const encryptedPayload = encryptRequest({ page, limit });
      const response = await fetch(`${apis.getPaymentHistory}?page=${page}&limit=${limit}`);
      const data = await response.json();
      console.log("data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch payment history');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const initiateRefund = createAsyncThunk(
  'payment/initiateRefund',
  async ({ paymentId, amount, reason }, { rejectWithValue }) => {
    try {
      const encryptedPayload = encryptRequest({ paymentId, amount, reason });
      const response = await fetch(apis.initiateRefund, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedPayload),
      });
      
      const data = await response.json();
      console.log("data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to initiate refund');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

const initialState = {
  plans: [],
  selectedPlan: null,
  order: null,
  subscription: null,
  paymentHistory: {
    transactions: [],
    pagination: null
  },
  subscriptions: [],
  loading: false,
  error: null,
  message: '',
  verificationLoading: false,
  verificationError: null,
  currentPlan: null,
  subscriptionStatus: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.order = null;
      state.error = null;
      state.message = '';
      state.loading = false;
      state.verificationLoading = false;
      state.verificationError = null;
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all plans
      .addCase(fetchAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans;
        state.message = action.payload.message || '';
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch plans';
      })
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.message = action.payload.message || '';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
      })
      // Verify payment cases
      .addCase(verifyPayment.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.subscription = action.payload.subscription;
        state.message = action.payload.message || '';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload || 'Payment verification failed';
      })
      // Fetch subscriptions
      .addCase(fetchMySubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.subscriptions;
        state.message = action.payload.message || '';
      })
      .addCase(fetchMySubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch subscriptions';
      })
      // Fetch payment history
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = {
          transactions: action.payload.transactions,
          pagination: action.payload.pagination
        };
        state.message = action.payload.message || '';
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch payment history';
      })
      // Initiate refund
      .addCase(initiateRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Refund initiated successfully';
      })
      .addCase(initiateRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initiate refund';
      });
  },
});

export const { clearPaymentState, setCurrentPlan, setSelectedPlan } = paymentSlice.actions;

export default paymentSlice.reducer;
