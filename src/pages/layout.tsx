/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GkNjwEC
 */
import { NavLink, Outlet } from "react-router-dom";
import { LuHome, LuSquareStack } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";

import { cn } from "~/lib/utils";

export default function RootLayout() {
  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen w-56 bg-gray-100 text-gray-800 p-4">
        <div className="flex items-center mb-4 space-x-1">
          <img
            alt="Company Logo"
            height="30"
            src="/tauri.svg"
            style={{
              aspectRatio: "30/30",
              objectFit: "cover",
            }}
            width="30"
          />
          <h1 className="text-lg font-medium">Management</h1>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "w-full flex items-center space-x-2 hover:bg-gray-200 py-2 px-2 rounded-lg text-gray-500",
                isActive && "bg-gray-300 text-gray-800"
              )
            }
          >
            <LuHome className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </NavLink>
          <NavLink
            to="students"
            className={({ isActive }) =>
              cn(
                "w-full flex items-center space-x-2 hover:bg-gray-200 py-2 px-2 rounded-lg text-gray-500",
                isActive && "bg-gray-300 text-gray-800"
              )
            }
          >
            <GrGroup className="w-4 h-4" />
            <span className="text-sm font-medium">Students</span>
          </NavLink>
          <NavLink
            to="classes"
            className={({ isActive }) =>
              cn(
                "w-full flex items-center space-x-2 hover:bg-gray-200 py-2 px-2 rounded-lg text-gray-500",
                isActive && "bg-gray-300 text-gray-800"
              )
            }
          >
            <SiGoogleclassroom className="w-4 h-4" />
            <span className="text-sm font-medium">Classes</span>
          </NavLink>
          <NavLink
            to="batches"
            className={({ isActive }) =>
              cn(
                "w-full flex items-center space-x-2 hover:bg-gray-200 py-2 px-2 rounded-lg text-gray-500",
                isActive && "bg-gray-300 text-gray-800"
              )
            }
          >
            <LuSquareStack className="w-4 h-4" />
            <span className="text-sm font-medium">Batches</span>
          </NavLink>
        </nav>
      </aside>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
