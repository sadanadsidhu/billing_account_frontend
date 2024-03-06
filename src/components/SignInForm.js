import axios from "axios";
import React, { useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link, useNavigate } from "react-router-dom";
import { apiDomain } from "../utilities/url";
import "react-notifications/lib/notifications.css";

function SignInForm({ handleSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      NotificationManager.warning(
        "Please enter both username and password.",
        "Warning",
        2000
      );
      return;
    }

    try {
      const response = await axios.post(`${apiDomain}/account/login`, {
        username,
        password,
      });
      handleSignIn(username);
      console.log("response: ", response);
      NotificationManager.success("Login successful.", "Success");
      navigate("/transactions");
    } catch (error) {
      console.error("Login error:", error.response);
      if (error.response && error.response.status === 401) {
        NotificationManager.error(
          "Invalid username or password. Please try again.",
          "Error"
        );
      } else {
        NotificationManager.error(
          "Failed to sign in. Please try again.",
          "Error"
        );
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="mb-2 form-header">Sign In</h2>
        <div className="form-control">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary mt-1">
          Sign In
        </button>
        <br />

        <p className="form-switch">
          Don't have an account?
          <Link to="/signup">Sign up here.</Link>
        </p>
        <NotificationContainer />
      </form>
    </div>
  );
}

export default SignInForm;
