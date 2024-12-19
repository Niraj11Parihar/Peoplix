import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeTasks = ({ employeeId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/Task/${employeeId}`);
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [employeeId]);

  const updateStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:8082/Task/update/${taskId}`, { status });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  return (
    <div>
      <h1>My Tasks</h1>
      <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.taskTitle}</td>
              <td>{task.taskDescription}</td>
              <td>{new Date(task.deadline).toLocaleDateString()}</td>
              <td>{task.status}</td>
              <td>
                {task.status === "Pending" && (
                  <button onClick={() => updateStatus(task._id, "Completed")}>
                    Mark as Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTasks;
