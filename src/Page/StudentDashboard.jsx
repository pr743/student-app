import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/axios";
import Loader from "./Loader";

import { FaUserGraduate, FaIdCard, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdOutlinePendingActions } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";

function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) {
      navigate("/student/login");
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("http://localhost:5000/api/students/dashboard");

      setStudent(res.data.student);
      setResult(res.data.result);
    } catch {
      navigate("/student/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900  via-purple-800 to-pink-700 flex justify-center px-3">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-3xl">
        

        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-6">
        <div className="p-3 rounded-full bg-blue-600/50 text-blue-400">
          <MdDashboard className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left   text-white">
          Student Dashboard
        </h1>
      </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              <FaUserGraduate /> Student Information
            </h2>

            <p className="text-gray-100">
              <FaIdCard />
              <b>Name:</b> {student.name}
            </p>
            <p className="text-gray-100">
              <FaIdCard />
              <b>Roll No:</b> {student.rollNo}
            </p>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 shadow-xl">
            {result?.isPublished ? (
              <>
                <p className="text-green-300 font-semibold flex items-center gap-2 mb-4">
                  <AiOutlineFileDone size={20} />
                  Result Published
                </p>

                <button
                  onClick={() => navigate("/student/result")}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:scale-105 transition shadow-lg"
                >
                  View Marksheet
                </button>
              </>
            ) : (
              <p className="text-yellow-300 font-semibold">
                <MdOutlinePendingActions size={20} />
                Result Not Published Yet
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/student/login");
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
