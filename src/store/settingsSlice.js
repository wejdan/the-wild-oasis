// settingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readSettings, updateSettingsAction } from "./actions/settingsActions";

const initialState = {
  appSettings: {
    minBookingLength: 0,
    maxBookingLength: 0,
    maxGuestsPerBooking: 0,
    breakfastPrice: 0,
  },
  id: null,
  status: "idle", // to keep track of loading state
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const response = await readSettings();
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (newSettings) => {
    const response = await updateSettingsAction(newSettings);
    return response.data;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.appSettings = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appSettings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.appSettings = action.payload;
      });
  },
});
export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
