import React, { useState, useContext } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext"; // 👈 import AuthContext
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();
  const { login } = useContext(AuthContext); // 👈 use login from context

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/login", form);

      // 👇 instead of only localStorage, also update context
      login(r.data.user, r.data.token);

      setMsg("Login success");

      // redirect by role
      if (r.data.user.role === "admin") nav("/admin");
      else if (r.data.user.role === "store_owner") nav("/owner");
      else nav("/stores");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {msg && (
          <div
            className={`message ${
              msg.includes("success") ? "success" : "error"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}
