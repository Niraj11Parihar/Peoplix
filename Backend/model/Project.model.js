const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
      adminId: {
        type: mongoose.Schema.Types.ObjectId, // Referencing the admin who created the project
        required: true,
        ref: 'Admin',
      },
      projectName: {
        type: String,
        required: true,
        trim: true,
      },
      clientName: {
        type: String,
        required: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            return value > this.startDate; // Ensure the end date is after the start date
          },
          message: 'End date must be after the start date.',
        },
      },
      projectHead: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the employee managing the project
        ref: 'Employee',
        required: true,
      },
    },
    {
      timestamps: true, // Automatically add createdAt and updatedAt fields
    }
  );
  
  // Export the models
  const ProjectModel = mongoose.model('Project', projectSchema);
  module.exports = ProjectModel;