import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import { useEffect } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

export default function App() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const updateLastSeen = async () => {
      if (!username) return;

      try {
        await updateDoc(doc(db, "users", username), {
          lastSeen: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to update last seen", err);
      }
    };

    updateLastSeen();
  }, [username]);

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
              role === "admin" || role === "superadmin" ?
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