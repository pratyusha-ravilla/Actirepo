import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ViewMyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
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

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>Report not found</div>;

  const baseUploads = axiosClient.defaults.baseURL.replace("/api", "");

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{data.activityName || "Activity Report"}</h2>
        <div>
         <a href={`/api/activity/${id}/pdf`} target="_blank" rel="noreferrer">Download PDF</a>
<a href={`/api/activity/${id}/docx`} target="_blank" rel="noreferrer">Download DOCX</a>

        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Type:</strong> {data.reportType} &nbsp; | &nbsp;
        <strong>Status:</strong> {data.status} &nbsp; | &nbsp;
        <strong>Date:</strong> {data.date || "-"}
      </div>

      <section style={{ marginTop: 14 }}>
        <h3>Coordinator & Details</h3>
        <div><strong>Coordinator:</strong> {data.coordinator || "-"}</div>
        <div><strong>Duration:</strong> {data.duration || "-"}</div>
        <div><strong>PO & POs:</strong> {data.poPos || "-"}</div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Invitation</h3>
        {data.invitation ? <img src={`${baseUploads}/${data.invitation}`} alt="inv" style={{ maxWidth: "100%" }} /> : <div>No invitation uploaded</div>}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Poster</h3>
        {data.poster ? <img src={`${baseUploads}/${data.poster}`} alt="poster" style={{ maxWidth: "100%" }} /> : <div>No poster uploaded</div>}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Resource Person</h3>
        <div><strong>Name:</strong> {data.resourcePerson?.name || "-"}</div>
        <div><strong>Designation:</strong> {data.resourcePerson?.designation || "-"}</div>
        <div><strong>Institution:</strong> {data.resourcePerson?.institution || "-"}</div>
        {data.resourcePerson?.photo && <img src={`${baseUploads}/${data.resourcePerson.photo}`} alt="rp" style={{ width: 120, marginTop: 8 }} />}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Session Report</h3>
        <div>{data.sessionReport?.summary || "-"}</div>
        <div><strong>Students present:</strong> {data.sessionReport?.participantsCount || "-"}</div>
        <div><strong>Faculty present:</strong> {data.sessionReport?.facultyCount || "-"}</div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Attendance</h3>
        {data.attendanceFile ? <a href={`${baseUploads}/${data.attendanceFile}`} target="_blank" rel="noreferrer">Download attendance</a> : <div>No attendance file</div>}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Photos</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(data.photos || []).length === 0 && <div>No photos uploaded</div>}
          {(data.photos || []).map((p, i) => <img key={i} src={`${baseUploads}/${p}`} alt={`photo-${i}`} style={{ width: 140 }} />)}
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Feedback</h3>
        <div>{data.feedback || "-"}</div>
      </section>

      <div style={{ marginTop: 16 }}>
        {data.status === "pending" && <Link to={`/faculty/report/${id}/edit`}><button>Edit Report</button></Link>}
        <button onClick={() => navigate("/faculty/dashboard")} style={{ marginLeft: 8 }}>Back to Dashboard</button>
      </div>
    </div>
  );
}
