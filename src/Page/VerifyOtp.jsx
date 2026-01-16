import React, { useEffect, useRef, useState } from "react";
import API from "../API/axios";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCheck, FiRefreshCw } from "react-icons/fi";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

 
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  
  useEffect(() => {
    if (otp.join("").length === 6 && !loading && !verified) {
      handleVerify();
    }
  }, [otp]);

 
  function handleChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(pasted)) return;

    setOtp(pasted.split(""));
    inputRefs.current[5]?.focus();
  };

 
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    const email = localStorage.getItem("email");

    if (enteredOtp.length !== 6) {
      showAlert("Enter 6 digit OTP", "error");
      return;
    }

    if (!email) {
      showAlert("Session expired. Please login again.", "error");
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/admin/verify-otp", {
        email: email.trim(),
        otp: String(enteredOtp), 
      });

      localStorage.setItem("adminToken", res.data.token);

      showAlert("OTP Verified Successfully", "success");
      setVerified(true);

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      showAlert(
        err?.response?.data?.message || "Invalid OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

 
  const handleResend = async () => {
    if (!canResend) return;

    try {
      await API.post("/admin/resend-otp", {
        email: localStorage.getItem("email"),
      });

      showAlert("OTP resent successfully", "success");
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      showAlert("Failed to resend OTP", "error");
    }
  };

  
  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-900 to-gray-800 px-4">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-black font-semibold z-50
          ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <FiLock className="text-3xl text-blue-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Verify OTP
        </h2>
        <p className="text-gray-400 mb-5">
          Enter the 6-digit OTP sent to your email
        </p>

        {timer > 0 && !verified && (
          <p className="text-sm text-yellow-400 mb-2">
            ⏳ OTP expires in <b>{timer}s</b>
          </p>
        )}

        {timer === 0 && !verified && (
          <p className="text-sm text-red-400 mb-2">
            ❌ OTP expired. Please resend.
          </p>
        )}

        <div className="flex justify-between mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength="1"
              value={digit}
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-xl rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || verified || otp.join("").length !== 6}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold disabled:opacity-60"
        >
          {verified ? (
            <span className="flex justify-center items-center gap-2">
              <FiCheck /> Verified
            </span>
          ) : loading ? (
            "Verifying..."
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="mt-4 text-sm text-gray-400">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-400 flex items-center justify-center gap-1 hover:underline mx-auto"
            >
              <FiRefreshCw /> Resend OTP
            </button>
          ) : (
            <p>
              🔒 Resend OTP in{" "}
              <span className="text-blue-400 font-semibold">
                00:{timer.toString().padStart(2, "0")}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
