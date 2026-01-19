import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import {
  Menu,
  X,
  Users,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Trash2,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudent: 0,
    publishResults: 0,
    pendingResults: 0,
  });

  const [results, setResults] = useState([]);

  const [alert, setAlert] = useState(null);

  const [showSidebar, setShowSidebar] = useState(false);

  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("/publish-results/stats", axiosConfig);

      setStats({
        totalStudent: res.data.totalStudents || res.data.totalStudent || 0,
        publishResults:
          res.data.publishResults || res.data.publishResulted || 0,
        pendingResults: res.data.pendingResults || res.data.pending || 0,
      });
    } catch {
      showAlert("Failed to load stats", "error");
    }
  };

  const loadResults = async () => {
    try {
      const res = await axios.get("/results");

      const data = Array.isArray(res.data) ? res.data : res.data.results || [];

      setResults(data);
    } catch {
      showAlert("Failed to load results", "error");
      setResults([]);
    }
  };

  const publishResult = async (resultId) => {
    try {
      await axios.post(
        `/api/publish-results/publish/${resultId}`,
        {},
        axiosConfig,
      );

      showAlert("Result published successfully");
      loadStats();
      loadResults();
    } catch {
      showAlert("Failed to publish result", "error");
    }
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await axios.delete(`/api/results/${id}`, {
        axiosConfig,
      });

      setResults((prev) => prev.filter((r) => r._id !== id));
      showAlert("Result deleted successfully");
    } catch {
      showAlert("Failed to delete result", "error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
    loadResults();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats((prev) => ({
      ...prev,
      publishResults: results.filter((r) => r.isPublished).length,
      pendingResults: results.filter((r) => !r.isPublished).length,
    }));
  }, [results]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white overflow-x-hidden">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
          px-4 py-2 rounded-xl text-sm font-semibold shadow-lg 
          w-[90%] max-w-sm text-black z-50 ${
            alert.type === "error" ? "bg-red-400" : "bg-green-400"
          }`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}

      {showSidebar && (
        <div className="fixed inset-0  bg-black/60 z-40 md:hidden">
          <div className="absolute left-0 top-0 w-64 h-full bg-gray-900 z-50">
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1  w-full">
        <div className="md:hidden flex items-center p-4 bg-gray-800">
          <button onClick={() => setShowSidebar(true)}>
            <Menu />
          </button>
        </div>
        <Header />

        <div className="p-4  md:p-6  grid grid-cols-1    sm:grid-cols-2   md:grid-cols-3 gap-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudent}
            icon={<Users />}
            color="blue"
          />

          <StatCard
            title="Results published"
            value={stats.publishResults}
            icon={<CheckCircle />}
            color="green"
          />

          <StatCard
            title="Pending Results"
            value={stats.pendingResults}
            icon={<Clock />}
            color="yellow"
          />
        </div>

        <div className="p-4 md:p-6">
          <h2 className="text-lg  md:text-xl  mb-3 font-semibold flex items-center gap-2">
            <FileText className="text-cyan-400" />
            All Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full  text-xs sm:text-sm md:text-base  border border-cyan-500">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2  sm:p-3">Roll No</th>
                  <th className="p-2  sm:p-3">Name</th>
                  <th className="p-2  sm:p-3">Type</th>
                  <th className="p-2  sm:p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(results) &&
                  results.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-700 text-center"
                    >
                      <td className="p-2  sm:p-3">
                        {item?.studentId?.roll ||
                          item?.studentId?.rollNo ||
                          "N/A"}
                      </td>
                      <td className="p-2  sm:p-3">
                        {item?.studentId?.name || "N/A"}
                      </td>
                      <td className="p-2  sm:p-3">{item?.type || "N/A"}</td>

                      <td className="p-2 sm:p-3">
                        {!item.isPublished ? (
                          <button
                            onClick={() => publishResult(item._id)}
                            className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
                          >
                            <Send size={16} />
                            publish
                          </button>
                        ) : (
                          <span className="text-green-400 flex items-center justify-center gap-1">
                            <CheckCircle size={16} />
                            Done
                          </span>
                        )}

                        <button
                          onClick={() => deleteResult(item._id)}
                          className={`px-4 py-1 rounded 
                                ${
                                  item.isPublished
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                          <Trash2 size={16} className="inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {results.length === 0 && (
              <p className="mt-4 text-gray-400">No results found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-600/20 text-blue-400 ",
    green: "bg-green-600/20 text-green-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
  };
  return (
    <div className="bg-gray-800 p-5 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClasses[color]}  `}>{icon}</div>

      <div>
        <h3 className="text-white text-sm md:text-base font-semibold">
          {title}
        </h3>
        <p className="text-white text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
