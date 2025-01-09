import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpLayout from "./EmpComponents/EmpLayout";
import axios from "axios";
import TaskTable from "./EmpComponents/EmpTaskTable";

const Employee = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
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
        "http://localhost:8011/Attendance/getAttendanceRecords",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      // Group attendance data by month
      const groupedData = data.reduce((acc, record) => {
        const date = new Date(record.date);
        const month = date.getMonth();
        if (!acc[month]) acc[month] = [];
        acc[month].push(record);
        return acc;
      }, {});

      setAttendanceData(groupedData);

      // Calculate attendance for the current month
      const currentMonthData = groupedData[currentMonth] || [];
      calculateAttendanceStats(currentMonthData);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  const calculateAttendanceStats = (records) => {
    const totalDays = new Set(
      records.map((record) => new Date(record.date).toISOString().split("T")[0])
    ).size;

    const attendanceScore = records.reduce((count, record) => {
      if (record.status === "Present") return count + 1;
      else if (record.status === "Half Day") return count + 0.5;
      else if (record.status === "Leave") return count + 1;
      else if (record.status === "Absent") return Math.max(count - 1, 0);
      return count;
    }, 0);

    const percentage = totalDays
      ? ((attendanceScore / totalDays) * 100).toFixed(2)
      : 0;

    setAttendancePercentage(percentage);
    setAttendancePerformance(calculateAttendancePerformance(percentage));
  };

  const calculateAttendancePerformance = (attendancePercentage) => {
    if (attendancePercentage >= 95) return "Performance: Excellent";
    else if (attendancePercentage >= 85) return "Performance: Good";
    else return "Performance: Needs Improvement";
  };

  const changeMonth = (direction) => {
    const newMonth = (currentMonth + direction + 12) % 12;
    setCurrentMonth(newMonth);
    calculateAttendanceStats(attendanceData[newMonth] || []);
  };

  const getStatusForDate = (date) => {
    const currentMonthData = attendanceData[currentMonth] || [];
    const record = currentMonthData.find(
      (r) => new Date(r.date).toISOString().split("T")[0] === date
    );
    return record ? record.status : "Absent";
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
              (attendanceData[currentMonth] || []).filter(
                (record) => record.status === "Leave"
              ).length
            }{" "}
            Days
          </p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-xl">2 Active</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* Attendance calendar for employees */}
        <div className="w-full lg:w-1/3 bg-white bg-opacity-50 p-4 rounded-lg shadow-lg h-[30vh]">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Attendance Calendar
          </h2>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Previous
            </button>
            <h3 className="text-xl font-bold">
              {new Date(2022, currentMonth).toLocaleString("default", {
                month: "long",
              })}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Next
            </button>
          </div>
          <div className="p-4 rounded-lg">
            <div className="grid grid-cols-7 gap-2">
              {(attendanceData[currentMonth] || []).map((record, index) => {
                const date = new Date(record.date).getDate();
                const status = record.status;
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
                    {date}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="w-full lg:w-2/3">
          <TaskTable />
        </div>
      </div>
    </EmpLayout>
  );
};

export default Employee;
