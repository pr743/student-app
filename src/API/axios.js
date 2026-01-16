import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


API.interceptors.request.use(
  (req) => {
    const adminToken = localStorage.getItem("adminToken");
    const studentToken = localStorage.getItem("studentToken");

    const token = adminToken || studentToken;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
