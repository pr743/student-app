import { GraduationCap, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 max-w-md w-full text-center border border-white/20">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <GraduationCap size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Student Result Management System
        </h1>

        <p className="text-gray-200 mb-8 text-sm">
          choose your portal to continue
        </p>

        <div className="space-y-5">
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full py-3 rounded-xl text-lg font-semibold 
            bg-white text-indigo-600 shadow 
            hover:scale-105 hover:bg-indigo-50 transition 
            flex items-center justify-center gap-3"
          >
            <ShieldCheck size={20} />
            Admin Portal
          </button>

          <button
            onClick={() => navigate("/student/login")}
            className="w-full py-3 rounded-xl text-lg font-semibold 
            bg-white text-indigo-600 shadow 
            hover:scale-105 hover:bg-indigo-50 transition 
            flex items-center justify-center gap-3"
          >
            <User size={20} />
            Student Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
