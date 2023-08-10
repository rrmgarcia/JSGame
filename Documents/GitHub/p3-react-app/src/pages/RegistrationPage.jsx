import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../module-styles/SignInPage-style.module.css";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passDoesNotMatchError, setpassDoesNotMatchError] = useState(false);
  const [requireFields, setRequiredFields] = useState(false);

  const handleChange = (event) => {
    switch (event.target.id) {
      case "email":
        const email = event.target.value;
        setUserData({ ...userData, email: email });
        if (email.length === 0 && !emailError) {
          setEmailError(true);
        } else if (usernameError) {
          setEmailError(false);
        }
        break;
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
        break;
      case "confirmPassword":
        const confirmPassword = event.target.value;
        setUserData({ ...userData, confirmPassword: confirmPassword });
        if (confirmPassword.length === 0 && !confirmPasswordError) {
          setConfirmPasswordError(true);
        } else if (passwordError) {
          setConfirmPasswordError(false);
        }
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !userData.email ||
      !userData.username ||
      !userData.password ||
      !userData.confirmPassword
    ) {
      setRequiredFields(true);
    } else if (userData.password !== userData.confirmPassword) {
      setpassDoesNotMatchError(true);
    } else {
      setRequiredFields(false);
      setpassDoesNotMatchError(false);
      setTimeout(() => {
        alert("Congratulations! You are now registered!");
      }, 500);
      setTimeout(() => {
        navigate("/sign-in");
      }, 1000);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} id={styles.registrationContainer}>
        <h3>Please register below.</h3>
          <label>Email Address:</label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
          ></input>
        {emailError ? <div className={styles.errorMsg}>Please enter valid email.</div> : null}
          <label>Username:</label>
          <input
            type="text"
            id="username"
            value={userData.username}
            onChange={handleChange}
          ></input>
        {usernameError ? <div className={styles.errorMsg}>Username cannot be blank.</div> : null}
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={userData.password}
            onChange={handleChange}
          ></input>
        {passwordError ? <div className={styles.errorMsg}>Password cannot be blank.</div> : null}
          <label>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          ></input>
        {confirmPasswordError ? <div className={styles.errorMsg}>Password cannot be blank.</div> : null}
        {passDoesNotMatchError ? <div className={styles.errorMsg}>Passwords do not match.</div> : null}
        {requireFields ? (
          <div className={styles.errorMsg}>There are fields that require your attention.</div>
        ) : null}
        <div>
          <input type="submit" value={"Proceed"} className={styles.button}></input>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
