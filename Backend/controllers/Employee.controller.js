const EmpModel = require('../model/Emp.model');
const EmpAttendenceModel = require('../model/EmpAttendence.model');

// Add a new employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, country, position, department, joiningDate, salary } = req.body;
    const { id: adminId } = req.user;  // Use the ID from the decoded token

    if (!adminId) {
      return res.status(400).json({ error: 'Admin ID is required.' });
    }

    if (!position || !salary) {
      return res.status(400).json({ error: 'Position and salary are required.' });
    }

    // Existing check for duplicate email
    const existingEmployee = await EmpModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists.' });
    }

    // Create the new employee document
    const newEmployee = new EmpModel({
      name,
      email,
      password,
      phone,
      address,
      city,
      country,
      position,
      department,
      joiningDate: new Date(joiningDate),
      salary,
      adminId,  // The admin who created this employee (extracted from token)
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully!', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee.' });
  }
};

// Fetch the employees data
const getEmployees = async (req, res) => {
  try {
    const { id: adminId } = req.user;   // Use the adminId from the token

    // Fetch employees that belong to the logged-in admin
    const employees = await EmpModel.find({ adminId }); 
    if (!employees.length) {
      return res.status(404).json({ error: "No employees found for this admin." });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: "Failed to fetch employees." });
  }
};

// Update an employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const { id: adminId } = req.user;  // Ensure the admin ID is passed from the token

    // Find and update employee only if the adminId matches
    const updatedEmployee = await EmpModel.findOneAndUpdate(
      { _id: id, adminId },  // Ensure the employee belongs to the logged-in admin
      updatedData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    res.status(200).json({ message: 'Employee updated successfully!', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee.' });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: adminId } = req.user;  // Use the adminId from the token

    // Delete employee only if the adminId matches
    const deletedEmployee = await EmpModel.findOneAndDelete({ _id: id, adminId });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    res.status(200).json({ message: 'Employee deleted successfully!' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
};

// Save attendance for employees
const saveAttendance = async (req, res) => {
  try {
    const attendanceRecords = Object.keys(req.body).map((employeeId) => ({
      employeeId,
      status: req.body[employeeId],
    }));

    // Insert attendance records into the database
    await EmpAttendenceModel.insertMany(attendanceRecords);

    res.status(201).send({ message: "Attendance saved successfully!" });
  } catch (err) {
    res.status(500).send({ error: "Error saving attendance" });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  saveAttendance
};
