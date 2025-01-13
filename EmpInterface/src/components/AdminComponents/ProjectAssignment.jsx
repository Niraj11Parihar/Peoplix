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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8011/Projects/getProjects",
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
          `http://localhost:8011/Projects/updateProject/${editingProject._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Project updated successfully!"); // Toast for success
      } else {
        // Create new project
        const response = await axios.post(
          "http://localhost:8011/Projects/CreateProjects",
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
                `http://localhost:8011/Projects/deleteProject/${projectId}`,
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

  // Filter projects by search term and selected status
  const filteredProjects = projects.filter(
    (project) =>
      (project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedStatus ? project.Projectstatus === selectedStatus : true)
  );

  return (
    <Layout>
      <div className="min-h-full w-full py-8 px-4 ">
        {/* Assignment Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            {editingProject ? "Edit Project" : "Assign a Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="projectName"
                className="block text-gray-700 font-semibold mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="clientName"
                className="block text-gray-700 font-semibold mb-2"
              >
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-gray-700 font-semibold mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-700 font-semibold mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="projectHead"
                className="block text-gray-700 font-semibold mb-2"
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
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {editingProject ? "Update Project" : "Assign Project"}
            </button>
          </form>
        </div>

        

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white p-6 shadow-lg rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">{project.projectName}</h3>
                <p className="text-gray-600 mb-2">
                  Client: {project.clientName}
                </p>
                <p className="text-gray-600 mb-2">
                  Start Date: {new Date(project.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                  End Date: {new Date(project.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4">
                  Project Head: {project.projectHead}
                </p>
                <p
                  className={`text-sm font-semibold mb-4 ${
                    project.Projectstatus === "Complete"
                      ? "text-green-600"
                      : project.Projectstatus === "In Progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {project.Projectstatus}
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-1 md:col-span-2 lg:col-span-3 text-center">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectManagement;
