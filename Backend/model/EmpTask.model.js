const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  taskDescription: { type: String, required: true },
  dateAssigned: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
