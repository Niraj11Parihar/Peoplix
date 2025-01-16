import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList, 
  User2, 
  Calendar, 
  Briefcase, 
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const TaskAssigningForm = ({ projects }) => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    taskName: "",
    employeeName: "",
    deadline: "",
    projectName: "",
    projectHead: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [Projectstatus, setProjectStatus] = useState("");
  const navigate = useNavigate();

  // Fetch employees, user position, and tasks
  const fetchEmployeeData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      // Fetch employee's profile data (including position)
      const response = await axios.get(
        "http://localhost:8011/Emp/getEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserPosition(response.data.position); // Set the user position

      // Fetch all employees data
      const employeesResponse = await axios.get(
        "http://localhost:8011/Emp/getAllEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(employeesResponse.data);

      // Fetch all tasks for status update
      const tasksResponse = await axios.get(
        "http://localhost:8011/TaskManager/getTasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasksResponse.data.tasks);
    } catch (err) {
      setError("Failed to load employee or task data.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTaskStatusChange = (e) => {
    setTaskStatus(e.target.value);
  };

  const handleTaskSelection = (e) => {
    setSelectedTask(e.target.value); // Set selected task
  };

  const handleProjectStatusChange = (e) => {
    setProjectStatus(e.target.value); // Set selected project status
  };

  const handleProjectSelection = (e) => {
    setSelectedProject(e.target.value); // Set selected project
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:8011/TaskManager/assign",
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setTaskData({
        taskName: "",
        employeeName: "",
        deadline: "",
        projectName: "",
        projectHead: "",
      }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || "Error assigning task.");
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        "http://localhost:8011/TaskManager/updateStatus",
        { taskId: selectedTask, status: taskStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setTaskStatus(""); // Reset status
    } catch (err) {
      setError(err.response?.data?.message || "Error updating task status.");
    }
  };

  const handleProjectStatusSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:8011/Projects/updateProject/${selectedProject}`,
        { Projectstatus: Projectstatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setProjectStatus(""); // Reset project status
    } catch (err) {
      setError(err.response?.data?.message || "Error updating project status.");
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100/50">
    {message && (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <p className="text-emerald-700 font-medium">{message}</p>
      </div>
    )}
    
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )}

    {userPosition === "Project Manager" ? (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Assignment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900">Task Name</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type="text"
                  name="taskName"
                  value={taskData.taskName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900">Employee Name</label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <select
                  name="employeeName"
                  value={taskData.employeeName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="" disabled>Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee.name}>
                      {employee.name} [{employee.position}]
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900">Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type="date"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900">Project Name</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <select
                  name="projectName"
                  value={taskData.projectName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="" disabled>Select a project</option>
                  {projects?.length > 0 ? (
                    projects.map((project) => (
                      <option key={project._id} value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No projects available</option>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900">Project Head</label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <select
                  name="projectHead"
                  value={taskData.projectHead}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="" disabled>Select a Project Head</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project.projectHead}>
                      {project.projectHead}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Assign Task
          </button>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Project Status</h2>
          <form onSubmit={handleProjectStatusSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-900">Select Project</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                  <select
                    value={selectedProject}
                    onChange={handleProjectSelection}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-900">Project Status</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                  <select
                    name="Projectstatus"
                    value={Projectstatus}
                    onChange={handleProjectStatusChange}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" disabled>Select status</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Update Project Status
            </button>
          </form>
        </div>
      </>
    ) : (
      <form onSubmit={handleStatusSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Update Task Status
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-900">Select Task</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
              <select
                value={selectedTask}
                onChange={handleTaskSelection}
                className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                required
              >
                <option value="" disabled>Select a task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.taskName} - {task.projectName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-900">Task Status</label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
              <select
                name="status"
                value={taskStatus}
                onChange={handleTaskStatusChange}
                className="w-full pl-10 pr-10 py-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                required
              >
                <option value="" disabled>Select status</option>
                <option value="NotStarted">Not Started</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Update Status
        </button>
      </form>
    )}
  </div>
  );
};

export default TaskAssigningForm;
