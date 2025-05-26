import { NavLink } from "react-router-dom";
import styles from "./SettingNav.module.css";

export default function SettingsNav() {
  return (
    <div className={styles.nav}>
            <NavLink
        to="/category"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        Category
      </NavLink>
      <NavLink
        to="/database"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        Database
      </NavLink>
      <NavLink
        to="/recommendation"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        Recommendation
      </NavLink>
    </div>
  );
}
