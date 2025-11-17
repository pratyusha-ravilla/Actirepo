import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function FacultyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch faculty's own reports
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/activity/mine");
        setReports(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Faculty Dashboard</h2>
        <div>
          <button onClick={() => navigate("/faculty/create")}>+ Create Report</button>
        </div>
      </div>

      <p>Welcome, <strong>{user?.name}</strong> — your recent activity reports are below.</p>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {reports.length === 0 ? (
            <div>No reports found. Create a new report.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  <th style={{ padding: "8px 6px" }}>Activity</th>
                  <th style={{ padding: "8px 6px" }}>Type</th>
                  <th style={{ padding: "8px 6px" }}>Date</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                  <th style={{ padding: "8px 6px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid #fafafa" }}>
                    <td style={{ padding: "8px 6px" }}>{r.activityName || "-"}</td>
                    <td style={{ padding: "8px 6px" }}>{r.reportType}</td>
                    <td style={{ padding: "8px 6px" }}>{r.date || "-"}</td>
                    <td style={{ padding: "8px 6px" }}>{r.status}</td>
                    <td style={{ padding: "8px 6px" }}>
                      <Link to={`/faculty/report/${r._id}`} style={{ marginRight: 8 }}>View</Link>
                      {r.status === "pending" && (
                        <Link to={`/faculty/report/${r._id}/edit`} style={{ marginLeft: 8 }}>Edit</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
