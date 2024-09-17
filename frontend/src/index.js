import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import File from "./pages/File";
import Account from "./pages/Account";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Peers from "./pages/Peers";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/files",
    element: <File />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/resources",
    element: <Resources/>,
  },
  {
    path: "/peers",
    element: <Peers/>,
  },
  {
    path: "/chat",
    element: <Chat/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();