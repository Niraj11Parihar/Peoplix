import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import axios from "axios";
import logo from "../assets/logo/logo.png"; // Logo image path

function SecondRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    postalCode: "",
    profileImage: "",
  });

  useEffect(() => {
    // Retrieve the basic data from local storage
    const storedData = JSON.parse(localStorage.getItem("registrationData"));
    if (!storedData) {
      navigate("/register-first"); // Redirect if first step is not completed
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedData = JSON.parse(localStorage.getItem("registrationData"));
      if (!storedData) {
        toast.error("Registration step one is incomplete. Redirecting...");
        navigate("/register-first");
        return;
      }

      const finalData = { ...storedData, ...formData }; // Merge stored data with form data

      const response = await axios.post(
        "http://localhost:8082/auth/register",
        finalData
      );

      toast.success("Registration completed successfully!");
      localStorage.removeItem("registrationData"); // Clear local storage after successful registration
      navigate("/login"); // Redirect to login or dashboard
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-950">
      {/* Radial Gradient Background */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>

      {/* Main Registration Form Container */}
      <div className="relative max-w-md w-full border-white border rounded px-8 pt-6 pb-8 mx-auto mt-20 z-10">
        <ToastContainer /> {/* Toast Container for Toasts */}

        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Final Step
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Profile Image URL</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-900"
          >
            Complete Registration
          </button>
        </form>

        <div className="my-3 flex items-center">
          <p className="text-blue-400 hidden sm:block">Already registered?</p>
          <Link to={"/"} className="mx-2 text-green-500 font-semibold underline p-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SecondRegistrationPage;
