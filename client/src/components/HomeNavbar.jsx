

//client/src/components/HomeNavbar.js

import { Link } from "react-router-dom";
import "./HomeNavbar.css";

export default function HomeNavbar() {
  return (
    <nav className="home-navbar">
      <div className="logo">Actify</div>

      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#roles">Roles</a></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
