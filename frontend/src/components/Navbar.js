import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <h2 className="logo">⭐ RatingApp</h2>
      <div className="nav-links">
        <Link to="/stores">Stores</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/owner">Owner</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className="nav-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
