import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../features/Layout";
import AttendanceSheet from "../AdminComponents/AttendanceSheet";

const AttendanceTodo = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({}); // Track attendance for each employee

  // Fetch employees using Axios
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8082/Attendance/getAttendance"
      );
      setEmployees(response.data); // Set employee data
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employee data on component load
  }, []);

  // Handle attendance change
  const handleAttendanceChange = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  // Save attendance to backend using Axios
  const saveAttendance = async () => {
    try {
      await axios.post(
        "http://localhost:8082/Attendance/postAttendance",
        attendance
      );
      toast.success("Attendance saved/updated successfully!");
    } catch (err) {
      console.error("Error saving/updating attendance:", err);
      toast.error("Failed to save/update attendance.");
    }
  };

  return (
    <Layout>
<>

<div className="table-wrapper overflow-x-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
        <table className="attendance-table w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-indigo-600 text-white px-4 py-2 border border-gray-300">
                Employee Name
              </th>
              <th className="bg-indigo-600 text-white px-4 py-2 border border-gray-300">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-b border-gray-300">
                <td className="bg-gray-50 text-gray-800 px-4 py-2 border-r border-gray-300">
                  {employee.name}
                </td>
                <td className="bg-gray-50 px-4 py-2 flex justify-center gap-2 border-l border-gray-300">
                  <button
                    onClick={() =>
                      handleAttendanceChange(employee._id, "Present")
                    }
                    className={`${
                      attendance[employee._id] === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-800"
                    } button px-4 py-2 rounded-md`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() =>
                      handleAttendanceChange(employee._id, "Absent")
                    }
                    className={`${
                      attendance[employee._id] === "Absent"
                        ? "bg-red-500 text-white"
                        : "bg-red-100 text-red-800"
                    } button px-4 py-2 rounded-md`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() =>
                      handleAttendanceChange(employee._id, "Half Day")
                    }
                    className={`${
                      attendance[employee._id] === "Half Day"
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-100 text-yellow-800"
                    } button px-4 py-2 rounded-md`}
                  >
                    Half Day
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-6">
          <button
            className="save-button bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            onClick={saveAttendance}
          >
            Save Attendance
          </button>
        </div>
      </div>

      <div className="my-20">
          <AttendanceSheet />
        </div> 

</>    

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </Layout>
  );
};

export default AttendanceTodo;
