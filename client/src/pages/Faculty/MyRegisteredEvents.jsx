import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

export default function MyRegistrations() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axiosClient.get("/events/my-registrations");
    setEvents(res.data || []);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Registered Events
      </Typography>

      <Grid container spacing={3}>
        {events.length === 0 && (
          <Typography>No registrations found</Typography>
        )}

        {events.map((ev) => (
          <Grid key={ev._id} xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 800 }}>
                {ev.title}
              </Typography>

              <Typography sx={{ mt: 1, color: "gray" }}>
                {ev.eventType} • {ev.department}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                📅 {new Date(ev.startDate).toDateString()}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                variant="outlined"
                fullWidth
                onClick={() =>
                  navigate(`/faculty/create?fromEvent=${ev._id}`)
                }
              >
                Create Report
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
