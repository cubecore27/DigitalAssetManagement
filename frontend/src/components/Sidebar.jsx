import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.title}>Navigation</h2>
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
            end
          >
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
              </svg>
            </span>
            <span className={styles.label}>Inspire</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/asset"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 4v16h18V4H3zm16 14H5V6h14v12z" />
              </svg>
            </span>
            <span className={styles.label}>Asset</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </span>
            <span className={styles.label}>Create</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h2v-2H3v2zm4 0h14v-2H7v2z" />
              </svg>
            </span>
            <span className={styles.label}>Category Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
