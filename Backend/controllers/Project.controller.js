const ProjectModel = require("../model/Project.model");
const EmpModel = require("../model/Emp.model");

// Create Project Controller
const createProject = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log the request body to verify it's correct
    const adminId = req.user.id; // Extracted from the token
    const { projectName, clientName, startDate, endDate, projectHead } =
      req.body;

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
    let projects = [];

    if (req.user.role === "admin") {
      projects = await ProjectModel.find({ adminId: req.user.id });
    } else if (req.user.role === "employee") {
      const user = await EmpModel.findOne({ _id: req.user.id });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.position === "Project Manager") {
        projects = await ProjectModel.find({ projectHead: user.name });
      } else {
        return res.status(403).json({ message: "Access denied. Not a Project Manager." });
      }
    } else {
      return res.status(403).json({ message: "Access denied. Role not recognized." });
    }

    // Return the projects
    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};


module.exports = {
  createProject,
  getProjects,
};
