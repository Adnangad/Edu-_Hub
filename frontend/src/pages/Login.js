import React, { useState } from "react";
import "../static/Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [type, setType] = useState("Students");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state
  const url = "http://127.0.0.1:8000/edu/login";
  const navigate = useNavigate();

  async function logIn(event) {
    event.preventDefault();
    setLoading(true);
    
    if (!email || !password || !type) {
      alert("Please fill out all fields");
      setLoading(false);
      return;
    }

    const doc = { type, email, password };
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      const data = await response.json();
      
      if (response.status === 200) {
        navigate("/dashboard", { state: { user: data.user, model: type } });
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("modelType", type);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("old_password", password);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Unable to login at this time, please try again later.");
    }
    setLoading(false);
  }

  return (
    <div id="login-container">
      <header id="login-header">
        <h1>Edu Hub</h1>
        <h2>Welcome Back</h2>
        <p id="login-intro">Please sign in to continue</p>
      </header>
      <main id="login-form-container">
        <form id="login-form" onSubmit={logIn}>
          <div className="radio-group">
            <label htmlFor="usertype">Type of user:</label>
            <select name="usertype" id="usertype" onChange={(e) => setType(e.target.value)}>
              <option value="Students">Student</option>
              <option value="Teachers">Teacher</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="email-input">Email:</label>
            <input
              type="email"
              id="email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password-input">Password:</label>
            <input
              type="password"
              id="password-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" id="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p id="signup-link">
            <Link to="/signup">Or create a new account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;