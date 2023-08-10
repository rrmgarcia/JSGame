import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../module-styles/SignInPage-style.module.css";

const SignInPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ username: "", password: "" });
  const [usernameError, setUsernameError] = useState("false");
  const [passwordError, setPasswordError] = useState("false");

  const handleChange = (event) => {
    switch (event.target.id) {
      case "username":
        const username = event.target.value;
        setUserData({ ...userData, username: username });
        if (username.length === 0 && !usernameError) {
          setUsernameError(true);
        } else if (usernameError) {
          setUsernameError(false);
        }
        break;
      case "password":
        const password = event.target.value;
        setUserData({ ...userData, password: password });
        if (password.length === 0 && !passwordError) {
          setPasswordError(true);
        } else if (passwordError) {
          setPasswordError(false);
        }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userData.username || !userData.password) {
      setUsernameError(true);
      setPasswordError(true);
    } else {
      setTimeout(() => {
        navigate("/mainpage/.../home");
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} id={styles.registrationContainer}>
        <h3>Please sign-in below</h3>
        <label>Username:</label>
        <input
          type="text"
          id="username"
          onChange={handleChange}
        ></input>
        {usernameError ? (
          <div className={styles.errorMsg}>Please enter valid username.</div>
        ) : null}
        <label>Password:</label>
        <input
          type="password"
          id="password"
          onChange={handleChange}
        ></input>
        {passwordError ? (
          <div className={styles.errorMsg}>Please enter valid password.</div>
        ) : null}
        <input type="submit" value={"Sign-in"} className={styles.button}></input>
      </form>
    </div>
  );
};

export default SignInPage;
