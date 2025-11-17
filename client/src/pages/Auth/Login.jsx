import React, { useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", form);
      // res.data: { token, user }
      const userPayload = {
        token: res.data.token,
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      };
      login(userPayload);
      // redirect by role
      if (userPayload.role === "faculty") navigate("/faculty/dashboard");
      else navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 20, border: "1px solid #eee", borderRadius: 6 }}>
      <h2 style={{ marginBottom: 12 }}>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
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

        <button type="submit" style={{ marginTop: 12 }} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <small>
          Don't have an account? <Link to="/register">Register</Link>
        </small>
      </div>
    </div>
  );
}
