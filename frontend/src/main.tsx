import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { GlobalErrorBoundary } from "./components/common/GlobalErrorBoundary";
import "./styles/globals.css";

// Suppress benign THREE.Clock deprecation warning emitted by @react-three/fiber internals until upstream adopts THREE.Timer
const origWarnGlobal = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock: This module has been deprecated")
  ) {
    return;
  }
  origWarnGlobal.apply(console, args);
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
