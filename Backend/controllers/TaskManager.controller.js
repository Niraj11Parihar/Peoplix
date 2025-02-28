const EmpModel = require("../model/Emp.model");
const TaskModel = require("../model/Task.model");

const assignTask = async (req, res) => {
  const { taskName, projectName, deadline, employeeName, projectHead } =
    req.body;

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

    res
      .status(201)
      .json({ message: "Task assigned successfully", task: newTask });
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
      // Fetch tasks for Project Manager with project details
      tasks = await TaskModel.aggregate([
        {
          $match: {
            projectHead: user.name,
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "projectName",
            foreignField: "projectName",
            as: "projectData",
          },
        },
        {
          $unwind: {
            path: "$projectData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            taskName: 1,
            projectHead: 1,
            employeeName: 1,
            projectName: 1,
            status: 1,
            clientName: "$projectData.clientName",
            startDate: "$projectData.startDate",
            endDate: "$projectData.endDate",
          },
        },
      ]);
    } else if (role === "employee") {
      // Fetch tasks for normal employees
      tasks = await TaskModel.find({ employeeName: user.name }).populate(
        "projectHead"
      );
    } else if (role === "admin") {
      // Fetch tasks for admin
      tasks = await TaskModel.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "projectName",
            foreignField: "projectName",
            as: "projectData",
          },
        },
        {
          $unwind: {
            path: "$projectData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            taskName: 1,
            projectHead: 1,
            employeeName: 1,
            projectName: 1,
            status: 1,
            clientName: "$projectData.clientName",
            startDate: "$projectData.startDate",
            endDate: "$projectData.endDate",
          },
        },
      ]);
    }

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json({ tasks, user  });
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

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const { id } = req.user; 
  try {
    // Check if the user is a Project Manager
    const user = await EmpModel.findById(id);
    if (user.position !== "Project Manager") {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete tasks" });
    }

    const task = await TaskModel.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

module.exports = {
  assignTask,
  getTasksByEmployee,
  updateTaskStatus,
  deleteTask,
};
