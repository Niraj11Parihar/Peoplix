const ProjectModel = require("../model/Project.model");
const EmpModel = require("../model/Emp.model");

// Create Project Controller
const createProject = async (req, res) => {
  try {
    console.log("Received data:", req.body);  // Log the request body to verify it's correct
    const adminId = req.user.id; // Extracted from the token
    const { projectName, clientName, startDate, endDate, projectHead } = req.body;

    if (!projectName || !clientName || !startDate || !endDate || !projectHead) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create the new project
    const project = new ProjectModel({
      adminId,
      projectName,
      clientName,
      startDate,
      endDate,
      projectHead,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error); // Log the error for debugging
    res.status(500).json({ message: "Error creating project", error });
  }
};


const EmpModel = require('../model/Employee.model'); // Import Employee model

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const user = await EmpModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let projects;
    if (user.role === 'admin') {
      // Fetch all projects created by the admin
      projects = await ProjectModel.find({ adminId: userId });
    } else if (user.role === 'Employee' && user.position === 'Project Manager') {
      // Fetch projects where the user is the project head
      projects = await ProjectModel.find({ projectHead: user.name });
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found." });
    }

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
};


  module.exports = {
    createProject,
    getProjects
  }