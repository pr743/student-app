import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Hash, School, User, Eye, BadgeCheck, X } from "lucide-react";

function AdminPublishedResults() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadPublished = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/publish-results/published"
    );
    setResults(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPublished();
  }, []);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-400" size={28} />
        <h2 className="text-2xl font-bold text-white">Published Results</h2>
      </div>

      <div className="hidden md:block   rounded-2xl border border-gray-700 shadow-lg  overflow-x-auto ">
        <table className="w-full  text-sm border  border-gray-700  rounded-xl  bg-gray-900 ">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4 text-left">Roll No</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Institute</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r) => (
              <tr
                key={r._id}
                className="border-b border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    {r.studentId?.rollNo || "N/A"}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {r.studentId?.name || "N/A"}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <School size={16} className="text-gray-400" />
                    {r.instituteId?.name || "N/A"}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelected(r)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {results.map((r) => (
          <div
            key={r._id}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow"
          >
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" />
              {r.studentId?.rollNo || "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              {r.studentId?.name || "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <School size={16} className="text-gray-400" />
              {r.instituteId?.name || "N/A"}
            </div>

            <button
              onClick={() => setSelected(r)}
              className="w-full mt-4 py-2 bg-blue-600 rounded-xl flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <MarksheetModal result={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}

function MarksheetModal({ result, close }) {
  return (
    <div className="fixed inset-0  z-50  bg-black/70 backdrop-blur-sm   flex items-center justify-center  p-3 ">
      <div className="bg-gray-900 p-5 rounded-3xl w-full max-w-md border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck className="text-green-400" />
            Marksheet
          </h3>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-800 rounded-lg"
          >
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>
            <b>Roll No:</b> {result.studentId?.rollNo}
          </p>
          <p>
            <b>Name:</b> {result.studentId?.name}
          </p>
          <p className="col-span-2">
            <b>Institute:</b> {result.instituteId?.name}
          </p>
         
         <p>
  <b>Class:</b>{" "}
  {result.classLevel || result.studentId?.classLevel || "N/A"}
</p>

  {console.log("CLASS VALUE:", result.classLevel)}


          <p>
            <b>Exam:</b> {result.type}
          </p>
        </div>

        <hr className="my-4 border-gray-700" />

        <table className="w-full text-sm border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-gray-800 text-blue-300">
            <tr>
              <th className="p-2">Subject</th>
              <th className="p-2">Marks</th>
              <th className="p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {result.subjectResult?.map((s, i) => (
              <tr key={i} className="border-t border-gray-700  text-center ">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.marks}</td>
                <td className="p-2">{s.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <SummaryBox label="Total" value={result.total} />
          <SummaryBox label="Percentage" value={result.percentage + "%"} />
          <SummaryBox label="Grade" value={result.overallGrade} />
        </div>

        <div
          className={`mt-4 py-3 rounded-xl text-center font-bold tracking-wide ${
            result.overallStatus === "PASS"
              ? "bg-green-700/30 text-green-300"
              : "bg-red-700/30 text-red-300"
          }`}
        >
          {result.overallStatus}
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="bg-gray-800 p-3 rounded-xl">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

export default AdminPublishedResults;
