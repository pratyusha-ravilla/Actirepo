


// client/src/pages/Admin/AdminDashboard.jsx
// import React, { useEffect, useMemo, useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Box,
//   CssBaseline,
//   AppBar,
//   Toolbar,
//   Typography,
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
//   Button,
//   Grid,
// } from "@mui/material";
// import {
//   Article as ArticleIcon,
//   Book as BookIcon,
//   Event as EventIcon,
//   People as PeopleIcon,
//   Description as DescriptionIcon,
//   Logout as LogoutIcon,
//   Menu as MenuIcon,
//   Download as DownloadIcon,
// } from "@mui/icons-material";

// import axiosClient from "../../utils/axiosClient";
// import { AuthContext } from "../../context/AuthContext";

// // Re-usable stat card (simple)
// function StatCard({ title, value, subtitle, icon, colorStart = "#4c1d95", colorEnd = "#7c3aed" }) {
//   return (
//     <Paper
//       sx={{
//         p: 2,
//         borderRadius: 3,
//         display: "flex",
//         gap: 2,
//         alignItems: "center",
//         height: "100%",
//         background: `linear-gradient(90deg, ${colorStart}10 0%, ${colorEnd}05 100%)`,
//         boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
//       }}
//     >
//       <Box
//         sx={{
//           width: 64,
//           height: 64,
//           borderRadius: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#fff",
//           background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
//         }}
//       >
//         {icon}
//       </Box>

//       <Box sx={{ flex: 1 }}>
//         <Typography sx={{ color: colorStart, fontWeight: 700 }} variant="subtitle2">
//           {title}
//         </Typography>
//         <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//           {value}
//         </Typography>
//         <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
//           {subtitle}
//         </Typography>
//       </Box>
//     </Paper>
//   );
// }

// const drawerWidth = 260;

// /**
//  * NOTE: you uploaded a file earlier. Put its path below so your toolchain can transform it to a served URL.
//  * Developer instruction: use the path from history. Example path included:
//  */
// const UPLOADED_ACTIVITY_FORMAT_PATH = "/mnt/data/Activity Format.pdf";

// export default function AdminDashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // state
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // filters & pagination
//   const [query, setQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10); // use allowed values: 10,25,50,100
//   const [sortBy, setSortBy] = useState("date");
//   const [sortDir, setSortDir] = useState("desc");

//     // ----------------------------
//   // APPROVE ACTIVITY
//   // ----------------------------
//   const handleApprove = async (id) => {
//     try {
//       await axiosClient.put(`/activity/${id}/approve`);
//       setReports((prev) =>
//         prev.map((a) => (a._id === id ? { ...a, status: "approved" } : a))
//       );
//     } catch (err) {
//       console.error("Approve error:", err);
//     }
//   };

//   // ----------------------------
//   // REJECT ACTIVITY
//   // ----------------------------
//   const handleReject = async (id) => {
//     try {
//       await axiosClient.put(`/activity/${id}/reject`);
//       setReports((prev) =>
//         prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a))
//       );
//     } catch (err) {
//       console.error("Reject error:", err);
//     }
//   };



//   const typeOptions = [
//     { value: "all", label: "All Types" },
//     { value: "conducted", label: "Conducted" },
//     { value: "attended", label: "Attended" },
//     { value: "expert_talk", label: "Expert Talks" },
//   ];
//   const statusOptions = [
//     { value: "all", label: "All Status" },
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//   ];

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosClient.get("/activity"); // admin sees all
//         if (mounted) setReports(res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch activities", err);
//         if (mounted) setReports([]);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, []);

//   // derived stats
//   const stats = useMemo(() => {
//     const total = reports.length;
//     const conducted = reports.filter((r) => r.reportType === "conducted").length;
//     const attended = reports.filter((r) => r.reportType === "attended").length;
//     const talks = reports.filter((r) => r.reportType === "expert_talk").length;
//     const pending = reports.filter((r) => r.status === "pending").length;
//     const approved = reports.filter((r) => r.status === "approved").length;
//     return { total, conducted, attended, talks, pending, approved };
//   }, [reports]);

//   // filtered + sorted
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
//           ? new Date(a.date || 0) - new Date(b.date || 0)
//           : new Date(b.date || 0) - new Date(a.date || 0);
//       }
//       const sa = (a.activityName || "").toLowerCase();
//       const sb = (b.activityName || "").toLowerCase();
//       return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
//     });
//     return data;
//   }, [reports, typeFilter, statusFilter, query, sortBy, sortDir]);

//   // Drawer content (left nav)
//   // const drawerContent = (
//   //   <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: 2 }}>
//   //     <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
//   //       <Avatar sx={{ bgcolor: "white", color: "#4c1d95" }}>
//   //         {(user?.name || "A").charAt(0)}
//   //       </Avatar>
//   //       <Box>
//   //         <Typography sx={{ fontWeight: 700 }}>{user?.name || "Admin"}</Typography>
//   //         <Typography variant="caption" sx={{ opacity: 0.9 }}>
//   //           {user?.email || ""}
//   //         </Typography>
//   //       </Box>
//   //     </Box>

//   //     <Divider sx={{ my: 1 }} />

//   //     <List sx={{ flex: 1 }}>
//   //       <ListItem component={Link} to="/admin/dashboard">
//   //         <ListItemIcon><ArticleIcon /></ListItemIcon>
//   //         <ListItemText primary="Dashboard" />
//   //       </ListItem>

//   //       <ListItem component={Link} to="/admin/reports">
//   //         <ListItemIcon><DescriptionIcon /></ListItemIcon>
//   //         <ListItemText primary="All Reports" />
//   //       </ListItem>

//   //       <ListItem component={Link} to="/admin/users">
//   //         <ListItemIcon><PeopleIcon /></ListItemIcon>
//   //         <ListItemText primary="Users" />
//   //       </ListItem>
//   //     </List>

//   //     <Box sx={{ py: 2 }}>
//   //       <Button
//   //         fullWidth
//   //         startIcon={<LogoutIcon />}
//   //         color="error"
//   //         variant="contained"
//   //         onClick={() => {
//   //           logout?.();
//   //           navigate("/login");
//   //         }}
//   //       >
//   //         Logout
//   //       </Button>
//   //     </Box>
//   //   </Box>
//   // );

//   const drawerContent = (
//   <Box
//     sx={{
//       height: "100%",
//       display: "flex",
//       flexDirection: "column",
//       px: 2,
//       py: 3,
//       color: "white",
//     }}
//   >
//     {/* Admin Header */}
//     <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
//       <Avatar
//         sx={{
//           bgcolor: "#ffffff",
//           color: "#4c1d95",
//           width: 52,
//           height: 52,
//           fontSize: "20px",
//           fontWeight: 700,
//         }}
//       >
//         {(user?.name || "A").charAt(0)}
//       </Avatar>

//       <Box>
//         <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
//           {user?.name || "Admin"}
//         </Typography>
//         <Typography
//           variant="caption"
//           sx={{ opacity: 0.85, display: "block", mt: 0.2 }}
//         >
//           {user?.email || ""}
//         </Typography>
//       </Box>
//     </Box>

//     <Divider
//       sx={{
//         borderColor: "rgba(255,255,255,0.2)",
//         mb: 2,
//       }}
//     />

//     {/* Menu Title */}
//     <Typography
//       sx={{
//         fontSize: "12px",
//         opacity: 0.7,
//         mt: 1,
//         mb: 0.5,
//         letterSpacing: 1,
//       }}
//     >
//       MAIN MENU
//     </Typography>

//     {/* Menu Items */}
//     <List sx={{ flex: 1 }}>
//       <ListItem
//         component={Link}
//         to="/admin/dashboard"
//         sx={{
//           color: "white",
//           borderRadius: 1,
//           mb: 1,
//           "&:hover": { background: "rgba(255,255,255,0.12)" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "white" }}>
//           <ArticleIcon />
//         </ListItemIcon>
//         <ListItemText primary="Dashboard" />
//       </ListItem>

//       <ListItem
//         component={Link}
//         to="/admin/reports"
//         sx={{
//           color: "white",
//           borderRadius: 1,
//           mb: 1,
//           "&:hover": { background: "rgba(255,255,255,0.12)" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "white" }}>
//           <DescriptionIcon />
//         </ListItemIcon>
//         <ListItemText primary="All Reports" />
//       </ListItem>

//       <ListItem
//         component={Link}
//         to="/admin/pending"
//         sx={{
//           color: "white",
//           borderRadius: 1,
//           mb: 1,
//           "&:hover": { background: "rgba(255,255,255,0.12)" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "white" }}>
//           <EventIcon />
//         </ListItemIcon>
//         <ListItemText primary="Pending Reports" />
//       </ListItem>

//       <ListItem
//         component={Link}
//         to="/admin/approved"
//         sx={{
//           color: "white",
//           borderRadius: 1,
//           mb: 1,
//           "&:hover": { background: "rgba(255,255,255,0.12)" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "white" }}>
//           <BookIcon />
//         </ListItemIcon>
//         <ListItemText primary="Approved Reports" />
//       </ListItem>

//       <ListItem
//         component={Link}
//         to="/admin/users"
//         sx={{
//           color: "white",
//           borderRadius: 1,
//           mb: 1,
//           "&:hover": { background: "rgba(255,255,255,0.12)" },
//         }}
//       >
//         <ListItemIcon sx={{ color: "white" }}>
//           <PeopleIcon />
//         </ListItemIcon>
//         <ListItemText primary="Manage Users" />
//       </ListItem>
//     </List>

//     {/* Logout button */}
//     <Box sx={{ mt: 2 }}>
//       <Button
//         variant="contained"
//         fullWidth
//         startIcon={<LogoutIcon />}
//         sx={{
//           background: "#ef4444",
//           fontWeight: 600,
//           "&:hover": { background: "#dc2626" },
//         }}
//         onClick={() => {
//           logout?.();
//           navigate("/login");
//         }}
//       >
//         Logout
//       </Button>
//     </Box>
//   </Box>
// );


//   // small helpers
//   const formatDate = (d) => {
//     if (!d) return "-";
//     try {
//       return new Date(d).toLocaleDateString();
//     } catch {
//       return d;
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />

//       {/* Top AppBar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           ml: { md: `${drawerWidth}px` },
//           bgcolor: "#fff",
//           color: "#111",
//           boxShadow: "0 2px 6px rgba(16,24,40,0.06)",
//           borderBottom: "4px solid rgba(124,58,237,0.08)",
//         }}
//       >
//         <Toolbar sx={{ minHeight: 64 }}>
//           <IconButton
//             color="inherit"
//             edge="start"
//             sx={{ display: { md: "none" }, mr: 2 }}
//             onClick={() => setMobileOpen(true)}
//           >
//             <MenuIcon />
//           </IconButton>


//           <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 800, color: "#4c1d95" }}>
//             Admin Dashboard
//           </Typography>
//           <Paper
//   sx={{
//     p: 2,
//     mt: 2,
//     borderRadius: 3,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
//     background: "#ffffffaa",
//     backdropFilter: "blur(5px)"
//   }}
// >
//   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//     Welcome back, {user?.name} 👋
//   </Typography>

  
// </Paper>


         
//         </Toolbar>
//       </AppBar>

//       {/* Left Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           [`& .MuiDrawer-paper`]: {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             background: "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
//             color: "white",
//             borderRight: "none",
//             px: 1,
//           },
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* Mobile drawer */}


//       <Drawer
//   anchor="left"
//   open={mobileOpen}
//   onClose={() => setMobileOpen(false)}
//   transitionDuration={300}
//   sx={{
//     display: { md: "none" },
//     "& .MuiDrawer-paper": {
//       width: drawerWidth,
//       boxSizing: "border-box",
//       background:
//         "linear-gradient(180deg,#4c1d95 0%, #7c3aed 60%, #c084fc 100%)",
//       color: "white",
//       borderRight: "none",
//       animation: mobileOpen
//         ? "slideIn 0.3s ease forwards"
//         : "slideOut 0.3s ease forwards",
//     },
//   }}
// >
//   {drawerContent}
//     </Drawer>


//       {/* Main content */}
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
//         {/* Row 1: Stat cards (4 in one row) */}
//         <Grid container spacing={3} alignItems="stretch">
//           <Grid size={{ xs: 12, md: 3 }}>
//             <StatCard
//               title="Total Reports"
//               value={stats.total}
//               subtitle="All reports in the system"
//               icon={<ArticleIcon />}
//               colorStart="#4c1d95"
//               colorEnd="#7c3aed"
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 3 }}>
//             <StatCard
//               title="Conducted"
//               value={stats.conducted}
//               subtitle="FDPs / Events conducted"
//               icon={<EventIcon />}
//               colorStart="#7c3aed"
//               colorEnd="#a78bfa"
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 3 }}>
//             <StatCard
//               title="Attended"
//               value={stats.attended}
//               subtitle="Activities attended by faculty"
//               icon={<BookIcon />}
//               colorStart="#a78bfa"
//               colorEnd="#c084fc"
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 3 }}>
//             <StatCard
//               title="Pending"
//               value={stats.pending}
//               subtitle="Reports awaiting approval"
//               icon={<PeopleIcon />}
//               colorStart="#f59e0b"
//               colorEnd="#fb923c"
//             />
//           </Grid>
//         </Grid>

//         <Box sx={{ height: 24 }} />

//         {/* Row 2: Upcoming Events (full width) */}
//         <Grid container spacing={3}>
//           <Grid size={{ xs: 12 }}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }}>
//               <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
//                 Upcoming Events
//               </Typography>

//               <Stack spacing={2}>
//                 {reports
//                   .filter((r) => r.date && new Date(r.date) >= new Date())
//                   .slice(0, 6)
//                   .map((ev) => (
//                     <Box key={ev._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <Box>
//                         <Typography sx={{ fontWeight: 700 }}>{ev.activityName}</Typography>
//                         <Typography variant="caption" sx={{ color: "text.secondary" }}>
//                           {formatDate(ev.date)} • {ev.reportType}
//                         </Typography>
//                       </Box>
//                       <Chip
//                         label={ev.status}
//                         color={ev.status === "approved" ? "success" : ev.status === "pending" ? "warning" : "error"}
//                         size="small"
//                       />
//                     </Box>
//                   ))}

//                 {reports.filter((r) => r.date && new Date(r.date) >= new Date()).length === 0 && (
//                   <Typography sx={{ color: "text.secondary" }}>No upcoming events</Typography>
//                 )}
//               </Stack>
//             </Paper>
//           </Grid>
//         </Grid>

//         <Box sx={{ height: 24 }} />

//         {/* Row 3: Reports Table (full width) */}
//         <Grid container spacing={3}>
//           <Grid size={{ xs: 12 }}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }}>
//               {/* Search + filters */}
//               <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }} alignItems="center">
//                 <TextField
//                   placeholder="Search by activity or coordinator"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   size="small"
//                   sx={{ width: { xs: "100%", md: "45%" } }}
//                 />

//                 <TextField
//                   select
//                   size="small"
//                   value={typeFilter}
//                   onChange={(e) => setTypeFilter(e.target.value)}
//                   sx={{ minWidth: 160 }}
//                 >
//                   {typeOptions.map((o) => (
//                     <MenuItem key={o.value} value={o.value}>
//                       {o.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <TextField
//                   select
//                   size="small"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   sx={{ minWidth: 160 }}
//                 >
//                   {statusOptions.map((o) => (
//                     <MenuItem key={o.value} value={o.value}>
//                       {o.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <Box sx={{ flex: 1 }} />
//                 <Button variant="contained" onClick={() => { setQuery(""); setTypeFilter("all"); setStatusFilter("all"); }}>
//                   Reset Filters
//                 </Button>
//               </Stack>

//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 700, cursor: "pointer" }} onClick={() => { setSortBy("activityName"); setSortDir((d) => (d === "asc" ? "desc" : "asc")); }}>
//                         Activity
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
//                       <TableCell sx={{ fontWeight: 700, cursor: "pointer" }} onClick={() => { setSortBy("date"); setSortDir((d) => (d === "asc" ? "desc" : "asc")); }}>
//                         Date
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
//                       <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//   {loading && (
//     <TableRow>
//       <TableCell colSpan={6} align="center">Loading...</TableCell>
//     </TableRow>
//   )}

//   {!loading && filtered.length === 0 && (
//     <TableRow>
//       <TableCell colSpan={6} align="center">
//         No reports found
//       </TableCell>
//     </TableRow>
//   )}

//   {!loading &&
//     filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
//       <TableRow key={r._id} hover>
//         <TableCell>{r.activityName}</TableCell>
//         <TableCell>{r.reportType}</TableCell>
//         <TableCell>{formatDate(r.date)}</TableCell>
//         <TableCell>
//           <Chip
//             label={r.status}
//             color={
//               r.status === "approved"
//                 ? "success"
//                 : r.status === "pending"
//                 ? "warning"
//                 : "error"
//             }
//             size="small"
//           />
//         </TableCell>
//         <TableCell>
//           <Link
//             to={`/admin/report/${r._id}`}
//             style={{ color: "#6d28d9", fontWeight: 700 }}
//           >
//             View
//           </Link>
//         </TableCell>

//         {/* APPROVE / REJECT BUTTONS */}
//         <TableCell>
//   <Stack direction="row" spacing={1}>
//     <Button
//       onClick={() => handleApprove(r._id)}
//       sx={{
//         textTransform: "none",
//         px: 2,
//         py: "4px",
//         borderRadius: "8px",
//         fontWeight: 600,
//         border: "1px solid #22c55e",
//         color: "#22c55e",
//         background: "#22c55e20",
//         "&:hover": { background: "#22c55e", color: "#fff" }
//       }}
//       disabled={r.status !== "pending"}
//     >
//       Approve
//     </Button>

//     <Button
//       onClick={() => handleReject(r._id)}
//       sx={{
//         textTransform: "none",
//         px: 2,
//         py: "4px",
//         borderRadius: "8px",
//         fontWeight: 600,
//         border: "1px solid #ef4444",
//         color: "#ef4444",
//         background: "#ef444420",
//         "&:hover": { background: "#ef4444", color: "#fff" }
//       }}
//       disabled={r.status !== "pending"}
//     >
//       Reject
//     </Button>
//   </Stack>
// </TableCell>

//       </TableRow>
//     ))}
// </TableBody>

//                 </Table>
//               </TableContainer>

//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//                 <Typography variant="caption">Showing {Math.min(filtered.length, (page + 1) * rowsPerPage)} of {filtered.length}</Typography>

//                 <TablePagination
//                   component="div"
//                   count={filtered.length}
//                   page={page}
//                   onPageChange={(e, newPage) => setPage(newPage)}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//                   rowsPerPageOptions={[10, 25, 50, 100]}
//                 />
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>

//         <Box sx={{ height: 24 }} />

       
//       </Box>
//     </Box>
//   );
// }





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





