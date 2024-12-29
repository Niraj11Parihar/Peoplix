import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AssignedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8082/TaskManager/getTasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data.tasks);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Error fetching tasks.");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:mt-0">
      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-600">
          {error ? error : "No tasks assigned yet."}
        </p>
      ) : (
        <>
          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTasks.map((task) => (
              <div
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
                  <strong>Project Head:</strong> {task.projectHead}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {task.status || "Pending"}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignedTaskList;
