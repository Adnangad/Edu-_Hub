import React, { useState } from "react";
import "../static/SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [otp, setOtp] = useState("");
  const url = "http://127.0.0.1:8000/edu/signUp";
  const navigate = useNavigate();

  async function signup(event) {
    event.preventDefault();
    const doc = {
      first_name: firstname,
      last_name: lastname,
      type: type,
      otp: otp,
      email: email,
      subject: subject,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      const data = await response.json();
      if (response.status !== 200) {
        alert(data.error);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("modelType", type);
        sessionStorage.setItem("firstname", firstname);
        sessionStorage.setItem("lastname", lastname);
        sessionStorage.setItem("email", email);
        navigate("/dashboard", { state: { model: type, user: data } });
      }
    } catch (error) {
      alert("Unable to add you to the registry at the moment");
    }
  }

  return (
    <div id="signup-container">
      <header id="signup-header">
        <h1>Welcome to Edu Hub</h1>
      </header>
      <main id="signup-form-container">
        <form id="signup-form" onSubmit={signup}>
          <h2>Sign Up</h2>
          <div className="radio-group">
            <input
              type="radio"
              id="student-radio"
              name="usertype"
              value="Students"
              onChange={(e) => setType(e.target.value)}
            />
            <label htmlFor="student-radio">Student</label>
            <input
              type="radio"
              id="teacher-radio"
              name="usertype"
              value="Teachers"
              onChange={(e) => setType(e.target.value)}
            />
            <label htmlFor="teacher-radio">Teacher</label>
          </div>
          {type === "Teachers" && (
            <div className="additional-info">
              <label htmlFor="otp-input">Enter OTP:</label>
              <input
                type="text"
                id="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field"
              />
              <label htmlFor="subject-input">Course to Teach:</label>
              <input
                type="text"
                id="subject-input"
                placeholder="Course to teach"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
              />
            </div>
          )}
          <label htmlFor="firstname-input">First Name:</label>
          <input
            type="text"
            id="firstname-input"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
          />
          <label htmlFor="lastname-input">Last Name:</label>
          <input
            type="text"
            id="lastname-input"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
          />
          <label htmlFor="email-input">Email:</label>
          <input
            type="email"
            id="email-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <label htmlFor="password-input">Password:</label>
          <input
            type="password"
            id="password-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" id="signup-button">
            Sign Up
          </button>
        </form>
      </main>
    </div>
  );
}

export default SignUp;
