import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import LoginCard from "../components/LoginCard";
import { getUser } from "../firebase/firestore";


export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (username: string) => {
    const user = await getUser(username);

    if (!user) {
      alert("User not found");
      return;
    }

    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);

    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, rgba(0,230,118,.16), transparent 24%), radial-gradient(circle at 20% 10%, rgba(0,184,255,.12), transparent 26%), linear-gradient(180deg,#040b14 0%,#07111d 100%)",
      }}
    >
      <LoginCard onLogin={handleLogin} />
    </Box>
  );
}