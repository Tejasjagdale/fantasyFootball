import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import { useEffect, useState } from "react";
import { collection, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function App() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    const initializeUser = async () => {
      if (!username) return;

      try {
        if (role === "user") {
          const snapshot = await getDocs(
            query(
              collection(db, "users"),
              where("username", "==", username.toLowerCase())
            )
          );

          if (snapshot.empty) return;

          const userDoc = snapshot.docs[0];

          await updateDoc(userDoc.ref, {
            lastSeen: serverTimestamp(),
          });

          const data = userDoc.data();

          console.log(data);

          if (
            (data.pendingAmount ?? 0) !== 0 &&
            !data.lastSettledOn
          ) {
            setPendingAmount(data.pendingAmount);
            setSettlementOpen(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    initializeUser();
  }, [username, role]);

  const payWithUPI = () => {
    const upiId = "saurabh-gawas-1@okhdfcbank"; // Replace later
    const receiverName = "Fantasy Football";

    const amount = Math.abs(Number(pendingAmount)).toFixed(2);

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(receiverName)}` +
      `&am=${amount}` +
      `&cu=INR`;

    window.location.href = upiUrl;
  };

  const markSettlementDone = async () => {
    if (!username) return;

    try {
      const snapshot = await getDocs(
        query(
          collection(db, "users"),
          where("username", "==", username.toLowerCase())
        )
      );

      if (snapshot.empty) {
        alert("User not found.");
        return;
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(userDoc.ref, {
        pendingAmount: 0,
        lastSettledOn: serverTimestamp(),
      });

      setSettlementOpen(false);
      setPendingAmount(0);
    } catch (e) {
      console.error(e);
    }
  };
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

      <Dialog
        open={settlementOpen}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            pt: 3,
            pb: 1,
          }}
        >
          {pendingAmount > 0 ? "🎉 Payout Available" : "💳 Payment Due"}
        </DialogTitle>

        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={1}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 48,
                  sm: 60,
                },
                fontWeight: 800,
                color: pendingAmount > 0 ? "success.main" : "error.main",
                lineHeight: 1,
              }}
            >
              ₹{Math.abs(Number(pendingAmount)).toFixed(2)}
            </Typography>

            <Typography
              mt={3}
              textAlign="center"
              color="text.secondary"
              sx={{
                maxWidth: 310,
                lineHeight: 1.7,
              }}
            >
              {pendingAmount > 0
                ? "You've won this amount from yesterday's matches. Once you've received your payout, confirm it below."
                : "Please complete your payment for yesterday's matches using UPI, then come back and confirm it."}
            </Typography>

            <Box
              display="flex"
              gap={2}
              width="100%"
              mt={4}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSettlementOpen(false)}
              >
                Later
              </Button>

              {pendingAmount > 0 ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={markSettlementDone}
                >
                  I've Received It
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={payWithUPI}
                >
                  Pay with UPI
                </Button>
              )}
            </Box>

            {pendingAmount < 0 && (
              <Button
                sx={{ mt: 2 }}
                size="small"
                onClick={markSettlementDone}
              >
                I've Already Paid
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </BrowserRouter>
  );
}