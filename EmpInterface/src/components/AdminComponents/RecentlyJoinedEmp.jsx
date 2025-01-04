import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RecentlyJoinedEmployees = () => {
  const [employees, setEmployees] = useState([]);

  const fetchRecentlyJoinedEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8082/Emp/getEmployees", // Adjust the endpoint if necessary
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      // Assuming response contains an array of employees with "joiningDate"
      const sortedEmployees = response.data
        .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)) // Sort by joiningDate descending
        .slice(0, 7); // Fetch the most recent 5 employees
      setEmployees(sortedEmployees);
    } catch (error) {
      toast.error("Failed to load recently joined employees.");
    }
  }, []);

  useEffect(() => {
    fetchRecentlyJoinedEmployees();
  }, [fetchRecentlyJoinedEmployees]);

  return (
    <div className="p-6 h-auto md:full lg:w-full   bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 shadow-xl rounded-lg">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      Recently Joined Employees
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <tr>
            <th className="py-3 px-4 text-center font-semibold">Name</th>
            <th className="py-3 px-4 text-center font-semibold">Email</th>
            <th className="py-3 px-4 text-center font-semibold">Phone</th>
            <th className="py-3 px-4 text-center font-semibold">City</th>
            <th className="py-3 px-4 text-center font-semibold">Salary</th>
            <th className="py-3 px-4 text-center font-semibold">Joining Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-purple-100" : "bg-purple-200"
                } text-gray-800 hover:bg-purple-300`}
              >
                <td className="xl:text-lg py-2 px-4 text-center">{employee.name}</td>
                <td className="xl:text-lg py-2 px-4 text-center">{employee.email}</td>
                <td className="xl:text-lg py-2 px-4 text-center">{employee.phone}</td>
                <td className="xl:text-lg py-2 px-4 text-center">{employee.city}</td>
                <td className="xl:text-lg py-2 px-4 text-center">{employee.salary}</td>
                <td className="xl:text-lg py-2 px-4 text-center">
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="py-4 px-4 text-center text-gray-600 italic"
              >
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default RecentlyJoinedEmployees;
