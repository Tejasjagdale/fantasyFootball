/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { db } from "../firebase/firebase";
import teams from "../data/teams.json";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "../utils/scoring";
import type { Match, User } from "../types/Leaderboard";
import { calculateSettlements } from "../utils/calculateSettlements";


type EditMode = "teams" | "result";

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [team1, setTeam1] = useState<any>(null);
  const [team2, setTeam2] = useState<any>(null);
  const [newUsername, setNewUsername] = useState("");
  const role = localStorage.getItem("role");
  const [entryFee, setEntryFee] = useState(20);
  const [calculatingSettlement, setCalculatingSettlement] = useState(false);
  const isSuperAdmin = role === "superadmin";
  // Edit dialog state
  const [viewPayoutsOpen, setViewPayoutsOpen] = useState(false);
  const [payoutUsers, setPayoutUsers] = useState<User[]>([]);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("teams");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editTeam1, setEditTeam1] = useState<any>(null);
  const [editTeam2, setEditTeam2] = useState<any>(null);
  const [editScore1, setEditScore1] = useState<string>("");
  const [editScore2, setEditScore2] = useState<string>("");
  const [penaltyWinner, setPenaltyWinner] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  // Delete confirm dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const openDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteText("");
    setDeleteUserOpen(true);
  };

  const loadMatches = async () => {
    const snapshot = await getDocs(collection(db, "matches"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Match, "id">),
    }));
    data.sort((a, b) => {
      const aTime = a.createdOn?.seconds ?? 0;
      const bTime = b.createdOn?.seconds ?? 0;
      return bTime - aTime;
    });
    setMatches(data);
  };

  const handleSettlement = async () => {
    if (entryFee <= 0) {
      showSnackbar("Please enter a valid entry fee.", "warning");
      return;
    }

    try {
      setCalculatingSettlement(true);

      const result = await calculateSettlements(entryFee);

      showSnackbar(
        `Settlement Completed

Matches Processed : ${result.matchesProcessed}
Users Updated : ${result.usersUpdated}`
        , "success");

      loadUsers();
    } catch (e) {
      console.error(e);
      showSnackbar("Settlement failed", "error");
    } finally {
      setCalculatingSettlement(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // ── Create ──────────────────────────────────────────────────
  const createMatch = async () => {
    if (!team1 || !team2) return;
    if (team1.fifa_code === team2.fifa_code) {
      alert("Choose different teams");
      return;
    }
    await addDoc(collection(db, "matches"), {
      team1: team1.fifa_code,
      team2: team2.fifa_code,
      status: "upcoming",
      createdOn: serverTimestamp(),
      result: {
        team1: 0,
        team2: 0,
        penaltyWinner: null,
      },
    });
    setTeam1(null);
    setTeam2(null);
    loadMatches();
  };

  const loadPayouts = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const users = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }))
      .sort((a, b) => b.pendingAmount - a.pendingAmount);

    setPayoutUsers(users);
    setViewPayoutsOpen(true);
  };

  const createUser = async () => {
    const username = newUsername.trim().toLowerCase();

    if (!username) return;

    const ref = doc(db, "users", username);

    const existing = await getDoc(ref);

    if (existing.exists()) {
      alert("User already exists");
      return;
    }

    await setDoc(ref, {
      username,
      role: "user",
    });

    setNewUsername("");
  };

  const togglePredictionStatus = async (match: Match) => {
    if (match.status === "locked" && !isSuperAdmin) {
      return;
    }

    const ref = doc(db, "matches", match.id);

    await updateDoc(ref, {
      status: match.status === "upcoming" ? "locked" : "upcoming",
    });

    loadMatches();
  };

  // ── Delete ──────────────────────────────────────────────────
  const openDeleteDialog = (match: Match) => {
    setDeletingMatch(match);
    setDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    await deleteDoc(doc(db, "users", userToDelete.id));

    setDeleteUserOpen(false);
    setUserToDelete(null);
    setDeleteText("");

    loadUsers();
  };
  const confirmDelete = async () => {
    if (!deletingMatch) return;
    await deleteDoc(doc(db, "matches", deletingMatch.id));
    setDeleteOpen(false);
    setDeletingMatch(null);
    loadMatches();
  };

  // ── Edit ────────────────────────────────────────────────────
  const openEditTeams = (match: Match) => {
    setEditingMatch(match);
    setEditMode("teams");
    const t1 = teams.teams.find((t) => t.fifa_code === match.team1) ?? null;
    const t2 = teams.teams.find((t) => t.fifa_code === match.team2) ?? null;
    setEditTeam1(t1);
    setEditTeam2(t2);
    setEditOpen(true);
  };

  const openEditResult = (match: Match) => {
    setEditingMatch(match);
    setEditMode("result");
    setEditScore1(match.result?.team1?.toString() ?? "");
    setEditScore2(match.result?.team2?.toString() ?? "");
    setPenaltyWinner(match.result?.penaltyWinner ?? null);
    setEditOpen(true);
    if (match.result?.team1 !== match.result?.team2) {
      setPenaltyWinner(null);
    }
  };

  const updatePredictionScores = async (
    matchId: string,
    actualHome: number,
    actualAway: number,
    actualPenaltyWinner: string | null,
    team1: string,
    team2: string
  ) => {

    const snapshot = await getDocs(
      query(
        collection(db, "predictions"),
        where("matchId", "==", matchId)
      )
    );

    await Promise.all(

      snapshot.docs.map(async (predictionDoc) => {

        const data = predictionDoc.data();

        const score = calculateScore(
          actualHome,
          actualAway,
          actualPenaltyWinner,
          data.prediction.team1,
          data.prediction.team2,
          data.prediction.penaltyWinner ?? null,
          team1,
          team2
        );
        await updateDoc(predictionDoc.ref, {
          score,
        });
      })

    );

  };

  const saveEdit = async () => {
    if (!editingMatch) return;
    const ref = doc(db, "matches", editingMatch.id);

    if (editMode === "teams") {
      if (!editTeam1 || !editTeam2) return;
      if (editTeam1.fifa_code === editTeam2.fifa_code) {
        alert("Choose different teams");
        return;
      }
      await updateDoc(ref, {
        team1: editTeam1.fifa_code,
        team2: editTeam2.fifa_code,
      });


    } else {
      const s1 = parseInt(editScore1, 10);
      const s2 = parseInt(editScore2, 10);
      if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
        alert("Enter valid non-negative scores");
        return;
      }
      await updateDoc(ref, {
        result: {
          team1: s1,
          team2: s2,
          penaltyWinner: s1 === s2 ? penaltyWinner : null,
        },
        status: "completed",
      });
      await updatePredictionScores(
        editingMatch.id,
        s1,
        s2,
        s1 === s2 ? penaltyWinner : null,
        editingMatch.team1,
        editingMatch.team2
      );
    }

    setEditOpen(false);
    setEditingMatch(null);
    loadMatches();
  };


  const onLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login")
  }

  const loadUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));

    data.sort((a, b) => {
      const t1 = a.lastSeen?.seconds ?? 0;
      const t2 = b.lastSeen?.seconds ?? 0;
      return t2 - t1;
    });

    setUsers(data);
  };

  useEffect(() => {
    loadMatches();

    if (isSuperAdmin) {
      loadUsers();
    }
  }, []);

  return (
    <Box p={2} maxWidth={800} mx="auto">
      <Navbar onLeaderboardClick={() => { }}
        username={"admin"} onLogout={onLogout} />
      <Stack direction="row" alignItems="center" spacing={1.5} mb={4} mt={2}>
        <SportsSoccerIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight={700}>
          Admin Panel
        </Typography>
      </Stack>

      <Card variant="outlined" sx={{ mb: 5 }}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
          >
            Daily Settlement
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >

            <TextField
              type="number"
              label="Entry Fee"
              value={entryFee}
              onChange={(e) =>
                setEntryFee(Number(e.target.value))
              }
              sx={{ width: 180 }}
            />

            <Stack direction="row" spacing={2}>

              <Button
                variant="contained"
                color="success"
                disabled={calculatingSettlement}
                onClick={handleSettlement}
              >
                {calculatingSettlement
                  ? "Calculating..."
                  : "Calculate Settlement"}
              </Button>

              <Button
                variant="outlined"
                onClick={loadPayouts}
              >
                View Payouts
              </Button>

            </Stack>

          </Stack>

        </CardContent>
      </Card>

      {isSuperAdmin && (
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent sx={{ py: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Users
              </Typography>

              <Chip
                label={users.length}
                size="small"
                color="primary"
              />
            </Stack>

            <Stack divider={<Divider />}>
              {users.map((user) => (
                <Stack
                  key={user.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  sx={{
                    py: 1.5,
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {user.username}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {user.lastSeen
                        ? user.lastSeen.toDate().toLocaleString()
                        : "Never logged in"}
                    </Typography>
                  </Box>

                  <Button
                    color="error"
                    size="small"
                    variant="outlined"
                    onClick={() => openDeleteUserDialog(user)}
                  >
                    Delete
                  </Button>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ mb: 5 }}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
          >
            Add User
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              fullWidth
              label="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={createUser}
              disabled={!newUsername.trim()}
              sx={{
                minWidth: 150,
              }}
            >
              Add User
            </Button>

          </Stack>

        </CardContent>
      </Card>

      {/* ── Create Match ── */}
      <Card variant="outlined" sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h6" mb={3} fontWeight={600}>
            Create Match
          </Typography>

          <Stack spacing={3}>
            <Autocomplete
              value={team1}
              onChange={(_, value) => setTeam1(value)}
              options={teams.teams}
              getOptionLabel={(o) => `${o.name_en} (${o.fifa_code})`}
              renderInput={(params) => (
                <TextField {...params} label="Home Team" />
              )}
            />

            <Autocomplete
              value={team2}
              onChange={(_, value) => setTeam2(value)}
              options={teams.teams}
              getOptionLabel={(o) => `${o.name_en} (${o.fifa_code})`}
              renderInput={(params) => (
                <TextField {...params} label="Away Team" />
              )}
            />

            <Button
              variant="contained"
              onClick={createMatch}
              disabled={!team1 || !team2}
            >
              Create Match
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Match List ── */}
      <Typography variant="h5" mb={2} fontWeight={600}>
        Matches
        <Chip
          label={matches.length}
          size="small"
          color="primary"
          sx={{ ml: 1.5, verticalAlign: "middle" }}
        />
      </Typography>

      {matches.length === 0 && (
        <Typography color="text.secondary">
          No matches yet. Create one above.
        </Typography>
      )}

      <Stack spacing={2}>
        {matches.map((match) => (
          <Card key={match.id} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                {/* Left: match info */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {match.team1}{" "}
                    <Typography
                      component="span"
                      color="text.secondary"
                      fontWeight={400}
                    >
                      vs
                    </Typography>{" "}
                    {match.team2}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={0.75} flexWrap="wrap">
                    <Chip
                      label={match.status ?? "upcoming"}
                      size="small"
                      color={
                        match.status === "completed"
                          ? "success"
                          : match.status === "locked"
                            ? "warning"
                            : "primary"
                      }
                      variant="outlined"
                    />

                    {match.result ? (
                      <Chip
                        label={
                          match.result.penaltyWinner
                            ? `${match.result.team1} – ${match.result.team2} (${match.result.penaltyWinner} pens)`
                            : `${match.result.team1} – ${match.result.team2}`
                        }
                        size="small"
                        color="primary"
                      />
                    ) : (
                      <Chip
                        label="Result pending"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                    ID: {match.id}
                  </Typography>
                </Box>

                {/* Right: actions */}
                <Stack direction="row" spacing={0.5} ml={1} flexShrink={0}>
                  <Tooltip
                    title={
                      match.status === "upcoming"
                        ? "Lock Predictions"
                        : match.status === "locked"
                          ? "Open Predictions"
                          : "Completed matches cannot be reopened"
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        color={match.status === "upcoming" ? "warning" : "success"}
                        disabled={match.status === "completed"}
                        onClick={() => togglePredictionStatus(match)}
                      >
                        {match.status === "upcoming" ? (
                          <LockIcon />
                        ) : (
                          <LockOpenIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Edit teams">
                    <IconButton
                      size="small"
                      onClick={() => openEditTeams(match)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Set result">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openEditResult(match)}
                    >
                      <SportsSoccerIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete match">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDeleteDialog(match)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editMode === "teams" ? "Edit Teams" : "Set Result"}
        </DialogTitle>

        <Divider />

        <DialogContent>
          {editMode === "teams" ? (
            <Stack spacing={3} mt={1}>
              <Autocomplete
                value={editTeam1}
                onChange={(_, value) => setEditTeam1(value)}
                options={teams.teams}
                getOptionLabel={(o) => `${o.name_en} (${o.fifa_code})`}
                renderInput={(params) => (
                  <TextField {...params} label="Home Team" />
                )}
              />
              <Autocomplete
                value={editTeam2}
                onChange={(_, value) => setEditTeam2(value)}
                options={teams.teams}
                getOptionLabel={(o) => `${o.name_en} (${o.fifa_code})`}
                renderInput={(params) => (
                  <TextField {...params} label="Away Team" />
                )}
              />
            </Stack>
          ) : (
            <>
              <Stack direction="row" spacing={2} mt={1} mb={1} alignItems="center">
                <TextField
                  label={editingMatch?.team1 ?? "Home"}
                  value={editScore1}
                  onChange={(e) => {
                    setEditScore1(e.target.value);

                    if (Number(e.target.value) !== Number(editScore2)) {
                      setPenaltyWinner(null);
                    }
                  }}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                />
                <Typography variant="h5" flexShrink={0}>
                  –
                </Typography>
                <TextField
                  label={editingMatch?.team2 ?? "Away"}
                  value={editScore2}
                  onChange={(e) => {
                    setEditScore2(e.target.value);

                    if (Number(editScore1) !== Number(e.target.value)) {
                      setPenaltyWinner(null);
                    }
                  }}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                />

              </Stack>
              {Number(editScore1) === Number(editScore2) && (
                <Autocomplete
                  value={
                    penaltyWinner
                      ? teams.teams.find((t) => t.fifa_code === penaltyWinner) ?? null
                      : null
                  }
                  onChange={(_, value) =>
                    setPenaltyWinner(value ? value.fifa_code : null)
                  }
                  options={[
                    teams.teams.find((t) => t.fifa_code === editingMatch?.team1)!,
                    teams.teams.find((t) => t.fifa_code === editingMatch?.team2)!,
                  ]}
                  getOptionLabel={(o) => `${o.name_en} (${o.fifa_code})`}
                  renderInput={(params) => (
                    <TextField  {...params} label="Penalty Winner" />
                  )}
                />
              )}
            </>

          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Match?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deletingMatch?.team1} vs {deletingMatch?.team2}
            </strong>
            ? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteUserOpen}
        onClose={() => setDeleteUserOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography>
              You're about to permanently delete
              <strong> {userToDelete?.username}</strong>.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              This action cannot be undone.
            </Typography>

            <TextField
              fullWidth
              label='Type "DELETE" to confirm'
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteUserOpen(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={deleteText !== "DELETE"}
            onClick={confirmDeleteUser}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewPayoutsOpen}
        onClose={() => setViewPayoutsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Yesterday's Payouts
        </DialogTitle>

        <DialogContent>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              mt: 1,
            }}
          >
            <Table size="small">

              <TableHead>

                <TableRow>

                  <TableCell>
                    Username
                  </TableCell>

                  <TableCell align="right">
                    Amount
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {payoutUsers.map((user) => {

                  const positive =
                    user.pendingAmount > 0;

                  const negative =
                    user.pendingAmount < 0;

                  return (

                    <TableRow key={user.id}>

                      <TableCell>
                        {user.username}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: positive
                            ? "success.main"
                            : negative
                              ? "error.main"
                              : "text.secondary",
                        }}
                      >

                        {positive && "+"}

                        ₹{user.pendingAmount.toFixed(4)}

                      </TableCell>

                    </TableRow>

                  );
                })}

              </TableBody>

            </Table>
          </TableContainer>

        </DialogContent>

      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
