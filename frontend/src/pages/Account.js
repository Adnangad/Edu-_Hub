import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../static/Account.css";
import { Link } from "react-router-dom";

function Account() {
  const token = sessionStorage.getItem("token");
  const model = sessionStorage.getItem("modelType");
  const firstname = sessionStorage.getItem("firstname");
  const lastname = sessionStorage.getItem("lastname");
  const email = sessionStorage.getItem("email");
  const old_password = sessionStorage.getItem("old_password");
  console.log(firstname, lastname, email, old_password);
  const navigate = useNavigate();

  const [registeredCourses, setRegistered] = useState([]);
  const [offered, setOffered] = useState([]);
  const [firstName, setFirstName] = useState("" || firstname);
  const [lastName, setLastName] = useState("" || lastname);
  const [password, setPassword] = useState("" || old_password);

  const regurl = "http://127.0.0.1:8000/edu/registerCourse";
  const deregurl = "http://127.0.0.1:8000/edu/deregister";
  const availableUrl = "http://127.0.0.1:8000/edu/offered";
  const url = "http://127.0.0.1:8000/edu/getCourses";
  const updateurl = "http://127.0.0.1:8000/edu/update_account";

  useEffect(() => {
    if (!token) {
      alert("The session expired,please sign in again");
      navigate("/");
    }
    async function getCourses() {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "Application/json", "X-Token": token },
        });
        const data = await response.json();
        if (response.status === 200) {
          setRegistered(data);
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert(
          "Unable to fetch your registered subjects, please try again later"
        );
      }
    }
    async function getavailable() {
      const response = await fetch(availableUrl, {
        method: "GET",
        headers: { "Content-Type": "Application/json", "X-Token": token },
      });
      const data = await response.json();
      if (response.status !== 200) {
        alert(data.error);
      }
      if (response.status === 401) {
        alert("Please sign in to continue");
        navigate("/");
      } else {
        setOffered(data["Courses"]);
      }
    }
    if (model === "Students") {
      getavailable();
      getCourses();
    }
  }, [token, model, navigate]);
  async function regCourse(event, courseName) {
    event.preventDefault();
    try {
      const response = await fetch(regurl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Token": token },
        body: JSON.stringify({ course: courseName }),
      });

      if (response.status !== 200) {
        alert("Unable to register the subject, try again later");
      } else {
        const updatedRegistered = [
          ...registeredCourses,
          { id: registeredCourses.length + 1, name: courseName },
        ];
        setRegistered(updatedRegistered);
        setOffered(offered.filter((name) => name !== courseName));
      }
    } catch (error) {
      alert("Failed to register the course. Please try again later.");
    }
  }
  async function deregister(event, jina) {
    event.preventDefault();
    try {
      const response = await fetch(deregurl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Token": token },
        body: JSON.stringify({ course: jina }),
      });

      if (response.status === 200) {
        const data = await response.json();
        alert(data.message);
        const updatedRegistered = registeredCourses.filter(
          (course) => course.name !== jina
        );
        setRegistered(updatedRegistered);
        setOffered(offered.filter((name) => name !== jina));
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to deregister the course. Please try again later.");
    }
  }
  async function updateAccount(event) {
    event.preventDefault();
    const response = await fetch(updateurl, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Token": token },
      body: JSON.stringify({
        type: model,
        first_name: firstName,
        last_name: lastName,
        password: password,
        old_password: old_password,
        email: email,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("old_password", password);
      localStorage.setItem("firstname", firstName);
      localStorage.setItem("lastname", lastName);
    } else {
      console(data.error);
    }
  }
  if (model === "Students") {
    return (
      <>
        <div className="stdcont">
          <div className="logo">
            <h2>EDU HUB</h2>
          </div>
          <nav className="navBar">
            <ul className="navBarLinks">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/peers">Peers</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
            </ul>
          </nav>
          <div className="accountcont">
            <div className="details">
              <h3>Update Account</h3>
              <form id="updateForm" onSubmit={updateAccount}>
                <label htmlFor="updf_name">First Name:</label>
                <input
                  type="text"
                  id="updf_name"
                  name="name"
                  placeholder="Enter Your First Name"
                  className="update_bar"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <label htmlFor="updl_name">Last Name:</label>
                <input
                  type="text"
                  id="updl_name"
                  name="name"
                  placeholder="Enter Your Last Name"
                  className="update_bar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <label htmlFor="uppassword">Password:</label>
                <input
                  type="password"
                  id="uppassword"
                  name="password"
                  placeholder="Enter Password"
                  className="update_bar"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit" className="updatebut">
                  Update Account
                </button>
              </form>
            </div>
            <div className="info">
              <h3>Account Details</h3>
              <p>First Name: {firstName}</p>
              <p>Last Name: {lastName}</p>
              <p>Email: {email}</p>
            </div>
            <div className="offered">
              <h3>Available Courses</h3>
              <ul>
                {offered.map((item, index) => (
                  <li key={index}>
                    {item}
                    <span className="spacer"></span>
                    <button
                      onClick={(event) => regCourse(event, item)}
                      className="regBut"
                    >
                      Register
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="registered">
              <h3>Registered Courses</h3>
              {registeredCourses.length === 0 && <p>No registered courses</p>}
              <ul>
                {registeredCourses.map((course) => (
                  <li key={course.id || course.name}>
                    {course.name}
                    <span className="spacer"></span>
                    <button
                      onClick={(event) => deregister(event, course.name)}
                      className="unregBut"
                    >
                      Unregister
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="teachersContent">
          <div className="logo">
            <h2>EDU HUB</h2>
          </div>
          <nav className="navBar">
            <ul className="navBarLinks">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/peers">Students</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
            </ul>
          </nav>
          <div className="accountcont">
            <div className="details">
              <h3>Update Details</h3>
              <form id="updateForm" onSubmit={updateAccount}>
                <label htmlFor="updf_name">First Name:</label>
                <input
                  type="text"
                  id="updf_name"
                  name="name"
                  placeholder="Enter Your First Name"
                  className="update_bar"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <label htmlFor="updl_name">Last Name:</label>
                <input
                  type="text"
                  id="updl_name"
                  name="name"
                  placeholder="Enter Your Last Name"
                  className="update_bar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <label htmlFor="uppassword">Password:</label>
                <input
                  type="password"
                  id="uppassword"
                  name="password"
                  placeholder="Enter Password"
                  className="update_bar"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit" className="updatebut">
                  Update Account
                </button>
              </form>
            </div>
            <div className="info">
              <h3>Account Details</h3>
              <p>First Name: {firstName}</p>
              <p>Last Name: {lastName}</p>
              <p>Email: {email}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Account;
