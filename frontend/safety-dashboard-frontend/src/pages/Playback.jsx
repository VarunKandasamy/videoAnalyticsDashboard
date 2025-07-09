
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import axios from "axios";

export default function PlaybackPage() {
  const { id } = useParams();
  const videoRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/download/${id}`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const blobUrl = URL.createObjectURL(res.data);
        setVideoUrl(blobUrl);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      }
    };

    fetchVideo();

    return () => {
      // Clean up blob URL
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [id]);

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="space-y-6">
      <Typography variant="h5" fontWeight="bold">Recording ID: {id}</Typography>

      {videoUrl ? (
        <video ref={videoRef} controls className="w-full max-w-3xl rounded shadow" src={videoUrl} />
      ) : (
        <Typography>Loading video...</Typography>
      )}

      <Box className="space-x-4">
        <Button variant="contained" onClick={() => skip(-10)}>-10 sec</Button>
        <Button variant="contained" onClick={() => videoRef.current?.play()}>Play</Button>
        <Button variant="contained" onClick={() => videoRef.current?.pause()}>Pause</Button>
        <Button variant="contained" onClick={() => skip(10)}>+10 sec</Button>
      </Box>

      <Box className="mt-6">
        <Typography variant="h6">Warnings (placeholder)</Typography>
        <ul className="list-disc list-inside">
          <li>12:34 AM – No Helmet Detected</li>
          <li>12:36 AM – Unsafe Distance</li>
        </ul>
      </Box>
    </div>
  );
}
