const ProjectModel = require("../model/Project.model");
const EmpModel = require("../model/Emp.model");

// Create Project Controller
const createProject = async (req, res) => {
  try {
    console.log("Received data:", req.body); 
    const adminId = req.user.id; 
    const { projectName, clientName, startDate, endDate, projectHead } =
      req.body;

    if (!projectName || !clientName || !startDate || !endDate || !projectHead) {
      return res.status(400).json({ message: "All fields are required." });
    }

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
    console.error("Error creating project:", error); 
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

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};


// Update Project Controller
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;   
    const { projectName, clientName, startDate, endDate, projectHead, Projectstatus } = req.body;
    
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ message: "Access denied. Role not recognized." });
    }

    if (req.user.role === "employee") {
      const user = await EmpModel.findOne({ _id: req.user.id });
      if (!user || user.position !== "Project Manager") {
        return res.status(403).json({ message: "Access denied. Not a Project Manager." });
      }

      const project = await ProjectModel.findOne({ _id: projectId, projectHead: user.name });
      if (!project) {
        return res.status(404).json({ message: "Project not found or access denied." });
      }
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { projectName, clientName, startDate, endDate, projectHead, Projectstatus },
      { new: true, runValidators: true } 
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project updated successfully.", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Role not recognized." });
    }

    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project deleted successfully.", project: deletedProject });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project", error });
  }
};



module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};
