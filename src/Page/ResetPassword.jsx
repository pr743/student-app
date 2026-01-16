import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../API/axios";
import { Lock, ShieldCheck } from "lucide-react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/admin/reset-password", { token, password });
      localStorage.setItem("adminToken", res.data.token);
      showAlert("Password reset successful! Redirecting...", "success");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      showAlert("Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
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
        className="bg-gray-800 p-10 rounded-xl w-full max-w-md text-white"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full mb-3">
            <ShieldCheck size={34} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold">Reset Password</h2>

          <p className="text-gray-400 text-sm mt-1 text-center">
            Create a strong new password for your account
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">New Password</label>
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock size={18} className="text-gray-500" />
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full px-3"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-70"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
