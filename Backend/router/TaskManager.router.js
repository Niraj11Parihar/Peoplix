// routes/taskRoutes.js
const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { assignTask, getTasksByEmployee } = require("../controllers/TaskManager.controller");
const Task_router = express.Router();

Task_router.post("/assign", verifyToken, assignTask); 
Task_router.get("/getTasks", verifyToken, getTasksByEmployee); 

module.exports = Task_router;
