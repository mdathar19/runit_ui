import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';
// Async thunks for authentication
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (email, { rejectWithValue }) => {
    try {
        const encryptedPayload = encryptRequest({email});
        console.log(encryptedPayload);
        const response = await fetch(apis.signup, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(encryptedPayload),
        });
      
        const data = await response.json();
        const decrypted = decryptResponse(data);
        if (!decrypted.success) {
            return rejectWithValue(decrypted.message || 'Signup failed');
        }
        
        return { isExists: decrypted.isExists, email };
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
        const encryptedPayload = encryptRequest({email, password});
        const response = await fetch(apis.login, {
            method: 'POST',
            headers: {
          'Content-Type': 'application/json',
            },
            body: JSON.stringify(encryptedPayload),
        });
      
        const data = await response.json();
        const decrypted = decryptResponse(data);
        if (!decrypted.success || !decrypted.token) {
            return rejectWithValue(decrypted.message || 'Invalid credentials');
        }
      
        return { token: decrypted.token, user: decrypted.user || { email } };
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
        const encryptedPayload = encryptRequest({email, otp});
        const response = await fetch(apis.verifyOtp, {
            method: 'POST',
            headers: {
          'Content-Type': 'application/json',
            },
            body: JSON.stringify(encryptedPayload),
        });
      
      const data = await response.json();
        const decrypted = decryptResponse(data);
        if (!decrypted.success || !decrypted.token) {
            return rejectWithValue(decrypted.message || 'Invalid OTP');
        }
        return { token: decrypted.token, user: decrypted.user || { email } };
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  step: 'email', // email, password, otp
  isLoading: false,
  error: null,
  message: '',
  isSessionChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
      state.error = null;
      state.message = '';
    },
    resetAuth: (state) => {
      state.step = 'email';
      state.error = null;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.step = 'email';
    },
    checkSession: (state) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
      state.isSessionChecked = true;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isExists) {
          // User exists, show password field
          state.message = 'Welcome back! Please enter your password to continue.';
          state.step = 'password';
        } else {
          // New user, OTP sent
          state.message = 'OTP sent to your email. Please check your inbox.';
          state.step = 'otp';
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.message = 'Account created successfully! Password sent to your email.';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'OTP verification failed';
      });
  },
});

export const { setStep, resetAuth, logout, checkSession } = authSlice.actions;

export default authSlice.reducer;
