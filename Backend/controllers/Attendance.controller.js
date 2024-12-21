// Import necessary modules
const EmpModel = require("../model/Emp.model");
const Attendance = require("../model/EmpAttendence.model");

// Controller to fetch all employees
const getAttendance = async (req, res) => {
  try {
    const employees = await EmpModel.find(); // Fetch all employees from the database
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Controller to save employee attendance
const saveAttendance = async (req, res) => {
  try {
    const attendanceData = req.body; // Attendance data sent from the frontend

    // Save or update attendance for each employee
    const attendancePromises = Object.keys(attendanceData).map(async (employeeId) => {
      const attendanceRecord = await Attendance.findOne({ employeeId, date: new Date().toISOString().split("T")[0] });
      if (attendanceRecord) {
        // Update existing attendance record
        attendanceRecord.status = attendanceData[employeeId];
        return attendanceRecord.save();
      } else {
        // Create a new attendance record
        return Attendance.create({
          employeeId,
          date: new Date().toISOString().split("T")[0],
          status: attendanceData[employeeId],
        });
      }
    });

    await Promise.all(attendancePromises);

    res.status(200).json({ message: "Attendance saved/updated successfully" });
  } catch (err) {
    console.error("Error saving/updating attendance:", err);
    res.status(500).json({ error: "Failed to save/update attendance" });
  }
};

// Controller to fetch attendance records
const getAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.aggregate([
      {
        $lookup: {
          from: "employeetbls", // Collection name for Employee
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails", // Unwind the employeeDetails array
      },
      {
        $project: {
          _id: 1,
          employeeId: 1,
          date: 1,
          status: 1,
          "employeeDetails.name": 1,
          "employeeDetails.email": 1,
        },
      },
    ]);

    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error("Error fetching attendance records:", err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

module.exports = {
  getAttendance,
  saveAttendance,
  getAttendanceRecords,
};
