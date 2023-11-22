// cabinsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { guests } from "../data/data-guests";

const initialState = {
  guestsList: [],
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  loading: true,
};

const guestsSlice = createSlice({
  name: "guests",
  initialState,
  reducers: {
    setGuestsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGuestsList: (state, action) => {
      state.guestsList = action.payload;
      state.loading = false;
      state.error = null;
    },
    setGuestsError: (state, action) => {
      state.error = action.payload;
    },
    // Add other cabin-related actions here as needed
  },
});

export const { setGuestsLoading, setGuestsList, setGuestsError } =
  guestsSlice.actions;

export default guestsSlice.reducer;
