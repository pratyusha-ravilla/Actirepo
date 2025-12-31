

// // client/src/pages/Faculty/FacultyDashboard.jsx


import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";

import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Grid,
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
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button
} from "@mui/material";

import {
  Article as ArticleIcon,
  Book as BookIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from "@mui/icons-material";




import StatCard from "../../components/StatCard.jsx";
import EventItem from "../../components/EventItem.jsx";
import SummaryCard from "../../components/SummaryCard.jsx";

const drawerWidth = 260;


const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "conducted", label: "Conducted" },
  { value: "attended", label: "Attended" },
  { value: "expert_talk", label: "Expert Talks" }
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];



export default function FacultyDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get("/activity/mine");
        setReports(res.data || []);
      } catch {
        setReports([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      conducted: reports.filter((r) => r.reportType === "conducted").length,
      attended: reports.filter((r) => r.reportType === "attended").length,
      talks: reports.filter((r) => r.reportType === "expert_talk").length,
      approved: reports.filter((r) => r.status === "approved").length,
      pending: reports.filter((r) => r.status === "pending").length
    };
  }, [reports]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return reports
      .filter((r) => r.date && new Date(r.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6);
  }, [reports]);

  const filtered = useMemo(() => {
    let data = [...reports];

    if (typeFilter !== "all")
      data = data.filter((r) => r.reportType === typeFilter);

    if (statusFilter !== "all")
      data = data.filter((r) => r.status === statusFilter);

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
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return sortDir === "asc"
        ? a.activityName.localeCompare(b.activityName)
        : b.activityName.localeCompare(a.activityName);
    });

    return data;
  }, [reports, query, typeFilter, statusFilter, sortBy, sortDir]);


  
  const drawerContent = (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}>

    {/* USER PROFILE SECTION */}
    <Box sx={{ px: 3, py: 4, textAlign: "left" }}>
      <Avatar sx={{ bgcolor: "#fff", color: "#4c1d95", width: 56, height: 56, mb: 1 }}>
        {(user?.name || "U").charAt(0).toUpperCase()}
      </Avatar>

      <Typography sx={{ fontWeight: 700 }}>{user?.name || "Faculty User"}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {user?.email}
      </Typography>
    </Box>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

 
{/* MAIN MENU */}
<List>
  <ListItem
    component={Link}
    to="/faculty/mine"
    sx={{
      color: "#f5f3ff",
      "&:hover": {
        background: "rgba(255,255,255,0.15)",
        color: "#ffffff"
      }
    }}
  >
    <ListItemIcon sx={{ color: "inherit" }}>
      <BookIcon />
    </ListItemIcon>
    <ListItemText
      primary="My Reports"
      primaryTypographyProps={{ fontWeight: 600 }}
    />
  </ListItem>

</List>


    {/* OTHER LINKS */}

  <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

<Box sx={{ px: 3, py: 2 }}>
  <Typography
    variant="subtitle2"
    sx={{
      color: "#e9d5ff",
      fontWeight: 700,
      letterSpacing: 0.5
    }}
  >
    Create Report
  </Typography>
</Box>



<List>
  {[
    { label: "FDP Attended", icon: <EventIcon />, link: "/faculty/create?type=attended" },
    { label: "FDP Conducted", icon: <PeopleIcon />, link: "/faculty/create?type=conducted" },
    { label: "Expert Talk", icon: <DescriptionIcon />, link: "/faculty/create?type=expert_talk" },
  ].map((item) => (
    <ListItem
      key={item.label}
      component={Link}
      to={item.link}
      sx={{
        color: "#f5f3ff",
        "&:hover": {
          background: "rgba(255,255,255,0.15)",
          color: "#ffffff"
        }
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    </ListItem>
  ))}
</List>



    {/* FOOTER LOGOUT */}
    <Box sx={{ px: 3, py: 3, mt: "auto" }}>
      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        color="error"
        fullWidth
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Box>

  </Box>
);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ░░ TOP BAR ░░ */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <Typography variant="h6">Faculty Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* ░░ SIDE DRAWER ░░ */}
     <Drawer
  variant="permanent"
  sx={{
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      background: "linear-gradient(180deg, #4c1d95 0%, #743bd7ff 60%, #c084fc 100%)",
      color: "white",
      borderRight: "none",
    },
  }}
>

        {drawerContent}
      </Drawer>

      {/* ░░ MAIN CONTENT ░░ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: "90px",
          bgcolor: "#f4f5fa",
          minHeight: "100vh"
        }}
      >
        <Grid container spacing={4}>

         


{/* ===== DASHBOARD HEADER ===== */}
<Grid size={12}>
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
      boxShadow: 2
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 900, color: "#4c1d95" }}>
      Welcome back, {user?.name || "Faculty"} 👋
    </Typography>

    <Typography sx={{ mt: 1, color: "#5b21b6", fontWeight: 500 }}>
      {new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })}
    </Typography>

    <Typography sx={{ mt: 1, color: "#6b7280" }}>
      Manage your FDPs, expert talks, and activity reports from one place.
    </Typography>
  </Paper>
</Grid>


{/* ===== QUICK ACTIONS ===== */}
{/* <Grid size={12}>
  <Grid container spacing={3}>
    {[
      {
        title: "Create New Report",
        desc: "Start a new FDP / Expert Talk report",
        action: () => navigate("/faculty/create"),
        color: "#4c1d95"
      },
      {
        title: "My Reports",
        desc: "View all reports you created",
        action: () => navigate("/faculty/mine"),
        color: "#7c3aed"
      },
      {
        title: "Pending Approvals",
        desc: `${stats.pending} reports awaiting approval`,
        action: () => {},
        color: "#b45309"
      }
    ].map((item) => (
      <Grid key={item.title} size={{ xs: 12, md: 4 }}>
        <Paper
          onClick={item.action}
          sx={{
            p: 3,
            borderRadius: 3,
            cursor: "pointer",
            borderLeft: `6px solid ${item.color}`,
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6
            }
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
            {item.title}
          </Typography>
          <Typography sx={{ mt: 1, color: "gray" }}>
            {item.desc}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Grid> */}


 {/* ---------------- Row 1: Stat Cards ---------------- */}
          {/* <Grid size={12}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="My FDPs"
                  value={stats.conducted}
                  subtitle="View FDPs you created."
                  icon={<BookIcon />}
                  colorStart="#9c6bf0ff"
                  colorEnd="#c084fc"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Conducted Events"
                  value={stats.conducted}
                  subtitle="Events you organized."
                  icon={<EventIcon />}
                  colorStart="#8b4aedff"
                  colorEnd="#a173f0ff"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Expert Talks"
                  value={stats.talks}
                  subtitle="Talks conducted & attended."
                  icon={<PeopleIcon />}
                  colorStart="#ac92faff"
                  colorEnd="#c084fc"
                />
              </Grid>



               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Attended"
                  value={stats.attended}
                  subtitle="Talks conducted & attended."
                  icon={<DescriptionIcon />}
                  colorStart="#805cedff"
                  colorEnd="#d481edff"
                />
              </Grid>

            </Grid>
          </Grid> */}



<Grid size={12}>
  <Grid container spacing={3}>
    {[
      {
        title: "My FDPs",
        value: stats.conducted,
        subtitle: "View FDPs you created",
        icon: <BookIcon />,
        start: "#915ceeff",
        end: "#c084fc"
      },
      {
        title: "Conducted Events",
        value: stats.conducted,
        subtitle: "Events you organized",
        icon: <EventIcon />,
        start: "#9d64f3ff",
        end: "#a173f0"
      },
      {
        title: "Expert Talks",
        value: stats.talks,
        subtitle: "Talks conducted & attended",
        icon: <PeopleIcon />,
        start: "#9576f4ff",
        end: "#c084fc"
      },
      {
        title: "Attended",
        value: stats.attended,
        subtitle: "Programs you attended",
        icon: <DescriptionIcon />,
        start: "#8059f7ff",
        end: "#d481ed"
      }
    ].map((item) => (
      <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
        <Box
          sx={{
            height: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px) scale(1.02)",
              filter: "drop-shadow(0 16px 25px rgba(0,0,0,0.2))"
            }
          }}
        >
          <StatCard
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            colorStart={item.start}
            colorEnd={item.end}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
</Grid>




          {/* ---------------- Row 2: Upcoming Events ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "linear-gradient(180deg,#ffffff,#fafafa)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Upcoming Events
              </Typography>

              <Stack spacing={2}>
                {upcoming.length === 0 && (
                  <Typography sx={{ color: "gray" }}>
                    No upcoming events found.
                  </Typography>
                )}

                {upcoming.map((ev) => (
                  <EventItem
                    key={ev._id}
                    title={ev.activityName}
                    date={ev.date}
                    status={ev.status}
                    type={ev.reportType}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* ---------------- Row 3: Reports Table ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>

              {/* Search + Filters */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <TextField
                  fullWidth
                  placeholder="Search by activity or coordinator..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <TextField
                  select
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {typeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              {/* TABLE */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={5}>Loading...</TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      filtered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((r) => (
                          <TableRow key={r._id} hover>
                            <TableCell>{r.activityName}</TableCell>
                            <TableCell>{r.reportType}</TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell>
                              <Chip
                                label={r.status}
                                color={
                                  r.status === "approved"
                                    ? "success"
                                    : r.status === "pending"
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </TableCell>


                            {/* <TableCell>
                              <Link
                                to={`/faculty/report/${r._id}`}
                                style={{ color: "#6d28d9", fontWeight: 700 }}
                              >
                                View
                              </Link>
                            </TableCell> */}
     <TableCell>
  <Stack direction="row" spacing={1}>
    <Button
      size="small"
      variant="outlined"
      onClick={() => navigate(`/faculty/report/${r._id}`)}
    >
      View
    </Button>

    {r.status === "pending" && (
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`/faculty/report/${r._id}/edit`)}
      >
        Edit
      </Button>
    )}
  </Stack>
</TableCell>




                          </TableRow>
                        ))}

                    {!loading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Paper>
          </Grid>

       

          {/* ---------------- Row 5: Usage Tips ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Usage Tips
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#444" }}>
                <li>Submit FDP / Event / Expert Talk reports easily</li>
                <li>Track approval status in real time</li>
                <li>Download your reports in PDF & DOCX formats</li>
                <li>Check upcoming events and deadlines</li>
              </ul>
            </Paper>
          </Grid>

          {/* ---------------- Row 6: Highlights ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Highlights
              </Typography>

              <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Total Reports</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Pending Reports</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stats.pending}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Recently Approved</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stats.approved}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* ---------------- Row 7: CTA Panel ---------------- */}
          <Grid size={12}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 3,
                textAlign: "center"
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Start Your Activity Report Now
              </Typography>

              <Typography sx={{ mt: 1, color: "gray" }}>
                Document your FDP / Event / Expert Talk in a few clicks.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/faculty/create")}
                sx={{
                  mt: 3,
                  px: 5,
                  py: 1.5,
                  background:
                    "linear-gradient(90deg, rgba(76,29,149,1) 0%, rgba(124,58,237,1) 100%)",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 3
                }}
              >
                Create Report
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
