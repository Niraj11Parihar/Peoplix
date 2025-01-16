import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  ClipboardList, 
  AlertCircle, 
  Loader2, 
  Calendar,
  User2,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Userposition, setUserposition] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8011/TaskManager/getTasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { tasks } = response.data;
      setTasks(tasks);
      setUserposition(response.data.user.position);
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

  const getStatusStyle = (status) => {
    const styles = {
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'InProgress': 'bg-amber-100 text-amber-700 border-amber-200',
      'Not Started': 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return `${styles[status] || styles.default} px-3 py-1 rounded-full text-sm font-medium border`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 rounded-2xl shadow-xl">
      {/* Header Section */}
      <div className="mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              <ClipboardList className="w-8 h-8 text-indigo-600" />
              Task Management System
            </h1>
            <p className="text-gray-500">Track and manage all tasks in one place</p>
          </div>
          <div className="bg-indigo-100 px-4 py-2 rounded-full">
            <span className="text-indigo-600 font-medium">{tasks.length} Tasks</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 p-8 bg-white rounded-xl shadow-sm">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="text-indigo-600 font-medium">Loading tasks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Task Table */}
        {!loading && !error && tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-6 py-4 font-semibold">Task Name</th>
                    <th className="px-6 py-4 font-semibold">Project Name</th>
                    <th className="px-6 py-4 font-semibold">Project Head</th>
                    <th className="px-6 py-4 font-semibold">Employee Name</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    {Userposition === "Project Manager" ? (
                      <>
                        <th className="px-6 py-4 font-semibold">Start Date</th>
                        <th className="px-6 py-4 font-semibold">End Date</th>
                      </>
                    ) : (
                      <th className="px-6 py-4 font-semibold">Deadline</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-400" />
                          <span className="font-small text-gray-800">{task.taskName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-700">{task.projectName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-700">{task.projectHead || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-700">{task.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusStyle(task.status)}>
                          {task.status || "Not Started"}
                        </span>
                      </td>
                      {Userposition === "Project Manager" ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-400" />
                              <span className="text-gray-700">
                                {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-400" />
                              <span className="text-gray-700">
                                {task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A"}
                              </span>
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span className="text-gray-700">
                              {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
            <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No tasks found</p>
            <p className="text-gray-400">Tasks will appear here once they are assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;