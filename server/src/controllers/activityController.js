// // server/src/controllers/activityController.js
// import fs from "fs";
// import path from "path";
// import Activity from "../models/Activity.js";
// import puppeteer from "puppeteer";
// import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

// const TEMPLATE_PATH = path.join(process.cwd(), "server", "templates", "report_template.html");
// const UPLOADS_DIR = path.join(process.cwd(), "server", "uploads");

// // helper: load template
// function loadTemplate() {
//   return fs.readFileSync(TEMPLATE_PATH, "utf8");
// }

// function toDataUrl(localPath) {
//   if (!localPath) return "";
//   try {
//     const buf = fs.readFileSync(localPath);
//     const ext = path.extname(localPath).substring(1) || "png";
//     return `data:image/${ext};base64,${buf.toString("base64")}`;
//   } catch (e) {
//     return "";
//   }
// }

// export const createActivity = async (req, res) => {
//   try {
//     const payload = req.body.payload ? JSON.parse(req.body.payload) : {};
//     // attach file paths
//     if (req.files) {
//       if (req.files.invitation) payload.invitation = req.files.invitation[0].path.replace(/\\/g,"/");
//       if (req.files.poster) payload.poster = req.files.poster[0].path.replace(/\\/g,"/");
//       if (req.files.attendanceFile) payload.attendanceFile = req.files.attendanceFile[0].path.replace(/\\/g,"/");
//       if (req.files.resourcePhoto) payload.resourcePerson = payload.resourcePerson || {};
//       if (req.files.resourcePhoto) payload.resourcePerson.photo = req.files.resourcePhoto[0].path.replace(/\\/g,"/");
//       if (req.files.photos) payload.photos = (req.files.photos || []).map(f => f.path.replace(/\\/g,"/"));
//     }
//     // default status and createdBy set by frontend earlier
//     payload.status = payload.status || "pending";

//     const a = await Activity.create(payload);
//     res.status(201).json(a);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Create failed", error: err.message });
//   }
// };

// export const getActivity = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).populate("createdBy", "name email");
//     if (!a) return res.status(404).json({ message: "Not found" });
//     res.json(a);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed" });
//   }
// };

// export const updateActivity = async (req, res) => {
//   try {
//     const payload = req.body.payload ? JSON.parse(req.body.payload) : {};
//     if (req.files) {
//       if (req.files.invitation) payload.invitation = req.files.invitation[0].path.replace(/\\/g,"/");
//       if (req.files.poster) payload.poster = req.files.poster[0].path.replace(/\\/g,"/");
//       if (req.files.attendanceFile) payload.attendanceFile = req.files.attendanceFile[0].path.replace(/\\/g,"/");
//       if (req.files.resourcePhoto) payload.resourcePerson = payload.resourcePerson || {};
//       if (req.files.resourcePhoto) payload.resourcePerson.photo = req.files.resourcePhoto[0].path.replace(/\\/g,"/");
//       if (req.files.photos) payload.photos = (req.files.photos || []).map(f => f.path.replace(/\\/g,"/"));
//     }

//     const a = await Activity.findByIdAndUpdate(req.params.id, payload, { new: true });
//     res.json(a);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// // GET /api/activity/:id/pdf
// export const getPdf = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).lean();
//     if (!a) return res.status(404).json({ message: "Not found" });

//     let html = loadTemplate();

//     const titleMap = { conducted: "ACTIVITY CONDUCTED REPORT", attended: "ACTIVITY ATTENDED REPORT", expert_talk: "ACTIVITY EXPERT TALK" };
//     html = html.replace(/{{reportTitle}}/g, titleMap[a.reportType] || "ACTIVITY REPORT");
//     html = html.replace(/{{academicYear}}/g, a.academicYear || "");
//     html = html.replace(/{{activityName}}/g, a.activityName || "");
//     html = html.replace(/{{coordinator}}/g, a.coordinator || "");
//     html = html.replace(/{{date}}/g, a.date || "");
//     html = html.replace(/{{duration}}/g, a.duration || "");
//     html = html.replace(/{{poPos}}/g, a.poPos || "");
//     html = html.replace(/{{sessionSummary}}/g, (a.sessionReport && a.sessionReport.summary) || "");
//     html = html.replace(/{{resourceName}}/g, (a.resourcePerson && a.resourcePerson.name) || "");
//     html = html.replace(/{{resourceDesignation}}/g, (a.resourcePerson && a.resourcePerson.designation) || "");
//     html = html.replace(/{{resourceInstitution}}/g, (a.resourcePerson && a.resourcePerson.institution) || "");
//     html = html.replace(/{{participants}}/g, (a.sessionReport && a.sessionReport.participantsCount) || "");
//     html = html.replace(/{{facultyCount}}/g, (a.sessionReport && a.sessionReport.facultyCount) || "");
//     html = html.replace(/{{feedback}}/g, a.feedback || "");

//     // images
//     html = html.replace(/{{invitationImage}}/g, toDataUrl(a.invitation));
//     html = html.replace(/{{posterImage}}/g, toDataUrl(a.poster));
//     html = html.replace(/{{resourcePhoto}}/g, toDataUrl(a.resourcePerson?.photo));
//     const photosHtml = (a.photos || []).map(p => `<img class="photo-item" src="${toDataUrl(p)}" />`).join("");
//     html = html.replace(/{{photos}}/g, photosHtml);

//     // attendance link: if attendance is a file, we provide link text (can't embed non-image)
//     const attendanceLink = a.attendanceFile ? `${req.protocol}://${req.get("host")}/${a.attendanceFile}` : "";
//     html = html.replace(/{{attendanceFileLink}}/g, attendanceLink);

//     const browser = await puppeteer.launch({ args: ["--no-sandbox","--disable-setuid-sandbox"] });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });
//     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${(a.activityName || "activity")}.pdf"`,
//       "Content-Length": pdfBuffer.length
//     });
//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "PDF generation failed", error: err.message });
//   }
// };

// // GET /api/activity/:id/docx
// export const getDocx = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).lean();
//     if (!a) return res.status(404).json({ message: "Not found" });

//     const titleMap = { conducted: "ACTIVITY CONDUCTED REPORT", attended: "ACTIVITY ATTENDED REPORT", expert_talk: "ACTIVITY EXPERT TALK" };

//     const doc = new Document();
//     const children = [];

//     children.push(new Paragraph({ children: [ new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: titleMap[a.reportType] || "ACTIVITY REPORT", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `ACADEMIC YEAR ${a.academicYear || ""}` }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `Activity Name: ${a.activityName || ""}` }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `Coordinator: ${a.coordinator || ""}` }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `Date: ${a.date || ""}` }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `Duration: ${a.duration || ""}` }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun({ text: `PO & POs: ${a.poPos || ""}` }) ] }));

//     children.push(new Paragraph({ children: [ new TextRun({ text: "TABLE OF CONTENTS", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun("1. INVITATION") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("2. POSTER") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("3. RESOURCE PERSON DETAILS") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("4. SESSION REPORT") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("5. ATTENDANCE") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("6. PHOTOS") ] }));
//     children.push(new Paragraph({ children: [ new TextRun("7. FEEDBACK") ] }));

//     children.push(new Paragraph({ children: [ new TextRun({ text: "RESOURCE PERSON DETAILS", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(`Name: ${a.resourcePerson?.name || ""}`) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(`Designation: ${a.resourcePerson?.designation || ""}`) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(`Institution: ${a.resourcePerson?.institution || ""}`) ] }));

//     children.push(new Paragraph({ children: [ new TextRun({ text: "SESSION REPORT", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(a.sessionReport?.summary || "") ] }));
//     children.push(new Paragraph({ children: [ new TextRun(`No. of Students Present: ${a.sessionReport?.participantsCount || ""}`) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(`No. of Faculty Present: ${a.sessionReport?.facultyCount || ""}`) ] }));

//     children.push(new Paragraph({ children: [ new TextRun({ text: "FEEDBACK", bold: true }) ] }));
//     children.push(new Paragraph({ children: [ new TextRun(a.feedback || "") ] }));

//     // embed images (invitation/poster/resource/photos)
//     function addImageIfExists(localPath) {
//       if (!localPath) return null;
//       if (!fs.existsSync(localPath)) return null;
//       const buf = fs.readFileSync(localPath);
//       return new ImageRun({ data: buf, transformation: { width: 600, height: 400 } });
//     }

//     const invImg = addImageIfExists(a.invitation);
//     if (invImg) children.push(new Paragraph(invImg));
//     const posterImg = addImageIfExists(a.poster);
//     if (posterImg) children.push(new Paragraph(posterImg));
//     const rpImg = addImageIfExists(a.resourcePerson?.photo);
//     if (rpImg) children.push(new Paragraph(rpImg));
//     (a.photos || []).forEach(p => {
//       const ph = addImageIfExists(p);
//       if (ph) children.push(new Paragraph(ph));
//     });

//     doc.addSection({ children });

//     const buffer = await Packer.toBuffer(doc);
//     res.set({
//       "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "Content-Disposition": `attachment; filename="${(a.activityName || "activity")}.docx"`,
//       "Content-Length": buffer.length
//     });
//     res.send(buffer);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "DOCX failed", error: err.message });
//   }
// };

// export const listActivities = async (req, res) => {
//   const list = await Activity.find().populate("createdBy","name email").sort({ createdAt:-1 });
//   res.json(list);
// };

// // approve/reject
// export const approveActivity = async (req,res) => {
//   try {
//     const a = await Activity.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
//     res.json(a);
//   } catch(e){ res.status(500).json({message:"fail"}); }
// };

// export const rejectActivity = async (req,res) => {
//   try {
//     const a = await Activity.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
//     res.json(a);
//   } catch(e){ res.status(500).json({message:"fail"}); }
// };






// server/src/controllers/activityController.js
import fs from "fs";
import path from "path";
import Activity from "../models/Activity.js";
import puppeteer from "puppeteer";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

// =============== TEMPLATE PATH ===================
const TEMPLATE_PATH = path.join(process.cwd(), "server", "templates", "report_template.html");

// =============== Load HTML Template ===================
function loadTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, "utf8");
}

// =============== Convert Relative Path → Data URL (for PDF) ===================
function toDataUrl(relativePath) {
  if (!relativePath) return "";

  try {
    // Build absolute file path
    const fullPath = path.join(process.cwd(), "server", relativePath);

    const buf = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).substring(1) || "png";

    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch (e) {
    console.log("Image not found:", relativePath);
    return "";
  }
}

//
// ===============================================================
// CREATE ACTIVITY
// ===============================================================
//

export const createActivity = async (req, res) => {
  try {
    const payload = req.body.payload ? JSON.parse(req.body.payload) : {};

    // Always set status
    payload.status = payload.status || "pending";

    // Initialize resourcePerson if missing
    if (!payload.resourcePerson) payload.resourcePerson = {};

    // SAVE RELATIVE PATHS INTO DB
    if (req.files.invitation) {
      payload.invitation = "uploads/" + req.files.invitation[0].filename;
    }

    if (req.files.poster) {
      payload.poster = "uploads/" + req.files.poster[0].filename;
    }

    if (req.files.resourcePhoto) {
      payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
    }

    if (req.files.attendanceFile) {
      payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
    }

    if (req.files.photos) {
      payload.photos = req.files.photos.map(f => "uploads/" + f.filename);
    }

    const report = await Activity.create(payload);
    res.status(201).json(report);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

//
// ===============================================================
// FETCH 1 ACTIVITY
// ===============================================================
//

export const getActivity = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).populate("createdBy", "name email");
    if (!a) return res.status(404).json({ message: "Not found" });

    res.json(a);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

//
// ===============================================================
// UPDATE ACTIVITY
// ===============================================================
//

export const updateActivity = async (req, res) => {
  try {
    const payload = req.body.payload ? JSON.parse(req.body.payload) : {};

    if (!payload.resourcePerson) payload.resourcePerson = {};

    if (req.files.invitation) {
      payload.invitation = "uploads/" + req.files.invitation[0].filename;
    }

    if (req.files.poster) {
      payload.poster = "uploads/" + req.files.poster[0].filename;
    }

    if (req.files.resourcePhoto) {
      payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
    }

    if (req.files.attendanceFile) {
      payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
    }

    if (req.files.photos) {
      payload.photos = req.files.photos.map(f => "uploads/" + f.filename);
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

//
// ===============================================================
// PDF GENERATION
// ===============================================================
//

export const getPdf = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).lean();
    if (!a) return res.status(404).json({ message: "Not found" });

    let html = loadTemplate();

    // Section header title
    const titleMap = {
      conducted: "ACTIVITY CONDUCTED REPORT",
      attended: "ACTIVITY ATTENDED REPORT",
      expert_talk: "ACTIVITY EXPERT TALK"
    };

    // Replace placeholders
    html = html.replace(/{{reportTitle}}/g, titleMap[a.reportType] || "ACTIVITY REPORT");
    html = html.replace(/{{academicYear}}/g, a.academicYear || "");
    html = html.replace(/{{activityName}}/g, a.activityName || "");
    html = html.replace(/{{coordinator}}/g, a.coordinator || "");
    html = html.replace(/{{date}}/g, a.date || "");
    html = html.replace(/{{duration}}/g, a.duration || "");
    html = html.replace(/{{poPos}}/g, a.poPos || "");

    // Resource Person
    html = html.replace(/{{resourceName}}/g, a.resourcePerson?.name || "");
    html = html.replace(/{{resourceDesignation}}/g, a.resourcePerson?.designation || "");
    html = html.replace(/{{resourceInstitution}}/g, a.resourcePerson?.institution || "");
    html = html.replace(/{{resourcePhoto}}/g, toDataUrl(a.resourcePerson?.photo));

    // Session Report
    html = html.replace(/{{sessionSummary}}/g, a.sessionReport?.summary || "");
    html = html.replace(/{{participants}}/g, a.sessionReport?.participantsCount || "");
    html = html.replace(/{{facultyCount}}/g, a.sessionReport?.facultyCount || "");

    // Feedback
    html = html.replace(/{{feedback}}/g, a.feedback || "");

    // Invitation / Poster
    html = html.replace(/{{invitationImage}}/g, toDataUrl(a.invitation));
    html = html.replace(/{{posterImage}}/g, toDataUrl(a.poster));

    // Photos
    const photosHtml = (a.photos || []).map(p => {
      return `<img class="photo-item" src="${toDataUrl(p)}" />`;
    }).join("");
    html = html.replace(/{{photos}}/g, photosHtml);

    // Attendance file (not embedded)
    const attendanceLink = a.attendanceFile ?
      `${req.protocol}://${req.get("host")}/${a.attendanceFile}` : "";
    html = html.replace(/{{attendanceFileLink}}/g, attendanceLink);

    //
    // Generate PDF using puppeteer
    //
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", left: "12mm", right: "12mm", bottom: "20mm" }
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${a.activityName}.pdf"`
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed", error: err.message });
  }
};

//
// ===============================================================
// DOCX GENERATION
// ===============================================================
//

export const getDocx = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).lean();
    if (!a) return res.status(404).json({ message: "Not found" });

    const titleMap = {
      conducted: "ACTIVITY CONDUCTED REPORT",
      attended: "ACTIVITY ATTENDED REPORT",
      expert_talk: "ACTIVITY EXPERT TALK"
    };

    const doc = new Document();
    const children = [];

    // Header
    children.push(new Paragraph({ children: [ new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", bold: true }) ] }));
    children.push(new Paragraph({ children: [ new TextRun({ text: titleMap[a.reportType], bold: true }) ] }));
    children.push(new Paragraph({ children: [ new TextRun(`ACADEMIC YEAR ${a.academicYear}`) ] }));

    // Activity Info
    children.push(new Paragraph(`Activity Name: ${a.activityName}`));
    children.push(new Paragraph(`Coordinator: ${a.coordinator}`));
    children.push(new Paragraph(`Date: ${a.date}`));
    children.push(new Paragraph(`Duration: ${a.duration}`));
    children.push(new Paragraph(`PO & POs: ${a.poPos}`));

    // TOC
    children.push(new Paragraph("TABLE OF CONTENTS"));
    children.push(new Paragraph("1. INVITATION"));
    children.push(new Paragraph("2. POSTER"));
    children.push(new Paragraph("3. RESOURCE PERSON DETAILS"));
    children.push(new Paragraph("4. SESSION REPORT"));
    children.push(new Paragraph("5. ATTENDANCE"));
    children.push(new Paragraph("6. PHOTOS"));
    children.push(new Paragraph("7. FEEDBACK"));

    //
    // Resource Person
    //
    children.push(new Paragraph({ children: [ new TextRun({ text: "RESOURCE PERSON DETAILS", bold: true }) ] }));
    children.push(new Paragraph(`Name: ${a.resourcePerson?.name || ""}`));
    children.push(new Paragraph(`Designation: ${a.resourcePerson?.designation || ""}`));
    children.push(new Paragraph(`Institution: ${a.resourcePerson?.institution || ""}`));

    //
    // Session Report
    //
    children.push(new Paragraph({ children: [ new TextRun({ text: "SESSION REPORT", bold: true }) ] }));
    children.push(new Paragraph(a.sessionReport?.summary || ""));
    children.push(new Paragraph(`No. of Students Present: ${a.sessionReport?.participantsCount || ""}`));
    children.push(new Paragraph(`No. of Faculty Present: ${a.sessionReport?.facultyCount || ""}`));

    //
    // Feedback
    //
    children.push(new Paragraph({ children: [ new TextRun({ text: "FEEDBACK", bold: true }) ] }));
    children.push(new Paragraph(a.feedback || ""));

    //
    // Embed images
    //
    function addImage(relPath) {
      if (!relPath) return null;

      const abs = path.join(process.cwd(), "server", relPath);
      if (!fs.existsSync(abs)) return null;

      const buf = fs.readFileSync(abs);
      return new ImageRun({
        data: buf,
        transformation: { width: 500, height: 350 }
      });
    }

    const img1 = addImage(a.invitation);
    if (img1) children.push(new Paragraph(img1));

    const img2 = addImage(a.poster);
    if (img2) children.push(new Paragraph(img2));

    const img3 = addImage(a.resourcePerson?.photo);
    if (img3) children.push(new Paragraph(img3));

    (a.photos || []).forEach(p => {
      const img = addImage(p);
      if (img) children.push(new Paragraph(img));
    });

    doc.addSection({ children });

    const buffer = await Packer.toBuffer(doc);

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${a.activityName}.docx"`
    });

    res.send(buffer);

  } catch(err) {
    console.error("DOCX ERROR:", err);
    res.status(500).json({ message: "DOCX failed", error: err.message });
  }
};

//
// ===============================================================
// LIST, APPROVE, REJECT
// ===============================================================
//

export const listActivities = async (req, res) => {
  const list = await Activity.find().populate("createdBy","name email").sort({ createdAt:-1 });
  res.json(list);
};

export const approveActivity = async (req, res) => {
  try {
    const a = await Activity.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: "fail" });
  }
};

export const rejectActivity = async (req, res) => {
  try {
    const a = await Activity.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: "fail" });
  }
};
