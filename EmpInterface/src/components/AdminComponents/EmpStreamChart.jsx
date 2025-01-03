import React, { useEffect, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { toast } from "react-toastify"; // Optional, if you want to show error messages

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeStreamPieChart = () => {
  const [employees, setEmployees] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverOffset: 4,
      },
    ],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8082/Emp/getEmployees", {
        headers: { Authorization: "Bearer " + token },
      });

      setEmployees(response.data);
      generateChartData(response.data);
    } catch (error) {
      toast.error("Failed to load employees.");
    }
  }, []);

  const generateChartData = (employees) => {
    const positionCounts = employees.reduce((acc, employee) => {
      const position = employee.position || "Unknown"; // default to "Unknown" if no position
      if (!acc[position]) {
        acc[position] = 0;
      }
      acc[position]++;
      return acc;
    }, {});

    const positions = Object.keys(positionCounts);
    const counts = Object.values(positionCounts);

    // Create gradients for each position
    const gradients = positions.map((_, index) => createGradient(index));

    setChartData({
      labels: positions,
      datasets: [
        {
          data: counts,
          backgroundColor: gradients,
          hoverOffset: 4,
        },
      ],
    });
  };

  const createGradient = (index) => {
    // Create a gradient color based on the index of the position
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    
    // Set gradient color stops
    gradient.addColorStop(0, getColorStop(index, 0));
    gradient.addColorStop(1, getColorStop(index, 1)); 

    return gradient;
  };

  const getColorStop = (index, stop) => {
    // Define a set of color combinations for gradients
    const colors = [
      ["#FF7F50", "#FF6347"],
      ["#4CAF50", "#2E8B57"], 
      ["#FFD700", "#FF6347"], 
      ["#00BFFF", "#1E90FF"], 
      ["#FF69B4", "#FF1493"], 
      ["#9932CC", "#8A2BE2"], 
      ["#FF4500", "#DC143C"], 
      ["#00CED1", "#20B2AA"], 
    ];
    
    return colors[index % colors.length][stop];
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 h-1/3 mt-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-400 to-indigo-500">
          <h3 className="text-center font-bold text-xl text-white">Employee Position Stream</h3>
        </div>
        <div className=" py-3 px-4 flex justify-center">
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.raw} Employees`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeStreamPieChart;
