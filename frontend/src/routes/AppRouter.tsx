import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import History from "../pages/History/History";
import VoiceToSign from "../pages/VoiceToSign/VoiceToSign";
import SignToText from "../pages/SignToText/SignToText";

export default function AppRouter() {
  return (
    <Routes>
      {/* Home & Core Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/history" element={<History />} />
      <Route path="/voice-to-sign" element={<VoiceToSign />} />
      <Route path="/sign-to-text" element={<SignToText />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Master Dashboard Studio */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

