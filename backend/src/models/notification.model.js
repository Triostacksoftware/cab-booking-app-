const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, required: true },
    recipientId: { type: String, required: true, index: true },
    channel: { type: String, required: true },
    template: { type: String, required: true },
    status: { type: String, default: "queued" },
    payload: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
