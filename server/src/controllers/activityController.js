
// // server/src/controllers/activityController.js
// import fs from "fs";
// import path from "path";
// import Activity from "../models/Activity.js";
// import puppeteer from "puppeteer";
// import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
// import { fileURLToPath } from "url";

// // Fix __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Correct template and uploads path
// const TEMPLATE_PATH = path.join(__dirname, "..", "..", "templates", "report_template.html");
// const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

// // Load template file
// function loadTemplate() {
//   return fs.readFileSync(TEMPLATE_PATH, "utf8");
// }

// // Convert an image relative path to Base64
// function toDataUrl(relativePath) {
//   if (!relativePath) return "";

//   try {
//     const fullPath = path.join(UPLOADS_DIR, path.basename(relativePath));
//     const buf = fs.readFileSync(fullPath);
//     const ext = path.extname(fullPath).substring(1);
//     return `data:image/${ext};base64,${buf.toString("base64")}`;
//   } catch (e) {
//     console.log("IMAGE NOT FOUND:", relativePath);
//     return "";
//   }
// }

// //
// // =================================================================
// // CREATE ACTIVITY
// // =================================================================
// //

// export const createActivity = async (req, res) => {
//   try {
//     const payload = req.body.payload ? JSON.parse(req.body.payload) : {};
//     payload.status = "pending";
//     payload.resourcePerson = payload.resourcePerson || {};

//     if (req.files.invitation) payload.invitation = "uploads/" + req.files.invitation[0].filename;
//     if (req.files.poster) payload.poster = "uploads/" + req.files.poster[0].filename;
//     if (req.files.resourcePhoto) payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
//     if (req.files.attendanceFile) payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
//     if (req.files.photos) payload.photos = req.files.photos.map(f => "uploads/" + f.filename);

//     const a = await Activity.create(payload);
//     res.status(201).json(a);

//   } catch (err) {
//     console.error("CREATE ERROR:", err);
//     res.status(500).json({ message: "Create failed", error: err.message });
//   }
// };

// //
// // =================================================================
// // GET ONE ACTIVITY (IMPORTANT - FIXED)
// // =================================================================
// //

// export const getActivity = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).populate("createdBy", "name email");
//     if (!a) return res.status(404).json({ message: "Not found" });

//     res.json(a);
//   } catch (err) {
//     console.error("FETCH ERROR:", err);
//     res.status(500).json({ message: "Fetch activity failed" });
//   }
// };

// //
// // =================================================================
// // UPDATE ACTIVITY
// // =================================================================
// //

// export const updateActivity = async (req, res) => {
//   try {
//     const payload = req.body.payload ? JSON.parse(req.body.payload) : {};

//     if (!payload.resourcePerson) payload.resourcePerson = {};

//     if (req.files.invitation) payload.invitation = "uploads/" + req.files.invitation[0].filename;
//     if (req.files.poster) payload.poster = "uploads/" + req.files.poster[0].filename;
//     if (req.files.resourcePhoto) payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
//     if (req.files.attendanceFile) payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
//     if (req.files.photos) payload.photos = req.files.photos.map(f => "uploads/" + f.filename);

//     const updated = await Activity.findByIdAndUpdate(req.params.id, payload, { new: true });
//     res.json(updated);

//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };

// //
// // =================================================================
// // GENERATE PDF
// // =================================================================
// //

// export const getPdf = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).lean();
//     if (!a) return res.status(404).json({ message: "Not found" });

//     let html = loadTemplate();

//     // ⭐ Insert Atria full-width header image
// const headerPath = path.join(__dirname, "..", "..", "templates/images/header.png");
// html = html.replace("{{headerImage}}", headerPath);


//     const titleMap = {
//       conducted: "ACTIVITY CONDUCTED REPORT",
//       attended: "ACTIVITY ATTENDED REPORT",
//       expert_talk: "ACTIVITY EXPERT TALK"
//     };

//     // Replace variables in template
//     html = html.replace(/{{reportTitle}}/g, titleMap[a.reportType]);
//     html = html.replace(/{{academicYear}}/g, a.academicYear);
//     html = html.replace(/{{activityName}}/g, a.activityName);
//     html = html.replace(/{{coordinator}}/g, a.coordinator);
//     html = html.replace(/{{date}}/g, a.date);
//     html = html.replace(/{{duration}}/g, a.duration);
//     html = html.replace(/{{poPos}}/g, a.poPos);

//     html = html.replace(/{{resourceName}}/g, a.resourcePerson?.name || "");
//     html = html.replace(/{{resourceDesignation}}/g, a.resourcePerson?.designation || "");
//     html = html.replace(/{{resourceInstitution}}/g, a.resourcePerson?.institution || "");
//     html = html.replace(/{{resourcePhoto}}/g, toDataUrl(a.resourcePerson?.photo));

//     html = html.replace(/{{sessionSummary}}/g, a.sessionReport?.summary || "");
//     html = html.replace(/{{participants}}/g, a.sessionReport?.participantsCount || "");
//     html = html.replace(/{{facultyCount}}/g, a.sessionReport?.facultyCount || "");
//     html = html.replace(/{{feedback}}/g, a.feedback || "");

//     html = html.replace(/{{invitationImage}}/g, toDataUrl(a.invitation));
//     html = html.replace(/{{posterImage}}/g, toDataUrl(a.poster));

//     const photosHtml = (a.photos || [])
//       .map(p => `<img src="${toDataUrl(p)}" class="photo-item" />`)
//       .join("");
//     html = html.replace(/{{photos}}/g, photosHtml);

//     const attendanceLink = a.attendanceFile
//       ? `${req.protocol}://${req.get("host")}/${a.attendanceFile}`
//       : "";
//     html = html.replace(/{{attendanceFileLink}}/g, attendanceLink);

//     // Puppeteer PDF
//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"]
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true
//     });

//     await browser.close();

//     // Allow browser to download
//     res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="${a.activityName}.pdf"`);

//     res.send(pdf);

//   } catch (err) {
//     console.error("PDF ERROR:", err);
//     res.status(500).json({ message: "PDF failed", error: err.message });
//   }
// };

// //
// // =================================================================
// // GENERATE DOCX
// // =================================================================
// //

// export const getDocx = async (req, res) => {
//   try {
//     const a = await Activity.findById(req.params.id).lean();
//     if (!a) return res.status(404).json({ message: "Not found" });

//     const titleMap = {
//       conducted: "ACTIVITY CONDUCTED REPORT",
//       attended: "ACTIVITY ATTENDED REPORT",
//       expert_talk: "ACTIVITY EXPERT TALK"
//     };

//     // Collect paragraphs & images
//     const children = [];

//     const safePush = (p) => {
//       if (p !== null && p !== undefined) children.push(p);
//     };

//     safePush(new Paragraph({
//       children: [new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", bold: true })]
//     }));

//     safePush(new Paragraph({
//       children: [new TextRun({ text: titleMap[a.reportType], bold: true })]
//     }));

//     safePush(new Paragraph(`ACADEMIC YEAR ${a.academicYear}`));
//     safePush(new Paragraph(`Activity Name: ${a.activityName}`));
//     safePush(new Paragraph(`Coordinator: ${a.coordinator}`));
//     safePush(new Paragraph(`Date: ${a.date}`));
//     safePush(new Paragraph(`Duration: ${a.duration}`));
//     safePush(new Paragraph(`PO & POs: ${a.poPos}`));

//     safePush(new Paragraph("TABLE OF CONTENTS"));
//     [
//       "Invitation", "Poster", "Resource Person Details", "Session Report",
//       "Attendance", "Photos", "Feedback"
//     ].forEach((t, i) =>
//       safePush(new Paragraph(`${i + 1}. ${t.toUpperCase()}`))
//     );

//     safePush(new Paragraph("RESOURCE PERSON DETAILS"));
//     safePush(new Paragraph(`Name: ${a.resourcePerson?.name || ""}`));
//     safePush(new Paragraph(`Designation: ${a.resourcePerson?.designation || ""}`));
//     safePush(new Paragraph(`Institution: ${a.resourcePerson?.institution || ""}`));

//     safePush(new Paragraph("SESSION REPORT"));
//     safePush(new Paragraph(a.sessionReport?.summary || ""));
//     safePush(new Paragraph(`Students Present: ${a.sessionReport?.participantsCount}`));
//     safePush(new Paragraph(`Faculty Present: ${a.sessionReport?.facultyCount}`));

//     safePush(new Paragraph("FEEDBACK"));
//     safePush(new Paragraph(a.feedback || ""));

//     // IMAGE EMBED UTILITY
//     function embedImage(rel) {
//       if (!rel) return null;
//       const full = path.join(UPLOADS_DIR, path.basename(rel));
//       if (!fs.existsSync(full)) return null;

//       const buffer = fs.readFileSync(full);
//       return new Paragraph({
//         children: [
//           new ImageRun({
//             data: buffer,
//             transformation: { width: 500, height: 350 }
//           })
//         ]
//       });
//     }

//     // Add images
//     [a.invitation, a.poster, a.resourcePerson?.photo, ...(a.photos || [])]
//       .forEach(img => safePush(embedImage(img)));

//     // FINAL DOCX — FIXED STRUCTURE
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: children
//         }
//       ]
//     });

//     const buffer = await Packer.toBuffer(doc);

//     res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
//     res.setHeader("Content-Disposition", `attachment; filename="${a.activityName}.docx"`);

//     res.send(buffer);

//   } catch (err) {
//     console.error("DOCX ERROR:", err);
//     res.status(500).json({ message: "DOCX failed", error: err.message });
//   }
// };

// //
// // =================================================================
// // LIST / APPROVE / REJECT
// // =================================================================
// //

// export const listActivities = async (req, res) => {
//   const list = await Activity.find().populate("createdBy", "name email").sort({ createdAt: -1 });
//   res.json(list);
// };

// export const approveActivity = async (req, res) => {
//   const a = await Activity.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
//   res.json(a);
// };

// export const rejectActivity = async (req, res) => {
//   const a = await Activity.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
//   res.json(a);
// };






// server/src/controllers/activityController.js
import fs from "fs";
import path from "path";
import Activity from "../models/Activity.js";
import puppeteer from "puppeteer";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { fileURLToPath } from "url";

// Fix dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PATHS
const TEMPLATE_PATH = path.join(__dirname, "..", "..", "templates", "report_template.html");
const CSS_PATH = path.join(__dirname, "..", "..", "templates", "report_template.css");
const HEADER_PATH = path.join(__dirname, "..", "..", "templates/images/header.png");
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

// ============================
// HELPERS
// ============================

// Base64 for header & static images
function toBase64(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).substring(1);
    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch (err) {
    console.log("BASE64 ERR:", err);
    return "";
  }
}

// Convert uploaded images → Base64
function toDataUrl(relativePath) {
  if (!relativePath) return "";
  try {
    const full = path.join(UPLOADS_DIR, path.basename(relativePath));
    const buf = fs.readFileSync(full);
    const ext = path.extname(full).substring(1);
    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

// Load HTML template
function loadTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, "utf8");
}

// ============================
// CREATE ACTIVITY
// ============================
export const createActivity = async (req, res) => {
  try {
    const payload = req.body.payload ? JSON.parse(req.body.payload) : {};

    // ensure resource person & session objects exist
    payload.resourcePerson = payload.resourcePerson || {};
    payload.sessionReport = payload.sessionReport || {};

    // Files
    if (req.files.invitation) payload.invitation = "uploads/" + req.files.invitation[0].filename;
    if (req.files.poster) payload.poster = "uploads/" + req.files.poster[0].filename;
    if (req.files.resourcePhoto) payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
    if (req.files.attendanceFile) payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
    if (req.files.photos) payload.photos = req.files.photos.map(f => "uploads/" + f.filename);

    const activity = await Activity.create(payload);
    res.status(201).json(activity);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

// ============================
// GET ONE ACTIVITY
// ============================
export const getActivity = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).populate("createdBy", "name email");
    if (!a) return res.status(404).json({ message: "Not found" });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ============================
// UPDATE ACTIVITY
// ============================
export const updateActivity = async (req, res) => {
  try {
    const payload = req.body.payload ? JSON.parse(req.body.payload) : {};
    payload.resourcePerson = payload.resourcePerson || {};

    if (req.files.invitation) payload.invitation = "uploads/" + req.files.invitation[0].filename;
    if (req.files.poster) payload.poster = "uploads/" + req.files.poster[0].filename;
    if (req.files.resourcePhoto) payload.resourcePerson.photo = "uploads/" + req.files.resourcePhoto[0].filename;
    if (req.files.attendanceFile) payload.attendanceFile = "uploads/" + req.files.attendanceFile[0].filename;
    if (req.files.photos) payload.photos = req.files.photos.map(f => "uploads/" + f.filename);

    const updated = await Activity.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ============================
// GENERATE PDF
// ============================
export const getPdf = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).lean();

    let html = loadTemplate();

    // Insert CSS path
    html = html.replace("{{cssPath}}", CSS_PATH.replace(/\\/g, "/"));

    // Insert header image
    html = html.replace("{{headerImage}}", toBase64(HEADER_PATH));

    // Titles
    const titleMap = {
      conducted: "ACTIVITY CONDUCTED REPORT",
      attended: "ACTIVITY ATTENDED REPORT",
      expert_talk: "ACTIVITY EXPERT TALK"
    };

    // Text replacements
    html = html.replace(/{{reportTitle}}/g, titleMap[a.reportType]);
    html = html.replace(/{{academicYear}}/g, a.academicYear || "");
    html = html.replace(/{{activityName}}/g, a.activityName || "");
    html = html.replace(/{{coordinator}}/g, a.coordinator || "");
    html = html.replace(/{{date}}/g, a.date || "");
    html = html.replace(/{{duration}}/g, a.duration || "");
    html = html.replace(/{{poPos}}/g, a.poPos || "");

    html = html.replace(/{{resourceName}}/g, a.resourcePerson?.name || "");
    html = html.replace(/{{resourceDesignation}}/g, a.resourcePerson?.designation || "");
    html = html.replace(/{{resourceInstitution}}/g, a.resourcePerson?.institution || "");
    html = html.replace(/{{resourcePhoto}}/g, toDataUrl(a.resourcePerson?.photo));

    html = html.replace(/{{sessionSummary}}/g, a.sessionReport?.summary || "");
    html = html.replace(/{{participants}}/g, a.sessionReport?.participantsCount || "");
    html = html.replace(/{{facultyCount}}/g, a.sessionReport?.facultyCount || "");
    html = html.replace(/{{feedback}}/g, a.feedback || "");

    html = html.replace(/{{invitationImage}}/g, toDataUrl(a.invitation));
    html = html.replace(/{{posterImage}}/g, toDataUrl(a.poster));

    // Photos
    const photosHtml = (a.photos || []).map(p => `<img src="${toDataUrl(p)}">`).join("");
    html = html.replace(/{{photos}}/g, photosHtml);

    // Attendance link
    const attendanceUrl = a.attendanceFile
      ? `${req.protocol}://${req.get("host")}/${a.attendanceFile}`
      : "";
    html = html.replace(/{{attendanceFileLink}}/g, attendanceUrl);

    // Create PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--allow-file-access-from-files",
        "--enable-local-file-access",
        "--disable-web-security"
      ]
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.addStyleTag({ path: CSS_PATH });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.setHeader("Content-Disposition", `attachment; filename="${a.activityName}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);

  } catch (err) {
    console.log("PDF ERROR:", err);
    res.status(500).json({ message: "PDF failed", error: err.message });
  }
};

// ============================
// GENERATE DOCX
// ============================
export const getDocx = async (req, res) => {
  try {
    const a = await Activity.findById(req.params.id).lean();

    const titleMap = {
      conducted: "ACTIVITY CONDUCTED REPORT",
      attended: "ACTIVITY ATTENDED REPORT",
      expert_talk: "ACTIVITY EXPERT TALK"
    };

    const children = [];

    // Header
    if (fs.existsSync(HEADER_PATH)) {
      const buf = fs.readFileSync(HEADER_PATH);
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: buf,
              transformation: { width: 550, height: 80 }
            })
          ]
        })
      );
    }

    // Content
    children.push(new Paragraph(titleMap[a.reportType]));
    children.push(new Paragraph(`Academic Year: ${a.academicYear}`));
    children.push(new Paragraph(`Activity Name: ${a.activityName}`));
    children.push(new Paragraph(`Coordinator: ${a.coordinator}`));
    children.push(new Paragraph(`Date: ${a.date}`));
    children.push(new Paragraph(`Duration: ${a.duration}`));
    children.push(new Paragraph(`PO & POs: ${a.poPos}`));

    // Embed images
    function embed(rel) {
      if (!rel) return null;
      const full = path.join(UPLOADS_DIR, path.basename(rel));
      if (!fs.existsSync(full)) return null;
      const buffer = fs.readFileSync(full);
      return new Paragraph({
        children: [
          new ImageRun({
            data: buffer,
            transformation: { width: 450, height: 280 }
          })
        ]
      });
    }

    children.push(embed(a.invitation));
    children.push(embed(a.poster));
    children.push(embed(a.resourcePerson?.photo));

    (a.photos || []).forEach(p => children.push(embed(p)));

    children.push(new Paragraph("Feedback"));
    children.push(new Paragraph(a.feedback || ""));

    // Build DOCX
    const doc = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${a.activityName}.docx"`);
    res.send(buffer);

  } catch (err) {
    console.log("DOCX ERROR:", err);
    res.status(500).json({ message: "DOCX failed", error: err.message });
  }
};

// ============================
// LIST / APPROVE / REJECT
// ============================
export const listActivities = async (req, res) => {
  const list = await Activity.find().populate("createdBy", "name email").sort({ createdAt: -1 });
  res.json(list);
};

export const approveActivity = async (req, res) => {
  const a = await Activity.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(a);
};

export const rejectActivity = async (req, res) => {
  const a = await Activity.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  res.json(a);
};
