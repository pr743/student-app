import React, { useState } from "react";
import API from "../API/axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { FaIdCard, FaLock, FaUserGraduate } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

function StudentLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [form, setForm] = useState({
    rollNo: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/students/login", form);

      localStorage.setItem("studentToken", res.data.token);
      navigate("/students-extra/dashboard");

      showAlert("Login success");
    } catch {
      showAlert("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-black px-4">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
          px-4 py-2 rounded-xl text-black font-semibold z-50
          ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-md text-white"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3 text-blue-500">
            <FaUserGraduate size={40} />
          </div>
          <h2 className="text-3xl font-bold">Student Login</h2>
          <p>Access your result dashboard</p>
        </div>

        <div className="mb-5  relative">
          <label className="block text-sm font-semibold mb-1">
            Roll Number
          </label>
          <FaIdCard className="absolute left-4 top-11 text-gray-400" />
          <input
            name="rollNo"
            placeholder=" Enter rollNo Number"
            onChange={handleChange}
            required
            className="w-full  pl-12 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 relative">

          <label className="block text-sm font-semibold mb-1">
          Password
          </label>
          <FaLock className="absolute left-4 top-11 text-gray-400" />
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
            required
            className="w-full  pl-12 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <Loader />}

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-60"
        >
        <FiLogIn size={20} />
          {loading ? "logging in....." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default StudentLogin;
