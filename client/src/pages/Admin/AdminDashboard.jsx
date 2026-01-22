

// client/src/pages/Admin/AdminDashboard.jsx

import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Stack,
  IconButton,
  Button,
  Drawer,      // ✅ ADD THIS
} from "@mui/material";


import {
  Menu as MenuIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Book as BookIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";

// Import Sidebar
import AdminSidebar from "../../components/AdminSidebar";

const drawerWidth = 260;

/* ============================================================
                       ADMIN DASHBOARD
============================================================ */

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Drawer toggle (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Main report data
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

//notifications
  const [events, setEvents] = useState([]);
const [eventsLoading, setEventsLoading] = useState(true);

  /* ============================================================
                         APPROVE / REJECT
  ============================================================ */

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/activity/${id}/approve`);
      setReports((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "approved" } : a))
      );
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.put(`/activity/${id}/reject`);
      setReports((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a))
      );
    } catch (err) {
      console.error("Reject error:", err);
    }
  };



  const handleEventApprove = async (id) => {
  try {
    await axiosClient.put(`/events/${id}/approve`);
    loadAdminEvents(); // refresh list
  } catch (err) {
    console.error("Event approve failed", err);
  }
};

const handleEventReject = async (id) => {
  try {
    await axiosClient.put(`/events/${id}/reject`);
    loadAdminEvents();
  } catch (err) {
    console.error("Event reject failed", err);
  }
};




const loadAdminEvents = async () => {
  try {
    setEventsLoading(true);
    const res = await axiosClient.get("/admin/events");
    setEvents(res.data || []);
  } catch (err) {
    console.error("Failed to load admin events", err);
    setEvents([]);
  } finally {
    setEventsLoading(false);
  }
};

useEffect(() => {
  loadAdminEvents();
}, []);

  /* ============================================================
                         LOAD REPORTS
  ============================================================ */

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/activity");
        if (mounted) setReports(res.data || []);
      } catch (err) {
        if (mounted) setReports([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);


  //new for notifications 

  useEffect(() => {
  let mounted = true;

  const loadAdminEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await axiosClient.get("/admin/events");
      if (mounted) setEvents(res.data || []);
    } catch (err) {
      if (mounted) setEvents([]);
      console.error("Failed to load admin events", err);
    } finally {
      if (mounted) setEventsLoading(false);
    }
  };

  loadAdminEvents();
  return () => (mounted = false);
}, []);



//notifications
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  axiosClient.get("/notifications").then((res) => {
    setNotifications(res.data || []);
  });
}, []);


useEffect(() => {
  axiosClient.get("/admin/notifications").then((res) => {
    setNotifications(res.data || []);
  });
}, []);



  /* ============================================================
                         STATS BOX
  ============================================================ */
  const stats = useMemo(() => {
    return {
      total: reports.length,
      conducted: reports.filter((r) => r.reportType === "conducted").length,
      attended: reports.filter((r) => r.reportType === "attended").length,
      talks: reports.filter((r) => r.reportType === "expert_talk").length,
      pending: reports.filter((r) => r.status === "pending").length,
      approved: reports.filter((r) => r.status === "approved").length,
    };
  }, [reports]);

  /* ============================================================
                       FILTERING + SORTING
  ============================================================ */

  const filtered = useMemo(() => {
    let data = [...reports];

    if (typeFilter !== "all") data = data.filter((r) => r.reportType === typeFilter);

    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (r) =>
          (r.activityName || "").toLowerCase().includes(q) ||
          (r.coordinator || "").toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      if (sortBy === "date") {
        return sortDir === "asc"
          ? new Date(a.date || 0) - new Date(b.date || 0)
          : new Date(b.date || 0) - new Date(a.date || 0);
      }
      const sa = (a.activityName || "").toLowerCase();
      const sb = (b.activityName || "").toLowerCase();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });

    return data;
  }, [reports, typeFilter, statusFilter, query, sortBy, sortDir]);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };

  /* ============================================================
                         MAIN DASHBOARD UI
  ============================================================ */

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ------------------------- TOP APPBAR ------------------------- */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "#fff",
          color: "#4c1d95",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            sx={{ display: { md: "none" }, mr: 2 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: "#ffffff70",
              backdropFilter: "blur(5px)",
            }}
          >
            <Typography variant="subtitle1">
              Welcome back, {user?.name} 👋
            </Typography>
          </Paper>
        </Toolbar>
      </AppBar>

      {/* ------------------------- SIDEBAR ------------------------- */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            position: "fixed",
            height: "100%",
            background:
              "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
          }}
        >
          <AdminSidebar />
        </Box>

      

        {/* Mobile Sidebar */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background:
                "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
              color: "white",
            },
          }}
        >
          <AdminSidebar />
        </Drawer>
      </Box>

      {/* ------------------------- MAIN CONTENT ------------------------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: "100px",
          bgcolor: "#f6f7fb",
          minHeight: "100vh",
        }}
      >
        {/* --------------------------------------------------------------
                         ROW 1 — STAT CARDS
        -------------------------------------------------------------- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
          }}
        >
          <StatBox
            title="Total Reports"
            value={stats.total}
            icon={<ArticleIcon />}
            color="#4c1d95"
          />
          <StatBox
            title="Conducted"
            value={stats.conducted}
            icon={<EventIcon />}
            color="#7c3aed"
          />
          <StatBox
            title="Attended"
            value={stats.attended}
            icon={<BookIcon />}
            color="#a78bfa"
          />
          <StatBox
            title="Pending"
            value={stats.pending}
            icon={<PeopleIcon />}
            color="#f59e0b"
          />
        </Box>


{/* notification feature */}

 <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 800 }}>
    Notifications 🔔
  </Typography>

  <Stack spacing={2} mt={2}>
    {notifications.length === 0 && (
      <Typography color="text.secondary">
        No new notifications
      </Typography>
    )}

    {notifications.slice(0, 5).map((n) => (
      <Paper
        key={n._id}
        sx={{
          p: 2,
          borderLeft: "4px solid #3b82f6",
          cursor: "pointer"
        }}
        onClick={() => navigate(`/admin/events/${n.relatedEvent?._id}`)}
      >
        <Typography sx={{ fontWeight: 700 }}>
          {n.title}
        </Typography>
        <Typography variant="caption">
          {n.message}
        </Typography>
      </Paper>
    ))}
  </Stack>
</Paper>



{/* approval feature */}


{["admin", "hod", "principal"].includes(user?.role) && (
  <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
      Pending Event Approvals
    </Typography>

    <Stack spacing={2}>
      {events.filter(e => e.approvalStatus === "pending").length === 0 && (
        <Typography color="text.secondary">
          No pending event approvals
        </Typography>
      )}

      {events
        .filter(e => e.approvalStatus === "pending")
        .map((e) => (
          <Paper key={e._id} sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>
              {e.title}
            </Typography>

            <Typography variant="caption">
              {e.eventType} • {e.department} • Created by {e.createdBy?.name}
            </Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <Button
                color="success"
                variant="contained"
                onClick={() => handleEventApprove(e._id)}
              >
                Approve
              </Button>

              <Button
                color="error"
                variant="outlined"
                onClick={() => handleEventReject(e._id)}
              >
                Reject
              </Button>
            </Stack>
          </Paper>
        ))}
    </Stack>
  </Paper>
)}





        {/* --------------------------------------------------------------
                     ROW 2 — UPCOMING EVENTS
        -------------------------------------------------------------- */}
        <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Upcoming Events
          </Typography>

          <Stack spacing={2}>
            {reports
              .filter((r) => r.date && new Date(r.date) >= new Date())
              .slice(0, 6)
              .map((ev) => (
                <Box
                  key={ev._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {ev.activityName}
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(ev.date)} • {ev.reportType}
                    </Typography>
                  </Box>

                  <Chip
                    label={ev.status}
                    size="small"
                    color={
                      ev.status === "approved"
                        ? "success"
                        : ev.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>
              ))}

            {!reports.some((r) => r.date && new Date(r.date) >= new Date()) && (
              <Typography sx={{ color: "text.secondary" }}>
                No upcoming events
              </Typography>
            )}
          </Stack>
        </Paper>



        {/* --------------------------------------------------------------
                 ROW 3 — REPORTS TABLE
        -------------------------------------------------------------- */}
        <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          {/* Filters */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            mb={2}
          >
            <TextField
              size="small"
              placeholder="Search..."
              sx={{ width: { xs: "100%", md: "40%" } }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <TextField
              select
              label="Type"
              size="small"
              sx={{ minWidth: 160 }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="conducted">Conducted</MenuItem>
              <MenuItem value="attended">Attended</MenuItem>
              <MenuItem value="expert_talk">Expert Talks</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              size="small"
              sx={{ minWidth: 160 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="outlined"
              onClick={() => {
                setQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
            >
              Reset
            </Button>
          </Stack>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>View</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.activityName}</TableCell>
                      <TableCell>{r.reportType}</TableCell>
                      <TableCell>{formatDate(r.date)}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.status}
                          size="small"
                          color={
                            r.status === "approved"
                              ? "success"
                              : r.status === "pending"
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Link
                          to={`/admin/report/${r._id}`}
                          style={{ fontWeight: 700, color: "#4c1d95" }}
                        >
                          View
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            onClick={() => handleApprove(r._id)}
                            disabled={r.status !== "pending"}
                            sx={{
                              border: "1px solid #22c55e",
                              color: "#22c55e",
                              textTransform: "none",
                              "&:hover": {
                                background: "#22c55e",
                                color: "white",
                              },
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            onClick={() => handleReject(r._id)}
                            disabled={r.status !== "pending"}
                            sx={{
                              border: "1px solid #ef4444",
                              color: "#ef4444",
                              textTransform: "none",
                              "&:hover": {
                                background: "#ef4444",
                                color: "white",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) =>
              setRowsPerPage(parseInt(e.target.value, 10))
            }
          />
        </Paper>
      </Box>
    </Box>
  );
}

/* --------------------------------------------------------------
         SMALL STAT BOX COMPONENT (Local to this file)
-------------------------------------------------------------- */
function StatBox({ title, value, icon, color }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        background: `${color}15`,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          bgcolor: color,
          color: "white",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}





