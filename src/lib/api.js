// src/lib/api.js
import axios from "axios";
import { API_BASE_URL } from "../config";

const baseURL = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,   // send/receive session cookies
});

export default api;
export { baseURL as API_BASE };
