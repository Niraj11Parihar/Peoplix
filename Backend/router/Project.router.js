const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { createProject, getProjects } = require('../controllers/Project.controller');
const Project_router = express.Router();

// Create a Project
Project_router.post('/CreateProjects', verifyToken, createProject);

// Get Project Data
Project_router.get('/getProjects', verifyToken, getProjects);

module.exports = Project_router;
