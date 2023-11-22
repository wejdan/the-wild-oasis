// bookingsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { bookings } from "../data/data-bookings";

const initialState = {
  bookingsList: bookings,
  status: "idle",
  error: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.status = "loading";
    },
    fetchBookingsSuccess: (state, action) => {
      state.status = "succeeded";
      state.bookings = action.payload;
    },
    fetchBookingsError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    // Add other booking-related actions here as needed
  },
});

export const { fetchBookingsStart, fetchBookingsSuccess, fetchBookingsError } =
  bookingsSlice.actions;

export default bookingsSlice.reducer;
