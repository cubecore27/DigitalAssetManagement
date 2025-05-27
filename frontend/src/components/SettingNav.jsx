import { NavLink } from "react-router-dom";
import styles from "./SettingNav.module.css";

export default function SettingsNav() {
  const links = [
    { to: "/category", label: "Category" },
    { to: "/database", label: "Database" },
    { to: "/recommendation", label: "Recommendation" },
  ];

  return (
    <div className={styles.settingsNav}>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}