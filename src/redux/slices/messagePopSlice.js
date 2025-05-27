import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  message: "Check out our latest features!",
  imageUrl: "/favicon_io/android-chrome-192x192.png",
  linkText: "",
  linkUrl: "",
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
