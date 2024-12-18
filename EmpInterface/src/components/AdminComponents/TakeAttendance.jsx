import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../features/Layout";
import AttendanceSheet from "../AdminComponents/AttendanceSheet";
import "../../assets/css/TakeAttendance.css";

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
      alert("Attendance saved/updated successfully!");
    } catch (err) {
      console.error("Error saving/updating attendance:", err);
    }
  };

  return (
    <Layout>
      <div className="layout">
        <h1 className="attendance-title">Employee Attendance</h1>

        {/* Attendance marking section */}
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleAttendanceChange(employee._id, "Present")
                      }
                      className={
                        attendance[employee._id] === "Present"
                          ? "button present"
                          : "button"
                      }
                    >
                      Present
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(employee._id, "Absent")
                      }
                      className={
                        attendance[employee._id] === "Absent"
                          ? "button absent"
                          : "button"
                      }
                    >
                      Absent
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(employee._id, "Half Day")
                      }
                      className={
                        attendance[employee._id] === "Half Day"
                          ? "button half-day"
                          : "button"
                      }
                    >
                      Half Day
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="save-button" onClick={saveAttendance}>
            Save Attendance
          </button>
        </div>
      </div>

      <div className="attendance-sheet">
        <AttendanceSheet />
      </div>
    </Layout>
  );
};

export default AttendanceTodo;
