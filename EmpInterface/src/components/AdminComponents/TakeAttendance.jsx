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
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error("Error saving attendance:", err);
    }
  };

  return (
    <Layout>
      <div class="layout">
        <h1 class="attendance-title">Employee Attendance</h1>

        {/* Attendance marking section */}
        <div class="table-wrapper">
          <table class="attendance-table">
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
                      class={
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
                      class={
                        attendance[employee._id] === "Absent"
                          ? "button absent"
                          : "button"
                      }
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button class="save-button" onClick={saveAttendance}>
            Save Attendance
          </button>
        </div>
      </div>

      <div class="attendance-sheet">
        <AttendanceSheet />
      </div>
    </Layout>
  );
};

export default AttendanceTodo;
