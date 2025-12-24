
// // client/src/pages/Faculty/FacultyDashboard.jsx






// client/src/pages/Faculty/FacultyDashboard.jsx
// import React, { useEffect, useState, useContext, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosClient from "../../utils/axiosClient";
// import { AuthContext } from "../../context/AuthContext";

// import {
//   Box,
//   CssBaseline,
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Grid,
//   Paper,
//   TextField,
//   MenuItem,
//   Chip,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   TablePagination,
//   Stack,
//   Avatar,
//   Divider,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
// } from "@mui/material";

// import {
//   Article as ArticleIcon,
//   Book as BookIcon,
//   Event as EventIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Logout as LogoutIcon,
//   Menu as MenuIcon,
// } from "@mui/icons-material";

// import StatCard from "../../components/StatCard.jsx";
// import EventItem from "../../components/EventItem.jsx";
// import SummaryCard from "../../components/SummaryCard.jsx";

// const drawerWidth = 260;

// const typeOptions = [
//   { value: "all", label: "All Types" },
//   { value: "conducted", label: "Conducted" },
//   { value: "attended", label: "Attended" },
//   { value: "expert_talk", label: "Expert Talks" },
// ];

// const statusOptions = [
//   { value: "all", label: "All Status" },
//   { value: "pending", label: "Pending" },
//   { value: "approved", label: "Approved" },
//   { value: "rejected", label: "Rejected" },
// ];

// export default function FacultyDashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // filters / UI state
//   const [query, setQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(6);
//   const [sortBy, setSortBy] = useState("date");
//   const [sortDir, setSortDir] = useState("desc");

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosClient.get("/activity/mine");
//         setReports(res.data || []);
//       } catch (err) {
//         console.error("Failed to load reports:", err);
//       }
//       setLoading(false);
//     };
//     load();
//   }, []);

//   // Stats
//   const stats = useMemo(() => {
//     const total = reports.length;
//     const conducted = reports.filter((r) => r.reportType === "conducted").length;
//     const attended = reports.filter((r) => r.reportType === "attended").length;
//     const talks = reports.filter((r) => r.reportType === "expert_talk").length;
//     const approved = reports.filter((r) => r.status === "approved").length;
//     const pending = reports.filter((r) => r.status === "pending").length;

//     return { total, conducted, attended, talks, approved, pending };
//   }, [reports]);

//   const upcoming = useMemo(() => {
//     const now = new Date();
//     return reports
//       .filter((r) => r.date && new Date(r.date) >= now)
//       .sort((a, b) => new Date(a.date) - new Date(b.date))
//       .slice(0, 6);
//   }, [reports]);

//   const filtered = useMemo(() => {
//     let data = [...reports];

//     if (typeFilter !== "all") data = data.filter((r) => r.reportType === typeFilter);
//     if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

//     if (query.trim()) {
//       const q = query.toLowerCase();
//       data = data.filter(
//         (r) =>
//           (r.activityName || "").toLowerCase().includes(q) ||
//           (r.coordinator || "").toLowerCase().includes(q)
//       );
//     }

//     data.sort((a, b) => {
//       if (sortBy === "date") {
//         return sortDir === "asc"
//           ? new Date(a.date) - new Date(b.date)
//           : new Date(b.date) - new Date(a.date);
//       }
//       return sortDir === "asc"
//         ? a.activityName.localeCompare(b.activityName)
//         : b.activityName.localeCompare(a.activityName);
//     });

//     return data;
//   }, [reports, typeFilter, statusFilter, query, sortBy, sortDir]);

//   const drawerContent = (
//     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       <Box sx={{ px: 3, py: 4, display: "flex", alignItems: "center", gap: 2 }}>
//         <Avatar sx={{ bgcolor: "white", width: 48, height: 48 }}>
//           {(user?.name || "U").charAt(0)}
//         </Avatar>
//         <Box>
//           <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700 }}>
//             ActiRepo
//           </Typography>
//           <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>
//             Faculty Panel
//           </Typography>
//         </Box>
//       </Box>

//       <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

//       <List sx={{ flex: 1 }}>
//         {[
//           { text: "Dashboard", icon: <ArticleIcon />, to: "/faculty/dashboard" },
//           { text: "FDP Attended", icon: <BookIcon />, to: "/faculty/fdp-attended" },
//           { text: "FDP Conducted", icon: <EventIcon />, to: "/faculty/fdp-conducted" },
//           { text: "Expert Talks", icon: <PeopleIcon />, to: "/faculty/expert-talks" },
//           { text: "Templates", icon: <DescriptionIcon />, to: "/faculty/templates" },
//         ].map((m) => (
//           <ListItem component={Link} to={m.to} key={m.text} sx={{ color: "white" }}>
//             <ListItemIcon sx={{ color: "white" }}>{m.icon}</ListItemIcon>
//             <ListItemText>{m.text}</ListItemText>
//           </ListItem>
//         ))}
//       </List>

//       <Box sx={{ px: 3, py: 4 }}>
//         <Button
//           variant="contained"
//           color="error"
//           fullWidth
//           startIcon={<LogoutIcon />}
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />

//       {/* TOP NAVBAR */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           ml: { md: `${drawerWidth}px` },
//           bgcolor: "#1976d2",
//           borderBottom: "4px solid rgba(76,29,149,0.7)",
//         }}
//       >
//         <Toolbar sx={{ minHeight: 64 }}>
//           <IconButton
//             color="inherit"
//             sx={{ display: { md: "none" }, mr: 2 }}
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Faculty Dashboard
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* SIDE DRAWER */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           [`& .MuiDrawer-paper`]: {
//             width: drawerWidth,
//             background:
//               "linear-gradient(180deg, #4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
//             color: "white",
//             borderRight: "none",
//           },
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* MOBILE DRAWER */}
//       <Drawer
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         sx={{
//           display: { md: "none" },
//           [`& .MuiDrawer-paper`]: { width: drawerWidth },
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* MAIN CONTENT */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 4,
//           pt: "92px",
//           bgcolor: "#f6f7fb",
//           minHeight: "100vh",
//         }}
//       >
//         <Grid container spacing={4}>
//           {/* HEADING */}
//           <Grid item xs={12}>
//             <Typography variant="h4" sx={{ fontWeight: 800 }}>
//               Faculty Dashboard
//             </Typography>
//             <Typography variant="body1" sx={{ mt: 1, color: "gray" }}>
//               Track your academic engagements and upcoming activities.
//             </Typography>
//           </Grid>

//           {/* STAT CARDS */}
//           <Grid item xs={12}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatCard title="My FDPs" value={stats.conducted} subtitle="View FDPs you created." colorStart="#7c3aed" colorEnd="#c084fc" icon={<BookIcon />} />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatCard title="Conducted Events" value={stats.conducted} subtitle="Events you have organized." colorStart="#4c1d95" colorEnd="#7c3aed" icon={<EventIcon />} />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatCard title="Expert Talks" value={stats.talks} subtitle="Talks conducted & attended." colorStart="#a78bfa" colorEnd="#c084fc" icon={<PeopleIcon />} />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatCard title="Templates" value="Manage" subtitle="View report templates." colorStart="#08d3a5" colorEnd="#34d399" icon={<DescriptionIcon />} />
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* SEARCH + FILTERS */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//               <Stack spacing={3} direction={{ xs: "column", md: "row" }} justifyContent="space-between">
//                 <TextField
//                   size="small"
//                   placeholder="Search activity or coordinator..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   sx={{ width: { xs: "100%", md: "60%" } }}
//                 />

//                 <Stack direction="row" spacing={2}>
//                   <TextField select size="small" sx={{ minWidth: 160 }} value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)}>
//                     {typeOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
//                   </TextField>

//                   <TextField select size="small" sx={{ minWidth: 160 }} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
//                     {statusOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
//                   </TextField>
//                 </Stack>
//               </Stack>
//             </Paper>
//           </Grid>

//           {/* 3 COLUMN DASHBOARD LAYOUT */}
//           <Grid item xs={12} md={3}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, minHeight: 380 }}>
//               <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
//                 Upcoming Events
//               </Typography>
//               <Stack spacing={2}>
//                 {upcoming.map((ev) => (
//                   <EventItem key={ev._id} title={ev.activityName} date={ev.date} type={ev.reportType} status={ev.status} />
//                 ))}

//                 {upcoming.length === 0 && (
//                   <Typography variant="body2" sx={{ color: "gray" }}>
//                     No upcoming events
//                   </Typography>
//                 )}
//               </Stack>
//             </Paper>
//           </Grid>

//           {/* MAIN TABLE */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 700, cursor: "pointer" }}
//                         onClick={() => { setSortBy("activityName"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>
//                         Activity
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
//                       <TableCell sx={{ fontWeight: 700, cursor: "pointer" }}
//                         onClick={() => { setSortBy("date"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>
//                         Date
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {loading && (
//                       <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
//                     )}

//                     {!loading && filtered.length === 0 && (
//                       <TableRow><TableCell colSpan={5} align="center">No reports found</TableCell></TableRow>
//                     )}

//                     {!loading &&
//                       filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
//                         <TableRow key={r._id} hover>
//                           <TableCell>{r.activityName}</TableCell>
//                           <TableCell sx={{ textTransform: "capitalize" }}>{r.reportType}</TableCell>
//                           <TableCell>{r.date}</TableCell>
//                           <TableCell>
//                             <Chip label={r.status} size="small" 
//                               color={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "error"} />
//                           </TableCell>
//                           <TableCell>
//                             <Link to={`/faculty/report/${r._id}`} style={{ color: "#6d28d9", fontWeight: 700 }}>
//                               View
//                             </Link>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="caption">
//                   Showing {Math.min(filtered.length, (page + 1) * rowsPerPage)} of {filtered.length}
//                 </Typography>
//                 <TablePagination
//                   component="div"
//                   count={filtered.length}
//                   page={page}
//                   onPageChange={(e, newPage) => setPage(newPage)}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
//                 />
//               </Box>
//             </Paper>
//           </Grid>

//           {/* QUICK SUMMARY */}
//           <Grid item xs={12} md={3}>
//             <SummaryCard stats={stats} onCreate={() => navigate("/faculty/create")} />
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }











// // client/src/pages/Faculty/FacultyDashboard.



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

  // const drawerContent = (
  //   <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
  //     <Box sx={{ px: 3, py: 4, display: "flex", gap: 2, alignItems: "center" }}>
  //       <Avatar sx={{ bgcolor: "white", width: 48, height: 48 }}>
  //         {(user?.name || "U").charAt(0)}
  //       </Avatar>
  //       <Box>
  //         <Typography sx={{ fontWeight: 700 }}>ActiRepo</Typography>
  //         <Typography variant="caption">Faculty Panel</Typography>
  //       </Box>
  //     </Box>

  //     <Divider />

  //     <List sx={{ flex: 1 }}>
  //       <ListItem component={Link} to="/faculty/templates">
  //         <ListItemIcon>
  //           <DescriptionIcon />
  //         </ListItemIcon>
  //         <ListItemText primary="Templates" />
  //       </ListItem>
  //     </List>

  //     <Box sx={{ px: 3, py: 4 }}>
  //       <Button
  //         variant="contained"
  //         color="error"
  //         fullWidth
  //         startIcon={<LogoutIcon />}
  //         onClick={() => {
  //           logout();
  //           navigate("/login");
  //         }}
  //       >
  //         Logout
  //       </Button>
  //     </Box>
  //   </Box>
  // );

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
      <ListItem component={Link} to="/faculty/dashboard">
        <ListItemIcon sx={{ color: "white" }}><ArticleIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem component={Link} to="/faculty/mine">
        <ListItemIcon sx={{ color: "white" }}><BookIcon /></ListItemIcon>
        <ListItemText primary="My Reports" />
      </ListItem>
    </List>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

    {/* CREATE REPORT SECTION */}
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
        Create Report
      </Typography>
    </Box>

    <List>
      <ListItem component={Link} to="/faculty/create?type=attended">
        <ListItemIcon sx={{ color: "white" }}><EventIcon /></ListItemIcon>
        <ListItemText primary="FDP Attended" />
      </ListItem>

      <ListItem component={Link} to="/faculty/create?type=conducted">
        <ListItemIcon sx={{ color: "white" }}><PeopleIcon /></ListItemIcon>
        <ListItemText primary="FDP Conducted" />
      </ListItem>

      <ListItem component={Link} to="/faculty/create?type=expert_talk">
        <ListItemIcon sx={{ color: "white" }}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary="Expert Talk" />
      </ListItem>
    </List>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

    {/* OTHER LINKS */}
    <List>
      <ListItem component={Link} to="/faculty/templates">
        <ListItemIcon sx={{ color: "white" }}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary="Templates" />
      </ListItem>
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
      background: "linear-gradient(180deg, #4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
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

          {/* ---------------- Row 1: Stat Cards ---------------- */}
          <Grid size={12}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="My FDPs"
                  value={stats.conducted}
                  subtitle="View FDPs you created."
                  icon={<BookIcon />}
                  colorStart="#7c3aed"
                  colorEnd="#c084fc"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Conducted Events"
                  value={stats.conducted}
                  subtitle="Events you organized."
                  icon={<EventIcon />}
                  colorStart="#4c1d95"
                  colorEnd="#7c3aed"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Expert Talks"
                  value={stats.talks}
                  subtitle="Talks conducted & attended."
                  icon={<PeopleIcon />}
                  colorStart="#a78bfa"
                  colorEnd="#c084fc"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Templates"
                  value="Manage"
                  subtitle="View report templates."
                  icon={<DescriptionIcon />}
                  colorStart="#08d3a5"
                  colorEnd="#34d399"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* ---------------- Row 2: Upcoming Events ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
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
                            <TableCell>
                              <Link
                                to={`/faculty/report/${r._id}`}
                                style={{ color: "#6d28d9", fontWeight: 700 }}
                              >
                                View
                              </Link>
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

          {/* ---------------- Row 4: Welcome Panel ---------------- */}
          <Grid size={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Welcome back, Dr. {user?.name || "Faculty"}!
              </Typography>
              <Typography sx={{ mt: 1, color: "gray" }}>
                You can track FDPs, events, expert talks, and report approvals here.
              </Typography>
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
