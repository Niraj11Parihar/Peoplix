import React, { useEffect, useState } from "react";
import { FaArrowRight, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logo/logo.png";

const EmpHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // if (!token) {
        //   localStorage.removeItem("authToken");
        //   navigate("/login");
        //   return;
        // }
        const response = await axios.get("http://localhost:8082/Emp/getEmployees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data) {
          setUserName(response.data.name);
        }
  
      } catch (err) {
        console.error("Error fetching profile data:", err);
        if (err.response && err.response.status === 404) {
          console.error("Employee not found.");
        }
        // localStorage.removeItem("authToken");
        // navigate("/login");
      }
    };
  
    fetchProfile();
  }, [navigate]);
  

  return (
    <div className="flex items-center justify-between bg-white h-28 shadow-md px-4 py-3 w-full">
      {/* Logo and Sidebar Toggle */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-32" />
        <button className="text-dark p-4" onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <FaArrowRight className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center space-x-4">
        <Link to={"/Employee"} className="text-xl font-bold text-gray-700">
          Employee Dashboard
        </Link>
      </div>

      {/* Profile */}
      <div className="flex items-center space-x-2 cursor-pointer">
        {userName && (
          <>
            <Link to={"/EmpProfile"}><span className="text-gray-700 font-semibold hidden lg:block">{userName}</span></Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmpHeader;
