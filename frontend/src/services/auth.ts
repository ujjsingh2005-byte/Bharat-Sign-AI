import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await API.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await API.post("/auth/login", data);
  return response.data;
}

export default API;
