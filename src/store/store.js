import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cabinsReducer from "./cabinsReducer";
import bookingsReducer from "./bookingsReducer"; // Assume you have this
import guestsReducers from "./guestsReducers";
import settingsSlice from "./settingsSlice";
import appSettingsSlice from "./appSettingsSlice";
// src/localStorage.js

// Save state to local storage
export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("appSettings", serializedState);
  } catch (e) {
    console.warn("Error saving state to local storage:", e);
  }
};

// Load state from local storage
export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("appSettings");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Error loading state from local storage:", e);
    return undefined;
  }
};
const preloadedState = {
  appSettings: loadFromLocalStorage(),
};
const store = configureStore({
  reducer: {
    user: userReducer,
    cabins: cabinsReducer,
    bookings: bookingsReducer,
    guests: guestsReducers,
    settings: settingsSlice,
    appSettings: appSettingsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  preloadedState,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState().appSettings);
});

export default store;
