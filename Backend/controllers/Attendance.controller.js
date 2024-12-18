const Employee = require("../model/Emp.model");
const Attendance = require("../model/EmpAttendence.model");



const getAttendance = async (req, res) => {
  try {
    const employees = await Employee.find().select("_id name");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: "Error fetching employees" });
  }
};


const saveAttendance = async (req, res) => {
  try {
    const attendanceData = req.body; // { employeeId: status }
    const currentDate = new Date().toISOString().split("T")[0]; 

    for (const [employeeId, status] of Object.entries(attendanceData)) {
      // Upsert logic: Update if exists, otherwise insert
      await Attendance.findOneAndUpdate(
        { employeeId, date: currentDate },
        { $set: { status } }, 
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Attendance saved/updated successfully!" });
  } catch (err) {
    console.error("Error saving/updating attendance:", err);
    res.status(500).json({ error: "Error saving/updating attendance" });
  }
};


// Fetch attendance records
const getAttendanceRecords = async (req, res) => {
    try {
      const attendanceRecords = await Attendance.aggregate([
        {
          $lookup: {
            from: "employees", // Collection name of employees
            localField: "employeeId",
            foreignField: "_id",
            as: "employeeDetails",
          },
        },
        {
          $unwind: "$employeeDetails",
        },
        {
          $project: {
            employeeId: 1,
            "employeeDetails.name": 1,
            date: 1,
            status: 1,
          },
        },
      ]);
  
      res.status(200).json(attendanceRecords);
    } catch (err) {
      res.status(500).json({ error: "Error fetching attendance records" });
    }
  };

module.exports = { getAttendance, saveAttendance, getAttendanceRecords };
