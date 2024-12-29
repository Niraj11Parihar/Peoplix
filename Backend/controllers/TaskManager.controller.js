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
  const user = await EmpModel.findOne({_id : id});
  try {
    let tasks = [];

    if (role === "employee" && user.position === "Project Manager") {

      tasks = await TaskModel.find({ projectHead: user.name })

    } else if (role === "employee") {

      tasks = await TaskModel.find({ employeeName: userName }).populate("projectHeadId");
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


module.exports = { assignTask, getTasksByEmployee };
