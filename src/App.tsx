import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/"
          element={
            username ? (
              role === "admin" ?
                <AdminPage /> :
                <HomePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}