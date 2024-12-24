const express = require('express');
const { createProject, getProject } = require('../controllers/Project.controller');
const { verifyToken } = require('../middleware/jwt');
const Project_router = express.Router();

// Create a Project
Project_router.post('/CreateProjects', verifyToken, createProject);

// Get Project Data
Project_router.get('/getProjects/:projectId', verifyToken, getProject);

module.exports = Project_router;
