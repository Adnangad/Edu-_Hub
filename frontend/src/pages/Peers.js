import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../static/Peers.css";

function Peers() {
  const token = sessionStorage.getItem("token");
  const model = sessionStorage.getItem("modelType");
  const [students, setStudents] = useState([]);
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  const stdUrl = "http://127.0.0.1:8000/edu/getStudents";

  useEffect(() => {
    if (!token) {
      alert("Please sign back in to continue");
      navigate("");
    }
    async function getStudents() {
      try {
        const response = await fetch(stdUrl, {
          method: "GET",
          headers: { "Content-Type": "Application/json", "X-Token": token },
        });
        const data = await response.json();
        if (response.status === 200) {
          setStudents(data.Students);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error);
      }
    }
    getStudents();
  }, [token, navigate]);

  if (model === "Students") {
    return (
      <>
        <div className="stdcont">
          <header className="logo">
            <h2>EDU HUB</h2>
          </header>
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
          {!errorMessage ? (
            <div className="students">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>
                        <a href={`mailto:${student.email}`}>{student.email}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{errorMessage}</p>
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="teachersContent">
          <header className="logo">
            <h2>EDU HUB</h2>
          </header>
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
                <Link to="/peers">Students</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </nav>
          {!errorMessage ? (
            <div className="students">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{errorMessage}</p>
          )}
        </div>
      </>
    );
  }
}

export default Peers;
