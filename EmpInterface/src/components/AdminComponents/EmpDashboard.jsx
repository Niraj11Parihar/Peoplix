  import React, { useState, useEffect, useCallback } from "react";
  import axios from "axios";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import Layout from "../../features/Layout";

  function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      country: "",
      position: "",
      salary: "",
      department: "",
      joiningDate: "",
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
      fetchEmployees();
    }, []);

    const fetchEmployees = useCallback(async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8011/Emp/getEmployees", {
          headers: { Authorization: "Bearer " + token },
        });

        setEmployees(response.data);
      } catch (error) {
        toast.error("Failed to load employees.");
      }
    }, []);

    const handleRowClick = (employee) => {
      setSelectedEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        password: employee.password,
        phone: employee.phone,
        city: employee.city,
        country: employee.country,
        position: employee.position,
        salary: employee.salary,
        department: employee.department,
        joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : "",
      });
      setShowModal(true);
    };

    const handleAddEmployee = () => {
      setSelectedEmployee(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        country: "",
        position: "",
        salary: "",
        department: "",
        joiningDate: formData.joiningDate,
      });
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        country: "",
        position: "",
        salary: "",
        department: "",
        joiningDate: formData.joiningDate,
      });
    };

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("authToken");

        if (selectedEmployee) {
          // Update Employee
          await axios.patch(
            `http://localhost:8011/Emp/employees/${selectedEmployee._id}`,
            formData, // Ensure joiningDate is included in the formData
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success("Employee updated successfully!");
        } else {
          // Add New Employee
          await axios.post("http://localhost:8011/Emp/addEmployees", formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("New employee added successfully!");
        }
        fetchEmployees();
        handleCloseModal();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit employee data.");
      }
    };

    const handleDelete = (employeeId) => {
      // Show a toast with confirmation buttons
      const toastId = toast.info(
        <div className="flex flex-col items-center space-y-4 text-center">
          <span className="text-lg font-medium mb-4">Are you sure you want to delete this employee?</span>
          <div className="flex space-x-4">
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("authToken");
                  await axios.delete(
                    `http://localhost:8011/Emp/employees/${employeeId}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  toast.success("Employee deleted successfully!");
                  fetchEmployees();
                } catch (error) {
                  console.error("Error deleting employee:", error);
                  toast.error("Failed to delete employee.");
                }
                toast.dismiss(toastId);  // Dismiss the toast after the action
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId);  // Dismiss the toast on "No" click
                toast.info("Employee deletion canceled");
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition duration-200"
            >
              No
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeButton: false,
          draggable: false, 
          className: "bg-white text-black shadow-lg p-5 rounded-xl",
          bodyClassName: "p-0", 
        }
      );
    };
    
    
  // For searching...
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Layout>
        <div className="flex-grow p-6 bg-gray-50">
          <ToastContainer />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-700">Employee List</h1>
            <button
              onClick={handleAddEmployee}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Employee
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 py-2 border rounded-lg text-gray-700"
            />
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Position</th>
                  <th className="border border-gray-300 px-4 py-2">Department</th>
                  <th className="border border-gray-300 px-4 py-2">Salary</th>
                  <th className="border border-gray-300 px-4 py-2">City</th>
                  <th className="border border-gray-300 px-4 py-2">Country</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      onClick={() => handleRowClick(employee)}
                      className="hover:bg-gray-200 cursor-pointer"
                    >
                      <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.position}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.salary}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.city}</td>
                      <td className="border border-gray-300 px-4 py-2">{employee.country}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee._id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto py-5">
              <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3 max-h-screen overflow-auto">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedEmployee ? "Update Employee" : "Add New Employee"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Salary</label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Joining Date</label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {selectedEmployee ? "Update" : "Add"} Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  export default EmployeeTable;
