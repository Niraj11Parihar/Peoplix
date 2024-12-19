const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  postalCode: { type: String },
  bio: { type: String }, 
  profileImage: { type: String }, 
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Foreign Key
  createdAt: { type: Date, default: Date.now },
});

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;