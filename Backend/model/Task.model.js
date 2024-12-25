// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  projectHeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee", // Assuming project head is a user
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
