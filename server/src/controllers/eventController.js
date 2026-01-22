

//server/src/controllers/eventController.js

import Event from "../models/Event.js";

import Notification from "../models/Notification.js";

/**
 * GET /api/events/open
 * List all open events for faculty registration
 */

// export const getOpenEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ status: "open" }).sort({ date: 1 });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch events" });
//   }
// };

//create event


// GET /api/events/open



// export const getOpenEvents = async (req, res) => {
//   try {
//     const events = await Event.find({
//       approvalStatus: "approved",
//       status: "open"
//     }).sort({ startDate: 1 });

//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch events" });
//   }
// };



export const getOpenEvents = async (req, res) => {
  try {
    const events = await Event.find({
      approvalStatus: "approved",
      status: "open"
    })
      .populate("createdBy", "name email")
      .sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};




export const createEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      department,
      eventType,
      startDate,
      endDate
    } = req.body;

    const event = await Event.create({
      title,
      description,
      department,
      eventType,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    // 🔔 CREATE NOTIFICATION
    await Notification.create({
      title: "New Event Created",
      message: `${req.user.name} created a new ${eventType} event: "${title}"`,
      type: "EVENT_CREATED",
      targetRoles: ["admin", "hod", "principal"],
      relatedEvent: event._id,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




/**
 * POST /api/events/:id/register
 * Faculty registers for an event
 */

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.registrations.some(
      (r) => r.faculty.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registrations.push({
      faculty: req.user._id
    });

    await event.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};




/**
 * GET /api/events/my-registrations
 * Faculty registered events
 */
export const myRegistrations = async (req, res) => {
  try {
    const events = await Event.find({
      "registrations.faculty": req.user._id
    }).sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to load registrations" });
  }
};



//delete event

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔒 OWNER CHECK
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this event"
      });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
  // in getOpenEvents controller
const events = await Event.find({ status: "open" })
  .populate("createdBy", "name email")
  .sort({ startDate: 1 });

};


// export const approveEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     event.status = "approved";
//     await event.save();

//     res.json({ message: "Event approved", event });
//   } catch (err) {
//     res.status(500).json({ message: "Approval failed" });
//   }
// };



export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.approvalStatus = "approved";
    await event.save();

    res.json({ message: "Event approved", event });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};



// export const rejectEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     event.status = "rejected";
//     await event.save();

//     res.json({ message: "Event rejected", event });
//   } catch (err) {
//     res.status(500).json({ message: "Rejection failed" });
//   }
// };




//event registration stats

export const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.approvalStatus = "rejected";
    await event.save();

    res.json({ message: "Event rejected", event });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};




export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("registrations.faculty", "name email department");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      title: event.title,
      eventType: event.eventType,
      registrations: event.registrations
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};
