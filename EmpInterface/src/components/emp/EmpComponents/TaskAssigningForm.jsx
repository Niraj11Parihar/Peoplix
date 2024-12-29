import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const TaskAssigningForm = ({ projects }) => {
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    taskName: "",
    employeeName: "",
    deadline: "",
    projectName: "",
    projectHead: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8082/Emp/getAllEmployees",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to load employees.");
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message); // Show success message
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Assign Task</h2>
      {message && <p className="text-green-500 font-medium mb-4">{message}</p>}
      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
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
                {employee.name}
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
            {projects.map((project) => (
              <option key={project._id} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
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
    </div>
  );
};

export default TaskAssigningForm;
