const ProjectModel = require("../model/Project.model");

// Create Project Controller
exports.createProject = async (req, res) => {
  try {
    console.log("object");
    const adminId = req.user.id; // Extracted from the token
    const { projectName, clientName, startDate, endDate, projectHead } = req.body;

    if (!projectName || !clientName || !startDate || !endDate || !projectHead) {
      return res.status(400).json({ message: 'All fields are required.' });
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
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
};

exports.getProject = async (req, res) => {
    try {
      const { projectId } = req.params; // Extract project ID from the route
  
      // Fetch project data with populated projectHead and tasks
      const project = await ProjectModel.findById(projectId)
        .populate('projectHead', 'name email') // Populate project head details (e.g., name, email)
        .populate('tasks.assignedTo', 'name email'); // Populate developer details in tasks
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching project data', error });
    }
  };