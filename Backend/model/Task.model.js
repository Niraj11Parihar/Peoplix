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
    ref: "Project",
    required: true,
  },
  projectHead: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "InProgress", "Completed"],
    default: "Not Started",
  },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
