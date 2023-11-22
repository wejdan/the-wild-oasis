// userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Define async thunk for logging in

export const appSettingslice = createSlice({
  name: "appSettings",
  initialState: {
    isDarkMode:
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  },
  reducers: {
    setMode: (state, action) => {
      const { payload } = action;
      state.isDarkMode = payload;

      //  console.log('newState', state);
    },
  },
});

export const { setMode } = appSettingslice.actions;
export default appSettingslice.reducer;
