import React from "react";
import Avatar from "./Avatar";
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, signout } from "../store/actions/userActions";
import { useCustomQuery } from "../hooks/queryHook";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import { setMode } from "../store/appSettingsSlice";

function Header() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  const userQuery = useCustomQuery("users", getUserData, [
    auth.currentUser.uid,
  ]);
  const userData = userQuery.isEmpty ? {} : userQuery.data;
  const handleLogout = () => {
    signout();
  };
  return (
    <div className="bg-white border-l-1 shadow-sm border-secondery dark:border-gray-900 dark:bg-gray-800 text-gray-600  dark:text-gray-300  h-16 flex items-center gap-8 justify-end px-14">
      <div className=" flex gap-3 items-center">
        <Avatar size={"36px"} url={userData.avatar} />
        <span className=" font-bold text-sm   select-none">
          {userData.name}
        </span>
      </div>
      <div className=" flex gap-3 text-primary dark:text-white items-center">
        <NavLink
          className="dark:hover:bg-gray-900 hover:bg-gray-200 rounded-md p-1 transition-all duration-300"
          to="/account"
        >
          <HiOutlineUser className=" cursor-pointer " size={"20px"} />
        </NavLink>
        <span className="dark:hover:bg-gray-900 rounded-md p-1  hover:bg-gray-200 transition-all duration-300">
          {isDarkMode ? (
            <HiOutlineSun
              className=" cursor-pointer"
              size={"20px"}
              onClick={() => {
                dispatch(setMode(!isDarkMode));
              }}
            />
          ) : (
            <HiOutlineMoon
              className=" cursor-pointer"
              size={"20px"}
              onClick={() => {
                dispatch(setMode(!isDarkMode));
              }}
            />
          )}
        </span>
        <span className="dark:hover:bg-gray-900 hover:bg-gray-200  rounded-md p-1 transition-all duration-300">
          <HiOutlineLogout
            onClick={handleLogout}
            className=" cursor-pointer"
            size={"20px"}
          />{" "}
        </span>
      </div>
    </div>
  );
}

export default Header;
