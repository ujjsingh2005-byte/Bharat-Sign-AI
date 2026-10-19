/**
 * Centralized API Base URL configuration
 * - In local dev (localhost / 127.0.0.1): connects to http://127.0.0.1:8000
 * - In production (Vercel / Cloud): connects to https://bharat-sign-ai-1.onrender.com
 * - Can be overridden anytime via VITE_API_URL or VITE_API_BASE_URL environment variable
 */
const LIVE_RENDER_API = "https://bharat-sign-ai-1.onrender.com";

export function getApiBaseUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://127.0.0.1:8000";
    }
  }

  return LIVE_RENDER_API;
}

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
