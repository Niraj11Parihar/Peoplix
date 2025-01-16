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
      <div className="flex flex-col lg:flex-row justify-between gap-6 p-6">
        {/* Assigned Projects Section */}
        <div className="w-full lg:w-1/2">
          <AssignedProjectsList projects={projects} error={error} />
        </div>

        {/* Task Assignment Form */}
        <div className="w-full">
          <TaskAssigningForm projects={projects} />
        </div>
      </div>

      {/* Assigned Tasks Section */}
      <div className="p-5 lg:mt-0">
        <AssignedTaskList />
      </div>
    </EmpLayout>
  );
};

export default EmpProjectManagement;
