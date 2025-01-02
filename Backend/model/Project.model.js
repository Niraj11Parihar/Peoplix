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
    },
    projectHead: {
      type: String,
      required: true,
      trim: true,
    },
    Projectstatus:{
      type:String,
      required:true,
      enum:["Not Started","In Progress","Completed"],
      default:"Not Started" 
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
const ProjectModel = mongoose.model('Project', projectSchema);
module.exports = ProjectModel;
