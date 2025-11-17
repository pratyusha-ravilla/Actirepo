import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <h1>Welcome to ActiRepo</h1>
      <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.6 }}>
        ActiRepo is an Activity Report Management System designed for faculty and administration
        to create, manage, review, and approve activity reports such as:
      </p>

      <ul style={{ marginTop: 10 }}>
        <li>✔ Activity Conducted Report</li>
        <li>✔ Activity Attended Report</li>
        <li>✔ Expert Talk Report</li>
      </ul>

      <p style={{ marginTop: 10 }}>
        Faculty can create detailed reports with multiple sections and upload files.
        Admin/HOD/Principal can review, approve, or reject reports from their dashboard.
      </p>

      <div style={{ marginTop: 20 }}>
        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/login">
          <button style={{ marginLeft: 10 }}>Login</button>
        </Link>
      </div>
    </div>
  );
}
