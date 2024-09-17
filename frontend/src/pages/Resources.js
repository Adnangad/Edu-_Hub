import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../static/Resources.css";

function Resources() {
  const modelType = sessionStorage.getItem("modelType");
  const token = sessionStorage.getItem("token");

  const getUrl = "http://127.0.0.1:8000/edu/getresource";

  const [link, setLink] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Please sign in to continue");
      navigate("");
    }

    async function getResources() {
      try {
        const response = await fetch(getUrl, {
          method: "GET",
          headers: { "Content-Type": "Application/json", "X-Token": token },
        });
        const data = await response.json();
        if (response.status === 200) {
          setLink(data.resources);
        }
        if (response.status === 401) {
          alert("Please sign in to continue");
          navigate("/");
        } else {
          console.error(data.error);
        }
      } catch (error) {
        alert(error);
      }
    }

    if (modelType === "Students") {
      getResources();
    }
  }, [token, modelType, navigate]);

  return (
    <>
      {modelType === "Teachers" ? (
        <p>Unauthorized</p>
      ) : (
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
            </ul>
          </nav>
          <div className="resourcedisplay">
            <p>The video or resource will be displayed here</p>
            <ul>
              {link.map((lnk) => (
                <li
                  key={lnk.id}
                  dangerouslySetInnerHTML={{ __html: lnk.link }}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Resources;
