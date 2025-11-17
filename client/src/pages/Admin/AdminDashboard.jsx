import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../Shared/Loading";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin → Fetch ALL reports
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/activity");
        setReports(res.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, <b>{user?.name}</b>. Below are all activity reports submitted by faculty.</p>

      {loading ? (
        <Loading />
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: 8 }}>Activity Name</th>
              <th style={{ padding: 8 }}>Report Type</th>
              <th style={{ padding: 8 }}>Faculty</th>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{r.activityName}</td>
                <td style={{ padding: 8 }}>{r.reportType}</td>
                <td style={{ padding: 8 }}>{r.createdBy?.name}</td>
                <td style={{ padding: 8 }}>{r.date}</td>
                <td style={{ padding: 8, textTransform: "capitalize" }}>{r.status}</td>
                <td style={{ padding: 8 }}>
                  <Link to={`/admin/report/${r._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
