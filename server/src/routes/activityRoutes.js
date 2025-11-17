// import express from "express";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import {
//   createActivity,
//   updateActivity,
//   getActivity,
//   getPdf,
//   getDocx,
//   listActivities,
//   approveActivity,
//   rejectActivity
// } from "../controllers/activityController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { roleMiddleware } from "../middleware/roleMiddleware.js";

// import Activity from "../models/Activity.js";

// // Fix __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Correct upload directory → server/uploads
// const uploadsDir = path.join(__dirname, "..", "uploads");

// // Ensure folder exists
// import fs from "fs";
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const cleanName = file.originalname.replace(/\s+/g, "_");
//     cb(null, Date.now() + "-" + cleanName);
//   }
// });

// const upload = multer({ storage });

// // Multer fields mapping
// const cpUpload = upload.fields([
//   { name: "invitation", maxCount: 1 },
//   { name: "poster", maxCount: 1 },
//   { name: "resourcePhoto", maxCount: 1 },
//   { name: "attendanceFile", maxCount: 1 },
//   { name: "photos", maxCount: 20 }
// ]);

// const router = express.Router();

// // Faculty actions
// router.post("/", authMiddleware, roleMiddleware("faculty"), cpUpload, createActivity);
// router.put("/:id", authMiddleware, roleMiddleware("faculty"), cpUpload, updateActivity);
// router.get("/mine", authMiddleware, roleMiddleware("faculty"), async (req, res) => {
//   const list = await Activity.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
//   res.json(list);
// });

// // Admin/HOD/Principal
// router.get("/", authMiddleware, roleMiddleware("hod", "admin", "principal"), listActivities);
// router.put("/:id/approve", authMiddleware, roleMiddleware("hod", "admin", "principal"), approveActivity);
// router.put("/:id/reject", authMiddleware, roleMiddleware("hod", "admin", "principal"), rejectActivity);

// // Shared
// router.get("/:id", authMiddleware, getActivity);
// router.get("/:id/pdf", authMiddleware, getPdf);
// router.get("/:id/docx", authMiddleware, getDocx);

// export default router;





import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 100% Correct Upload Directory
const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({ storage });

const cpUpload = upload.fields([
  { name: "invitation", maxCount: 1 },
  { name: "poster", maxCount: 1 },
  { name: "resourcePhoto", maxCount: 1 },
  { name: "attendanceFile", maxCount: 1 },
  { name: "photos", maxCount: 20 }
]);

// Import controllers AFTER multer definition
import {
  createActivity,
  updateActivity,
  getActivity,
  getPdf,
  getDocx,
  listActivities,
  approveActivity,
  rejectActivity
} from "../controllers/activityController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Faculty
router.post("/", authMiddleware, roleMiddleware("faculty"), cpUpload, createActivity);
router.put("/:id", authMiddleware, roleMiddleware("faculty"), cpUpload, updateActivity);

// Faculty reports
router.get("/mine", authMiddleware, roleMiddleware("faculty"), async (req, res) => {
  const list = await Activity.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
});

// Admin
router.get("/", authMiddleware, roleMiddleware("hod","admin","principal"), listActivities);
router.put("/:id/approve", authMiddleware, roleMiddleware("hod","admin","principal"), approveActivity);
router.put("/:id/reject", authMiddleware, roleMiddleware("hod","admin","principal"), rejectActivity);

// Shared
router.get("/:id", authMiddleware, getActivity);
router.get("/:id/pdf", authMiddleware, getPdf);
router.get("/:id/docx", authMiddleware, getDocx);

export default router;
