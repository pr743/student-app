import { Bell, LayoutDashboard, UserCircle } from "lucide-react";
import React from "react";

function Header() {

  return (
    <>
      <header className="w-full bg-gray-900 text-white px-6 py-4  flex   items-center justify-between  shadow-md">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-blue-400" size={24} />
          <h1 className="text-xl font-semibold tracking-wide">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative hover:text-blue-400 transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-xl">
            <UserCircle size={22} className="text-gray-300" />
            <span className="text-sm font-medium">
              Admin
            </span>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
