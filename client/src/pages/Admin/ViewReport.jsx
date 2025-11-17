import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Shared/Loading";

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = axiosClient.defaults.baseURL.replace("/api", "");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/activity/${id}`);
        setData(res.data);
      } catch (err) {
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm("Approve this report?")) return;
    await axiosClient.put(`/activity/${id}/approve`);
    alert("Report approved");
    navigate("/admin/dashboard");
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this report?")) return;
    await axiosClient.put(`/activity/${id}/reject`);
    alert("Report rejected");
    navigate("/admin/dashboard");
  };

  if (loading) return <Loading />;
  if (!data) return <div>No data</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <h2>{data.activityName}</h2>
      <p>
        <b>Type:</b> {data.reportType} |
        <b> Status:</b> {data.status} |
        <b> Date:</b> {data.date}
      </p>

      <div style={{ marginBottom: 12 }}>
        <a href={`/api/activity/${id}/pdf`} target="_blank">Download PDF</a> |
        <a href={`/api/activity/${id}/docx`} target="_blank">Download DOCX</a>
      </div>

      <h3>Coordinator</h3>
      <p>{data.coordinator}</p>

      <h3>Invitation</h3>
      {data.invitation ? (
        <img src={`${baseURL}/${data.invitation}`} style={{ width: "100%" }} />
      ) : <p>No invitation uploaded.</p>}

      <h3>Poster</h3>
      {data.poster ? (
        <img src={`${baseURL}/${data.poster}`} style={{ width: "100%" }} />
      ) : <p>No poster uploaded.</p>}

      <h3>Resource Person Details</h3>
      <p><b>Name:</b> {data.resourcePerson?.name}</p>
      <p><b>Designation:</b> {data.resourcePerson?.designation}</p>
      <p><b>Institution:</b> {data.resourcePerson?.institution}</p>
      {data.resourcePerson?.photo && (
        <img src={`${baseURL}/${data.resourcePerson.photo}`} style={{ width: 150 }} />
      )}

      <h3>Session Report</h3>
      <p>{data.sessionReport?.summary}</p>
      <p><b>Students:</b> {data.sessionReport?.participantsCount}</p>
      <p><b>Faculty:</b> {data.sessionReport?.facultyCount}</p>

      <h3>Attendance</h3>
      {data.attendanceFile ? (
        <a href={`${baseURL}/${data.attendanceFile}`} target="_blank">Open Attendance File</a>
      ) : <p>No attendance file uploaded.</p>}

      <h3>Photos</h3>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {data.photos?.map((p, i) => (
          <img key={i} src={`${baseURL}/${p}`} style={{ width: 180 }} />
        ))}
      </div>

      <h3>Feedback</h3>
      <p>{data.feedback}</p>

      <div style={{ marginTop: 20 }}>
        {data.status === "pending" && (
          <>
            <button onClick={handleApprove} style={{ marginRight: 8 }}>Approve</button>
            <button onClick={handleReject} style={{ marginRight: 8 }}>Reject</button>
          </>
        )}
        <button onClick={() => navigate("/admin/dashboard")}>Back</button>
      </div>
    </div>
  );
}
