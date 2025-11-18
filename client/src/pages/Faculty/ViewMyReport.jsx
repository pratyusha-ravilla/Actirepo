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

  // backend root URL (e.g. http://localhost:5002)
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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Report not found</div>;

  // ⭐ FORCE DOWNLOAD FUNCTION
  const downloadFile = async (type) => {
    try {
      const url = `${backend}/api/activity/${id}/${type}`;

      const res = await axiosClient.get(url, {
        responseType: "blob", // <-- IMPORTANT
      });

      // Create blob URL
      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create temporary link
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${data.activityName}.${type === "pdf" ? "pdf" : "docx"}`;
      document.body.appendChild(a);
      a.click();

      // cleanup
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error(error);
      alert("Download failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{data.activityName}</h2>

        {/* ⭐ NEW DOWNLOAD BUTTONS */}
        <div style={{ display: "flex", gap: 15 }}>
          <button onClick={() => downloadFile("pdf")}>⬇ Download PDF</button>
          <button onClick={() => downloadFile("docx")}>⬇ Download DOCX</button>
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <strong>Type:</strong> {data.reportType} |
        <strong>Status:</strong> {data.status} |
        <strong>Date:</strong> {data.date}
      </div>

      {/* Coordinator */}
      <section>
        <h3>Coordinator & Details</h3>
        <div><strong>Coordinator:</strong> {data.coordinator}</div>
        <div><strong>Duration:</strong> {data.duration}</div>
        <div><strong>PO & POs:</strong> {data.poPos}</div>
      </section>

      {/* Invitation */}
      <section>
        <h3>Invitation</h3>
        {data.invitation ? (
          <img src={`${backend}/${data.invitation}`} style={{ maxWidth: "100%" }} />
        ) : (
          <div>No invitation uploaded</div>
        )}
      </section>

      {/* Poster */}
      <section>
        <h3>Poster</h3>
        {data.poster ? (
          <img src={`${backend}/${data.poster}`} style={{ maxWidth: "100%" }} />
        ) : (
          <div>No poster uploaded</div>
        )}
      </section>

      {/* Resource Person */}
      <section>
        <h3>Resource Person</h3>
        <div><strong>Name:</strong> {data.resourcePerson?.name}</div>
        <div><strong>Designation:</strong> {data.resourcePerson?.designation}</div>
        <div><strong>Institution:</strong> {data.resourcePerson?.institution}</div>

        {data.resourcePerson?.photo && (
          <img src={`${backend}/${data.resourcePerson.photo}`} style={{ width: 120 }} />
        )}
      </section>

      {/* Session Report */}
      <section>
        <h3>Session Report</h3>
        <p>{data.sessionReport?.summary}</p>
        <p><strong>Students:</strong> {data.sessionReport?.participantsCount}</p>
        <p><strong>Faculty:</strong> {data.sessionReport?.facultyCount}</p>
      </section>

      {/* Attendance */}
      <section>
        <h3>Attendance</h3>
        {data.attendanceFile ? (
          <a href={`${backend}/${data.attendanceFile}`} target="_blank">Open Attendance File</a>
        ) : (
          "No attendance uploaded"
        )}
      </section>

      {/* Photos */}
      <section>
        <h3>Photos</h3>
        <div style={{ display: "flex", gap: 10 }}>
          {(data.photos || []).map((p, i) => (
            <img key={i} src={`${backend}/${p}`} style={{ width: 140 }} />
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h3>Feedback</h3>
        <p>{data.feedback}</p>
      </section>

      {/* Actions */}
      <div style={{ marginTop: 20 }}>
        {data.status === "pending" && (
          <Link to={`/faculty/report/${id}/edit`}>
            <button>Edit Report</button>
          </Link>
        )}
        <button onClick={() => navigate("/faculty/dashboard")} style={{ marginLeft: 10 }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
