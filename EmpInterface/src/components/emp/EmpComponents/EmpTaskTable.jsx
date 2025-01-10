import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Userposition, setUserposition] = useState(""); // State to store user role

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // Fetch user role and tasks in a single API request or separate API endpoints
      const response = await axios.get(
        "http://localhost:8011/TaskManager/getTasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { tasks} = response.data; // Assuming API sends back role and tasks
      setTasks(tasks);
      setUserposition(response.data.user.position); // Set user role (employee, project manager, admin)
      setError(null);
    } catch (err) {
      setError("Error fetching tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
        Task Management System
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-blue-600 font-medium animate-pulse">
          Loading tasks...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* Task Table */}
      {!loading && !error && tasks.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-orange-300 text-white text-left">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Project Head</th>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Status</th>
                {/* Conditionally render columns based on user role */}
                {Userposition === "Project Manager" ? (
                  <>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                  </>
                ) : (
                  <th className="px-6 py-4">Deadline</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className={`text-gray-800 text-sm hover:bg-blue-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">{task.taskName || "N/A"}</td>
                  <td className="px-6 py-4 font-semibold">{task.projectName || "N/A"}</td>
                  <td className="px-6 py-4 font-semibold">{task.projectHead || "N/A"}</td>
                  <td className="px-6 py-4 font-semibold">
                    {Userposition === "Project Manager" ? "N/A" : task.employeeName || "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "In Progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {task.status || "N/A"}
                  </td>

                  {/* Conditionally render Start Date, End Date or Deadline */}
                  {Userposition === "Project Manager" ? (
                    <>
                      <td className="px-6 py-4 font-semibold">
                        {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A"}
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 font-semibold">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Tasks Found */}
      {!loading && !error && tasks.length === 0 && (
        <div className="text-center text-gray-600 font-medium mt-6">
          No tasks found.
        </div>
      )}
    </div>
  );
};

export default TaskTable;
