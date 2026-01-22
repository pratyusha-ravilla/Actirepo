
import mongoose from "mongoose";


/* ================= REGISTRATION SUB-SCHEMA ================= */
const registrationSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attendanceMarked: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }

);



/* ================= EVENT SCHEMA ================= */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      required: true
    },

    eventType: {
      type: String,
      enum: ["Workshop", "Expert Talk", "Conducted","Attended"],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    registrations: [registrationSchema],

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },

    //approval event

    approvalStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},

status: {
  type: String,
  enum: ["open", "closed"],
  default: "open"
},


approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

approvedAt: Date,

  },
  { timestamps: true }

);



export default mongoose.model("Event", eventSchema);
