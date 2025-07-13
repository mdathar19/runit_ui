import apis from '@/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearResumeData } from './resumeSlice';


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

export const generatePortfolio = createAsyncThunk(
  'portfolio/generatePortfolio',
  async (body, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.generatePortfolio, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        dispatch(clearResumeData())
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

export const fetchPortfolioStats = createAsyncThunk(
  'portfolios/fetchPortfolioStats',
  async (_, { rejectWithValue,getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.portfoliosStats, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio stats');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolios/deletePortfolio',
  async (portfolioName, { rejectWithValue,getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(`${apis.deletePortfolios}/${portfolioName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete portfolio');
      }
      
      const data = await response.json();
      return { portfolioName, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  portfolios: [],
  stats: {
    total: 0,
    published: 0,
    private: 0,
    expired: 0,
    byEngine: {},
    recentActivity: []
  },
  isLoading: false,
  publishStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  checkNameStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  nameCheckResult: null,
  error: null,
  currentPortfolio: null,
  lastFetch: null
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
      // Delete portfolio
      .addCase(deletePortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        const portfolioName = action.payload.portfolioName;
        const index = state.portfolios.findIndex(p => p.name === portfolioName);
        if (index !== -1) {
          const portfolio = state.portfolios[index];
          state.portfolios.splice(index, 1);
          
          // Update stats
          state.stats.total -= 1;
          if (portfolio.isPublic) {
            state.stats.published -= 1;
          } else {
            state.stats.private -= 1;
          }
        }
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch portfolio stats
      .addCase(fetchPortfolioStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchPortfolioStats.rejected, (state, action) => {
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

// Selectors
export const selectPortfolios = (state) => state.portfolio.portfolios;
export const selectPortfolioStats = (state) => state.portfolio.stats;
export const selectPortfolioLoading = (state) => state.portfolio.loading;
export const selectPortfolioError = (state) => state.portfolio.error;
export const selectLastFetch = (state) => state.portfolio.lastFetch;
export default portfolioSlice.reducer;
