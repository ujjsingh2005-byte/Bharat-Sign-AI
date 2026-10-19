import axios from "axios";

import { API_BASE_URL } from "../utils/apiConfig";

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
