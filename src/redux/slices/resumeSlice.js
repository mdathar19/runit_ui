import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';
import { setTemplateHtml } from './editorSlice';

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
      if (!response.ok) {
        return rejectWithValue(decrypted.message || 'Resume parsing failed');
      }
      
      return decrypted;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const enhanceHtml = createAsyncThunk(
  'resume/enhanceHtml',
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log("templateHtml", data.templateHtml);
      console.log("resumeJson", data.resumeJson);
      
      const { auth } = getState();
      const token = auth.token;
      
      const body = {
        templateHtml: data.templateHtml,
        resumeJson: data.resumeJson,
        clientId: data.clientId // Pass socket client ID for progress updates
      };
      
      console.log("body", body);
      
      const encryptedPayload = encryptRequest(body);
      
      // Reset enhancement states before starting
      dispatch(resetEnhancementState());
      
      const response = await fetch(apis.enhanceHtml, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedPayload),
      });
      
      const responseData = await response.json();
      
      // Decrypt response if needed
      const decrypted = typeof decryptResponse === 'function' ? decryptResponse(responseData) : responseData;
      
      if (!response.ok) {
        return rejectWithValue(decrypted.message || 'Resume enhancement failed');
      }
      
      // The final HTML will be set via Socket.IO events
      // This is just for fallback if Socket.IO doesn't work
      if (decrypted && !data.useSocketProgress) {
        dispatch(setTemplateHtml(decrypted));
      }
      
      return decrypted;
    } catch (error) {
      console.error('enhanceHtml error:', error);
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
  
  // HTML Enhancement Progress States
  enhancementInProgress: false,
  enhancementProgress: 0,
  enhancementStatus: '',
  enhancementMessage: '',
  currentSection: null,
  totalSections: null,
  enhancementError: null,
  enhancementComplete: false,
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
    },
    
    // HTML Enhancement Progress Actions
    setHtmlEnhancementProgress: (state, action) => {
      const { status, message, progress, currentSection, totalSections } = action.payload;
      state.enhancementInProgress = true;
      state.enhancementProgress = progress || 0;
      state.enhancementStatus = status || '';
      state.enhancementMessage = message || '';
      state.currentSection = currentSection;
      state.totalSections = totalSections;
      state.enhancementComplete = false;
      state.enhancementError = null;
    },
    
    setHtmlEnhancementError: (state, action) => {
      state.enhancementInProgress = false;
      state.enhancementError = action.payload;
      state.enhancementComplete = false;
    },
    
    setHtmlEnhancementComplete: (state) => {
      state.enhancementInProgress = false;
      state.enhancementComplete = true;
      state.enhancementProgress = 100;
      state.enhancementStatus = 'completed';
      state.enhancementMessage = 'HTML enhancement completed successfully!';
      state.enhancementError = null;
    },
    
    resetEnhancementState: (state) => {
      state.enhancementInProgress = false;
      state.enhancementProgress = 0;
      state.enhancementStatus = '';
      state.enhancementMessage = '';
      state.currentSection = null;
      state.totalSections = null;
      state.enhancementError = null;
      state.enhancementComplete = false;
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
      })
      .addCase(enhanceHtml.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = '';
        // Enhancement progress will be handled by Socket.IO events
      })
      .addCase(enhanceHtml.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = 'Resume enhanced successfully!';
        // Final completion will be handled by Socket.IO events
      })
      .addCase(enhanceHtml.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to enhance resume. Please try again.';
        // Reset enhancement state on error
        state.enhancementInProgress = false;
        state.enhancementError = action.payload;
      })
  },
});

export const { 
  resetResumeState, 
  clearResumeData, 
  setFileName,
  setHtmlEnhancementProgress,
  setHtmlEnhancementError,
  setHtmlEnhancementComplete,
  resetEnhancementState
} = resumeSlice.actions;

// Selectors
export const selectResumeData = (state) => state.resume.data;
export const selectResumeLoading = (state) => state.resume.isLoading;
export const selectResumeError = (state) => state.resume.error;
export const selectFileName = (state) => state.resume.fileName;
export const selectResumeMessage = (state) => state.resume.message;

// Enhancement Progress Selectors
export const selectEnhancementInProgress = (state) => state.resume.enhancementInProgress;
export const selectEnhancementProgress = (state) => state.resume.enhancementProgress;
export const selectEnhancementStatus = (state) => state.resume.enhancementStatus;
export const selectEnhancementMessage = (state) => state.resume.enhancementMessage;
export const selectCurrentSection = (state) => state.resume.currentSection;
export const selectTotalSections = (state) => state.resume.totalSections;
export const selectEnhancementError = (state) => state.resume.enhancementError;
export const selectEnhancementComplete = (state) => state.resume.enhancementComplete;

export default resumeSlice.reducer;