import { useEffect, useState } from "react";
import { Card, Typography, Chip, Divider, Box, Grid } from "@mui/material";
import BarChart from "../components/BarChart";
import axios from "axios";

const colorForCount = (count) => {
  if (count >= 10) return "error";
  if (count >= 5) return "warning";
  return "success";
};

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [notes] = useState([
    "Review safety protocol.",
    "Create a daily checklist.",
    "Use signs for distance control.",
  ]);
  const [recommendations] = useState([
    "Your biggest warning is missing equipment.",
    "Try assigning a supervisor check-in per zone.",
    "Be sure to remind teams to check-in.",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 1. Get current user's profile
    axios.get("http://localhost:5000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUsername(res.data.username))
    .catch(err => {
      console.error("Failed to fetch user profile", err);
      setUsername("User");
    });

    // 2. Get user-specific warnings by day
    axios.get("http://localhost:5000/api/warnings-by-day", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setWeeklyData(res.data));

    // 3. Get recordings (sample: today only)
    axios.get("http://localhost:5000/videos?date=2025-07-09", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setRecordings(res.data.reverse()));
  }, []);

  return (
    <div className="space-y-8">
      <Typography variant="h5" fontWeight="bold">
        Welcome, {username || "Loading..."}
      </Typography>

      <Card className="p-4">
        <Typography variant="h6">Dashboard</Typography>
        <BarChart data={weeklyData} />
      </Card>

      <Card className="p-4">
        <Typography variant="h6" gutterBottom>Recordings</Typography>
        <Box className="space-y-2">
          {recordings.map((rec) => (
            <Box
              key={rec.id}
              className="flex justify-between items-center border rounded px-4 py-2"
            >
              <Typography>{rec.upload_date} – {rec.filename}</Typography>
              <Chip color={colorForCount(Math.floor(Math.random() * 12))} size="small" />
            </Box>
          ))}
        </Box>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className="p-4">
            <Typography variant="h6">Notes</Typography>
            <Divider className="my-2" />
            <ul className="list-disc list-inside space-y-1">
              {notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="p-4">
            <Typography variant="h6">Recommendations</Typography>
            <Divider className="my-2" />
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}








{/*
import { useEffect, useState } from "react";
import { Card, Typography, Chip, Divider, Box, Grid } from "@mui/material";
import BarChart from "../components/BarChart";
import axios from "axios";

const colorForCount = (count) => {
  if (count >= 10) return "error";
  if (count >= 5) return "warning";
  return "success";
};

export default function DashboardPage() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [notes] = useState([
    "Review safety protocol.",
    "Create a daily checklist.",
    "Use signs for distance control.",
  ]);

  const [recommendations] = useState([
    "Your biggest warning is missing equipment.",
    "Try assigning a supervisor check-in per zone.",
    "Be sure to remind teams to check-in.",
  ]);

  useEffect(() => {
    // Replace with your actual API endpoints
    axios.get("http://localhost:5000/api/warnings-by-day", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setWeeklyData(res.data));

    axios.get("http://localhost:5000/videos?date=2025-07-09", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setRecordings(res.data.reverse()));
  }, []);

  return (
    <div className="space-y-8">
      <Typography variant="h5" fontWeight="bold">
        Welcome, [User]
      </Typography>

      <Card className="p-4">
        <Typography variant="h6">Dashboard</Typography>
        <BarChart data={weeklyData} />
      </Card>

      <Card className="p-4">
        <Typography variant="h6" gutterBottom>Recordings</Typography>
        <Box className="space-y-2">
          {recordings.map((rec) => (
            <Box
              key={rec.id}
              className="flex justify-between items-center border rounded px-4 py-2"
            >
              <Typography>{rec.upload_date} – {rec.filename}</Typography>
              <Chip color={colorForCount(Math.floor(Math.random() * 12))} size="small" />
            </Box>
          ))}
        </Box>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className="p-4">
            <Typography variant="h6">Notes</Typography>
            <Divider className="my-2" />
            <ul className="list-disc list-inside space-y-1">
              {notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="p-4">
            <Typography variant="h6">Recommendations</Typography>
            <Divider className="my-2" />
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
*/}
