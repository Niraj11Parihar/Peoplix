import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TaskFrequencyChart = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task data from API using Axios
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8082/TaskManager/getTasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTaskData(response.data.tasks);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch task data.");
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  // Count tasks for each status
  const taskCounts = {
    notStarted: taskData.filter((task) => task.status === "Not Started").length,
    inProgress: taskData.filter((task) => task.status === "InProgress").length,
    completed: taskData.filter((task) => task.status === "Completed").length,
  };

  const statusData = {
    labels: ["Not Started", "In Progress", "Completed"], // Status labels
    datasets: [
      {
        label: "Not Started",
        data: [taskCounts.notStarted, 0, 0], // Only showing count for Not Started
        fill: false,
        borderColor: "#FF6347", // Red for 'Not Started'
        tension: 0.1,
      },
      {
        label: "In Progress",
        data: [0, taskCounts.inProgress, 0], // Only showing count for InProgress
        fill: false,
        borderColor: "#FFA07A", // Light Coral for 'In Progress'
        tension: 0.1,
      },
      {
        label: "Completed",
        data: [0, 0, taskCounts.completed], // Only showing count for Completed
        fill: false,
        borderColor: "#32CD32", // Green for 'Completed'
        tension: 0.1,
      },
    ],
  };

  // Options to configure the chart
  const options = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        ticks: {
          color: "#000000", // Color for the Y-axis
        },
        grid: {
          color: "#E0E0E0", // Light grey grid color
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "bottom",
      },
    },
    elements: {
      line: {
        borderWidth: 3, // Adjust line thickness if needed
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    backgroundColor: "#F7F7F7",
    borderColor: "#DDDDDD",
    borderWidth: 1,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-8">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Task Status Overview
        </h2>
        <div className="w-full">
          <Line data={statusData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TaskFrequencyChart;
