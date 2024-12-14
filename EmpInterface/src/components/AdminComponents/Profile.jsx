import React, { useState, useEffect } from "react";
import Sidebar from "../AdminComponents/SideBar";
import Header from "../AdminComponents/header";
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
    profileImage: "", // Add profile image
  });
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

        // If token is found, make the request to get profile data
        const response = await axios.get(
          "http://localhost:8081/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        // Handle errors, like logging out the user if needed
        localStorage.removeItem("authToken");
        navigate("/login"); // Redirect to login if any error occurs
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        "http://localhost:8081/admin/updateProfile",
        { ...userData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    navigate("/login"); // Redirect to login page
  };

  return (

        <Layout>

             {/* Profile Form */}
        <div className="container mx-auto p-6 border-2 border-gray-500 mt-2">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2  border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={userData.country || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={userData.city || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={userData.postalCode || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  value={userData.profileImage || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update Profile
              </button>
            </div>
          </form>

          {/* Logout Button */}
          <div className="mt-6 float-right sm:float-none">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        </Layout>

     
  );
};

export default Profile;
