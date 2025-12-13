import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: "https://expense-tracker-ml.onrender.com"
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};
