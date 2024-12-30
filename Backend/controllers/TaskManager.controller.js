const EmpModel = require("../model/Emp.model");
const TaskModel = require("../model/Task.model");

const assignTask = async (req, res) => {
  const { taskName, projectName, deadline, employeeName, projectHead } = req.body;

  try {
    const newTask = new TaskModel({
      taskName,
      projectName,
      deadline,
      projectHead,
      employeeName,
      status: "Not Started",
    });

    await newTask.save();

    res.status(201).json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning task" });
  }
};

const getTasksByEmployee = async (req, res) => {
  const { id, role } = req.user;
  const user = await EmpModel.findOne({ _id: id });

  try {
    let tasks = [];

    if (role === "employee" && user.position === "Project Manager") {
      // Fetch tasks for project manager
      tasks = await TaskModel.find({ projectHead: user.name });
    } else if (role === "employee") {
      // Fetch tasks for assigned employee
      tasks = await TaskModel.find({ employeeName: user.name }).populate("projectHead");
    }

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};


// Controller to update task status
const updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body;

  try {
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status; // Update the task status
    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task status" });
  }
};


module.exports = { assignTask, getTasksByEmployee, updateTaskStatus };
