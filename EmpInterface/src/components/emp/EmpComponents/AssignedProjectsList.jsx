import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AssignedProjectsList = ({ projects, error }) => {
  const [userPosition, setUserPosition] = useState("");

  // Fetch user position and projects
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      // Fetch user position (e.g., projectManager, employee, etc.)
      const userResponse = await axios.get(
        "http://localhost:8082/Emp/getEmployees", 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPosition(userResponse.data.position); // Assume position is available in user data
      // // Fetch projects
      // const response = await axios.get(
      //   "http://localhost:8082/Projects/getProjects",
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // setProjects(response.data.projects);
    } catch (err) {
      setError("Error fetching data.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Conditionally render the project list based on the user position
  if (userPosition !== "Project Manager") {
    return null; // Hide the component if not a project manager
  }

  return (
    <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-1/3 h-[60vh] lg:h-[70vh] overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Projects</h1>
      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
      <div className="w-full max-w-4xl overflow-y-auto p-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects assigned to you.</p>
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
  );
};

export default AssignedProjectsList;
