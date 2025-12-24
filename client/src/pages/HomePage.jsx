

//client/src/pages/HomePage.jsx

// import { Link } from "react-router-dom";

// export default function HomePage() {
//   return (
//     <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
//       <h1>Welcome to ActiRepo</h1>
//       <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.6 }}>
//         ActiRepo is an Activity Report Management System designed for faculty and administration
//         to create, manage, review, and approve activity reports such as:
//       </p>

//       <ul style={{ marginTop: 10 }}>
//         <li>✔ Activity Conducted Report</li>
//         <li>✔ Activity Attended Report</li>
//         <li>✔ Expert Talk Report</li>
//       </ul>

//       <p style={{ marginTop: 10 }}>
//         Faculty can create detailed reports with multiple sections and upload files.
//         Admin/HOD/Principal can review, approve, or reject reports from their dashboard.
//       </p>

//       <div style={{ marginTop: 20 }}>
//         <Link to="/register">
//           <button>Register</button>
//         </Link>

//         <Link to="/login">
//           <button style={{ marginLeft: 10 }}>Login</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



// import { Link } from "react-router-dom";
// import "./HomePage.css";
// import HomeNavbar from "../components/HomeNavbar";
// import Stats from "../components/Stats";


// export default function HomePage() {
//   return (
    
//     <div className="home-wrapper">
// <div id="home">
//   <HomeNavbar />

//   <section id="about">...</section>
//   <section id="features">...</section>

//   <Stats />

//   <section id="contact">...</section>
// </div>

//       {/* ================= HERO ================= */}
//       <section className="home-hero">
        
//         <h1>Actify</h1>
//         <p>
//           A Smart Activity Report Management System designed for academic
//           institutions to create, review, approve, and archive professional
//           activity reports with ease.
//         </p>
//       </section>

//       {/* ================= ABOUT ================= */}
//       <section className="home-section">
//         <h2 className="section-title">What is Actify?</h2>
//         <p className="section-desc">
//           Actify is a centralized digital platform that streamlines the entire
//           lifecycle of academic activity reporting. From faculty-led events to
//           expert talks and workshops, Actify ensures that every report follows
//           a standardized institutional format and is permanently archived.
//         </p>

//         <ul className="benefits-list">
//           <li>Eliminates manual Word/PDF formatting</li>
//           <li>Ensures uniform report templates across departments</li>
//           <li>Reduces approval delays and paperwork</li>
//           <li>Creates audit-ready digital records</li>
//         </ul>
//       </section>
      

//       <section className="college-highlights">
//   <div className="highlight-card">AICTE Approved</div>
//   <div className="highlight-card">VTU Affiliated</div>
//   <div className="highlight-card">Industry-Oriented Curriculum</div>
//   <div className="highlight-card">Outcome-Based Education</div>
// </section>


//       {/* ================= FEATURES ================= */}
//       <section className="home-section alt">
//         <h2 className="section-title">Core Features</h2>

//         <div className="features-grid">
//           <div className="feature-card">
//             <h4>Structured Report Builder</h4>
//             <p>
//               Create detailed activity reports with predefined sections such as
//               invitation, poster, resource person, session report, attendance,
//               photos, and feedback.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h4>Professional PDF & DOCX Output</h4>
//             <p>
//               Automatically generate institution-ready PDF and Word documents
//               with headers, page numbers, styling, and consistent layout.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h4>Preview Before Download</h4>
//             <p>
//               View the exact report layout in the browser before downloading,
//               ensuring accuracy and completeness.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h4>Multi-level Approval Workflow</h4>
//             <p>
//               Faculty submit reports which can be reviewed, approved, or rejected
//               by HODs, Admins, or Principals through role-based dashboards.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h4>Image-based Attendance & Evidence</h4>
//             <p>
//               Upload attendance sheets and activity photos as images, perfectly
//               aligned into the report without distortion.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h4>Secure & Centralized Storage</h4>
//             <p>
//               All reports and files are securely stored in a centralized system,
//               making retrieval easy during audits and accreditation reviews.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= WHO USES ================= */}
//       <section className="home-section">
//         <h2 className="section-title">Who Uses Actify?</h2>

//         <div className="roles-grid">
//           <div className="role-card">
//             <h4>Faculty</h4>
//             <p>
//               Easily create and submit structured activity reports without
//               worrying about formatting or document consistency.
//             </p>
//           </div>

//           <div className="role-card">
//             <h4>Head of Department (HOD)</h4>
//             <p>
//               Review department reports, verify content quality, and forward
//               approvals efficiently.
//             </p>
//           </div>

//           <div className="role-card">
//             <h4>Administrators</h4>
//             <p>
//               Monitor institution-wide activities, manage users, and ensure
//               compliance with reporting standards.
//             </p>
//           </div>

//           <div className="role-card">
//             <h4>Principal / Management</h4>
//             <p>
//               Gain high-level visibility into academic activities with final
//               approval authority and archival access.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="home-cta">
//         <h2>Transform Academic Reporting with Actify</h2>
//         <p>
//           Move away from scattered files and manual documentation.
//           Actify brings structure, clarity, and professionalism to
//           academic activity reporting.
//         </p>

//         <div className="home-actions">
//           <Link to="/register">
//             <button className="home-btn primary">Get Started</button>
//           </Link>

//           <Link to="/login">
//             <button className="home-btn secondary">Login</button>
//           </Link>
//         </div>
//       </section>

//     </div>
//   );
// }




import { Link } from "react-router-dom";
import "./HomePage.css";
import HomeNavbar from "../components/HomeNavbar";

export default function HomePage() {
  return (

    <>
    <HomeNavbar />
    <div className="home-wrapper">
      

      {/* ================= HERO ================= */}
     <section id="home" className="home-hero">
      
  <div className="hero-content">
    
    <h1>
      Welcome to <span>Actify</span>
    </h1>
    <p>
      A Smart Activity Report Management System designed for academic
      institutions to create, review, approve, and archive professional
      activity reports with ease.
    </p>

    <Link to="/register">
      <button className="hero-btn">Get Started</button>
    </Link>
  </div>

  <div className="hero-visual">
    {/* optional decorative icons / illustration placeholder */}
  </div>
</section>


{/* ================= DEPARTMENTS ================= */}
<section className="home-section departments-section">
  <h2 className="section-title">Department-wise Activity Scope</h2>
  <p className="section-desc">
    Explore academic activities conducted across various departments at
    Atria Institute of Technology. Each department contributes uniquely
    through workshops, expert talks, FDPs, industrial visits, and research activities.
  </p>

  <div className="departments-grid">
    <div className="department-card">
      <h3>Computer Science & Engineering</h3>
      <p>
        Focuses on software development, AI/ML, data science, cybersecurity,
        coding competitions, hackathons, and industry collaborations.
      </p>
    </div>

    <div className="department-card">
      <h3>Artificial Intelligence & Machine Learning</h3>
      <p>
        Covers AI research, deep learning workshops, data analytics,
        real-world AI applications, and industry-driven projects.
      </p>
    </div>

    <div className="department-card">
      <h3>Electronics & Communication Engineering</h3>
      <p>
        Emphasizes embedded systems, IoT, VLSI design, signal processing,
        hardware labs, and technical symposiums.
      </p>
    </div>

    <div className="department-card">
      <h3>Information Science & Engineering</h3>
      <p>
        Concentrates on information systems, cloud computing, cybersecurity,
        software engineering practices, and research initiatives.
      </p>
    </div>

    <div className="department-card">
      <h3>Mechanical Engineering</h3>
      <p>
        Includes CAD/CAM workshops, industrial visits, manufacturing processes,
        automation, and research-based learning activities.
      </p>
    </div>

    <div className="department-card">
      <h3>Civil Engineering</h3>
      <p>
        Focuses on construction technology, structural analysis, sustainability,
        site visits, and professional certification programs.
      </p>
    </div>
  </div>
</section>



      {/* ================= ABOUT ================= */}
      {/* <section id="about" className="home-section">
        <h2 className="section-title">What is Actify?</h2>
        <p className="section-desc">
          Actify is a centralized digital platform that streamlines the entire
          lifecycle of academic activity reporting. From faculty-led events to
          expert talks and workshops, Actify ensures that every report follows
          a standardized institutional format and is permanently archived.
        </p>

        <ul className="benefits-list">
          <li>Eliminates manual Word/PDF formatting</li>
          <li>Ensures uniform report templates across departments</li>
          <li>Reduces approval delays and paperwork</li>
          <li>Creates audit-ready digital records</li>
        </ul>
      </section> */}

      {/* ================= FEATURES ================= */}
      <section id="features" className="home-section alt">
        <h2 className="section-title">Core Features</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h4>Structured Report Builder</h4>
            <p>
              Create detailed activity reports with predefined sections such as
              invitation, poster, resource person, session report, attendance,
              photos, and feedback.
            </p>
          </div>

          <div className="feature-card">
            <h4>Professional PDF & DOCX Output</h4>
            <p>
              Automatically generate institution-ready PDF and Word documents
              with headers, page numbers, styling, and consistent layout.
            </p>
          </div>

          <div className="feature-card">
            <h4>Preview Before Download</h4>
            <p>
              View the exact report layout in the browser before downloading,
              ensuring accuracy and completeness.
            </p>
          </div>

          <div className="feature-card">
            <h4>Multi-level Approval Workflow</h4>
            <p>
              Faculty submit reports which can be reviewed, approved, or rejected
              by HODs, Admins, or Principals through role-based dashboards.
            </p>
          </div>

          <div className="feature-card">
            <h4>Image-based Attendance & Evidence</h4>
            <p>
              Upload attendance sheets and activity photos as images, perfectly
              aligned into the report without distortion.
            </p>
          </div>

          <div className="feature-card">
            <h4>Secure & Centralized Storage</h4>
            <p>
              All reports and files are securely stored in a centralized system,
              making retrieval easy during audits and accreditation reviews.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHO USES ================= */}
      <section id="roles" className="home-section">
        <h2 className="section-title">Who Uses Actify?</h2>

        <div className="roles-grid">
          <div className="role-card">
            <h4>Faculty</h4>
            <p>
              Easily create and submit structured activity reports without
              worrying about formatting or document consistency.
            </p>
          </div>

          <div className="role-card">
            <h4>Head of Department (HOD)</h4>
            <p>
              Review department reports, verify content quality, and forward
              approvals efficiently.
            </p>
          </div>

          <div className="role-card">
            <h4>Administrators</h4>
            <p>
              Monitor institution-wide activities, manage users, and ensure
              compliance with reporting standards.
            </p>
          </div>

          <div className="role-card">
            <h4>Principal / Management</h4>
            <p>
              Gain high-level visibility into academic activities with final
              approval authority and archival access.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section id="contact" className="home-cta">
        <h2>Transform Academic Reporting with Actify</h2>
        <p>
          Move away from scattered files and manual documentation.
          Actify brings structure, clarity, and professionalism to
          academic activity reporting.
        </p>

        <div className="home-actions">
          <Link to="/register">
            <button className="home-btn primary">Get Started</button>
          </Link>

          <Link to="/login">
            <button className="home-btn secondary">Login</button>
          </Link>
        </div>
      </section>

    </div>
    </>
  );
}
