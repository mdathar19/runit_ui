import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  message: "Check out our latest features!",
  imageUrl: "/api/placeholder/80/80",
  linkText: "Learn More",
  linkUrl: "#",
  duration: null, // null means no auto-hide
};

const messagePopSlice = createSlice({
  name: 'messagePop',
  initialState,
  reducers: {
    showPopup: (state, action) => {
      return { ...state, ...action.payload, show: true };
    },
    hidePopup: (state) => {
      state.show = false;
    },
    setPopupConfig: (state, action) => {
      return { ...state, ...action.payload, show: true };
    }
  }
});

export const { showPopup, hidePopup, setPopupConfig } = messagePopSlice.actions;

export default messagePopSlice.reducer;
