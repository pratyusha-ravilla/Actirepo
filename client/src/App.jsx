import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Faculty
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import CreateReport from "./pages/Faculty/CreateReport";
import EditReport from "./pages/Faculty/EditReport";
import ViewMyReport from "./pages/Faculty/ViewMyReport";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ViewReport from "./pages/Admin/ViewReport";

import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Faculty */}
        <Route 
          path="/faculty/dashboard" 
          element={
            <ProtectedRoute roles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/faculty/create" 
          element={
            <ProtectedRoute roles={["faculty"]}>
              <CreateReport />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/faculty/report/:id" 
          element={
            <ProtectedRoute roles={["faculty"]}>
              <ViewMyReport />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/faculty/report/:id/edit" 
          element={
            <ProtectedRoute roles={["faculty"]}>
              <EditReport />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute roles={["hod","admin","principal"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/report/:id" 
          element={
            <ProtectedRoute roles={["hod","admin","principal"]}>
              <ViewReport />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}
