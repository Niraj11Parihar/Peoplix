  const adminModel = require("../model/Admin.model")

  // Function to fetch the profile data
const getProfile = async (req, res) => {
  try {
    const adminId = req.user.id; 
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Return profile data with additional fields
    res.json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      phone: admin.phone, // Add phone
      country: admin.country, // Add country
      city: admin.city, // Add city
      postalCode: admin.postalCode, // Add postalCode
      profileImage: admin.profileImage, // Add profileImage (if applicable)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};


  // Function to update admin profile
const updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id; 
    const updatedData = req.body;

 
    if (!updatedData.name || !updatedData.email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    // Find and update admin details
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId,
      { $set: updatedData }, 
      { new: true } 
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      phone: updatedAdmin.phone,
      country: updatedAdmin.country,
      state: updatedAdmin.state,
      city: updatedAdmin.city,
      postalCode: updatedAdmin.postalCode,
      bio: updatedAdmin.bio,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

 
module.exports = { getProfile, updateProfile };
