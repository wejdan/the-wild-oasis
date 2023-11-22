// userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Define async thunk for logging in

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    error: null,
    isAuthenticating: true, // Add this line
    userData: null,
  },
  reducers: {
    setIsAuthenticating: (state, action) => {
      const { payload } = action;
      state.isAuthenticating = payload.isAuthenticating;

      //  console.log('newState', state);
    },

    logout: (state, action) => {
      state.userId = null;
      state.isAuthenticating = true;
      // state.didTryAutoLogin = false;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload.userId;
      state.isAuthenticating = false;
    },
  },
});

export const { setUserData, setUserId } = userSlice.actions;
export default userSlice.reducer;
