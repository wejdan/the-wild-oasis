import React, { useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGuestsList } from "../store/guestsReducers";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, database } from "../firebase";
import { setCabinsList } from "../store/cabinsReducer";
import Loader from "../components/Loader";
import { setUserData, setUserId } from "../store/userSlice";
import { setSettings } from "../store/settingsSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabins } from "../store/actions/cabinsActions";
import { onAuthStateChanged } from "firebase/auth";
import { useCustomQuery } from "../hooks/queryHook";
import { getUserData } from "../store/actions/userActions";
import Spinner from "../components/Spinner";

function AppLayout() {
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);
  const userQuery = useCustomQuery("users", getUserData, [
    auth.currentUser.uid,
  ]);
  if (userQuery.isLoading) {
    return (
      <div
        className={`z-50  absolute inset-0 bg-slate-200/20 dark:bg-gray-800 flex justify-center items-center min-h-screen `}
      >
        <div className="flex items-center gap-2">
          <p className="dark:text-white">Loading user data ...</p>
          <Spinner size={"20px"} />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex    bg-secondary dark:bg-gray-900  h-screen overflow-hidden `}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Header />

        <main className="px-10 py-12  overflow-y-auto flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
