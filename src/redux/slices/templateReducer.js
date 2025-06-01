// store/slices/templateSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apis from '@/api';
import { encryptRequest, decryptResponse } from '@/cryptoUtils';

// Async thunks for template operations
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async ({ page = 1, limit = 9, category = 'all', search = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category !== 'all' && { category }),
        ...(search && { search })
      });

      const response = await fetch(`${apis.templateList}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch templates');
      }

      return {
        templates: data.data.templates,
        pagination: data.data.pagination,
        isLoadMore: page > 1
      };
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const fetchTemplateByName = createAsyncThunk(
  'templates/fetchTemplateByName',
  async (templateName, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apis.templateDetail}/${templateName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Template not found');
      }

      return data.data.template;
    } catch (error) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const fetchTemplateHtml = createAsyncThunk(
  'templates/fetchTemplateHtml',
  async (templateUrl, { rejectWithValue }) => {
    try {
      const response = await fetch(templateUrl);
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch template HTML');
      }

      const html = await response.text();
      return html;
    } catch (error) {
      return rejectWithValue('Failed to load template content');
    }
  }
);

const initialState = {
  templates: [],
  selectedTemplate: null,
  templateHtml: '',
  filters: {
    category: 'all',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  },
  isLoading: false,
  isLoadingMore: false,
  isLoadingTemplate: false,
  isLoadingHtml: false,
  error: null,
  hasMore: true
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset templates when filters change
      state.templates = [];
      state.pagination.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    clearTemplates: (state) => {
      state.templates = [];
      state.pagination.currentPage = 1;
      state.hasMore = true;
    },
    resetTemplateState: (state) => {
      state.selectedTemplate = null;
      state.templateHtml = '';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Templates
    builder
      .addCase(fetchTemplates.pending, (state, action) => {
        const isLoadMore = action.meta.arg.page > 1;
        if (isLoadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const { templates, pagination, isLoadMore } = action.payload;
        
        if (isLoadMore) {
          // Append new templates for infinite scroll
          state.templates = [...state.templates, ...templates];
        } else {
          // Replace templates for new search/filter
          state.templates = templates;
        }
        
        state.pagination = pagination;
        state.hasMore = pagination.hasNext;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload || 'Failed to fetch templates';
      })
      
      // Fetch Template by Name
      .addCase(fetchTemplateByName.pending, (state) => {
        state.isLoadingTemplate = true;
        state.error = null;
      })
      .addCase(fetchTemplateByName.fulfilled, (state, action) => {
        state.isLoadingTemplate = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplateByName.rejected, (state, action) => {
        state.isLoadingTemplate = false;
        state.error = action.payload || 'Failed to fetch template details';
      })
      
      // Fetch Template HTML
      .addCase(fetchTemplateHtml.pending, (state) => {
        state.isLoadingHtml = true;
        state.error = null;
      })
      .addCase(fetchTemplateHtml.fulfilled, (state, action) => {
        state.isLoadingHtml = false;
        state.templateHtml = action.payload;
      })
      .addCase(fetchTemplateHtml.rejected, (state, action) => {
        state.isLoadingHtml = false;
        state.error = action.payload || 'Failed to load template HTML';
      });
  },
});

export const { 
  setFilters, 
  clearTemplates, 
  resetTemplateState, 
  clearError 
} = templateSlice.actions;

export default templateSlice.reducer;