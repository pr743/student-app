import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  School,
  Users,
} from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },

    {
      name: "Institutes",
      icon: <School size={20} />,
      path: "/admin/institutes",
    },

    {
      name: "Students",
      icon: <Users size={20} />,
      path: "/admin/students",
    },

    {
      name: "Results",
      icon: <FileText size={20} />,
      path: "/admin/results",
    },

    {
      name: "Published Results",
      icon: <GraduationCap size={20} />,
      path: "/admin/published-results",
    },
  ];
  return (
    <aside className="w-64 min-h-screen bg-gray-900   text-white  flex flex-col justify-between p-6  shadow-xl">
      <div>
        <h2 className="text-xl font-bold">Admin Panel</h2>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
            ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }}
        className="flex items-center gap-3 bg-red-600 px-4 py-3 rounded-xl hover:bg-red-700 transition  font-semibold"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
