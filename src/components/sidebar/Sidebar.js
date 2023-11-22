import React from "react";
import Logo from "../Logo";
import SidebarItem from "./SidebarItem";
import { HiOutlineHome, HiOutlineUsers } from "react-icons/hi";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHomeModern,
  HiUsers,
} from "react-icons/hi2";
import { useSelector } from "react-redux";

function Sidebar() {
  return (
    <div className="w-64  bg-white dark:bg-gray-800 h-screen gap-3 flex flex-col items-center py-10 px-8">
      <div className="mb-5">
        <Logo width={"150px"} />
      </div>
      <div className="w-full space-y-3">
        <SidebarItem
          text="Home"
          icon={<HiOutlineHome size={"20px"} />}
          link="/dashboard"
        />
        <SidebarItem
          text="Bookings"
          icon={<HiOutlineCalendarDays size={"20px"} />}
          link="/bookings"
        />
        <SidebarItem
          text="Cabins"
          icon={<HiOutlineHomeModern size={"20px"} />}
          link="/cabins"
        />

        <SidebarItem
          text="Users"
          icon={<HiOutlineUsers size={"20px"} />}
          link="/users"
        />

        <SidebarItem
          text="Settings"
          icon={<HiOutlineCog6Tooth size={"20px"} />}
          link="/settings"
        />
      </div>
    </div>
  );
}

export default Sidebar;
