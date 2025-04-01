import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Import Navbar
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateAd from "./pages/CreateAd";
import MyAds from "./pages/MyAds";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h1>Welcome to Local Ads</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/my-ads" element={<MyAds />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
