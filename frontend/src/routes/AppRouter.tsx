import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import History from "../pages/History/History";
import VoiceToSign from "../pages/VoiceToSign/VoiceToSign";
import SignToText from "../pages/SignToText/SignToText";
import SignLanguageLearningPage from "../pages/Learn/SignLanguageLearningPage";

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
      <Route path="/learn" element={<SignLanguageLearningPage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Master Dashboard Studio & Typo Redirects */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard." element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
