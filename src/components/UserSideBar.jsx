import React from "react";
import { NavLink } from "react-router-dom";
import { User, Settings, LayoutDashboard } from "lucide-react";

export default function UserSidebar() {
    const links = [
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { to: "/dashboard/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        { to: "/dashboard/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="w-64 bg-white shadow-xl rounded-xl p-6 space-y-4 h-full">
            { links.map((l) => (
                <NavLink
                    key={ l.to }
                    to={ l.to }
                    className={ ({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    { l.icon }
                    { l.label }
                </NavLink>
            )) }
        </div>
    );
}
