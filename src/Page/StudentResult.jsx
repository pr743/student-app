import React, { useEffect, useState } from "react";
import API from "../API/axios";
import {
  FaBook,
  FaChartBar,
  FaCheckCircle,
  FaFilePdf,
  FaUniversity,
  FaUserGraduate,
  FaTimesCircle
} from "react-icons/fa";

function StudentResult() {
  const [result, setResult] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get("/students/result");
        setResult(res.data);
      } catch {
        // eslint-disable-next-line react-hooks/immutability
        showAlert("Result not available");
      }
    };
    fetchResult();
  }, []);

  if (!result) return null;

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const downloadPDF = async () => {
    try {
      const res = await API.get("/students/marksheet/pdf", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "Marksheet.pdf";
      link.click();
    } catch {
      showAlert("PDF download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900  text-white flex  justify-center p-6">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
          px-4 py-2 rounded-xl text-black font-semibold z-50
          ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-3xl w-full max-w-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6  flex items-center  justify-center gap-3">
          <FaChartBar className="text-blue-400" />
          Student Marksheet
        </h1>

        <div className="grid  md:grid-cols-2  gap-4 text-sm  bg-gray-900 p-4 rounded-xl">
          <p className="flex items-center gap-2">
            <FaUserGraduate className="text-blue-400" />
            <b>Name:</b> {result.studentId.name}
          </p>
          <p className="flex items-center gap-2">
            <FaUserGraduate className="text-blue-400" />
            <b>Roll No:</b> {result.studentId.rollNo}
          </p>

          <p className="flex items-center gap-2">
            <FaUniversity className="text-purple-400" />
            <b>Institute:</b> {result.instituteId?.name}
          </p>

          <p className="flex items-center gap-2">
            <FaBook className="text-green-400" />
            <b>Class:</b> {result.classLevel}
          </p>
        </div>

        <hr className="my-4 border-gray-700" />

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-center border border-gray-700  rounded-xl overflow-hidden">
            <thead className="bg-gray-900 text-blue-300">
              <tr>
                <th className="p-2">Subject</th>
                <th className="p-2">Marks</th>
                <th className="p-2">Grade</th>
              </tr>
            </thead>

            <tbody>
              {result.subjectResult?.map((s, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.marks}</td>
                  <td className="p-2">{s.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4  gap-4 mt-6 text-center">
          <div className="bg-gray-700 p-3 rounded-xl">
            <p>Total</p>
            <b>{result.total}</b>
          </div>

          <div className="bg-gray-700 p-3 rounded-xl">
            <p>Percentage</p>
            <b>{result.percentage}%</b>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl">
            <p>Status</p>
            <b
              className={`flex items-center justify-center gap-1 ${
                result.overallStatus === "PASS"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {result.overallStatus === "PASS" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}

              {result.overallStatus}
            </b>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl">
            <p>Grade</p>
            <b>{result.overallGrade}</b>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="mt-8 w-full flex items-center justify-center gap-3 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          <FaFilePdf size={20} />
          Download Marksheet PDF
        </button>
      </div>
    </div>
  );
}

export default StudentResult;
