import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../static/Dashboard.css";

function Dashboard() {
  const token = sessionStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const url = "http://127.0.0.1:8000/edu/getCourses";
  const setUrl = "http://127.0.0.1:8000/edu/setmeeting";
  const getUrl = "http://127.0.0.1:8000/edu/getmeeting";
  const model = sessionStorage.getItem("modelType");

  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("");
  const [link, setLink] = useState("");

  const [type, setType] = useState("");
  const [resLink, setResLink] = useState("");
  const setresoueceUrl = "http://127.0.0.1:8000/edu/setresource";

  async function setResources(event) {
    event.preventDefault();
    const bod = {
      type: type,
      link: resLink,
    };

    try {
      const response = await fetch(setresoueceUrl, {
        method: "POST",
        headers: { "Content-Type": "Application/json", "X-Token": token },
        body: JSON.stringify(bod),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Success");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert(error);
    }
  }

  async function setMeet(event) {
    event.preventDefault();

    if (!duration || !date || !course || !link) {
      alert("Please fill in all fields before scheduling a meeting.");
      return;
    }

    const body = { duration, date, course, link };
    try {
      const response = await fetch(setUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Success");
      } else {
        alert(data.error || "Error setting meeting");
      }
    } catch (err) {
      alert("Failed to schedule the meeting. Please try again.");
    }
  }

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch courses.");
        }
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      }
    }

    async function getSchedule() {
      try {
        const response = await fetch(getUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSchedule(data.schedule);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch schedule.");
        }
      } catch (err) {
        setError("Failed to fetch schedule. Please try again later.");
      }
    }

    if (model === "Students") {
      getCourses();
    }
    getSchedule();
  }, [token, model]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  console.log(`Schedule is ${JSON.stringify(schedule)}`);

  return (
    <div className="dashboard">
      {model === "Students" ? (
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
                  <Link to="/projects">Projects</Link>
                </li>
                <li>
                  <Link to="/resources">Resources</Link>
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
            <div className="stddashCont">
              <section className="schedule">
                <h3>Schedule</h3>
                <ul>
                  {schedule.map((sched) => (
                    <li key={sched.id}>
                      {sched.course_name}:
                      <a href={sched.link}>Google meet link</a>
                      <p>
                        Duration: {sched.duration} hrs Date:{" "}
                        {new Date(sched.time).toLocaleDateString()} Time:{" "}
                        {new Date(sched.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="scores">
                <h3>Scores</h3>
                <ul>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <li key={course.id}>
                        {course.name}: {course.score}
                      </li>
                    ))
                  ) : (
                    <li>No courses available.</li>
                  )}
                </ul>
              </section>
              <section className="registered">
                <h3>Registered Courses</h3>
                <ul>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <li key={course.id}>{course.name}</li>
                    ))
                  ) : (
                    <li>You are yet to register for a course.</li>
                  )}
                </ul>
              </section>
            </div>
          </div>
        </>
      ) : (
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
          <div className="teachcont">
            <section className="schedule">
              <h3>Schedule a class</h3>
              <form onSubmit={setMeet}>
                <input
                  type="text"
                  placeholder="Please enter the course name"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Please enter the link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Duration of meeting"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button type="submit">Schedule meeting</button>
              </form>
            </section>
            <section className="teacherSchedule">
              <h3>Your Schedule</h3>
              <ul>
                {schedule.map((sched) => (
                  <li key={sched.id}>
                    {sched.course_name}:
                    <a href={sched.link}>Google meet link</a>
                    <p>
                      Duration: {sched.duration} hrs Date:{" "}
                      {new Date(sched.time).toLocaleDateString()} Time:{" "}
                      {new Date(sched.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="resourceForm">
              <h3>Resource for students</h3>
              <form onSubmit={setResources}>
                <label htmlFor="typeoflink">Type of link:</label>
                <input
                  type="radio"
                  name="linkType"
                  value="Youtube_Video"
                  onChange={(e) => setType(e.target.value)}
                />{" "}
                YouTube Video
                <input
                  type="radio"
                  name="linkType"
                  value="file_link"
                  onChange={(e) => setType(e.target.value)}
                />{" "}
                File Link
                <label htmlFor="videoUrl">Link:</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  placeholder="Enter video URL or embed code"
                  value={resLink}
                  onChange={(e) => setResLink(e.target.value)}
                />
                <button type="submit">Embed Video</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
