



// client/src/pages/Faculty/ViewMyReports.jsx.jsx

import React, { useEffect, useState, useContext } from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ViewMyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const backend = axiosClient.defaults.baseURL.replace("/api", "");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/activity/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (!data) return <Box sx={{ p: 4 }}>Report not found</Box>;

  const downloadFile = async (type) => {
    try {
      const url = `${backend}/api/activity/${id}/${type}`;
      const res = await axiosClient.get(url, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${data.activityName}.${type === "pdf" ? "pdf" : "docx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Download failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{data.activityName}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {data.reportType} • {data.date} • Status: {data.status}
            </Typography>
          </Grid>

          <Grid item>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={() => downloadFile("pdf")}>⬇ PDF</Button>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={() => downloadFile("docx")}>⬇ DOCX</Button>

            {data.status === "pending" && (
              <Link to={`/faculty/report/${id}/edit`} style={{ textDecoration: "none" }}>
                <Button variant="contained" sx={{ ml: 1 }}>Edit Report</Button>
              </Link>
            )}

            <Button onClick={() => navigate("/faculty/dashboard")} sx={{ ml: 1 }} variant="text">Back</Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Coordinator & Details</Typography>
          <Typography><strong>Coordinator:</strong> {data.coordinator || "-"}</Typography>
          <Typography><strong>Duration:</strong> {data.duration || "-"}</Typography>
          <Typography><strong>PO & POs:</strong> {data.poPos || "-"}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Invitation</Typography>
          {data.invitation ? <img src={`${backend}/${data.invitation}`} style={{ maxWidth: "100%" }} alt="inv" /> : <Typography>No invitation uploaded</Typography>}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Poster</Typography>
          {data.poster ? <img src={`${backend}/${data.poster}`} style={{ maxWidth: "100%" }} alt="poster" /> : <Typography>No poster uploaded</Typography>}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Resource Person</Typography>
          <Typography><strong>Name:</strong> {data.resourcePerson?.name || "-"}</Typography>
          <Typography><strong>Designation:</strong> {data.resourcePerson?.designation || "-"}</Typography>
          <Typography><strong>Institution:</strong> {data.resourcePerson?.institution || "-"}</Typography>
          {data.resourcePerson?.photo && <Box sx={{ mt: 1 }}><img src={`${backend}/${data.resourcePerson.photo}`} style={{ width: 120 }} alt="rp" /></Box>}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Session Report</Typography>
          <Typography>{data.sessionReport?.summary || "—"}</Typography>
          <Typography><strong>Students:</strong> {data.sessionReport?.participantsCount || 0}</Typography>
          <Typography><strong>Faculty:</strong> {data.sessionReport?.facultyCount || 0}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Attendance</Typography>
          {data.attendanceFile ? <a href={`${backend}/${data.attendanceFile}`} target="_blank" rel="noreferrer">Open Attendance File</a> : <Typography>No attendance uploaded</Typography>}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Photos</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {(data.photos || []).map((p, i) => <img key={i} src={`${backend}/${p}`} style={{ width: 140, borderRadius: 6 }} alt={`photo-${i}`} />)}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Feedback</Typography>
          <Typography>{data.feedback || "—"}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
