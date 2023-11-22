import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsersPages from "./pages/UsersPages";
import Bookings from "./pages/Bookings";
import UserSettings from "./pages/UserSettings";
import Cabins from "./pages/cabinPage/CabinModals";
import SettingsPage from "./pages/SettingsPage";
import { useDispatch, useSelector } from "react-redux";
import { auth, database } from "./firebase";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BookingDetails from "./pages/BookingDetails";
import { onAuthStateChanged } from "firebase/auth";
import { setUserId } from "./store/userSlice";
import Loader from "./components/Loader";
import Modal from "./components/ModalV2";
import useAuth from "./hooks/useAuth";
import { getUserData } from "./store/actions/userActions";
import { useQuery } from "@tanstack/react-query";

function App() {
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  // const dispatch = useDispatch();
  // const isAuthenticating = useSelector((state) => state.user.isAuthenticating);

  // useEffect(() => {
  //   // Listen for changes in user authentication state
  //   const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
  //     if (authenticatedUser) {
  //       dispatch(setUserId({ userId: authenticatedUser.uid }));
  //     } else {
  //       dispatch(setUserId({ userId: null }));
  //     }
  //     // dispatch(setIsAuthenticating({isAuthenticating:false}));
  //   });

  //   // Cleanup function
  //   return () => unsubscribe();
  // }, [dispatch]);
  const { userId, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return (
      <div
        className={` z-50 absolute inset-0 flex justify-center items-center min-h-screen  ${
          isDarkMode ? "dark bg-gray-800" : ""
        }  `}
      >
        <Loader />
      </div>
    );
  }
  return (
    <Modal>
      <div className={`${isDarkMode ? "dark bg-gray-800" : ""}  `}>
        <Router>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/users" element={<UsersPages />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/account" element={<UserSettings />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/cabins" element={<Cabins />} />

              {/* Add other routes as needed */}
            </Route>

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </Modal>
  );
}

export default App;
