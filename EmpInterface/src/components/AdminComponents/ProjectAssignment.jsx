import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../features/Layout";
import { confirmAlert } from "react-confirm-alert"; // Import confirmAlert
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the confirm alert CSS


const ProjectManagement = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    startDate: "",
    endDate: "",
    projectHead: "",
  });

  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8082/Projects/getProjects",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.projects) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle project assignment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      if (editingProject) {
        // Update existing project
        const response = await axios.patch(
          `http://localhost:8082/Projects/updateProject/${editingProject._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Project updated successfully!"); // Toast for success
      } else {
        // Create new project
        const response = await axios.post(
          "http://localhost:8082/Projects/CreateProjects",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Project assigned successfully!"); // Toast for success
      }

      setFormData({
        projectName: "",
        clientName: "",
        startDate: "",
        endDate: "",
        projectHead: "",
      });
      setEditingProject(null); // Reset editing state
      fetchProjects(); // Refresh the projects list
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Error submitting project: " + error.message); // Toast for error
    }
  };

  // Handle edit button click
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      clientName: project.clientName,
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate.split("T")[0],
      projectHead: project.projectHead || "",
    });
  };

  // Handle delete button click with confirmation alert
  const handleDelete = (projectId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const token = localStorage.getItem("authToken");
              await axios.delete(
                `http://localhost:8082/Projects/deleteProject/${projectId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.success("Project deleted successfully!"); // Toast for success
              fetchProjects(); // Refresh the projects list
            } catch (error) {
              console.error("Error deleting project:", error);
              toast.error(error.response?.data?.message || error.message); // Toast for error
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <Layout>
      <div className=" min-h-full w-full py-8 px-4">
        {/* Assignment Form */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingProject ? "Edit Project" : "Assign a Project"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="projectName"
                className="block text-gray-600 font-medium"
              >
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="clientName"
                className="block text-gray-600 font-medium"
              >
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-gray-600 font-medium"
              >
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-gray-600 font-medium"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="projectHead"
                className="block text-gray-600 font-medium"
              >
                Project Head (Name)
              </label>
              <input
                type="text"
                name="projectHead"
                value={formData.projectHead}
                onChange={handleChange}
                placeholder="Enter Project Head Name"
                required
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {editingProject ? "Update Project" : "Assign Project"}
            </button>
          </form>
        </div>

        {/* Project Cards */}
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Project List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Client:</strong> {project.clientName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Start Date:</strong>{" "}
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>End Date:</strong>{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Project Head:</strong>{" "}
                    {project.projectHead || "Not Assigned"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong>{" "}
                    {project.Projectstatus}
                  </p>
                  <button
                    onClick={() => handleEdit(project)}
                    className="my-4 w-1/4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="m-4 w-1/4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-1 md:col-span-2 lg:col-span-3">
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectManagement;
