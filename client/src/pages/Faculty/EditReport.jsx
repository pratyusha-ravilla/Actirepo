import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    reportType: "conducted",
    activityName: "",
    coordinator: "",
    date: "",
    duration: "",
    poPos: "",
    resourceName: "",
    resourceDesignation: "",
    resourceInstitution: "",
    sessionSummary: "",
    participantsCount: "",
    facultyCount: "",
    feedback: "",
  });

  const [previews, setPreviews] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });
  const [existingFiles, setExistingFiles] = useState({ invitation: null, poster: null, resourcePhoto: null, photos: [] });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/activity/${id}`);
        const data = res.data;
        // populate
        setForm({
          reportType: data.reportType || "conducted",
          activityName: data.activityName || "",
          coordinator: data.coordinator || "",
          date: data.date || "",
          duration: data.duration || "",
          poPos: data.poPos || "",
          resourceName: data.resourcePerson?.name || "",
          resourceDesignation: data.resourcePerson?.designation || "",
          resourceInstitution: data.resourcePerson?.institution || "",
          sessionSummary: data.sessionReport?.summary || "",
          participantsCount: data.sessionReport?.participantsCount || "",
          facultyCount: data.sessionReport?.facultyCount || "",
          feedback: data.feedback || "",
        });

        // existing file urls (we expect server to serve /uploads)
        setExistingFiles({
          invitation: data.invitation ? `${axiosClient.defaults.baseURL.replace("/api","")}/${data.invitation}` : null,
          poster: data.poster ? `${axiosClient.defaults.baseURL.replace("/api","")}/${data.poster}` : null,
          resourcePhoto: data.resourcePerson?.photo ? `${axiosClient.defaults.baseURL.replace("/api","")}/${data.resourcePerson.photo}` : null,
          photos: (data.photos || []).map((p) => `${axiosClient.defaults.baseURL.replace("/api","")}/${p}`),
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

  const previewFile = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(file) }));
  };

  const previewMultiple = (e) => {
    const files = Array.from(e.target.files);
    setPreviews((p) => ({ ...p, photos: files.map((f) => URL.createObjectURL(f)) }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      const payload = { ...form, updatedBy: user?.id };
      fd.append("payload", JSON.stringify(payload));

      if (e.target.invitation.files[0]) fd.append("invitation", e.target.invitation.files[0]);
      if (e.target.poster.files[0]) fd.append("poster", e.target.poster.files[0]);
      if (e.target.resourcePhoto.files[0]) fd.append("resourcePhoto", e.target.resourcePhoto.files[0]);
      if (e.target.attendanceFile.files[0]) fd.append("attendanceFile", e.target.attendanceFile.files[0]);
      const photos = e.target.photos.files;
      for (let i = 0; i < photos.length; i++) fd.append("photos", photos[i]);

      const res = await axiosClient.put(`/activity/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Report updated");
      navigate(`/faculty/report/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Edit Activity Report</h2>
      <form onSubmit={handleUpdate}>
        <label>Report Type</label>
        <select value={form.reportType} onChange={(e) => setForm({ ...form, reportType: e.target.value })}>
          <option value="conducted">Activity Conducted Report</option>
          <option value="attended">Activity Attended Report</option>
          <option value="expert_talk">Activity Expert Talk</option>
        </select>

        <h3>Activity Details</h3>
        <label>Activity Name</label>
        <input required value={form.activityName} onChange={(e) => setForm({ ...form, activityName: e.target.value })} />

        <label>Coordinator</label>
        <input value={form.coordinator} onChange={(e) => setForm({ ...form, coordinator: e.target.value })} />

        <label>Date</label>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <label>Duration</label>
        <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />

        <label>PO & POs Covered</label>
        <input value={form.poPos} onChange={(e) => setForm({ ...form, poPos: e.target.value })} />

        <h3>Invitation</h3>
        <input type="file" name="invitation" onChange={(e) => previewFile(e, "invitation")} />
        {previews.invitation ? <img src={previews.invitation} style={{ width: 200 }} alt="inv_preview" /> : existingFiles.invitation ? <img src={existingFiles.invitation} style={{ width: 200 }} alt="inv_existing" /> : null}

        <h3>Poster</h3>
        <input type="file" name="poster" onChange={(e) => previewFile(e, "poster")} />
        {previews.poster ? <img src={previews.poster} style={{ width: 200 }} alt="poster_preview" /> : existingFiles.poster ? <img src={existingFiles.poster} style={{ width: 200 }} alt="poster_existing" /> : null}

        <h3>Resource Person Details</h3>
        <label>Name</label>
        <input value={form.resourceName} onChange={(e) => setForm({ ...form, resourceName: e.target.value })} />

        <label>Designation</label>
        <input value={form.resourceDesignation} onChange={(e) => setForm({ ...form, resourceDesignation: e.target.value })} />

        <label>Institution</label>
        <input value={form.resourceInstitution} onChange={(e) => setForm({ ...form, resourceInstitution: e.target.value })} />

        <label>Resource Photo</label>
        <input type="file" name="resourcePhoto" onChange={(e) => previewFile(e, "resourcePhoto")} />
        {previews.resourcePhoto ? <img src={previews.resourcePhoto} style={{ width: 120 }} alt="rp_preview" /> : existingFiles.resourcePhoto ? <img src={existingFiles.resourcePhoto} style={{ width: 120 }} alt="rp_existing" /> : null}

        <h3>Session Report</h3>
        <label>Summary</label>
        <textarea rows={6} value={form.sessionSummary} onChange={(e) => setForm({ ...form, sessionSummary: e.target.value })} />

        <label>No. of Students Present</label>
        <input type="number" value={form.participantsCount} onChange={(e) => setForm({ ...form, participantsCount: e.target.value })} />

        <label>No. of Faculty Present</label>
        <input type="number" value={form.facultyCount} onChange={(e) => setForm({ ...form, facultyCount: e.target.value })} />

        <h3>Attendance File</h3>
        <input type="file" name="attendanceFile" />

        <h3>Event Photos</h3>
        <input type="file" name="photos" multiple onChange={previewMultiple} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {previews.photos.length > 0
            ? previews.photos.map((u, i) => <img key={i} src={u} alt={`preview-${i}`} style={{ width: 120 }} />)
            : existingFiles.photos.map((u, i) => <img key={i} src={u} alt={`existing-${i}`} style={{ width: 120 }} />)
          }
        </div>

        <h3>Feedback</h3>
        <textarea rows={4} value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />

        <div style={{ marginTop: 12 }}>
          <button type="submit">Update Report</button>
          <button type="button" onClick={() => navigate(`/faculty/report/${id}`)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
