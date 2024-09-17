import React, { useEffect, useState } from "react";
import "../static/Chat.css";
import Pusher from "pusher-js";
import { Link } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    Pusher.logToConsole = true;
    const secret_key = process.env.REACT_APP_API_KEY;
    const cluster = process.env.REACT_APP_CLUSTER

    const pusher = new Pusher(secret_key, {
      cluster: cluster,
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return; // Avoid sending empty messages

    await fetch("http://localhost:8000/edu/chatRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": token,
      },
      body: JSON.stringify({ message }),
    });

    setMessage("");
  };

  useEffect(() => {
    console.log("Messages updated:", messages); // Debug log
  }, [messages]);

  return (
    <div id="chat-page">
      <header className="chat-header">
        <h1>EDU HUB</h1>
      </header>
      <nav className="chat-nav">
        <ul className="chat-nav-links">
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
      <div className="chat-container">
        <div className="chat-room">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <div className="chat-message-header">
                  <span className="chat-username">{msg.username}</span>
                </div>
                <p className="chat-message-body">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="chat-form" onSubmit={submit}>
          <input
            className="chat-input"
            placeholder="Write a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
export default Chat;