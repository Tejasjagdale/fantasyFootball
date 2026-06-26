/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
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
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

import { db } from "../firebase/firebase";
import teams from "../data/teams.json";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "../utils/scoring";

type Match = {
  id: string;
  team1: string;
  team2: string;
  status: string;
  result: {
    team1: number;
    team2: number;
  } | null;
};

type EditMode = "teams" | "result";

export default function AdminPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [team1, setTeam1] = useState<any>(null);
  const [team2, setTeam2] = useState<any>(null);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("teams");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editTeam1, setEditTeam1] = useState<any>(null);
  const [editTeam2, setEditTeam2] = useState<any>(null);
  const [editScore1, setEditScore1] = useState<string>("");
  const [editScore2, setEditScore2] = useState<string>("");

  // Delete confirm dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);

  const loadMatches = async () => {
    const snapshot = await getDocs(collection(db, "matches"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Match, "id">),
    }));
    setMatches(data);
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
      result: null,
    });
    setTeam1(null);
    setTeam2(null);
    loadMatches();
  };

  // ── Delete ──────────────────────────────────────────────────
  const openDeleteDialog = (match: Match) => {
    setDeletingMatch(match);
    setDeleteOpen(true);
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
    setEditOpen(true);
  };

  const updatePredictionScores = async (
    matchId: string,
    actualHome: number,
    actualAway: number
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
          data.prediction.team1,
          data.prediction.team2
        );

        await updateDoc(
          predictionDoc.ref,
          {
            score,
          }
        );



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
        result: { team1: s1, team2: s2 },
        status: "completed",
      });
      await updatePredictionScores(
        editingMatch.id,
        s1,
        s2
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
                        match.status.toLowerCase() === "completed"
                          ? "success"
                          : match.status.toLowerCase() === "live"
                            ? "error"
                            : "default"
                      }
                      variant="outlined"
                    />

                    {match.result ? (
                      <Chip
                        label={`${match.result.team1} – ${match.result.team2}`}
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
            <Stack direction="row" spacing={2} mt={1} alignItems="center">
              <TextField
                label={editingMatch?.team1 ?? "Home"}
                value={editScore1}
                onChange={(e) => setEditScore1(e.target.value)}
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
                onChange={(e) => setEditScore2(e.target.value)}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Stack>
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
    </Box>
  );
}
