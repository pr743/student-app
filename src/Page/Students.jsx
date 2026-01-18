import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiEdit,
  FiPlus,
  FiSearch,
  FiTrash,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

function Students() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [classOrCourse, setClassOrCourse] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [type, setType] = useState("");

  const [students, setStudents] = useState([]);
  const [institute, setInstitute] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState(null);

  const pageSize = 10;
  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get("/students", axiosConfig);

      const normalizedStudents = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.students)
          ? res.data.students
          : Array.isArray(res.data?.loadStudents)
            ? res.data.loadStudents
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

      setStudents(normalizedStudents);
    } catch {
      setStudents([]);
      showAlert("Failed to load students", "error");
    }
  };

  const loadInstitutes = async () => {
    try {
      const res = await axios.get("/institutes", axiosConfig);

      const normalizedInstitutes = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.institutes)
          ? res.data.institutes
          : Array.isArray(res.data?.institute)
            ? res.data.institute
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];
      setInstitute(normalizedInstitutes);
    } catch {
      setInstitute([]);
      showAlert("Failed to load institutes", "error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
    loadInstitutes();
  }, []);

  const saveStudent = async () => {
    if (!name || !roll || !instituteId || !type)
      return showAlert("All fields required", "error");

    const payload = {
      name,
      rollNo: roll,
      password: password || roll,
      classOrCourse,
      instituteId,
      type,
    };

    try {
      if (editId) {
        await axios.put(`/students/${editId}`, payload, axiosConfig);
        showAlert("Student updated");
      } else {
        await axios.post("api/students/create", payload, axiosConfig);
        showAlert("Student added");
      }

      setName("");
      setRoll("");
      setPassword("");
      setClassOrCourse("");
      setInstituteId("");
      setType("");
      setEditId(null);

      loadStudents();
    } catch {
      showAlert("Save failed", "error");
    }
  };

  const editStudent = (s) => {
    setEditId(s._id);
    setName(s.name);
    setRoll(s.rollNo);
    setPassword("");
    setClassOrCourse(s.classOrCourse || "");
    setInstituteId(s.instituteId || "");
    setType(s.type || "");
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`/students/${id}`, axiosConfig);
      showAlert("Deleted successfully");
      loadStudents();
    } catch {
      showAlert("Delete failed", "error");
    }
  };

  const searched = Array.isArray(students)
    ? students.filter((s) =>
        `{s?.name ?? ""}${s?.rollNo ?? ""}$ {s.instituteName ??""} ${s?.type ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : [];

  const totalPages = Math.ceil(searched.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginated = searched.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6 md:p-8">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
            px-4 py-2 rounded-xl text-black font-semibold z-50
            ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
        Manage Students
      </h2>

      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl">
        <div className="relative w-full mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 px-3 py-2 rounded-xl bg-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          />
          <input
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          />
          <input
            placeholder="Class / Course"
            value={classOrCourse}
            onChange={(e) => setClassOrCourse(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          >
            <option value="">Select Type</option>
            <option value="regular">Regular</option>
            <option value="private">Private</option>
            <option value="distance">Distance</option>
          </select>
          <select
            value={instituteId}
            onChange={(e) => setInstituteId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          >
            <option value="">Select Institute</option>
            {institute.map((i) => (
              <option key={i._id} value={i._id} className="text-black">
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={saveStudent}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl"
          >
            <FiPlus className="mr-2" />
            {editId ? "Update Student" : "Add Student"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setName("");
                setRoll("");
                setPassword("");
                setClassOrCourse("");
                setInstituteId("");
                setType("");
              }}
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-xl"
            >
              <FiX className="mr-2" /> Cancel
            </button>
          )}
        </div>

        <div className=" hidden md:block   overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Roll</th>
                <th className="px-3 py-2 text-left">Institute</th>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s._id} className="border-t border-gray-700">
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{s.rollNo}</td>
                  <td className="px-3 py-2">{s.instituteName}</td>
                  <td className="px-3 py-2">{s.classOrCourse}</td>
                  <td className="px-3 py-2 capitalize">{s.type}</td>
                  <td className="flex gap-2 whitespace-nowrap">
                    <button
                      onClick={() => editStudent(s)}
                      className="flex items-center bg-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-700 cursor-pointer"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => removeStudent(s._id)}
                      className="flex items-center bg-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-700 cursor-pointer"
                    >
                      <FiTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-2 ">
          {paginated.map((s) => (
            <div key={s._id} className="bg-gray-800 p-4 rounded-2xl space-y-2">
              <div className="space-y-1 text-sm">
                <p className="font-bold text-base">{s.name}</p>
                <p>
                  <span className="text-gray-400">Roll:</span>{" "}
                  <span className="font-medium">{s.rollNo}</span>
                </p>
                <p>
                  <span className="text-gray-400">Institute:</span>{" "}
                  <span className="font-medium">{s.instituteName}</span>
                </p>
                <p>
                  <span className="text-gray-400">Class:</span>{" "}
                  <span className="font-medium">{s.classOrCourse}</span>
                </p>

                <p>
                  <span className="text-gray-400">Type:</span>{" "}
                  <span className="capitalize font-medium">{s.type}</span>
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => editStudent(s)}
                  className="flex items-center bg-yellow-600 px-3 py-1 rounded-lg text-xs hover:bg-yellow-700 cursor-pointer"
                >
                  <FiEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => removeStudent(s._id)}
                  className="flex items-center bg-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-700 cursor-pointer"
                >
                  <FiTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-5 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-700 rounded-xl disabled:opacity-40"
            >
              <FiChevronLeft /> prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-700 rounded-xl disabled:opacity-40"
            >
              <FiChevronRight /> Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;
