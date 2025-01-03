const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  projectName: {
    type: String,
    ref: "Project", // Reference to the Project model
    required: true,
  },
  projectHead: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["NotStarted", "InProgress", "Completed"],
    default: "Not Started",
  },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
