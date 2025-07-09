
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/Dashboard";
import CalendarPage from "./pages/Calendar";
import PlaybackPage from "./pages/Playback";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated && <Sidebar />}
      <main className="p-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/recordings/:id"
            element={isAuthenticated ? <PlaybackPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
}
