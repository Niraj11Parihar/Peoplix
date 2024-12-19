const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {type: String, require: true},
  phone: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  department: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  joiningDate: { type: Date, required: true }, // Make sure this is a Date type
  role: { type: String, default: 'employee' }, 
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Link employee to admin
});

const EmpModel = mongoose.model('Employeetbl', employeeSchema);

module.exports = EmpModel; 