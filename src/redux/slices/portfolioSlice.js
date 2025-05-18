import apis from '@/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Async thunks
export const publishPortfolio = createAsyncThunk(
  'portfolio/publish',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(apis.publishPortfolio, {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        return rejectWithValue(errorData?.message || 'Failed to publish portfolio');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to publish portfolio');
    }
  }
);

export const getUserPortfolios = createAsyncThunk(
  'portfolio/getUserPortfolios',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(apis.getUserPortfolios, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        return rejectWithValue(errorData?.message || 'Failed to get user portfolios');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user portfolios');
    }
  }
);

export const checkWebsiteName = createAsyncThunk(
  'portfolio/checkWebsiteName',
  async (websiteName, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(`${apis.checkWebsiteName}/${websiteName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        return rejectWithValue(errorData?.message || 'Failed to check website name');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check website name');
    }
  }
);

const initialState = {
  portfolios: [],
  isLoading: false,
  publishStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  checkNameStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  nameCheckResult: null,
  error: null,
  currentPortfolio: null
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearNameCheckResult: (state) => {
      state.nameCheckResult = null;
      state.checkNameStatus = 'idle';
    },
    setCurrentPortfolio: (state, action) => {
      state.currentPortfolio = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user portfolios
      .addCase(getUserPortfolios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserPortfolios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolios = action.payload.portfolios || [];
      })
      .addCase(getUserPortfolios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Publish portfolio
      .addCase(publishPortfolio.pending, (state) => {
        state.publishStatus = 'loading';
        state.error = null;
      })
      .addCase(publishPortfolio.fulfilled, (state, action) => {
        state.publishStatus = 'succeeded';
        // Add the new portfolio to the list if it's not already there
        if (action.payload && action.payload._id) {
          const exists = state.portfolios.some(p => p._id === action.payload._id);
          if (!exists) {
            state.portfolios.push(action.payload);
          }
        }
        state.currentPortfolio = action.payload;
      })
      .addCase(publishPortfolio.rejected, (state, action) => {
        state.publishStatus = 'failed';
        state.error = action.payload;
      })
      
      // Check website name
      .addCase(checkWebsiteName.pending, (state) => {
        state.checkNameStatus = 'loading';
        state.nameCheckResult = null;
      })
      .addCase(checkWebsiteName.fulfilled, (state, action) => {
        state.checkNameStatus = 'succeeded';
        state.nameCheckResult = action.payload;
      })
      .addCase(checkWebsiteName.rejected, (state, action) => {
        state.checkNameStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearNameCheckResult, setCurrentPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
