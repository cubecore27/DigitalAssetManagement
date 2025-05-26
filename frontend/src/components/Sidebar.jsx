// Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="w-64 h-full bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        <li>
          <NavLink to="/" className="hover:text-gray-300" end>
            Inspire
          </NavLink>
        </li>
        <li>
          <NavLink to="/asset" className="hover:text-gray-300">
            Asset
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" className="hover:text-gray-300">
            Create
          </NavLink>
        </li>
        <li>
          <NavLink to="/category" className="hover:text-gray-300">
            Category Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
