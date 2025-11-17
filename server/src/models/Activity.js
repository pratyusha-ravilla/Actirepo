import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  reportType: { type: String, enum: ["conducted", "attended", "expert_talk"], required: true },
  activityName: String,
  coordinator: String,
  date: String,
  duration: String,
  poPos: String,

  invitation: String,
  poster: String,

  resourcePerson: {
    name: String,
    designation: String,
    institution: String,
    photo: String
  },

  sessionReport: {
    summary: String,
    participantsCount: Number,
    facultyCount: Number
  },

  attendanceFile: String,
  photos: [String],

  feedback: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
