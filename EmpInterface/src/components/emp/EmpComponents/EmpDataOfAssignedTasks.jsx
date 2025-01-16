import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Calendar, 
  User2, 
  Briefcase, 
  CheckCircle2, 
  Trash2,
  ClipboardList,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AssignedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8011/TaskManager/getTasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data.tasks);
      setError(null); 
    } catch (err) {
      setError("Error fetching tasks.");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8011/TaskManager/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Error deleting task.");
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'In Progress': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'default': 'bg-gray-50 text-gray-700 border border-gray-200'
    };
    return statusColors[status] || statusColors.default;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100/50">
      <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-indigo-600" />
            Assigned Tasks
          </h2>
          <p className="text-gray-500">Track and manage your task assignments</p>
        </div>
        <div className="bg-indigo-50 px-6 py-2 rounded-xl border border-indigo-100">
          <span className="text-indigo-600 font-medium">{tasks.length} Tasks</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-xl border border-indigo-100">
          <Briefcase className="w-16 h-16 text-indigo-300 mb-4" />
          <p className="text-indigo-900 text-lg font-medium">No tasks assigned yet.</p>
          <p className="text-indigo-500">New tasks will appear here when assigned.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8">
            {currentTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {task.taskName}
                  </h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status || "Pending"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <User2 className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Assigned To</p>
                      <p className="text-gray-700 font-medium">{task.employeeName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Deadline</p>
                      <p className="text-gray-700">{new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Project</p>
                      <p className="text-gray-700">{task.projectName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Project Head</p>
                      <p className="text-gray-700">{task.projectHead}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="w-full mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Task
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-indigo-900 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignedTaskList;