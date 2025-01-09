import React, { useState, useEffect } from "react";
import { FaArrowRight, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo/logo.png";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
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

        setProfileImage(response.data.profileImage);
        setUserName(response.data.name);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="flex items-center justify-between bg-white h-28 shadow-md px-4 py-3 w-full">
      <div className="flex items-center">
        <span>
          <img src={logo} alt="Logo" className="h-32" />
        </span>
        <button
          className="text-dark p-4"
          onClick={toggleSidebar} // Toggle sidebar visibility
        >
          {isSidebarOpen ? (
            <FaArrowRight className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <Link to={"/"} className="text-xl font-bold text-gray-700">
          Admin Dashboard
        </Link>
      </div>

      <div class="flex items-center space-x-4 bg-gradient-to-r from-site-primary-color to-site-secondary-color rounded-full py-2 px-4">
        <div
          class="flex items-center space-x-2 cursor-pointer hover:bg-opacity-75"
          onClick={() => navigate("/Profile")}
        >
          <span class="text-site-text-color hidden lg:block">{userName}</span>
          <img
            class="w-8 h-8 rounded-full border-2 border-white"
            src={profileImage || "https://via.placeholder.com/150"}
            alt="User"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
