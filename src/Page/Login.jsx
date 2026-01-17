import React, { useState } from "react";
import API from "../API/axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { Lock, Mail, ShieldCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true); 

    try {
      await API.post("/admin/login", {
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("email", form.email.trim());
      showAlert("OTP sent to your email");

      navigate("/admin/verify-otp");
    } catch {
      showAlert("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr form-gray-900  via-gray-900 to-gray-800 px-4">
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
        className="bg-gray-800 shadow-2xl  rounded-3xl p-10 w-full max-w-md text-white"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full mb-3">
            <ShieldCheck size={34} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold">Admin Login</h2>

          <p className="text-gray-400 text-sm mt-1 text-center">
            Secure access using OTP verification.
          </p>
        </div>

        <div className="mb-5">
          <label className="text-gray-300 mb-2 block">Email</label>
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail size={20} className="text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder=" Enter Email"
            className="bg-transparent outline-none w-full px-3"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-300 mb-2 block">password</label>
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="bg-transparent outline-none w-full px-3"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {loading ? <Loader /> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-70"
        >
          Send OTP
        </button>

        <p className="text-gray-400 text-sm text-center mt-3">
          Forget password?{" "}
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-600"
          >
            Reset
          </Link>
        </p>

        <p className="text-gray-400 text-sm text-center mt-5">
          Don’t have an account?{" "}
          <Link
            to="/admin/register"
            className="text-blue-400 hover:text-blue-600"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
