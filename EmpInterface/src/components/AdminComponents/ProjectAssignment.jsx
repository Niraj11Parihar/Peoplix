import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../features/Layout";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Search, Calendar, User, Briefcase, Building2, ChevronDown, Edit3, Trash2, PlusCircle } from 'lucide-react';

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
  const [isFormVisible, setIsFormVisible] = useState(false);

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
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Project Management
            </h1>
            <p className="text-gray-500 mt-1">Manage and track your projects efficiently</p>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} />
            {editingProject ? "Edit Project" : "New Project"}
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              placeholder="Search projects or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={20} />
            <select
              className="w-full pl-4 pr-10 py-3 bg-white border border-indigo-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Complete">Complete</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Form */}
      {(isFormVisible || editingProject) && (
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-indigo-100">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {editingProject ? "Edit Project Details" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Head</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                    <input
                      type="text"
                      name="projectHead"
                      value={formData.projectHead}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false);
                    setEditingProject(null);
                    setFormData({
                      projectName: "",
                      clientName: "",
                      startDate: "",
                      endDate: "",
                      projectHead: "",
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100 hover:shadow-lg transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {project.projectName}
                  </h3>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      project.Projectstatus === "Complete"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : project.Projectstatus === "In Progress"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {project.Projectstatus}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <Building2 size={18} className="mr-2 text-indigo-400" />
                    <span>{project.clientName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2 text-indigo-400" />
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="mr-2 text-indigo-400" />
                    <span>{project.projectHead}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleEdit(project);
                      setIsFormVisible(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-2xl border border-indigo-100 shadow-sm">
              <Briefcase size={48} className="mb-4 text-indigo-300" />
              <p className="text-lg font-medium text-indigo-900">No projects found</p>
              <p className="text-sm text-indigo-600">Create a new project to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default ProjectManagement;
