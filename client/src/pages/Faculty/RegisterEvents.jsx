
// // client/src/pages/Faculty/RegisterEvents.jsx





// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Grid,
//   Chip,
//   Stack,
//   Divider
// } from "@mui/material";



// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import BusinessIcon from "@mui/icons-material/Business";
// import CategoryIcon from "@mui/icons-material/Category";
// import HowToRegIcon from "@mui/icons-material/HowToReg";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// import axiosClient from "../../utils/axiosClient";
// import "./RegisterEvents.css";

// export default function RegisterEvents() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [registeringId, setRegisteringId] = useState(null);

//   useEffect(() => {
//     const loadEvents = async () => {
//       try {
//         const res = await axiosClient.get("/events/open");
//         setEvents(res.data || []);
//       } catch (err) {
//         alert("Failed to load events");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadEvents();
//   }, []);

//   const register = async (id) => {
//     try {
//       setRegisteringId(id);
//       await axiosClient.post(`/events/${id}/register`);
//       alert("Registered successfully");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Registration failed");
//     } finally {
//       setRegisteringId(null);
//     }
//   };

//   return (
//     <Box className="register-events-page">

//       {/* ================= HEADER ================= */}
//       <Paper className="register-header">
//         <Typography className="register-title">
//           Event Registration 🎓
//         </Typography>

//         <Typography className="register-subtitle">
//           Register for FDPs, workshops, expert talks and conferences
//         </Typography>
//       </Paper>

//       {/* ================= STATS BAR ================= */}
//       <Grid container spacing={3} className="stats-bar">
//         <Grid item xs={12} md={4}>
//           <Paper className="stat-tile">
//             <Typography className="stat-value">{events.length}</Typography>
//             <Typography className="stat-label">Open Events</Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper className="stat-tile accent">
//             <Typography className="stat-value">Auto</Typography>
//             <Typography className="stat-label">
//               Registered Events
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper className="stat-tile soft">
//             <Typography className="stat-value">✔</Typography>
//             <Typography className="stat-label">
//               Attendance Trackable
//             </Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ================= INFO PANEL ================= */}
//       <Paper className="info-panel">
//         <Stack direction="row" spacing={2} alignItems="center">
//           <InfoOutlinedIcon color="secondary" />
//           <Typography className="info-text">
//             Once registered, the event will appear in your dashboard. You can
//             later generate reports and track attendance from registered events.
//           </Typography>
//         </Stack>
//       </Paper>

//       {/* ================= EVENTS LIST ================= */}
//       {loading && (
//         <Typography sx={{ textAlign: "center", mt: 4 }}>
//           Loading events...
//         </Typography>
//       )}

//       <Grid container spacing={4} sx={{ mt: 1 }}>
//         {!loading && events.length === 0 && (
//           <Typography className="empty-text">
//             No open events available right now
//           </Typography>
//         )}

//         {events.map((ev) => (
//           <Grid key={ev._id} item xs={12} md={6}>
//             <Paper className="event-card">

//               {/* Left Accent */}
//               <div className="event-accent" />

//               <Stack spacing={1.5}>
//                 <Typography className="event-title">
//                   {ev.title}
//                 </Typography>

//                 <Typography className="event-description">
//                   {ev.description || "No description provided"}
//                 </Typography>

//                 <Divider />

//                 <Stack direction="row" spacing={1} flexWrap="wrap">
//                   <Chip
//                     icon={<CategoryIcon />}
//                     label={ev.eventType}
//                     size="small"
//                     color="secondary"
//                   />

//                   <Chip
//                     icon={<BusinessIcon />}
//                     label={ev.department}
//                     size="small"
//                     variant="outlined"
//                   />

//                   <Chip
//                     icon={<EventAvailableIcon />}
//                     label={`${new Date(ev.startDate).toDateString()} → ${new Date(
//                       ev.endDate
//                     ).toDateString()}`}
//                     size="small"
//                     color="primary"
//                   />
//                 </Stack>

//                 <Button
//                   startIcon={<HowToRegIcon />}
//                   className="register-btn"
//                   disabled={registeringId === ev._id}
//                   onClick={() => register(ev._id)}
//                 >
//                   {registeringId === ev._id
//                     ? "Registering..."
//                     : "Register for Event"}
//                 </Button>
//               </Stack>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }




// client/src/pages/Faculty/RegisterEvents.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import "./RegisterEvents.css";

export default function RegisterEvents() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await axiosClient.get("/events/open");
        setEvents(res.data || []);
      } catch {
        alert("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  /* ================= REGISTER ================= */
  const register = async (id) => {
    try {
      setRegisteringId(id);
      await axiosClient.post(`/events/${id}/register`);
      alert("Registered successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await axiosClient.delete(`/events/${id}`);

      setEvents((prev) => prev.filter((e) => e._id !== id));
      alert("Event deleted successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box className="register-events-page">

      {/* ================= HEADER ================= */}
      <Paper className="register-header">
        <Typography className="register-title">
          Event Registration 🎓
        </Typography>
        <Typography className="register-subtitle">
          Register for FDPs, workshops, expert talks and conferences
        </Typography>
      </Paper>

      {/* ================= STATS ================= */}
      <Grid container spacing={3} className="stats-bar">
        <Grid item xs={12} md={4}>
          <Paper className="stat-tile">
            <Typography className="stat-value">{events.length}</Typography>
            <Typography className="stat-label">Open Events</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="stat-tile accent">
            <Typography className="stat-value">Auto</Typography>
            <Typography className="stat-label">
              Registered Events
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="stat-tile soft">
            <Typography className="stat-value">✔</Typography>
            <Typography className="stat-label">
              Attendance Trackable
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ================= INFO ================= */}
      <Paper className="info-panel">
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoOutlinedIcon color="secondary" />
          <Typography className="info-text">
            Once registered, the event will appear in your dashboard. You can
            later generate reports and track attendance from registered events.
          </Typography>
        </Stack>
      </Paper>

      {/* ================= EVENTS ================= */}
      {loading && (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          Loading events...
        </Typography>
      )}

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {!loading && events.length === 0 && (
          <Typography className="empty-text">
            No open events available right now
          </Typography>
        )}

        {events.map((ev) => (
          <Grid key={ev._id} item xs={12} md={6}>
            <Paper className="event-card">
              <div className="event-accent" />

              <Stack spacing={1.5}>
                <Typography className="event-title">
                  {ev.title}
                </Typography>

                <Typography className="event-description">
                  {ev.description || "No description provided"}
                </Typography>

                <Divider />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<CategoryIcon />}
                    label={ev.eventType}
                    size="small"
                    color="secondary"
                  />

                  <Chip
                    icon={<BusinessIcon />}
                    label={ev.department}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    icon={<EventAvailableIcon />}
                    label={`${new Date(ev.startDate).toDateString()} → ${new Date(
                      ev.endDate
                    ).toDateString()}`}
                    size="small"
                    color="primary"
                  />
                </Stack>

                {/* ACTION BUTTONS */}
                <Stack direction="row" spacing={2}>
                  <Button
                    startIcon={<HowToRegIcon />}
                    className="register-btn"
                    disabled={registeringId === ev._id}
                    onClick={() => register(ev._id)}
                  >
                    {registeringId === ev._id
                      ? "Registering..."
                      : "Register for Event"}
                  </Button>

                  {/* DELETE – ONLY CREATOR */}
                  {user?._id === ev.createdBy?._id && (
  <Button
    color="error"
    variant="outlined"
    startIcon={<DeleteOutlineIcon />}
    onClick={() => deleteEvent(ev._id)}
  >
    Delete
  </Button>
)}

                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
