import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./Page/AdminRegister";
import Login from "./Page/Login";
import VerifyOtp from "./Page/VerifyOtp";
import ForgotPassword from "./Page/ForgotPassword";
import ResetPassword from "./Page/ResetPassword";
import AdminProtectedRoute from "./Page/AdminProtectedRoute";
import AdminDashboard from "./Page/AdminDashboard";
import Institutes from "./Page/Institutes";
import Students from "./Page/Students";
import Results from "./Page/Results";
import StudentLogin from "./Page/StudentLogin";
import StudentResult from "./Page/StudentResult";
import StudentProtectedRoute from "./Page/StudentProtectedRoute";
import Home from "./Page/Home";
import StudentDashboard from "./Page/StudentDashboard";
import AdminPublishedResults from "./Page/AdminPublishedResults";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/institutes" element={<Institutes />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/results" element={<Results />} />
          <Route
            path="/admin/published-results"
            element={<AdminPublishedResults />}
          />
        </Route>

        <Route path="/student/login" element={<StudentLogin />} />

        <Route element={<StudentProtectedRoute />}>
          <Route path="/students-extra/dashboard" element={<StudentDashboard />} />
          <Route path="/student/result" element={<StudentResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
