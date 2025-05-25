import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';

// Fetch user usage
export const fetchUserUsage = createAsyncThunk(
  'usage/fetchUserUsage',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.getMyUsage, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("fetchUserUsage_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch usage data');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

// Fetch all usage stats (admin)
export const fetchAllUsageStats = createAsyncThunk(
  'usage/fetchAllUsageStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.getAllUsageStats, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("fetchAllUsageStats_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch usage stats');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

// Fetch dashboard stats (admin)
export const fetchDashboardStats = createAsyncThunk(
  'usage/fetchDashboardStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.getDashboardStats, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("fetchDashboardStats_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch dashboard stats');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

// Export usage data (admin)
export const exportUsageData = createAsyncThunk(
  'usage/exportUsageData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await fetch(apis.exportUsageData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("exportUsageData_data",data);
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to export usage data');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

const initialState = {
  userUsage: null,
  allUsageStats: null,
  dashboardStats: {
    today: null,
    month: null,
    topUsers: [],
    planDistribution: []
  },
  exportData: null,
  loading: false,
  error: null,
  message: '',
  dashboardLoading: false,
  dashboardError: null,
  exportLoading: false,
  exportError: null
};

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {
    clearUsageState: (state) => {
      state.userUsage = null;
      state.allUsageStats = null;
      state.dashboardStats = {
        today: null,
        month: null,
        topUsers: [],
        planDistribution: []
      };
      state.exportData = null;
      state.error = null;
      state.message = '';
      state.loading = false;
      state.dashboardLoading = false;
      state.dashboardError = null;
      state.exportLoading = false;
      state.exportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user usage
      .addCase(fetchUserUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.userUsage = action.payload.usage;
        state.message = action.payload.message || '';
      })
      .addCase(fetchUserUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch usage data';
      })
      // Fetch all usage stats
      .addCase(fetchAllUsageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsageStats.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsageStats = action.payload.stats;
        state.message = action.payload.message || '';
      })
      .addCase(fetchAllUsageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch usage stats';
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload.data;
        state.message = action.payload.message || '';
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload || 'Failed to fetch dashboard stats';
      })
      // Export usage data
      .addCase(exportUsageData.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportUsageData.fulfilled, (state, action) => {
        state.exportLoading = false;
        state.exportData = action.payload.data;
        state.message = action.payload.message || 'Data exported successfully';
      })
      .addCase(exportUsageData.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Failed to export usage data';
      });
  },
});

export const { clearUsageState } = usageSlice.actions;

export default usageSlice.reducer;
