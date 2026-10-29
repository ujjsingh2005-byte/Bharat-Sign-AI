import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { GlobalErrorBoundary } from "./components/common/GlobalErrorBoundary";
import "./styles/globals.css";

// Suppress benign third-party notices emitted by @react-three/fiber and MediaPipe WebGL Emscripten
const origWarnGlobal = console.warn;
const origErrorGlobal = console.error;
const isBenignNotice = (msg: any) => {
  if (typeof msg === "string") {
    return (
      msg.includes("THREE.Clock: This module has been deprecated") ||
      msg.includes("gl_context") ||
      msg.includes("gl_context_webgl") ||
      msg.includes("OpenGL error checking is disabled") ||
      msg.includes("Successfully created a WebGL context")
    );
  }
  return false;
};

console.warn = (...args: any[]) => {
  if (isBenignNotice(args[0])) return;
  origWarnGlobal.apply(console, args);
};

console.error = (...args: any[]) => {
  if (isBenignNotice(args[0])) return;
  origErrorGlobal.apply(console, args);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
