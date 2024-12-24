const ProjectModel = require("../model/Project.model");

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


const getProjects = async (req, res) => {
  try {
    const adminId = req.user.id; // Get the adminId from the token (already set in verifyToken middleware)
    
    // Fetch projects that belong to the admin
    const projects = await ProjectModel.find({ adminId }); 
    
    if (!projects) {
      return res.status(404).json({ message: "No projects found." });
    }

    // Send the projects to the client
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error); // Log any error
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

  module.exports = {
    createProject,
    getProjects
  }