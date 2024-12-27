import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpLayout from "./EmpComponents/EmpLayout";
import axios from "axios";

const Employee = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePerformance, setAttendancePerformance] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token is missing or invalid");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:8082/Attendance/getAttendanceRecords",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      setAttendanceData(data);

      // Extract unique dates
      const dates = Array.from(
        new Set(
          data.map(
            (record) => new Date(record.date).toISOString().split("T")[0]
          )
        )
      );
      setUniqueDates(dates.sort());

      // Calculate attendance percentage and performance
      const employeeRecords = data.filter(
        (record) => record.status !== "Holiday"
      );
      const totalDays = dates.length;

      const attendanceScore = calculateAttendanceScore(employeeRecords);
      const percentage = totalDays
        ? ((attendanceScore / totalDays) * 100).toFixed(2)
        : 0;

      setAttendancePercentage(percentage);
      setAttendancePerformance(calculateAttendancePerformance(percentage));
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  // Calculate attendance score based on attendance rules
  const calculateAttendanceScore = (records) => {
    return records.reduce((count, record) => {
      if (record.status === "Present") {
        return count + 1;
      } else if (record.status === "Half Day") {
        return count + 0.5;
      } else if (record.status === "Leave") {
        return count + 1;
      } else if (record.status === "Absent") {
        return Math.max(count - 1, 0);
      }
      return count; // No change for holidays
    }, 0);
  };

  // Determine performance based on attendance percentage
  const calculateAttendancePerformance = (attendancePercentage) => {
    if (attendancePercentage >= 95) {
      return "Performance: Excellent";
    } else if (attendancePercentage >= 85) {
      return "Performance: Good";
    } else {
      return "Performance: Needs Improvement";
    }
  };

  // Get the status for each date
  const getStatusForDate = (date) => {
    const record = attendanceData.find(
      (r) => new Date(r.date).toISOString().split("T")[0] === date
    );
    return record ? record.status : "Absent"; // Default to "Absent" if no record found
  };

  return (
    <EmpLayout>
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-teal-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Salary</h2>
          <p className="text-xl">$25,000</p>
        </div>
        <div className="bg-orange-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Attendance</h2>
          <p className="text-xl">{attendancePercentage}% Present</p>
          <p className="text-sm mt-1">{attendancePerformance}</p>
        </div>
        <div className="bg-pink-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Leaves</h2>
          <p className="text-xl">
            {
              attendanceData.filter((record) => record.status === "Leave")
                .length
            }{" "}
            Days
          </p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-xl">2 Active</p>
        </div>
      </div>

      <div className="mt-8 w-1/5">
        <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>
        {/* attendance calendar card  */}
        <div className="bg-white bg-opacity-60 p-4 rounded-lg"> 
          <h3 className="text-xl text-center font-medium mb-4 ">
            {new Date(uniqueDates[0]).toLocaleString("default", {
              month: "long",
            })}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {uniqueDates.map((date, index) => {
              const status = getStatusForDate(date);
              const statusClass =
                status === "Present"
                  ? "bg-green-500"
                  : status === "Absent"
                  ? "bg-red-500"
                  : status === "Leave"
                  ? "bg-blue-500"
                  : status === "Half Day"
                  ? "bg-yellow-500"
                  : "bg-gray-500";

              return (
                <div
                  key={index}
                  className={`p-2 rounded-md text-center ${statusClass} text-white`}
                >
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EmpLayout>
  );
};

export default Employee;
