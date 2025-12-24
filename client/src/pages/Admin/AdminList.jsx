// import React, { useEffect, useState } from "react";
// import {
//   Box, Paper, Typography, TextField, Table,
//   TableContainer, TableHead, TableRow, TableCell, TableBody,
//   Button
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import axiosClient from "../../utils/axiosClient";

// export default function AdminList() {
//   const [admins, setAdmins] = useState([]);
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const res = await axiosClient.get("/auth/users");
//     setAdmins(res.data.filter((u) =>
//       ["admin", "hod", "principal"].includes(u.role)
//     ));
//   };

//   const filtered = admins.filter((u) =>
//     u.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
//         Admin / HOD / Principal
//       </Typography>

//       <Stack direction="row" spacing={2}>
//         <TextField
//           placeholder="Search admins..."
//           size="small"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           sx={{ width: "40%" }}
//         />

//         <Button variant="contained" component={Link} to="/admin/users/add">
//           ➕ Add Admin
//         </Button>
//       </Stack>

//       <Paper sx={{ p: 2, mt: 3, borderRadius: 3 }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Name</b></TableCell>
//                 <TableCell><b>Email</b></TableCell>
//                 <TableCell><b>Role</b></TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filtered.map((u) => (
//                 <TableRow key={u._id}>
//                   <TableCell>{u.name}</TableCell>
//                   <TableCell>{u.email}</TableCell>
//                   <TableCell>{u.role}</TableCell>
//                 </TableRow>
//               ))}

//               {filtered.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center">
//                     No admin users found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }



// client/src/pages/Admin/AdminList.jsx
import React from "react";
import UsersList from "./UsersList";

export default function AdminList() {
  return <UsersList roleFilter="admin" />;
}
