import React, { useState } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link, useNavigate } from "react-router-dom";
import { apiDomain } from "../utilities/url";
import "react-notifications/lib/notifications.css";

function SignUpForm({ handleSignUp }) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    const number = e.target.value;

    // Validation: Only allow numeric characters
    if (!/^\d*$/.test(number)) {
      return;
    }

    setPhoneNumber(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      NotificationManager.warning("Please fill in all the fields.", "Warning");
      return;
    }

    if (password !== confirmPassword) {
      NotificationManager.warning(
        "Passwords do not match. Please try again.",
        "Warning"
      );
      return;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      NotificationManager.warning(
        "Please enter a valid 10-digit phone number.",
        "Warning"
      );
      return;
    }

    try {
      const response = await axios.post(`${apiDomain}/account/register`, {
        username,
        phoneNumber,
        password,
      });
      handleSignUp(username);
      console.log("response:", response);
      NotificationManager.success("Sign up successful.", "Success");
      navigate("/signin");
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.toString();
        if (errorMessage.includes("phone number or username already exists")) {
          NotificationManager.error(
            "Phone number or username already exists. Please try a different one.",
            "Error"
          );
        } else {
          NotificationManager.error(
            "Failed to sign up. Please try again.",
            "Error"
          );
        }
      } else {
        NotificationManager.error(
          "Failed to sign up. Please try again.",
          "Error"
        );
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-header mb-2">Sign Up</h2>
        <div className="form-control">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
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

        <div className="form-control">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary mt-1">
          Sign Up
        </button>
        <br />

        <p className="form-switch">
          Already have an account?
          <Link to="/signin">Sign in here.</Link>
        </p>

        <NotificationContainer />
      </form>
    </div>
  );
}

export default SignUpForm;
