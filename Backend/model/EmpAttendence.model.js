const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String, // Use a formatted string for the date (e.g., YYYY-MM-DD)
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half Day"], // Restrict the status to these values
    required: true,
  },
});

// Add a unique compound index to prevent duplicate attendance for the same employee on the same date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance
