import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { Link, useNavigate } from "react-router-dom"; 
import logo from "../assets/logo/logo.png"; 

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8082/auth/login",
        formData
      );

      const { token, message, user } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
        toast.success(message || "Login successful!");

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/");
        } else if (user.role === "employee") {
          navigate("/Employee");
        }
      } else {
        toast.error("Failed to retrieve token.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950">
      {/* Background with linear and radial gradients */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>


      {/* Login Form */}
      <div className="relative z-10 max-w-md w-full mx-auto bg-transparent border-white border rounded-lg px-8 pt-8 pb-10 mt-16">
        <ToastContainer /> {/* Toast Container for notifications */}

        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-blue-900 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="my-3 flex items-center">
          <p className="text-blue-400 hidden sm:block">
            Not Registered?
          </p>
          <Link
            to={"/registration"}
            className="mx-2 text-green-500 font-semibold underline p-1"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
