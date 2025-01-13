const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  position: {
    type: String,
    required: true,
    enum: [
      "Software Engineer",
      "Project Manager",
      "Data Analyst",
      "UI/UX Designer",
      "Marketing Specialist",
      "Security Specialist",
      "Flutter Developer",
      "Web Developer",
    ],
  },
  salary: { type: Number, required: true },
  department: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "Design/UI/UX",
      "Marketing",
      "Data Analytics",
      "Security",
    ], 
  },
  image: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  role: { type: String, default: "employee" },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
});

const EmpModel = mongoose.model("Employeetbl", employeeSchema);

module.exports = EmpModel;
