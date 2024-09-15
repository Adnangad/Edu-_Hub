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

  // Function to set a meeting
  async function setMeet(event) {
    event.preventDefault();

    // Form validation
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
      <header className="logo">
        <h2>EDU HUB</h2>
      </header>
      <nav className="navBar">
        <ul className="navBarLinks">
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
        </ul>
      </nav>
      <main className="dashboardcont">
        {model === "Students" ? (
          <>
            <section className="schedule">
              <h3>Schedule</h3>
              <ul>
                {schedule.map((sched) => (
                  <li key={sched.id}>
                    {sched.course_name}:
                    <a href={sched.link}>Google meet link</a>
                    <p>Duration: {sched.duration} hrs</p>
                    <p>Date: {new Date(sched.time).toLocaleDateString()}</p>
                    <p>
                      Time:{" "}
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
          </>
        ) : (
          <section className="teachersContent">
            <div className="schedule">
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
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button type="submit">Schedule meeting</button>
              </form>
              <div className="teacherSchedule">
                <h3>Today's classes</h3>
                <ul>
                  {schedule.map((sched) => (
                    <li key={sched.id}>
                      {sched.course_name}:
                      <a href={sched.link}>Google meet link</a>
                      <p>Duration: {sched.duration} hrs</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
