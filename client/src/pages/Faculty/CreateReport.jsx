import React, { useState, useContext } from "react";
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    reportType: "conducted",
    academicYear: "",
    activityName: "",
    coordinator: "",
    date: "",
    duration: "",
    poPos: "",
    // resource
    resourceName: "",
    resourceDesignation: "",
    resourceInstitution: "",
    // session
    sessionSummary: "",
    participantsCount: "",
    facultyCount: "",
    // feedback
    feedback: ""
  });

  // files
  const [files, setFiles] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    attendanceFile: null,
    photos: []
  });

  // previews
  const [previews, setPreviews] = useState({
    invitation: null,
    poster: null,
    resourcePhoto: null,
    photos: []
  });

  const onFileChange = (e, key) => {
    const f = e.target.files[0];
    setFiles(prev => ({ ...prev, [key]: f }));
    if (f) setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(f) }));
  };

  const onMultiple = (e) => {
    const arr = Array.from(e.target.files);
    setFiles(prev => ({ ...prev, photos: arr }));
    setPreviews(prev => ({ ...prev, photos: arr.map(a => URL.createObjectURL(a)) }));
  };

  const next = () => setStep(s => Math.min(8, s+1));
  const prev = () => setStep(s => Math.max(1, s-1));

  const submit = async () => {
    try {
      const fd = new FormData();
      // include createdBy and academicYear
      const payload = { ...form, createdBy: user?.id, status: "pending" };
      fd.append("payload", JSON.stringify(payload));

      if (files.invitation) fd.append("invitation", files.invitation);
      if (files.poster) fd.append("poster", files.poster);
      if (files.resourcePhoto) fd.append("resourcePhoto", files.resourcePhoto);
      if (files.attendanceFile) fd.append("attendanceFile", files.attendanceFile);
      (files.photos || []).forEach(p => fd.append("photos", p));

      const res = await axiosClient.post("/activity", fd, { headers: { "Content-Type": "multipart/form-data" }});
      alert("Saved successfully");
      navigate(`/faculty/report/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Save failed");
    }
  };

  // steps UI
  return (
    <div style={{ maxWidth:900, margin:"20px auto" }}>
      <h2>Create Activity Report</h2>
      <div style={{ marginBottom:12 }}>
        <strong>Step {step} of 8</strong>
      </div>

      {step === 1 && (
        <div>
          <h3>1. Activity Details</h3>
          <label>Report Type</label>
          <select value={form.reportType} onChange={e=>setForm({...form,reportType:e.target.value})}>
            <option value="conducted">Activity Conducted Report</option>
            <option value="attended">Activity Attended Report</option>
            <option value="expert_talk">Activity Expert Talk</option>
          </select>

          <label>Academic Year (e.g. 2025-26)</label>
          <input value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} required />

          <label>Activity Name</label>
          <input value={form.activityName} onChange={e=>setForm({...form,activityName:e.target.value})} required />

          <label>Coordinator</label>
          <input value={form.coordinator} onChange={e=>setForm({...form,coordinator:e.target.value})} />

          <label>Date</label>
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />

          <label>Duration</label>
          <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />

          <label>PO & POs</label>
          <input value={form.poPos} onChange={e=>setForm({...form,poPos:e.target.value})} />
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>2. Invitation</h3>
          <input type="file" accept="image/*" onChange={(e)=>onFileChange(e,"invitation")} />
          {previews.invitation && <img src={previews.invitation} style={{ width:260, marginTop:8 }} />}
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>3. Poster</h3>
          <input type="file" accept="image/*" onChange={(e)=>onFileChange(e,"poster")} />
          {previews.poster && <img src={previews.poster} style={{ width:260, marginTop:8 }} />}
        </div>
      )}

      {step === 4 && (
        <div>
          <h3>4. Resource Person Details</h3>
          <label>Name</label>
          <input value={form.resourceName} onChange={e=>setForm({...form,resourceName:e.target.value})} />
          <label>Designation</label>
          <input value={form.resourceDesignation} onChange={e=>setForm({...form,resourceDesignation:e.target.value})} />
          <label>Institution</label>
          <input value={form.resourceInstitution} onChange={e=>setForm({...form,resourceInstitution:e.target.value})} />
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={(e)=>onFileChange(e,"resourcePhoto")} />
          {previews.resourcePhoto && <img src={previews.resourcePhoto} style={{ width:120, marginTop:8 }} />}
        </div>
      )}

      {step === 5 && (
        <div>
          <h3>5. Session Report</h3>
          <label>Summary</label>
          <textarea rows={6} value={form.sessionSummary} onChange={e=>setForm({...form,sessionSummary:e.target.value})} />
          <label>No. of Students Present</label>
          <input type="number" value={form.participantsCount} onChange={e=>setForm({...form,participantsCount:e.target.value})} />
          <label>No. of Faculty Present</label>
          <input type="number" value={form.facultyCount} onChange={e=>setForm({...form,facultyCount:e.target.value})} />
        </div>
      )}

      {step === 6 && (
        <div>
          <h3>6. Attendance</h3>
          <input type="file" accept=".pdf,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e)=>onFileChange(e,"attendanceFile")} />
          {files.attendanceFile && <div style={{ marginTop:8 }}>{files.attendanceFile.name}</div>}
        </div>
      )}

      {step === 7 && (
        <div>
          <h3>7. Photos</h3>
          <input type="file" accept="image/*" multiple onChange={onMultiple} />
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
            {previews.photos.map((p,i)=> <img key={i} src={p} style={{ width:120 }} />)}
          </div>
        </div>
      )}

      {step === 8 && (
        <div>
          <h3>Review & Feedback</h3>
          <div style={{ marginBottom:8 }}>
            <strong>Activity Name:</strong> {form.activityName}
          </div>
          <div style={{ marginBottom:8 }}>
            <strong>Coordinator:</strong> {form.coordinator}
          </div>
          <div style={{ marginBottom:8 }}>
            <strong>Academic Year:</strong> {form.academicYear}
          </div>
          <div style={{ marginTop:8 }}>
            <label>Feedback</label>
            <textarea rows={4} value={form.feedback} onChange={e=>setForm({...form,feedback:e.target.value})} />
          </div>

          <div style={{ marginTop:12 }}>
            <button onClick={submit}>Save & Finish</button>
            <button onClick={()=>{ // direct download preview (optional)
                const message = "After saving you can download PDF/DOCX from the report view.";
                alert(message);
            }} style={{ marginLeft:8 }}>Note</button>
          </div>
        </div>
      )}

      <div style={{ marginTop:16, display:"flex", gap:8 }}>
        {step > 1 && <button onClick={prev}>Previous</button>}
        {step < 8 && <button onClick={next}>Next</button>}
      </div>
    </div>
  );
}
