const express = require('express');
const Auth_router = express.Router();
const { registerAdmin, login } = require('../controllers/Authentication.controller');

// Register Admin
Auth_router.post('/register', registerAdmin);

// Login for Admin and Employee
Auth_router.post('/login', login);

module.exports = Auth_router;
