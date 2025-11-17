import React, { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.post("/auth/register", form);
      alert("Registration successful. Login now.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 20, border: "1px solid #eee", borderRadius: 6 }}>
      <h2 style={{ marginBottom: 12 }}>Register</h2>
      <form onSubmit={submit}>
        <label>Full name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label style={{ marginTop: 8 }}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label style={{ marginTop: 8 }}>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <label style={{ marginTop: 8 }}>Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="faculty">Faculty</option>
          <option value="hod">HOD</option>
          <option value="admin">Admin</option>
          <option value="principal">Principal</option>
        </select>

        <button type="submit" style={{ marginTop: 14 }} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <small>
          Already registered? <Link to="/login">Login</Link>
        </small>
      </div>
    </div>
  );
}
