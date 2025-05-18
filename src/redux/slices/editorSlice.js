import { createSlice } from '@reduxjs/toolkit';
import { TABS, ELEMENT_TYPES, PREVIEW_MODES } from '@/utils/Utils';

const initialState = {
  activeTab: TABS.ELEMENTS,
  previewMode: PREVIEW_MODES.DESKTOP,
  selectedElement: null,
  editorHistory: [],
  historyIndex: -1,
  templateHtml: '',
  iframeLoaded: false,
  editableElements: [],
  savingStatus: '',
  templateId: 'engineer-atif'
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
    },
    setSelectedElement: (state, action) => {
      state.selectedElement = action.payload;
    },
    setTemplateHtml: (state, action) => {
      state.templateHtml = action.payload;
    },
    setIframeLoaded: (state, action) => {
      state.iframeLoaded = action.payload;
    },
    setEditableElements: (state, action) => {
      state.editableElements = action.payload;
    },
    setSavingStatus: (state, action) => {
      state.savingStatus = action.payload;
    },
    setTemplateId: (state, action) => {
      state.templateId = action.payload;
    },
    updateElementContent: (state, action) => {
      // Update selected element in state
      if (state.selectedElement) {
        // Add to history for undo/redo
        const newHistoryEntry = {
          type: 'CONTENT',
          elementId: state.selectedElement.id,
          oldValue: state.selectedElement.content,
          newValue: action.payload
        };

        // If we're in the middle of the history, truncate it
        const newHistory = state.editorHistory.slice(0, state.historyIndex + 1);
        state.editorHistory = [...newHistory, newHistoryEntry];
        state.historyIndex = newHistory.length;

        state.selectedElement = {
          ...state.selectedElement,
          content: action.payload
        };

        // Also update in the elements catalog
        state.editableElements = state.editableElements.map(el =>
          el.id === state.selectedElement.id ? { ...el, content: action.payload } : el
        );
      }
    },
    deleteSelectedElement: (state) => {
      if (state.selectedElement) {
        // Add to history for undo/redo
        const newHistoryEntry = {
          type: 'DELETE',
          elementId: state.selectedElement.id,
          elementData: state.selectedElement,
          elements: state.editableElements
        };
        
        // If we're in the middle of the history, truncate it
        const newHistory = state.editorHistory.slice(0, state.historyIndex + 1);
        state.editorHistory = [...newHistory, newHistoryEntry];
        state.historyIndex = newHistory.length;

        // Remove the element from editableElements list
        state.editableElements = state.editableElements.filter(
          el => el.id !== state.selectedElement.id
        );
        
        // Reset selected element
        state.selectedElement = null;
      }
    },
    undo: (state) => {
      if (state.historyIndex >= 0) {
        const historyEntry = state.editorHistory[state.historyIndex];
        
        // Handle different types of history entries
        if (historyEntry.type === 'DELETE') {
          // For delete actions, restore the element
          state.editableElements = historyEntry.elements;
          state.selectedElement = historyEntry.elementData;
        } else {
          // For content updates, just update the selected element
          if (state.selectedElement && state.selectedElement.id === historyEntry.elementId) {
            state.selectedElement.content = historyEntry.oldValue;
          }
          
          // Also update in the elements catalog
          state.editableElements = state.editableElements.map(el =>
            el.id === historyEntry.elementId ? { ...el, content: historyEntry.oldValue } : el
          );
        }
        
        state.historyIndex -= 1;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.editorHistory.length - 1) {
        state.historyIndex += 1;
        const historyEntry = state.editorHistory[state.historyIndex];
        
        // Handle different types of history entries
        if (historyEntry.type === 'DELETE') {
          // For delete actions, remove the element again
          state.editableElements = state.editableElements.filter(
            el => el.id !== historyEntry.elementData.id
          );
          state.selectedElement = null;
        } else {
          // For content updates, update with the new value
          if (state.selectedElement && state.selectedElement.id === historyEntry.elementId) {
            state.selectedElement.content = historyEntry.newValue;
          }
          
          // Also update in the elements catalog
          state.editableElements = state.editableElements.map(el =>
            el.id === historyEntry.elementId ? { ...el, content: historyEntry.newValue } : el
          );
        }
      }
    },
  },
});

export const { 
  setActiveTab,
  setPreviewMode,
  setSelectedElement,
  setTemplateHtml,
  setIframeLoaded,
  setEditableElements,
  setSavingStatus,
  setTemplateId,
  updateElementContent,
  deleteSelectedElement,
  undo,
  redo
} = editorSlice.actions;

export const selectSelectedElement = (state) => state.editor.selectedElement;
export const selectActiveTab = (state) => state.editor.activeTab;
export const selectPreviewMode = (state) => state.editor.previewMode;
export const selectIframeLoaded = (state) => state.editor.iframeLoaded;
export const selectEditableElements = (state) => state.editor.editableElements;
export const selectSavingStatus = (state) => state.editor.savingStatus;
export const selectTemplateId = (state) => state.editor.templateId;

export default editorSlice.reducer;
