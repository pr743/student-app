import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import API from "../API/axios";

function Institutes() {
  const [name, setName] = useState("");
  const [type, setType] = useState("school");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState(null);

  const pageSize = 10;

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  const loadInstitutes = async () => {
    try {
      const res = await API.get("/institutes");
      setList(res.data);
    } catch {
      showAlert("Failed to load institutes", "error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInstitutes();
  }, []);

  const saveInstitute = async () => {
    if (!name.trim()) {
      return showAlert("Enter institute name", "error");
    }

    try {
      if (editId) {
        await API.put(`/institutes/${editId}`, { name, type });
        showAlert("Institute updated");
      } else {
        await API.post("/institutes", { name, type });
        showAlert("Institute added");
      }

      setName("");
      setType("school");
      setEditId(null);
      loadInstitutes();
    } catch {
      showAlert("Save failed", "error");
    }
  };

  const editInstitute = (ins) => {
    setEditId(ins._id);
    setName(ins.name);
    setType(ins.type);
  };

  const removeInstitute = async (id) => {
    if (!window.confirm("Delete this institute?")) return;

    try {
      await API.delete(`/institutes/${id}`);
      showAlert("Deleted successfully");
      loadInstitutes();
    } catch {
      showAlert("Delete failed", "error");
    }
  };

  const searched = list.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(searched.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginated = searched.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-semibold z-50 ${
            alert.type === "error" ? "bg-red-400 text-black" : "bg-green-400 text-black"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Manage Institutes</h2>

     
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search institute..."
          className="w-full pl-10 py-2 rounded-xl bg-gray-700"
        />
      </div>

      
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Institute Name"
          className="bg-gray-700 rounded-xl px-3 py-2"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-700 rounded-xl px-3 py-2"
        >
          <option value="school">School</option>
          <option value="college">College</option>
        </select>

        <button
          onClick={saveInstitute}
          className="bg-green-600 rounded-xl px-4 py-2 flex items-center justify-center"
        >
          <FiPlus className="mr-2" />
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setName("");
              setType("school");
            }}
            className="bg-gray-600 rounded-xl px-4 py-2 flex items-center justify-center"
          >
            <FiX className="mr-2" /> Cancel
          </button>
        )}
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ins) => (
              <tr key={ins._id} className="border-t border-gray-700">
                <td className="p-2">{ins.name}</td>
                <td className="p-2 capitalize">{ins.type}</td>
                <td className="p-2">
                  <button
                    onClick={() => editInstitute(ins)}
                    className="bg-yellow-600 px-3 py-1 rounded mr-2"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => removeInstitute(ins._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-blue-700 px-4 py-2 rounded"
          >
            <FiChevronLeft />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-blue-700 px-4 py-2 rounded"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default Institutes;
