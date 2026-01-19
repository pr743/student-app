import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  School,
  Users,
  BookOpen,
  Calculator,
  Award,
} from "lucide-react";
import API from "../API/axios";
import { FaSortNumericUpAlt } from "react-icons/fa";

function Results() {
  const [classLevel, setClassLevel] = useState("");
  const [stream, setStream] = useState("");
  const [student, setStudent] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [result, setResult] = useState(null);

  const [resultType, setResultType] = useState("");

  const [institutes, setInstitute] = useState([]);
  const [instituteId, setInstituteId] = useState("");

  const [alert, setAlert] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadStudents();
    // eslint-disable-next-line react-hooks/immutability
    loadInstitutes();
  }, []);

  const loadStudents = async () => {
    try {
      if (!token) return showAlert("Login required", "error");

      const res = await API.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudent(res.data.student || res.data || []);
    } catch {
      showAlert("Failed to load students", "error");
    }
  };

  const loadInstitutes = async () => {
    try {
      const res = await API.get("/institutes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInstitute(res.data.institutes || res.data || []);
    } catch {
      showAlert("Failed to load institutes", "error");
    }
  };

  const classSubjects = {
    "1-5": ["Hindi", "English", "Math", "EVS", "Computer", "Gujarati"],
    "6-8": ["Hindi", "English", "Math", "Science", "Social Science"],
    "9-10": ["English", "Math", "Science", "Social Science", "Gujarati"],
  };

  const streams = {
    science: ["Physics", "Chemistry", "Math/Bio", "English"],
    commerce: ["Accounts", "Economics", "Business Studies"],
    arts: ["History", "Geography", "Political Science"],
  };

  const handelClass = (cls) => {

    setClassLevel(cls);
    setStream("");
    setResult(null);

    if (cls  <= 5)
      setSubjects(classSubjects["1-5"].map((s) => ({ name: s, marks: "" })));
    else if (cls  <= 8)
      setSubjects(classSubjects["6-8"].map((s) => ({ name: s, marks: "" })));
    else if (cls <= 10)
      setSubjects(classSubjects["9-10"].map((s) => ({ name: s, marks: "" })));
    else setSubjects([]);
  };

  const handleStream = (val) => {
    setStream(val);
    setSubjects(streams[val].map((s) => ({ name: s, marks: "" })));
  };

  const updateMarks = (i, val) => {
    if (val === "") {
      const copy = [...subjects];
      copy[i].marks = "";
      setSubjects(copy);
      return;
    }

    if (!/^\d+$/.test(val)) return;

    const num = Number(val);
    if (num < 0 || num > 100) return;

    const copy = [...subjects];
    copy[i].marks = num;
    setSubjects(copy);
  };

  const gradeFromMarks = (m) =>
    m >= 90
      ? "A+"
      : m >= 80
        ? "A"
        : m >= 70
          ? "B+"
          : m >= 60
            ? "B"
            : m >= 50
              ? "C"
              : m >= 40
                ? "D"
                : "F";

  const generateResult = async () => {
    if (!studentId || !classLevel || !instituteId || !resultType)
      return showAlert("All fields required", "error");

    if ((classLevel === 11 || classLevel === 12) && !stream)
      return showAlert("Stream is required ", "error");

    for (const s of subjects) {
      if (s.marks === "")
        return showAlert("Enter marks for all subjects", "error");

      if (s.marks < 0 || s.marks > 100)
        return showAlert("Marks must be 0-100 ", "error");
    }

    const st = student.find((s) => s._id === studentId || s.id === studentId);
    if (!st) return showAlert("Student not found", "error");

    let total = 0;
    let fail = false;

    const subjectResult = subjects.map((s) => {
      const m = Number(s.marks);
      total += m;
      if (m < 33) fail = true;
      return {
        ...s,
        grade: gradeFromMarks(m),
        status: m >= 33 ? "PASS" : "FAIL",
      };
    });

    const percentage = ((total / (subjects.length * 100)) * 100).toFixed(2);

    const finalResult = {
      studentId,
      studentName: st.name,
      roll: st.rollNo,
      instituteId,
      classLevel,
      stream,
      type: resultType,
      date: new Date().toISOString().split("T")[0],
      subjectResult,
      total,
      percentage,
      overallStatus: fail ? "FAIL" : "PASS",
      overallGrade: fail ? "F" : gradeFromMarks(percentage),
    };

    try {
      await API.post("/results", finalResult, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(finalResult);
      showAlert("Result saved successfully");
    } catch {
      showAlert("Failed to save result", "error");
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
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

      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-6">
        <div className="p-3 rounded-full bg-blue-600/20 text-blue-400">
          <Award className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Result Management
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Select
          icon={<Users />}
          value={studentId}
          onChange={setStudentId}
          label="Student"
        >
          {student.map((s) => (
            <option key={s._id} value={s._id}>
              {s.roll} - {s.name}
            </option>
          ))}
        </Select>

        <Select
          icon={<School />}
          value={instituteId}
          onChange={setInstituteId}
          label="Institute"
        >
          {institutes.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name}
            </option>
          ))}
        </Select>

        <Select
          icon={<GraduationCap />}
          value={classLevel}
          onChange={handelClass}
          label="Class"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </Select>
      </div>

      <Select label="Result Type" value={resultType} onChange={setResultType}>
        <option value="regular">Regular</option>
        <option value="private">Private</option>
        <option value="distance">Distance</option>
      </Select>

      {(classLevel === 11 || classLevel === 12) && (
        <Select
          icon={<BookOpen />}
          value={stream}
          onChange={handleStream}
          label="Stream"
        >
          {Object.keys(streams).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {subjects.map((s, i) => (
          <div key={i} className="bg-black p-4 rounded-xl">
            <label>{s.name}</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full mt-2 p-2 rounded bg-gray-800"
              value={s.marks}
              onChange={(e) => updateMarks(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={generateResult}
        className="mt-6 w-full bg-blue-600 py-3 rounded-xl text-lg font-bold flex justify-center gap-2"
      >
        <Calculator /> Generate Result
      </button>

      {result && (
        <div className="mt-6 bg-black p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Marksheet</h2>
          <p>Name: {result.studentName}</p>
          <p>Roll: {result.rollNo}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>Status: {result.overallStatus}</p>
        </div>
      )}
    </div>
  );
}

const Select = ({ icon, label, value, onChange, children }) => (
  <div>
    <label className="flex gap-2 mb-1">
      {icon} {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded bg-black border border-gray-700"
    >
      <option value="">Select</option>
      {children}
    </select>
  </div>
);

export default Results;
