const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { assignTask, getTasksByEmployee, updateTaskStatus, deleteTask } = require("../controllers/TaskManager.controller");

const Task_router = express.Router();

// Route to assign task
Task_router.post("/assign", verifyToken, assignTask); 

// Route to fetch tasks for the logged-in user
Task_router.get("/getTasks", verifyToken, getTasksByEmployee); 

// Route to update task status
Task_router.patch("/updateStatus", verifyToken, updateTaskStatus);

// Route to delete task status
Task_router.delete("/deleteTask/:taskId", verifyToken, deleteTask);

module.exports = Task_router;
    