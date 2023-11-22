// cabinsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { cabins } from "../data/data-cabins";

const initialState = {
  cabinsList: [],
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  loading: true,
};

const cabinsSlice = createSlice({
  name: "cabins",
  initialState,
  reducers: {
    setCabinsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCabinsList: (state, action) => {
      state.cabinsList = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCabinsError: (state, action) => {
      state.error = action.payload;
    },
    // Add other cabin-related actions here as needed
  },
});

export const { setCabinsLoading, setCabinsList, setCabinsError } =
  cabinsSlice.actions;

export default cabinsSlice.reducer;
