import { Navigate, Outlet } from "react-router-dom";

export default function StudentProtectedRoute() {
  const token = localStorage.getItem("studentToken");

  if (!token) {
    return <Navigate to="/student/login" replace />;
  }

  return <Outlet />;
}
