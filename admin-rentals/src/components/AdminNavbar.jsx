import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react"; // hamburger-react
import { slide as Menu } from "react-burger-menu"; // react-burger-menu
import { setTheme, getTheme } from "../utils/themeUtils";
// import "react-burger-menu/lib/menus/slide.css";
import axios from "axios";

function AdminNavbar() {
  const navigate = useNavigate();

  // Local state for mobile menu and theme
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(getTheme());

  const handleToggleTheme = () => {
    const newTheme = selectedTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme); // Store theme
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setSelectedTheme(storedTheme);
    setTheme(storedTheme);
  }, []);

  // Logout function (calls backend and then navigates to login)
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5007/api/admin/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };

  // Choose hamburger color based on theme
  const burgerColor = selectedTheme === "dark" ? "#fff" : "#000";

  // react-burger-menu custom styling for mobile view
  const menuStyles = {
    bmBurgerButton: {
      display: "block", 
      position: "fixed",
      width: "30px",
      height: "30px",
      left: "20px",
      top: "20px",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      background: selectedTheme === "dark" ? "#333" : "#fff",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmItemList: {
      color: selectedTheme === "dark" ? "#fff" : "#000",
      padding: "0.8em",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar bg-base-200 px-4 shadow-sm">
        {/* Mobile: hamburger + brand on left */}
        <div className="navbar-start md:hidden flex items-center">
          <Hamburger
            toggled={isMenuOpen}
            toggle={setIsMenuOpen}
            color={burgerColor}
          />
          <span className="ml-2 font-bold text-xl">Admin Dashboard</span>
        </div>
        {/* Mobile: Right side theme toggle */}
        <div className="navbar-end md:hidden">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              onChange={handleToggleTheme}
              value="dark"
            />
            {/* Sun icon (light mode) */}
            <svg
              className="swap-off h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            {/* Moon icon (dark mode) */}
            <svg
              className="swap-on h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
            </svg>
          </label>
        </div>

        {/* Desktop: Left side brand */}
        <div className="navbar-start hidden md:flex">
          <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
            Admin Dashboard
          </Link>
        </div>

        {/* Desktop: Center nav links */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link className="font-semibold mt-3" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="font-semibold mt-3" to="/bookings">
                Bookings
              </Link>
            </li>
            <li>
              <Link className="font-semibold mt-3" to="/users">
                Users
              </Link>
            </li>
          </ul>
        </div>

        {/* Desktop: Right side: Theme toggle and Logout */}
        <div className="navbar-end hidden md:flex items-center gap-4">
          <label className="swap swap-rotate">
            {/* Hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              onChange={handleToggleTheme}
              value-="dark"
            />
            {/* Sun icon (shown when checkbox is off = light mode) */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            {/* Moon icon (shown when checkbox is on = dark mode) */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
            </svg>
          </label>
          <button onClick={handleLogout} className="btn btn-error">
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Out Menu (react-burger-menu) */}
      <Menu
        isOpen={isMenuOpen}
        onStateChange={(state) => setIsMenuOpen(state.isOpen)}
        styles={menuStyles}
      >
        <h1 className="font-extrabold mb-5">Admin Menu</h1>
        <Link
          onClick={() => setIsMenuOpen(false)}
          to="/dashboard"
          className="link link-hover block p-2 rounded"
        >
          Dashboard
        </Link>
        <Link
          onClick={() => setIsMenuOpen(false)}
          to="/bookings"
          className="link link-hover block p-2 rounded"
        >
          Bookings
        </Link>
        <Link
          onClick={() => setIsMenuOpen(false)}
          to="/users"
          className="link link-hover block p-2 rounded"
        >
          Users
        </Link>
        <button onClick={handleLogout} className="btn btn-error mt-4 w-full">
          Logout
        </button>
      </Menu>
    </>
  );
}

export default AdminNavbar;
