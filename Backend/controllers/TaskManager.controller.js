const TaskModel = require("../model/Task.model");

const assignTask = async (req, res) => {
  const { taskName, projectName, deadline, projectHeadId, employeeName } = req.body;
  
  const { userId } = req.user; 
  console.log(userId)

  try {
    const newTask = new TaskModel({
      taskName,
      projectName,
      deadline,
      projectHeadId : userId,
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
  const { userName } = req.user; // Accessing employee's name from the decoded token
  
  try {
    const tasks = await TaskModel.find({ employeeName: userName }).populate("projectHeadId");

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks assigned" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

module.exports = { assignTask, getTasksByEmployee };
