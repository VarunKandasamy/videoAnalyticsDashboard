
import { useState, useEffect } from "react";
import { Typography, Card, Box, Chip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const colorForCount = (n) => {
  if (n >= 10) return "error";
  if (n >= 5) return "warning";
  return "success";
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      try {
        const res = await axios.get(`http://localhost:5000/videos?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVideos(res.data.reverse());
      } catch (err) {
        console.error("Error fetching videos", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <Typography variant="h5" fontWeight="bold">
        Select a Date
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Pick a day"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
      </LocalizationProvider>

      <Card className="p-4">
        <Typography variant="h6">Recordings for {format(selectedDate, "PPP")}</Typography>
        <Box className="mt-4 space-y-2">
          {videos.length === 0 && <Typography>No recordings found for this date.</Typography>}
          {videos.map((v) => (
            <Box
              key={v.id}
              onClick={() => navigate(`/recordings/${v.id}`)}
              className="flex justify-between items-center p-3 rounded hover:bg-gray-100 cursor-pointer border"
            >
              <Typography>{v.filename}</Typography>
              <Chip label="Warning" color={colorForCount(Math.floor(Math.random() * 12))} />
            </Box>
          ))}
        </Box>
      </Card>
    </div>
  );
}
