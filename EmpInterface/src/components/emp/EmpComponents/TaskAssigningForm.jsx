import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        "http://localhost:8082/Emp/getEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserPosition(response.data.position); // Set the user position

      // Fetch all employees data
      const employeesResponse = await axios.get(
        "http://localhost:8082/Emp/getAllEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(employeesResponse.data);

      // Fetch all tasks for status update
      const tasksResponse = await axios.get(
        "http://localhost:8082/TaskManager/getTasks",
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
        "http://localhost:8082/TaskManager/assign",
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
        "http://localhost:8082/TaskManager/updateStatus",
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
        `http://localhost:8082/Projects/updateProject/${selectedProject}`,
        { Projectstatus : Projectstatus },
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
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Task Assignment</h2>
      {message && <p className="text-green-500 font-medium mb-4">{message}</p>}
      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

      {userPosition === "Project Manager" ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Task Name</label>
              <input
                type="text"
                name="taskName"
                value={taskData.taskName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Employee Name</label>
              <select
                name="employeeName"
                value={taskData.employeeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>
                  Select an employee
                </option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.name}>
                    {employee.name} [{employee.position}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Project Name</label>
              <select
                name="projectName"
                value={taskData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>
                  Select a project
                </option>
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
            </div>
            <div>
              <label className="block text-gray-700">Project Head</label>
              <select
                name="projectHead"
                value={taskData.projectHead}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>
                  Select a Project Head
                </option>
                {projects.map((project) => (
                  <option key={project._id} value={project.projectHead}>
                    {project.projectHead}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Assign Task
            </button>
          </form>

          <form onSubmit={handleProjectStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Select Project</label>
              <select
                value={selectedProject}
                onChange={handleProjectSelection}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>
                  Select a project
                </option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Project Status</label>
              <select
                name="Projectstatus"
                value={Projectstatus}
                onChange={handleProjectStatusChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="Not Started" className="text-red-600">Not Started</option>
                <option value="In Progress" className="text-blue-600">In Progress</option>
                <option value="Completed" className="text-green-600">Completed</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Update Project Status
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleStatusSubmit} className="space-y-4 ">
          <div>
            <label className="block text-gray-700">Select Task</label>
            <select
              value={selectedTask}
              onChange={handleTaskSelection}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select a task
              </option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.taskName} - {task.projectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Task Status</label>
            <select
              name="status"
              value={taskStatus}
              onChange={handleTaskStatusChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="NotStarted" className="text-red-600">Not Started</option>
              <option value="InProgress" className="text-blue-600">In Progress</option>
              <option value="Completed" className="text-green-600">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Update Status
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskAssigningForm;
