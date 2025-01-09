import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmpLayout from "./EmpLayout";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Check if token exists
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch the employee profile from the backend
        const response = await axios.get(
          "http://localhost:8011/Emp/getEmployees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployee(response.data); // Set employee data in state
      } catch (err) {
        setError("Error fetching profile data.");
        console.error("Error fetching profile data:", err);
        if (err.response && err.response.status === 404) {
          console.error("Employee not found.");
        }
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!employee) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <EmpLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Employee Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 - Personal Info */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl shadow-xl text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <strong className="text-gray-100">Name:</strong>
                <span>{employee.name}</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-100">Email:</strong>
                <span>{employee.email}</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-100">Phone:</strong>
                <span>{employee.phone}</span>
              </div>
              {/* <div className="flex justify-between">
              <strong className="text-gray-100">Address:</strong>
              <span>{employee.address}</span>
            </div> */}
            </div>
          </div>

          {/* Card 2 - Job Info */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-xl text-white">
            <h3 className="text-2xl font-semibold mb-4">Job Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <strong className="text-gray-100">Position:</strong>
                <span>{employee.position}</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-100">Department:</strong>
                <span>{employee.department}</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-100">Salary:</strong>
                <span>{employee.salary}</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-100">Joining Date:</strong>
                <span>
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {/* Logout Button */}
          <div className="absolute bottom-6 right-6">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Optional: Add other sections or styling as needed */}
      </div>
    </EmpLayout>
  );
};

export default EmployeeProfile;
