import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiPlus, FiSearch, FiTrash, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Institutes() {
  const [name, setName] = useState("");
  const [type, setType] = useState("school");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState(null);

  const pageSize = 10;
  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: { "auth-token": token },
  };

  
  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  
  const loadInstitutes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/institutes",
        axiosConfig
      );
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
    if (!name.trim()) return showAlert("Enter institute name", "error");

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/institutes/${editId}`,
          { name, type },
          axiosConfig
        );
        showAlert("Institute updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/institutes",
          { name, type },
          axiosConfig
        );
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
      await axios.delete(
        `http://localhost:5000/api/institutes/${id}`,
        axiosConfig
      );
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
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6 md:p-8">
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 
          px-4 py-2 rounded-xl text-black text-sm font-semibold z-50
          ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
        >
          {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
        Manage Institutes
      </h2>

      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">

      <div className="relative w-full mb-4">
       <FiSearch className="absolute left-3 top-3 text-gray-400"/>
        <input
          placeholder="Search institute..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 px-3 py-2 rounded-xl bg-gray-700"
        />
         </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <input
            placeholder="Institute Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-700"
          >
            <option value="school">School</option>
            <option value="college">College</option>
          </select>

          <button
            onClick={saveInstitute}
            className=" flex items-center justify-center  bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl"
          >
          <FiPlus className="mr-2"/>
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setName("");
                setType("school");
              }}
              className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-xl"
            >

             <FiX className="mr-2"/> Cancel
            </button>
          )}
        </div>


        <div className="block md:hidden space-y-4 mt-6">
          {paginated.map((ins) => (
            <div
              key={ins._id}
              className="bg-gray-700 p-4 rounded-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{ins.name}</h3>
                  <p className="text-gray-400 capitalize">{ins.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editInstitute(ins)}
                    className="bg-yellow-600 px-3 py-1 rounded-md text-xs"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => removeInstitute(ins._id)}
                    className="bg-red-600 px-3 py-1 rounded-md text-xs"
                  >
                    <FiTrash className="mr-1"/>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>



        <div className="hidden md:block overflow-x-auto mt-6">
          <table className="min-w-[600px] w-full text-sm border border-gray-700">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((ins) => (
                <tr key={ins._id} className="border-t border-gray-700">
                  <td className="px-3 py-2">{ins.name}</td>
                  <td className="px-3 py-2 capitalize">{ins.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => editInstitute(ins)}
                      className="bg-yellow-600 px-3 py-1 rounded-md text-xs mr-2"
                    >
                    <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => removeInstitute(ins._id)}
                      className="bg-red-600 px-3 py-1 rounded-md text-xs"
                    >
                    <FiTrash className="mr-1"/>Delete
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-400"
                  >
                    No institutes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-5 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-700 rounded-xl disabled:opacity-40"
            >
             <FiChevronLeft/> prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-700 rounded-xl disabled:opacity-40"
            >
            <FiChevronRight/>  Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Institutes;









