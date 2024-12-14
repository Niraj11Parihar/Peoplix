    const express = require('express');
    const emp_router = express.Router();
    const { addEmployee, getEmployees, updateEmployee, deleteEmployee } = require('../controllers/Employee.controller');
    const { verifyToken } = require('../middleware/jwt');

    // Add a new employee
    emp_router.post('/addEmployees', verifyToken, addEmployee);

    // Fetch all employees
    emp_router.get('/getEmployees', verifyToken, getEmployees);

    // Update an employee by ID
    emp_router.patch('/employees/:id', verifyToken, updateEmployee);

    // Delete an employee by ID
    emp_router.delete('/employees/:id', verifyToken, deleteEmployee);

    module.exports = emp_router;
