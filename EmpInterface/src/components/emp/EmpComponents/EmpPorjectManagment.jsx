import React, { useState, useEffect } from "react";
import axios from "axios";
import EmpLayout from "./EmpLayout";
import TaskAssigningForm from "./TaskAssigningForm";
import AssignedTaskList from "./EmpDataOfAssignedTasks";
import AssignedProjectsList from "./AssignedProjectsList";

const EmpProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8011/Projects/getProjects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data.projects);
      } catch (err) {
        setError("Error fetching project data.");
      }
    };

    fetchProjects();
  }, []);

  return (
    <EmpLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center h-full w-full p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Assigned Projects Section */}
        <AssignedProjectsList projects={projects} error={error} />
        
        {/* Task Assignment Form */}
        <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:w-2/3">
          <TaskAssigningForm projects={projects} />
        </div>
      </div>

      {/* Assigned Tasks Section */}
      <div className="bg-gray-500 bg-opacity-15 p-5 shadow-md rounded-lg w-full lg:mt-0">
        <AssignedTaskList />
      </div>
    </EmpLayout>
  );
};

export default EmpProjectManagement;
