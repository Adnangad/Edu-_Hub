import React, { useState } from "react";
import "../static/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const url = "http://127.0.0.1:8000/edu/login";
  const navigate = useNavigate();

  async function logIn(event) {
    event.preventDefault();
    const doc = {
      type: type,
      email: email,
      password: password,
    };
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
        alert(data.error);
      }
    } catch (error) {
      alert("Unable to login at this time, please try again later");
      return;
    }
  }
  return (
    <>
      <div className="loginSection">
        <h2>Edu Hub</h2>
        <h3>Welcome to Edu Hub</h3>
        <p>Please sign in to your account to continue</p>
        <form id="loginForm" onSubmit={logIn}>
          <input
            type="radio"
            id="students"
            name="usertype"
            value={"Students"}
            onChange={(e) => setType(e.target.value)}
          />
          <label htmlFor="students">Student</label>
          <br />
          <input
            type="radio"
            id="teachers"
            name="usertype"
            value={"Teachers"}
            onChange={(e) => setType(e.target.value)}
          />
          <label htmlFor="teachers">Teacher</label>
          <br />
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input_bar"
          />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input_bar"
          />
          <br />
          <button type="submit" className="subBut">
            Login
          </button>
          <p>
            <Link to="/signup" className="links">
              Or create a new account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
export default Login;
