import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import logo from "../assets/logo/logo.png"; // Logo image path

function FirstRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save basic data in localStorage
    localStorage.setItem("registrationData", JSON.stringify(formData));

    // Navigate to the second registration page
    navigate("/registration-2");
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
          Admin Registration 
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-900"
          >
            Next
          </button>
        </form>

        <div className="my-3 flex items-center">
          <p className="text-blue-400 hidden sm:block">Admin Already registered?</p>
          <p className="text-blue-400 block sm:hidden">Registered?</p>
          <Link to={"/"} className="mx-2 text-green-500 font-semibold underline p-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FirstRegistrationPage;
