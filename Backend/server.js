const express = require("express");
const db = require("./config/database");
const Auth_router = require("./router/Authentication.router");
const cors = require('cors');
const AS_router = require("./router/AdminSmall.router");
const emp_router = require("./router/Employee.router");
const Attendance_router = require("./router/Attendance.router");
const Project_router = require("./router/Project.router");
const Task_router = require("./router/TaskManager.router");

const app = express();

// Apply CORS middleware before defining routes
app.use(cors({
  origin: ['http://localhost:5174','http://localhost:5173'], 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.options("*", cors());


// Middleware for parsing JSON and URL-encoded data
app.use(express.json());

// Authentication routes
app.use("/auth", Auth_router);
app.use("/admin",AS_router);
app.use("/Emp", emp_router);
app.use("/Attendance", Attendance_router);
app.use("/Projects", Project_router);
app.use("/TaskManager", Task_router);

app.listen(8082, (err) => {
  db;
  if (err) {
    console.log("Server not started");
    return false;
  }
  console.log("Server started at http://localhost:8082");
  return true;
});
