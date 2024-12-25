import React, { useEffect, useState } from "react";
import axios from "axios";
import EmpLayout from "./EmpLayout";

const EmpProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]); // For storing tasks assigned to employees
  const [taskData, setTaskData] = useState({
    taskName: "",
    employeeName: "",
    deadline: "",
    projectName: "",
    projectHeadId: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8082/Projects/getProjects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(response.data.projects);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching projects");
      }
    };

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8082/TaskManager/getTasks", // Replace with actual endpoint to get tasks
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data.tasks); // Store tasks in state
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tasks");
      }
    };

    fetchProjects();
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:8082/TaskManager/assign",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message); // Show success message
      fetchTasks(); // Re-fetch tasks after assignment
    } catch (err) {
      setMessage("Error assigning task");
    }
  };

  return (
    <EmpLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center h-full w-full p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Assigned Projects Section */}
        <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-1/3 h-[60vh] lg:h-[70vh] overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assigned Projects
          </h1>
          {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
          <div className="w-full max-w-4xl overflow-y-auto p-4">
            {projects.length === 0 ? (
              <p className="text-center text-gray-600">
                No projects assigned to you.
              </p>
            ) : (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li
                    key={project._id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl text-center border-b border-gray-300 font-semibold text-gray-700">
                      {project.projectName}
                    </h2>
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
                      <strong>Project Head:</strong> {project.projectHead}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Task Assignment Form */}
        <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-2/3 lg:h-[70vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Assign Task</h2>
          {message && (
            <p className="text-green-500 font-medium mb-4">{message}</p>
          )}
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
              <input
                type="text"
                name="employeeName"
                value={taskData.employeeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
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
              <input
                type="text"
                name="projectName"
                value={taskData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Project Head ID</label>
              <input
                type="text"
                name="projectHeadId"
                value={taskData.projectHeadId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Assign Task
            </button>
          </form>
        </div>
      </div>

      {/* Assigned Tasks Below */}
      <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:mt-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Assigned Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl text-center font-semibold text-gray-700">
                  {task.taskName}
                </h3>
                <p className="text-gray-600">
                  <strong>Employee:</strong> {task.employeeName}
                </p>
                <p className="text-gray-600">
                  <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Project:</strong> {task.projectName}
                </p>
                <p className="text-gray-600">
                  <strong>Project Head:</strong> {task.projectHeadId}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {task.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </EmpLayout>
  );
};

export default EmpProjectManagement;
