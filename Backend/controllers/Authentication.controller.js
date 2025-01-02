const adminModel = require('../model/Admin.model');
const EmpModel = require('../model/Emp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// registration for only admin
const registerAdmin = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    country,
    state,
    city,
    postalCode,
    profileImage,
  } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      name,
      email,
      password: hashedPassword,
      phone,
      country,
      state,
      city,
      postalCode,
      profileImage,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};



// login for both employee and admin
const login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(req.body);
  try {
    let user;
    if (role === "admin") user = await adminModel.findOne({ email });
    else if (role === "employee") user = await EmpModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    } 

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};



module.exports = { registerAdmin, login };
