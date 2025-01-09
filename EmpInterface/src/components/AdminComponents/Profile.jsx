import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../features/Layout";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
    profileImage: "",
  });
  const [success, setSuccess] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8011/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (e) => {
    setNewProfileImage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const updatedData = {
        ...userData,
        profileImage: newProfileImage ? newProfileImage : userData.profileImage,
      };

      await axios.patch(
        "http://localhost:8011/admin/updateProfile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <Layout>
      {/* Profile Form */}
      <div className="container mx-auto border-blue-50 p-6 mt-6 flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-full flex justify-start mb-6">
          <img
            src={userData.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-52 h-52 rounded-full border-4 border-blue-500 shadow-lg cursor-pointer"
            onClick={handleImageClick}
          />
        </div>

        {/* Cards Layout */}
        <div className="block justify-between sm:flex gap-6 w-full">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Info
            </h3>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">Phone</label>
              <input
                type="text"
                name="phone"
                value={userData.phone || ""}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Address Info
            </h3>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">Country</label>
              <input
                type="text"
                name="country"
                value={userData.country || ""}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">City</label>
              <input
                type="text"
                name="city"
                value={userData.city || ""}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-800">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={userData.postalCode || ""}
                onChange={handleInputChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Update Profile
          </button>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg">
            <img
              src={userData.profileImage || "https://via.placeholder.com/150"}
              alt="Expanded Profile"
              className="w-80 h-80 rounded-lg shadow-lg mb-4"
            />
            <input
              type="text"
              value={newProfileImage}
              onChange={handleImageUrlChange}
              placeholder="Enter new image URL"
              className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Image
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
            <span className="block text-green-400 py-2">{success}</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
