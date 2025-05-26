// SettingsNav.jsx
import { NavLink } from "react-router-dom";

export default function SettingsNav() {
  return (
    <nav className="flex gap-4 p-4 border-b bg-gray-100">
      <NavLink
        to="/category"
        className={({ isActive }) =>
          isActive ? "font-semibold text-blue-600" : "text-gray-600"
        }
      >
        Category
      </NavLink>
      <NavLink
        to="/database"
        className={({ isActive }) =>
          isActive ? "font-semibold text-blue-600" : "text-gray-600"
        }
      >
        Database
      </NavLink>
      <NavLink
        to="/recommendation"
        className={({ isActive }) =>
          isActive ? "font-semibold text-blue-600" : "text-gray-600"
        }
      >
        Recommendation
      </NavLink>
    </nav>
  );
}
