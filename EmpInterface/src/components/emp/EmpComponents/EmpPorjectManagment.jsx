import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import EmpLayout from "./EmpLayout";
import TaskAssigningForm from "./TaskAssigningForm";
import AssignedTaskList from "./EmpDataOfAssignedTasks";

const EmpProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8082/Projects/getProjects",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(response.data.projects);
    } catch (err) {
      setError("Error fetching projects.");
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <EmpLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center h-full w-full p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Assigned Projects Section */}
        <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-1/3 h-[60vh] lg:h-[70vh] overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assigned Projects
          </h1>
          {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
          <div className="w-full max-w-4xl overflow-y-auto p-4">
            {projects.length === 0 ? (
              <p className="text-center text-gray-600">
                No projects assigned to you.
              </p>
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

        {/* Task Assignment Form */}
        <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-2/3 lg:h-[70vh]">
          <TaskAssigningForm projects={projects} />
        </div>
      </div>

      {/* Assigned Tasks Below */}
      <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:mt-0">
        <AssignedTaskList />
      </div>
    </EmpLayout>
  );
};

export default EmpProjectManagement;
