import React, { useState } from "react";
import API from "../API/axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log("Sending form:", form);

    try {
      await API.post("/admin/register", form);

      showAlert("Admin Registered successfully");

      navigate("/admin/login");
    } catch (error) {
      console.log("Error:", error.response?.data);
    
      showAlert("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr form-gray-900  via-gray-800 to-gray-900 px-4">
     {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
          px-4 py-2 rounded-xl text-black text-sm font-semibold z-50
          ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900   border border-gray-700  shadow-2xl  rounded-3xl p-8  w-full max-w-md text-white"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full mb-3">
            <ShieldCheck size={36} className="text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold">Admin Registration</h2>

          <p className="text-gray-400 text-sm mt-1">
            Create admin account securely
          </p>
        </div>

        <InputField
          icon={<User size={18} />}
          placeholder="Full Name"
          name="name"
          onChange={handleChange}
        />

        <InputField
          icon={<Mail size={18} />}
          placeholder="Email Address"
          type="email"
          name="email"
          onChange={handleChange}
        />

        <InputField
          icon={<Phone size={18} />}
          placeholder="Phone Number"
          type="tel"
          name="phone"
          onChange={handleChange}
        />

        <div className="mb-6">
          <label className="text-gray-300 mb-2 block">Password</label>
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock size={18} className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Strong password"
              className="bg-transparent outline-none w-full px-3"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Admin"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-5">
          Already have account?{" "}
          <Link
            to="/admin/login"
            className="text-blue-400 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="mb-5">
      <label className="text-gray-300 mb-2 block">{props.placeholder}</label>

      <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 mb-6 focus-within:ring-2 focus-within:ring-blue-500">
        <span>{icon}</span>

        <input
          {...props}
          className="bg-transparent outline-none w-full px-3"
          required
        />
      </div>
    </div>
  );
}

export default AdminRegister;
