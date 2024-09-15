import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../static/Projects.css";

function Projects() {
  const token = sessionStorage.getItem("token");
  const model = sessionStorage.getItem("modelType");
  const [registeredCourses, setRegistered] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [ungraded, setUngraded] = useState([]);

  const regurl = "http://127.0.0.1:8000/edu/getCourses";
  const taskUrl = "http://127.0.0.1:8000/edu/getTasks";
  const submitUrl = "http://127.0.0.1:8000/edu/submitproject";

  const ungrad = "http://127.0.0.1:8000/edu/get_projects";
  const createUrl = "http://127.0.0.1:8000/edu/upload";

  const gradeurl = "http://127.0.0.1:8000/edu/gradeproject";

  const [assignment, setAssignment] = useState(null);
  const [dueDate, setDueDate] = useState("");

  const [score, setScore] = useState(0);
  const [gradeFile, setGradeFile] = useState(null);

  const [file, setFile] = useState(null);
  const [submitedproject, setSubmited] = useState(null);

  const [graded_id, setGradedId] = useState("");

  async function getFile(event) {
    setFile(event.target.files[0]);
  }
  async function getanswFile(event) {
    setGradeFile(event.target.files[0]);
  }
  async function submitProject(event, project_id, courseName) {
    event.preventDefault();
    if (!file) {
      alert("No file selected");
      return;
    }
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("course", courseName);
    formdata.append("project_id", project_id);
    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "X-Token": token },
        body: formdata,
      });
      const data = await response.json();
      if (response.status === 200) {
        setSubmited(project_id);
      } else {
        alert(data.error);
        return;
      }
    } catch (error) {
      alert("Unable to submit project");
      return;
    }
  }
  const getAssignment = (event) => {
    setAssignment(event.target.files[0]);
  };
  async function createAssignment(event) {
    event.preventDefault();
    if (!assignment) {
      alert("No file selected");
      return;
    }

    const formd = new FormData();
    formd.append("file", assignment);
    formd.append("due", dueDate);
    try {
      const response = await fetch(createUrl, {
        method: "POST",
        headers: { "X-Token": token },
        body: formd,
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Successfully created an assignment");
        return;
      } else {
        alert(data.error);
        return;
      }
    } catch (error) {
      alert("Unable to create an assignment, try again later");
      return;
    }
  }

  async function gradeStudent(event, std_id, project_id) {
    event.preventDefault();
    if (!gradeFile) {
      alert("No file selected");
      return;
    }
    const gradefil = new FormData();
    gradefil.append("file", gradeFile);
    gradefil.append("student_id", std_id);
    gradefil.append("project_id", project_id);
    gradefil.append("score", score);
    try {
      console.log("start");

      const response = await fetch(gradeurl, {
        method: "POST",
        headers: { "X-Token": token },
        body: gradefil,
      });
      const data = await response.json();
      if (response.status === 200) {
        setGradedId(project_id);
      } else {
        alert(data.error);
        return;
      }
    } catch (error) {
      alert(`Error: ${error}`);
      return;
    }
  }

  useEffect(() => {
    if (!token) {
      alert("Please sign back in to continue");
      navigate("");
    }

    async function fetchData(url, setter) {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "Application/json", "X-Token": token },
      });
      const data = await response.json();
      if (response.status === 200) {
        setter(data.projects || data);
      } else {
        alert(data.error);
      }
    }

    async function getUngraded() {
      try {
        const response = await fetch(ungrad, {
          method: "GET",
          headers: { "Content-Type": "Application/json", "X-Token": token },
        });
        const data = await response.json();
        if (response.status === 200) {
          setUngraded(data.ungraded_projects);
        } else {
          alert(data.error);
          return;
        }
      } catch (error) {
        alert("Unable to fetch projects for grading");
        return;
      }
    }

    if (model === "Students") {
      fetchData(regurl, setRegistered);
      fetchData(taskUrl, setProjects);
    } else {
      getUngraded();
    }
  }, [token, navigate, model]);
  console.log(`unngraded projects is ${ungraded}`);
  if (model === "Students") {
    return (
      <>
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
              <Link to="/peers">Peers</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </nav>
        <main className="content">
          <section className="course-section">
            <h3>Registered Courses</h3>
            {registeredCourses.length === 0 ? (
              <p>No registered courses</p>
            ) : (
              <ul className="courseList">
                {registeredCourses.map((course) => (
                  <li key={course.id || course.name} className="courseItem">
                    {course.name}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="projects-section">
            <h3>Projects</h3>
            {projects.length === 0 ? (
              <p>No projects available</p>
            ) : (
              <ul className="projectList">
                {projects.map((project) => (
                  <li key={project.task_id} className="projectItem">
                    <div className="projectDetails">
                      <span>{project.course}</span>
                      <a href={project.download_url} download>
                        Download {project.course} Task
                      </a>
                      <p>
                        Due on: {new Date(project.due_on).toLocaleDateString()}
                      </p>
                    </div>
                    {submitedproject === project.task_id ? (
                      <p className="status">Done</p>
                    ) : (
                      <form
                        onSubmit={(event) =>
                          submitProject(event, project.task_id, project.course)
                        }
                        className="submitForm"
                      >
                        <input
                          type="file"
                          onChange={getFile}
                          className="fileInput"
                        />
                        <button type="submit" className="submitButton">
                          Submit Project
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </>
    );
  } else {
    return (
      <>
        {" "}
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
              <Link to="/peers">Peers</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </nav>
        <main className="content">
          <section className="projects-section">
            <h3>Create an assignment</h3>
            <form onSubmit={createAssignment}>
              <input type="file" onChange={getAssignment} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="year-month-day"
              />
              <button type="submit">Upload File</button>
            </form>
          </section>
          <section className="projects-section">
            <h3>Ungraded Projects</h3>
            {ungraded.length === 0 ? (
              <p>No projects available</p>
            ) : (
              <ul className="projectList">
                {ungraded.map((project, index) => (
                  <li key={index} className="projectItem">
                    <div className="projectDetails">
                      <span>{project.course}</span>
                      <a href={project.download_url} download>
                        Download {project.course} Task
                      </a>
                      <p>Student Id: {project.students_id}</p>
                    </div>
                    {graded_id === project.task_id ? (
                      <p>You have graded student {project.students_id}</p>
                    ) : (
                      <form
                        onSubmit={(event) =>
                          gradeStudent(
                            event,
                            project.students_id,
                            project.task_id
                          )
                        }
                        className="submitForm"
                      >
                        <input
                          type="file"
                          onChange={getanswFile}
                          className="fileInput"
                        />
                        <input
                          type="number"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                        ></input>
                        <button type="submit" className="submitButton">
                          Grade Student
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </>
    );
  }
}

export default Projects;
