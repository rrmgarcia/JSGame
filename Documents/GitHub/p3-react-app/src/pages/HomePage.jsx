import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../module-styles/Homepage-style.module.css"

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div id={ styles.homeContainer}>
        <h2>Welcome to Task24!</h2>
        <p>
          Task24 is a simple todo app created to help you plan and achieve your
          tasks for the day.
        </p>
        <h3>Stay on track, one task at a time!</h3>
        <button
          onClick={() => {
            navigate("/mainpage/.../planner");
          }}
        >
          Click here to Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
