import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Calendar, User2, Briefcase, Building2 } from 'lucide-react';

const AssignedProjectsList = ({ projects, error }) => {
  const [userPosition, setUserPosition] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const userResponse = await axios.get(
        "http://localhost:8011/Emp/getEmployees", 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPosition(userResponse.data.position);
    } catch (err) {
      setError("Error fetching data.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (userPosition !== "Project Manager") {
    return null;
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-red-50 text-red-700 border border-red-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 rounded-2xl shadow-lg h-[60vh] lg:h-[70vh] overflow-hidden border border-indigo-100/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Assigned Projects
          </h1>
          <p className="text-gray-500">Manage and track your project portfolio</p>
        </div>
        <div className="bg-indigo-50 px-6 py-2 rounded-xl border border-indigo-100">
          <span className="text-indigo-600 font-medium">{projects.length} Projects</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-y-auto h-[calc(100%-7rem)] pr-4 -mr-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 bg-white/50 rounded-xl border border-indigo-100">
            <Briefcase className="w-16 h-16 text-indigo-300 mb-4" />
            <p className="text-indigo-900 text-lg font-medium">No projects assigned to you.</p>
            <p className="text-indigo-500">New projects will appear here when assigned.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {project.projectName}
                  </h2>
                  <span className={`px-4 py-1 text-sm font-medium rounded-full ${getStatusStyles(project.Projectstatus)}`}>
                    {project.Projectstatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Client</p>
                      <p className="text-gray-700 font-medium">{project.clientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <User2 className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Project Head</p>
                      <p className="text-gray-700 font-medium">{project.projectHead}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">Start Date</p>
                      <p className="text-gray-700">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group-hover:bg-indigo-50/50 p-3 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-500">End Date</p>
                      <p className="text-gray-700">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedProjectsList;