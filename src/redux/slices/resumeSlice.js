import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';

// Async thunk for resume parsing
export const parseResume = createAsyncThunk(
  'resume/parse',
  async (file, { rejectWithValue, getState }) => {
    try {
        const { auth } = getState();
        const token = auth.token;
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await fetch(apis.extractResume, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        const data = await response.json();
        
        // Decrypt response if needed
        const decrypted = typeof decryptResponse === 'function' ? decryptResponse(data) : data;
      console.log("decrypted", decrypted);
      if (!response.ok) {
        return rejectWithValue(decrypted.message || 'Resume parsing failed');
      }
      
      return decrypted;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  fileName: null,
  message: '',
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    resetResumeState: (state) => {
      state.error = null;
      state.message = '';
      state.isLoading = false;
    },
    clearResumeData: (state) => {
      state.data = null;
      state.fileName = null;
      state.error = null;
      state.message = '';
      state.isLoading = false;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload?.data;
        state.message = 'Resume parsed successfully!';
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to parse resume. Please try again.';
      });
  },
});

export const { resetResumeState, clearResumeData, setFileName } = resumeSlice.actions;

export default resumeSlice.reducer;