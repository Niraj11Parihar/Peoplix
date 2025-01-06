import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectTaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks with project data from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8082/TaskManager/getTasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tasks.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-8">
  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
    <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Project & Task Overview</h2>
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="px-4 py-2 text-left">Project Name</th>
          <th className="px-4 py-2 text-left">Project Head</th>
          <th className="px-4 py-2 text-left">Employee Name</th>
          <th className="px-4 py-2 text-left">Client Name</th>
          <th className="px-4 py-2 text-left">Start Date</th>
          <th className="px-4 py-2 text-left">End Date</th>
          <th className="px-4 py-2 text-left">Project Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100 transition-all duration-200`}
          >
            <td className="px-4 py-2">{task.projectName}</td>
            <td className="px-4 py-2">{task.projectHead}</td>
            <td className="px-4 py-2">{task.employeeName}</td>
            <td className="px-4 py-2">{task.clientName}</td>
            <td className="px-4 py-2">{new Date(task.startDate).toLocaleDateString()}</td>
            <td className="px-4 py-2">{new Date(task.endDate).toLocaleDateString()}</td>
            <td className="px-4 py-2">
              <span
                className={`${
                  task.status === "Completed"
                    ? "text-green-500"
                    : task.status === "InProgress"
                    ? "text-yellow-500"
                    : "text-red-500"
                } font-semibold`}
              >
                {task.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default ProjectTaskTable;
