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
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    try {
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
      return;
    }
  }
  return (
    <>
      <div className="loginSection">
        <h2>Welcome To Edu Hub</h2>
        <form className="loginForm" onSubmit={signup}>
          <h3>Sign Up</h3>
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
          {type === "Teachers" && (
            <input
              type="password"
              id="teachers"
              name="otp"
              placeholder="Enter OTP value"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}
          <label htmlFor="firstname">First name:</label>
          <br />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="input_bar"
          />
          <br />
          <label htmlFor="lastname">Last name:</label>
          <br />
          <input
            type="text"
            name="lastName"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className="input_bar"
          />
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
          <input
            type="text"
            name="subject"
            placeholder="Course to teach"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input_bar"
          />
          <button type="submit" className="subBut">
            SignUp
          </button>
        </form>
      </div>
    </>
  );
}
export default SignUp;
