// // client/src/pages/Admin/UsersList.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Avatar,
//   IconButton,
//   MenuItem,
//   Select,
//   Stack,
//   Button,
//   Grow,
//   Tooltip,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   PersonAdd as PersonAddIcon,
//   ArrowUpward as PromoteIcon,
//   ArrowDownward as DemoteIcon,
// } from "@mui/icons-material";
// import axiosClient from "../../utils/axiosClient";
// import { Link, useParams, useNavigate } from "react-router-dom";


// export default function UsersList() {
//   const params = useParams(); // may contain role like 'faculty' or 'admins'
//   const navigate = useNavigate();

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rowsPerPage] = useState(50); // you can add pagination later
//   const [filterRole, setFilterRole] = useState(params.role || "all");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     setFilterRole(params.role || "all");
//   }, [params.role]);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosClient.get("/auth/users");
//         if (mounted) setUsers(res.data || []);
//       } catch (err) {
//         console.error("Failed to load users", err);
//         if (mounted) setUsers([]);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, []);

//   // filtered list computed
//   const visible = useMemo(() => {
//     let list = [...users];
//     if (filterRole && filterRole !== "all") {
//       if (filterRole === "admins") list = list.filter((u) => u.role === "admin");
//       else list = list.filter((u) => u.role === filterRole);
//     }
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(
//         (u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
//       );
//     }
//     return list;
//   }, [users, filterRole, search]);

//   // // Promote / Demote
//   // const changeRole = async (id, role) => {
//   //   if (!window.confirm(`Change user role to "${role}" ?`)) return;
//   //   try {
//   //     const res = await axiosClient.put(`/auth/users/${id}/role`, { role });
//   //     setUsers((prev) => prev.map((p) => (p._id === id ? res.data : p)));
//   //   } catch (err) {
//   //     console.error("Update role failed", err);
//   //     alert("Failed to update role");
//   //   }
//   // };

//   // Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user? This action cannot be undone.")) return;
//     try {
//       await axiosClient.delete(`/auth/users/${id}`);
//       setUsers((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <Box>
//       <Paper
//         sx={{
//           p: 3,
//           borderRadius: 3,
//           mb: 3,
//           background: "rgba(255,255,255,0.6)",
//           backdropFilter: "blur(6px)",
//           boxShadow: "0 12px 30px rgba(16,24,40,0.06)",
//         }}
//       >
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 800 }}>
//               Manage Users
//             </Typography>
//             <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
//               Create, promote/demote, or remove users. Admin-only.
//             </Typography>
//           </Box>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <Select
//               size="small"
//               value={filterRole}
//               onChange={(e) => {
//                 setFilterRole(e.target.value);
//                 // navigate so URL matches (optional)
//                 const role = e.target.value === "all" ? "" : e.target.value === "admin" ? "admins" : e.target.value;
//                 navigate(`/admin/users${role ? "/" + role : ""}`);
//               }}
//             >
//               <MenuItem value="all">All Roles</MenuItem>
//               <MenuItem value="faculty">Faculty</MenuItem>
//               <MenuItem value="admin">Admins</MenuItem>
//             </Select>

//             <input
//               placeholder="Search name or email"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 padding: 8,
//                 borderRadius: 8,
//                 border: "1px solid #e5e7eb",
//                 minWidth: 220,
//                 outline: "none",
//                 background: "white",
//               }}
//             />

//             <Button
//               variant="contained"
//               startIcon={<PersonAddIcon />}
//               component={Link}
//               to="/admin/users/add"
//               sx={{ textTransform: "none" }}
//             >
//               Add User
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 12px 30px rgba(16,24,40,0.06)" }}>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ background: "rgba(0,0,0,0.02)" }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
//                 <TableCell sx={{ fontWeight: 700 }} align="right">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading && (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading && visible.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
//                     No users found
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 visible.map((u, idx) => (
//                   <Grow in key={u._id} style={{ transformOrigin: "0 0 0" }} timeout={200 + idx * 60}>
//                     <TableRow hover>
//                       <TableCell>
//                         <Stack direction="row" spacing={2} alignItems="center">
//                           <Avatar sx={{ bgcolor: "#6d28d9" }}>{(u.name || "U").charAt(0)}</Avatar>
//                           <Box>
//                             <Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>
//                             <Typography variant="caption" sx={{ color: "text.secondary" }}>
//                               {u.department || ""}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>

//                       <TableCell>
//                         <Typography sx={{ fontWeight: 600 }}>{u.email}</Typography>
//                       </TableCell>

//                       <TableCell>
//                         <Select
//                           size="small"
//                           value={u.role}
//                           onChange={(e) => changeRole(u._id, e.target.value)}
//                           sx={{ minWidth: 120 }}
//                         >
//                           <MenuItem value="faculty">Faculty</MenuItem>
//                           <MenuItem value="hod">HOD</MenuItem>
//                           <MenuItem value="admin">Admin</MenuItem>
//                           <MenuItem value="principal">Principal</MenuItem>
//                         </Select>
//                       </TableCell>

//                       <TableCell>{new Date(u.createdAt || u._id?.slice(0,8) || Date.now()).toLocaleDateString()}</TableCell>

//                       <TableCell align="right">
//                         <Stack direction="row" spacing={1} justifyContent="flex-end">
//                           <Tooltip title="Edit (not implemented)">
//                             <span>
//                               <IconButton size="small" component={Link} to={`/admin/users/${u._id}/edit`}>
//                                 <EditIcon fontSize="small" />
//                               </IconButton>
//                             </span>
//                           </Tooltip>

//                           <Tooltip title="Delete user">
//                             <span>
//                               <IconButton size="small" color="error" onClick={() => handleDelete(u._id)}>
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             </span>
//                           </Tooltip>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   </Grow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }



// client/src/pages/Admin/UsersList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import axiosClient from "../../utils/axiosClient";

export default function UsersList({ roleFilter }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    load();
  }, []);

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosClient.delete(`/auth/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {roleFilter ? `${roleFilter.toUpperCase()} Users` : "All Users"}
      </Typography>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Stack spacing={3}>
          {filteredUsers.length === 0 && (
            <Typography>No users found.</Typography>
          )}

          {filteredUsers.map((user) => (
            <Paper
              key={user._id}
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#7c3aed" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.7 }}>{user.email}</Typography>
                </Box>
              </Stack>

              {/* ROLE DISPLAY – NOT EDITABLE */}
              <Tooltip title="Role cannot be changed" arrow>
                <Box
                  sx={{
                    px: 2,
                    py: 0.7,
                    borderRadius: 2,
                    bgcolor: "#ede9fe",
                    color: "#4c1d95",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {user.role}
                </Box>
              </Tooltip>

              {/* DELETE BUTTON */}
              <IconButton color="error" onClick={() => handleDelete(user._id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
