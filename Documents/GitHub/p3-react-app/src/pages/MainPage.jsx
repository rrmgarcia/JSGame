import { Link, Outlet } from "react-router-dom";
import styles from "../module-styles/MainPage-style.module.css"

const MainPage = () => {
  return (
    <div>
      <div id={styles.nav}>
        <h2>Task24</h2>
        <nav>
          <ul id={styles.navUL}>
            <li className={styles.navLi}>
              <Link to={".../home"}>Home</Link>
            </li>
            <li className={styles.navLi}>
              <Link to={".../planner"}>Planner</Link>
            </li>
            <li className={styles.navLi}>About</li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default MainPage;
