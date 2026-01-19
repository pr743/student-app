import { useEffect, useState } from "react";
import { FileText, Hash, School, User, Eye, BadgeCheck, X } from "lucide-react";
import API from "../API/axios";

function AdminPublishedResults() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadPublished = async () => {
    try {
      const res = await API.get("/results?published=true");
      setResults(res.data);
    } catch (err) {
      console.error("Failed to load published results", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPublished();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-400" size={28} />
        <h2 className="text-2xl font-bold">Published Results</h2>
      </div>

      
      <div className="hidden md:block rounded-2xl border border-gray-700 overflow-x-auto">
        <table className="w-full text-sm bg-gray-900">
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
              <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="p-4 flex items-center gap-2">
                  <Hash size={16} className="text-gray-400" />
                  {r.studentId?.rollNo || "N/A"}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {r.studentId?.name || "N/A"}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <School size={16} className="text-gray-400" />
                  {r.instituteId?.name || "N/A"}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelected(r)}
                    className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {results.map((r) => (
          <div key={r._id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <p><Hash size={14} /> {r.studentId?.rollNo || "N/A"}</p>
            <p><User size={14} /> {r.studentId?.name || "N/A"}</p>
            <p><School size={14} /> {r.instituteId?.name || "N/A"}</p>

            <button
              onClick={() => setSelected(r)}
              className="w-full mt-3 py-2 bg-blue-600 rounded-xl flex justify-center gap-2"
            >
              <Eye size={16} /> View
            </button>
          </div>
        ))}
      </div>

      {selected && <MarksheetModal result={selected} close={() => setSelected(null)} />}
    </div>
  );
}

function MarksheetModal({ result, close }) {
  const classValue =
    result.classLevel ||
    result.studentId?.classLevel ||
    "N/A";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
      <div className="bg-gray-900 p-5 rounded-3xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold flex gap-2">
            <BadgeCheck className="text-green-400" /> Marksheet
          </h3>
          <button onClick={close}><X /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p><b>Roll:</b> {result.studentId?.rollNo}</p>
          <p><b>Name:</b> {result.studentId?.name}</p>
          <p className="col-span-2"><b>Institute:</b> {result.instituteId?.name}</p>
          <p><b>Class:</b> {classValue}</p>
          <p><b>Exam:</b> {result.type}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPublishedResults;
