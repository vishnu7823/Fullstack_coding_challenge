import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StoresList from "./pages/StoresList";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css"; // Add this import

export default function App() {
  return (
    <div className="App"> {/* Changed from "app" to "App" to match CSS */}
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <h1>Welcome to Rating App</h1>
              <p>Discover and rate amazing stores in your area</p>
            </div>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stores" element={<ProtectedRoute><StoresList/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute role="store_owner"><OwnerDashboard/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
