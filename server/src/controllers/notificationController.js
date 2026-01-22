import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const role = req.user.role;

    const notifications = await Notification.find({
      targetRoles: role
    })
      .populate("relatedEvent", "title eventType startDate")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { isReadBy: req.user._id }
    });

    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};
