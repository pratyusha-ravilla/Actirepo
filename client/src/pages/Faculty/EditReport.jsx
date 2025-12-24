




// // client/src/pages/Faculty/EditReport.jsx

// import React, { useEffect, useState, useContext } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
// } from "@mui/material";
// import axiosClient from "../../utils/axiosClient";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// export default function EditReport() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState({
//     reportType: "conducted",
//     academicYear: "",
//     activityName: "",
//     coordinator: "",
//     date: "",
//     duration: "",
//     poPos: "",
//     resourceName: "",
//     resourceDesignation: "",
//     resourceInstitution: "",
//     sessionSummary: "",
//     participantsCount: "",
//     facultyCount: "",
//     feedback: "",
//   });

//   const [previews, setPreviews] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });
//   const [existing, setExisting] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosClient.get(`/activity/${id}`);
//         const data = res.data;

//         setForm({
//           reportType: data.reportType || "conducted",
//           academicYear: data.academicYear || "",
//           activityName: data.activityName || "",
//           coordinator: data.coordinator || "",
//           date: data.date || "",
//           duration: data.duration || "",
//           poPos: data.poPos || "",
//           resourceName: data.resourcePerson?.name || "",
//           resourceDesignation: data.resourcePerson?.designation || "",
//           resourceInstitution: data.resourcePerson?.institution || "",
//           sessionSummary: data.sessionReport?.summary || "",
//           participantsCount: data.sessionReport?.participantsCount || "",
//           facultyCount: data.sessionReport?.facultyCount || "",
//           feedback: data.feedback || "",
//         });

//         const base = axiosClient.defaults.baseURL.replace("/api", "");
//         setExisting({
//           invitation: data.invitation ? `${base}/${data.invitation}` : null,
//           poster: data.poster ? `${base}/${data.poster}` : null,
//           resourcePhoto: data.resourcePerson?.photo ? `${base}/${data.resourcePerson.photo}` : null,
//           photos: (data.photos || []).map((p) => `${base}/${p}`),
//         });
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load report");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   const previewFile = (e, key) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(f) }));
//   };

//   const previewMultiple = (e) => {
//     const arr = Array.from(e.target.files);
//     setPreviews((p) => ({ ...p, photos: arr.map((f) => URL.createObjectURL(f)) }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       const fd = new FormData();
//       const payload = {
//         ...form,
//         updatedBy: user?.id,
//       };
//       fd.append("payload", JSON.stringify(payload));

//       if (e.target.invitation?.files?.[0]) fd.append("invitation", e.target.invitation.files[0]);
//       if (e.target.poster?.files?.[0]) fd.append("poster", e.target.poster.files[0]);
//       if (e.target.resourcePhoto?.files?.[0]) fd.append("resourcePhoto", e.target.resourcePhoto.files[0]);
//       if (e.target.attendanceFile?.files?.[0]) fd.append("attendanceFile", e.target.attendanceFile.files[0]);

//       const photos = e.target.photos?.files || [];
//       for (let i = 0; i < photos.length; i++) fd.append("photos", photos[i]);

//       await axiosClient.put(`/activity/${id}`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Report updated");
//       navigate(`/faculty/report/${id}`);
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;

//   return (
//     <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Edit Activity Report
//         </Typography>

//         <form onSubmit={handleUpdate}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 select
//                 label="Report Type"
//                 value={form.reportType}
//                 fullWidth
//                 onChange={(e) => setForm({ ...form, reportType: e.target.value })}
//               >
//                 <MenuItem value="conducted">Conducted</MenuItem>
//                 <MenuItem value="attended">Attended</MenuItem>
//                 <MenuItem value="expert_talk">Expert Talk</MenuItem>
//               </TextField>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Activity Name"
//                 fullWidth
//                 value={form.activityName}
//                 onChange={(e) => setForm({ ...form, activityName: e.target.value })}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 label="Coordinator"
//                 fullWidth
//                 value={form.coordinator}
//                 onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="Duration" fullWidth value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="PO & POs" fullWidth value={form.poPos} onChange={(e) => setForm({ ...form, poPos: e.target.value })} />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>Invitation</Typography>
//               <input name="invitation" type="file" onChange={(e) => previewFile(e, "invitation")} />
//               {previews.invitation ? <img src={previews.invitation} style={{ width: 200 }} /> : existing.invitation ? <img src={existing.invitation} style={{ width: 200 }} /> : null}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>Poster</Typography>
//               <input name="poster" type="file" onChange={(e) => previewFile(e, "poster")} />
//               {previews.poster ? <img src={previews.poster} style={{ width: 200 }} /> : existing.poster ? <img src={existing.poster} style={{ width: 200 }} /> : null}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Resource Person</Typography>
//               <Grid container spacing={2} sx={{ mt: 1 }}>
//                 <Grid item xs={12} md={6}><TextField label="Name" fullWidth value={form.resourceName} onChange={(e) => setForm({ ...form, resourceName: e.target.value })} /></Grid>
//                 <Grid item xs={12} md={3}><TextField label="Designation" fullWidth value={form.resourceDesignation} onChange={(e) => setForm({ ...form, resourceDesignation: e.target.value })} /></Grid>
//                 <Grid item xs={12} md={3}><TextField label="Institution" fullWidth value={form.resourceInstitution} onChange={(e) => setForm({ ...form, resourceInstitution: e.target.value })} /></Grid>
//               </Grid>

//               <Box sx={{ mt: 1 }}>
//                 <input name="resourcePhoto" type="file" onChange={(e) => previewFile(e, "resourcePhoto")} />
//                 {previews.resourcePhoto ? <img src={previews.resourcePhoto} style={{ width: 120 }} /> : existing.resourcePhoto ? <img src={existing.resourcePhoto} style={{ width: 120 }} /> : null}
//               </Box>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Session Report</Typography>
//               <TextField multiline rows={4} fullWidth value={form.sessionSummary} onChange={(e) => setForm({ ...form, sessionSummary: e.target.value })} sx={{ mt: 1 }} />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField label="Students Present" type="number" fullWidth value={form.participantsCount} onChange={(e) => setForm({ ...form, participantsCount: e.target.value })} />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField label="Faculty Present" type="number" fullWidth value={form.facultyCount} onChange={(e) => setForm({ ...form, facultyCount: e.target.value })} />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Attendance File</Typography>
//               <input name="attendanceFile" type="file" />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Event Photos</Typography>
//               <input name="photos" type="file" multiple onChange={previewMultiple} />
//               <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                 {previews.photos.length > 0 ? previews.photos.map((u, i) => <img key={i} src={u} style={{ width: 120 }} />) : existing.photos.map((u, i) => <img key={i} src={u} style={{ width: 120 }} />)}
//               </Box>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField multiline rows={3} label="Feedback" fullWidth value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
//               <Button variant="contained" type="submit" disabled={saving} onClick={handleUpdate}>{saving ? "Saving..." : "Update Report"}</Button>
//               <Button variant="outlined" onClick={() => navigate(`/faculty/report/${id}`)}>Cancel</Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Box>
//   );
// }




// // // client/src/pages/Faculty/EditReport.jsx

// import React, { useEffect, useState, useContext } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
// } from "@mui/material";
// import axiosClient from "../../utils/axiosClient";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// export default function EditReport() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState({
//     reportType: "conducted",
//     academicYear: "",
//     activityName: "",
//     coordinator: "",
//     date: "",
//     duration: "",
//     poPos: "",
//     resourceName: "",
//     resourceDesignation: "",
//     resourceInstitution: "",

//     // session fields
//     sessionName: "",
//     coordinatorsText: "",
//     googleMeetLink: "",
//     intendedParticipants: "",
//     categoryOfEvent: "",
//     sessionDate: "",

//     sessionSummary: "",
//     participantsCount: "",
//     facultyCount: "",

//     feedback: "",
//   });

//   const [previews, setPreviews] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });
//   const [existing, setExisting] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosClient.get(`/activity/${id}`);
//         const data = res.data;

//         // sessionReport may be absent — use fallbacks
//         const sr = data.sessionReport || {};

//         // coordinators (array -> text)
//         const coordsText = Array.isArray(sr.coordinators) ? sr.coordinators.join(", ") : (sr.coordinators || "");

//         setForm({
//           reportType: data.reportType || "conducted",
//           academicYear: data.academicYear || "",
//           activityName: data.activityName || "",
//           coordinator: data.coordinator || "",
//           date: data.date || "",
//           duration: data.duration || "",
//           poPos: data.poPos || "",
//           resourceName: data.resourcePerson?.name || "",
//           resourceDesignation: data.resourcePerson?.designation || "",
//           resourceInstitution: data.resourcePerson?.institution || "",

//           // session fields loaded
//           sessionName: sr.sessionName || "",
//           coordinatorsText: coordsText,
//           googleMeetLink: sr.googleMeetLink || "",
//           intendedParticipants: sr.intendedParticipants || "",
//           categoryOfEvent: sr.categoryOfEvent || "",
//           sessionDate: sr.date || "",

//           sessionSummary: sr.summary || data.sessionReport?.summary || "",
//           participantsCount: sr.participantsCount || data.sessionReport?.participantsCount || "",
//           facultyCount: sr.facultyCount || data.sessionReport?.facultyCount || "",

//           feedback: data.feedback || "",
//         });

//         const base = axiosClient.defaults.baseURL.replace("/api", "");
//         setExisting({
//           invitation: data.invitation ? `${base}/${data.invitation}` : null,
//           poster: data.poster ? `${base}/${data.poster}` : null,
//           resourcePhoto: data.resourcePerson?.photo ? `${base}/${data.resourcePerson.photo}` : null,
//           photos: (data.photos || []).map((p) => `${base}/${p}`),
//         });
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load report");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   const previewFile = (e, key) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(f) }));
//   };

//   const previewMultiple = (e) => {
//     const arr = Array.from(e.target.files);
//     setPreviews((p) => ({ ...p, photos: arr.map((f) => URL.createObjectURL(f)) }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       const fd = new FormData();

//       // coordinatorsText -> array
//       const coordinatorsArr = form.coordinatorsText
//         ? form.coordinatorsText.split(",").map((s) => s.trim()).filter(Boolean)
//         : [];

//       const payload = {
//         ...form,
//         updatedBy: user?.id,
//         // embed resourcePerson and sessionReport properly
//         resourcePerson: {
//           name: form.resourceName,
//           designation: form.resourceDesignation,
//           institution: form.resourceInstitution,
//         },
//         sessionReport: {
//           sessionName: form.sessionName,
//           coordinators: coordinatorsArr,
//           googleMeetLink: form.googleMeetLink,
//           intendedParticipants: form.intendedParticipants,
//           categoryOfEvent: form.categoryOfEvent,
//           date: form.sessionDate,
//           summary: form.sessionSummary,
//           participantsCount: form.participantsCount,
//           facultyCount: form.facultyCount,
//         },
//       };

//       fd.append("payload", JSON.stringify(payload));

//       if (e.target.invitation?.files?.[0]) fd.append("invitation", e.target.invitation.files[0]);
//       if (e.target.poster?.files?.[0]) fd.append("poster", e.target.poster.files[0]);
//       if (e.target.resourcePhoto?.files?.[0]) fd.append("resourcePhoto", e.target.resourcePhoto.files[0]);
//       if (e.target.attendanceFile?.files?.[0]) fd.append("attendanceFile", e.target.attendanceFile.files[0]);

//       const photos = e.target.photos?.files || [];
//       for (let i = 0; i < photos.length; i++) fd.append("photos", photos[i]);

//       await axiosClient.put(`/activity/${id}`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Report updated");
//       navigate(`/faculty/report/${id}`);
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;

//   return (
//     <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Edit Activity Report
//         </Typography>

//         <form onSubmit={handleUpdate}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 select
//                 label="Report Type"
//                 value={form.reportType}
//                 fullWidth
//                 onChange={(e) => setForm({ ...form, reportType: e.target.value })}
//               >
//                 <MenuItem value="conducted">Conducted</MenuItem>
//                 <MenuItem value="attended">Attended</MenuItem>
//                 <MenuItem value="expert_talk">Expert Talk</MenuItem>
//               </TextField>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 label="Activity Name"
//                 fullWidth
//                 value={form.activityName}
//                 onChange={(e) => setForm({ ...form, activityName: e.target.value })}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 label="Coordinator"
//                 fullWidth
//                 value={form.coordinator}
//                 onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="Duration" fullWidth value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField label="PO & POs" fullWidth value={form.poPos} onChange={(e) => setForm({ ...form, poPos: e.target.value })} />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>Invitation</Typography>
//               <input name="invitation" type="file" onChange={(e) => previewFile(e, "invitation")} />
//               {previews.invitation ? <img src={previews.invitation} style={{ width: 200 }} /> : existing.invitation ? <img src={existing.invitation} style={{ width: 200 }} /> : null}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>Poster</Typography>
//               <input name="poster" type="file" onChange={(e) => previewFile(e, "poster")} />
//               {previews.poster ? <img src={previews.poster} style={{ width: 200 }} /> : existing.poster ? <img src={existing.poster} style={{ width: 200 }} /> : null}
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Resource Person</Typography>
//               <Grid container spacing={2} sx={{ mt: 1 }}>
//                 <Grid item xs={12} md={6}><TextField label="Name" fullWidth value={form.resourceName} onChange={(e) => setForm({ ...form, resourceName: e.target.value })} /></Grid>
//                 <Grid item xs={12} md={3}><TextField label="Designation" fullWidth value={form.resourceDesignation} onChange={(e) => setForm({ ...form, resourceDesignation: e.target.value })} /></Grid>
//                 <Grid item xs={12} md={3}><TextField label="Institution" fullWidth value={form.resourceInstitution} onChange={(e) => setForm({ ...form, resourceInstitution: e.target.value })} /></Grid>
//               </Grid>

//               <Box sx={{ mt: 1 }}>
//                 <input name="resourcePhoto" type="file" onChange={(e) => previewFile(e, "resourcePhoto")} />
//                 {previews.resourcePhoto ? <img src={previews.resourcePhoto} style={{ width: 120 }} /> : existing.resourcePhoto ? <img src={existing.resourcePhoto} style={{ width: 120 }} /> : null}
//               </Box>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Session Report</Typography>

//               <Grid container spacing={2} sx={{ mt: 1 }}>
//                 <Grid item xs={12}>
//                   <TextField label="Session Name" fullWidth value={form.sessionName} onChange={(e) => setForm({ ...form, sessionName: e.target.value })} />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField label="Co-ordinator(s) (comma separated)" fullWidth value={form.coordinatorsText} onChange={(e) => setForm({ ...form, coordinatorsText: e.target.value })} helperText="Enter multiple names separated by commas" />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField label="Google Meet / Link" fullWidth value={form.googleMeetLink} onChange={(e) => setForm({ ...form, googleMeetLink: e.target.value })} />
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <TextField label="Intended Participants" fullWidth value={form.intendedParticipants} onChange={(e) => setForm({ ...form, intendedParticipants: e.target.value })} />
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <TextField label="Category of Event" fullWidth value={form.categoryOfEvent} onChange={(e) => setForm({ ...form, categoryOfEvent: e.target.value })} />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField multiline rows={4} fullWidth value={form.sessionSummary} onChange={(e) => setForm({ ...form, sessionSummary: e.target.value })} sx={{ mt: 1 }} />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField label="Students Present" type="number" fullWidth value={form.participantsCount} onChange={(e) => setForm({ ...form, participantsCount: e.target.value })} />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField label="Faculty Present" type="number" fullWidth value={form.facultyCount} onChange={(e) => setForm({ ...form, facultyCount: e.target.value })} />
//                 </Grid>
//               </Grid>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Attendance File</Typography>
//               <input name="attendanceFile" type="file" />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Event Photos</Typography>
//               <input name="photos" type="file" multiple onChange={previewMultiple} />
//               <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                 {previews.photos.length > 0 ? previews.photos.map((u, i) => <img key={i} src={u} style={{ width: 120 }} />) : existing.photos.map((u, i) => <img key={i} src={u} style={{ width: 120 }} />)}
//               </Box>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField multiline rows={3} label="Feedback" fullWidth value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />
//             </Grid>

//             <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
//               <Button variant="contained" type="submit" disabled={saving} onClick={handleUpdate}>{saving ? "Saving..." : "Update Report"}</Button>
//               <Button variant="outlined" onClick={() => navigate(`/faculty/report/${id}`)}>Cancel</Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Box>
//   );
// }




// client/src/pages/Faculty/EditReport.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    reportType: "conducted",
    academicYear: "",
    activityName: "",
    coordinator: "",
    date: "",
    duration: "",
    poPos: "",
    resourceName: "",
    resourceDesignation: "",
    resourceInstitution: "",

    // session fields
    sessionName: "",
    coordinatorsText: "",
    googleMeetLink: "",
    intendedParticipants: "",
    categoryOfEvent: "",
    sessionDate: "",
    sessionSummary: "",
    participantsCount: "",
    facultyCount: "",

    feedback: "",
  });

  const [previews, setPreviews] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceImages: [],
    photos: [],
  });

  const [existing, setExisting] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceImages: [],
    photos: [],
  });

  // -----------------------------
  // LOAD REPORT DATA
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/activity/${id}`);
        const data = res.data;

        const sr = data.sessionReport || {};

        const coordsText = Array.isArray(sr.coordinators)
          ? sr.coordinators.join(", ")
          : sr.coordinators || "";

        setForm({
          reportType: data.reportType || "conducted",
          academicYear: data.academicYear || "",
          activityName: data.activityName || "",
          coordinator: data.coordinator || "",
          date: data.date || "",
          duration: data.duration || "",
          poPos: data.poPos || "",

          resourceName: data.resourcePerson?.name || "",
          resourceDesignation: data.resourcePerson?.designation || "",
          resourceInstitution: data.resourcePerson?.institution || "",

          sessionName: sr.sessionName || "",
          coordinatorsText: coordsText,
          googleMeetLink: sr.googleMeetLink || "",
          intendedParticipants: sr.intendedParticipants || "",
          categoryOfEvent: sr.categoryOfEvent || "",
          sessionDate: sr.date || "",
          sessionSummary: sr.summary || "",
          participantsCount: sr.participantsCount || "",
          facultyCount: sr.facultyCount || "",

          feedback: data.feedback || "",
        });

        const base = axiosClient.defaults.baseURL.replace("/api", "");

        setExisting({
          invitation: data.invitation ? `${base}/${data.invitation}` : null,
          poster: data.poster ? `${base}/${data.poster}` : null,
          resourcePhoto: data.resourcePerson?.photo
            ? `${base}/${data.resourcePerson.photo}`
            : null,
          attendanceImages: (data.attendanceImages || []).map(
            (p) => `${base}/${p}`
          ),
          photos: (data.photos || []).map((p) => `${base}/${p}`),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // -----------------------------
  // FILE PREVIEWS
  // -----------------------------
  const previewFile = (e, key) => {
    const f = e.target.files[0];
    if (!f) return;
    setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(f) }));
  };

  const previewAttendanceImages = (e) => {
    const arr = Array.from(e.target.files || []);
    setPreviews((p) => ({
      ...p,
      attendanceImages: arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  const previewMultiplePhotos = (e) => {
    const arr = Array.from(e.target.files);
    setPreviews((p) => ({
      ...p,
      photos: arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  // -----------------------------
  // UPDATE REPORT
  // -----------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();

      const coordinatorsArr = form.coordinatorsText
        ? form.coordinatorsText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...form,
        updatedBy: user?.id,
        resourcePerson: {
          name: form.resourceName,
          designation: form.resourceDesignation,
          institution: form.resourceInstitution,
        },
        sessionReport: {
          sessionName: form.sessionName,
          coordinators: coordinatorsArr,
          googleMeetLink: form.googleMeetLink,
          intendedParticipants: form.intendedParticipants,
          categoryOfEvent: form.categoryOfEvent,
          date: form.sessionDate,
          summary: form.sessionSummary,
          participantsCount: form.participantsCount,
          facultyCount: form.facultyCount,
        },
      };

      fd.append("payload", JSON.stringify(payload));

      // single files
      if (e.target.invitation?.files?.[0])
        fd.append("invitation", e.target.invitation.files[0]);
      if (e.target.poster?.files?.[0])
        fd.append("poster", e.target.poster.files[0]);
      if (e.target.resourcePhoto?.files?.[0])
        fd.append("resourcePhoto", e.target.resourcePhoto.files[0]);

      // attendance file (PDF/XLSX)
      if (e.target.attendanceFile?.files?.[0])
        fd.append("attendanceFile", e.target.attendanceFile.files[0]);

      // attendance images (multiple)
      const attImgs = e.target.attendanceImages?.files || [];
      for (let i = 0; i < attImgs.length; i++) {
        fd.append("attendanceImages", attImgs[i]);
      }

      // event photos
      const photos = e.target.photos?.files || [];
      for (let i = 0; i < photos.length; i++) fd.append("photos", photos[i]);

      await axiosClient.put(`/activity/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Report updated");
      navigate(`/faculty/report/${id}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;

  // -----------------------------
  // UI RENDER
  // -----------------------------
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Edit Activity Report
        </Typography>

        <form onSubmit={handleUpdate}>
          <Grid container spacing={2}>

            {/* ACTIVITY DETAILS */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Report Type"
                value={form.reportType}
                fullWidth
                onChange={(e) => setForm({ ...form, reportType: e.target.value })}
              >
                <MenuItem value="conducted">Conducted</MenuItem>
                <MenuItem value="attended">Attended</MenuItem>
                <MenuItem value="expert_talk">Expert Talk</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Activity Name"
                fullWidth
                value={form.activityName}
                onChange={(e) => setForm({ ...form, activityName: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Coordinator"
                fullWidth
                value={form.coordinator}
                onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Duration"
                fullWidth
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="PO & POs"
                fullWidth
                value={form.poPos}
                onChange={(e) => setForm({ ...form, poPos: e.target.value })}
              />
            </Grid>

            {/* INVITATION */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Invitation</Typography>
              <input name="invitation" type="file" onChange={(e) => previewFile(e, "invitation")} />
              {previews.invitation ? (
                <img src={previews.invitation} style={{ width: 200 }} />
              ) : existing.invitation ? (
                <img src={existing.invitation} style={{ width: 200 }} />
              ) : null}
            </Grid>

            {/* POSTER */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Poster</Typography>
              <input name="poster" type="file" onChange={(e) => previewFile(e, "poster")} />
              {previews.poster ? (
                <img src={previews.poster} style={{ width: 200 }} />
              ) : existing.poster ? (
                <img src={existing.poster} style={{ width: 200 }} />
              ) : null}
            </Grid>

            {/* RESOURCE PERSON */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Resource Person</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={form.resourceName}
                    onChange={(e) => setForm({ ...form, resourceName: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Designation"
                    fullWidth
                    value={form.resourceDesignation}
                    onChange={(e) => setForm({ ...form, resourceDesignation: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Institution"
                    fullWidth
                    value={form.resourceInstitution}
                    onChange={(e) => setForm({ ...form, resourceInstitution: e.target.value })}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 1 }}>
                <input name="resourcePhoto" type="file" onChange={(e) => previewFile(e, "resourcePhoto")} />
                {previews.resourcePhoto ? (
                  <img src={previews.resourcePhoto} style={{ width: 120 }} />
                ) : existing.resourcePhoto ? (
                  <img src={existing.resourcePhoto} style={{ width: 120 }} />
                ) : null}
              </Box>
            </Grid>

            {/* SESSION REPORT */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Session Report</Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Session Name"
                    fullWidth
                    value={form.sessionName}
                    onChange={(e) => setForm({ ...form, sessionName: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Co-ordinator(s)"
                    fullWidth
                    helperText="Separate multiple names with commas"
                    value={form.coordinatorsText}
                    onChange={(e) => setForm({ ...form, coordinatorsText: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Google Meet Link"
                    fullWidth
                    value={form.googleMeetLink}
                    onChange={(e) => setForm({ ...form, googleMeetLink: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Intended Participants"
                    fullWidth
                    value={form.intendedParticipants}
                    onChange={(e) => setForm({ ...form, intendedParticipants: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Category of Event"
                    fullWidth
                    value={form.categoryOfEvent}
                    onChange={(e) => setForm({ ...form, categoryOfEvent: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={4}
                    label="Summary"
                    fullWidth
                    value={form.sessionSummary}
                    onChange={(e) => setForm({ ...form, sessionSummary: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Students Present"
                    type="number"
                    fullWidth
                    value={form.participantsCount}
                    onChange={(e) => setForm({ ...form, participantsCount: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Faculty Present"
                    type="number"
                    fullWidth
                    value={form.facultyCount}
                    onChange={(e) => setForm({ ...form, facultyCount: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* ATTENDANCE FILE */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Attendance File (PDF/XLSX)</Typography>
              <input name="attendanceFile" type="file" />
            </Grid>

            {/* ATTENDANCE IMAGES */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Attendance Images (Multiple)</Typography>
              <input name="attendanceImages" type="file" accept="image/*" multiple onChange={previewAttendanceImages} />

              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                {previews.attendanceImages.length > 0
                  ? previews.attendanceImages.map((src, i) => (
                      <img key={i} src={src} style={{ width: 150, borderRadius: 6 }} />
                    ))
                  : existing.attendanceImages.map((src, i) => (
                      <img key={i} src={src} style={{ width: 150, borderRadius: 6 }} />
                    ))}
              </Box>
            </Grid>

            {/* EVENT PHOTOS */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Event Photos</Typography>
              <input name="photos" type="file" multiple onChange={previewMultiplePhotos} />

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {previews.photos.length > 0
                  ? previews.photos.map((u, i) => (
                      <img key={i} src={u} style={{ width: 120 }} />
                    ))
                  : existing.photos.map((u, i) => (
                      <img key={i} src={u} style={{ width: 120 }} />
                    ))}
              </Box>
            </Grid>

            {/* FEEDBACK */}
            <Grid item xs={12}>
              <TextField
                multiline
                rows={3}
                label="Feedback"
                fullWidth
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              />
            </Grid>

            {/* BUTTONS */}
            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Update Report"}
              </Button>
              <Button variant="outlined" onClick={() => navigate(`/faculty/report/${id}`)}>
                Cancel
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
