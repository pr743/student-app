import React, { useState } from "react";
import API from "../API/axios";
import { KeyRound, Mail } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showAlert("Email is required", "error");
      return;
    }

    try {
      setLoading(true);
      await API.post("/admin/forgot-password", { email });
      showAlert("Reset link sent to email","success");

      setEmail("");
    } catch {
      showAlert("Failed to send link","error");
    } finally {
      setLoading(false);
    }
  };
  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr form-gray-900  via-gray-900 to-gray-800 px-4">
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
        className="bg-gray-800 shadow-2xl  rounded-3xl p-10 w-full max-w-md text-white"
      >


      <div className="flex flex-col items-center mb-8">
      <div className="bg-blue-600/20 p-4 rounded-full mb-3">
        <KeyRound size={34} className="text-blue-400" />
      </div>
       <h2 className="text-3xl font-bold text-white text-center mb-8">
          Forgot password
        </h2>

        <p className="text-gray-400 text-sm mt-1 text-center">
          Enter your registered email to receive a password reset link.
        </p>
      </div>


        <div className="mb-6">
        <label className="text-gray-300 mb-2 block">Email Address</label>
        <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-2 focus:ring-blue-500">
        <Mail size={18} className="text-gray-400" />
           <input
            type="email"
            value={email}
            placeholder=" Enter Email"
            className="bg-transparent outline-none w-full px-3"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600  hover:bg-blue-700 transition font-semibold text-lg  disabled:opacity-60"
        >
          {loading ? "Sending...." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;







