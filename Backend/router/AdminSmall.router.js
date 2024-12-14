const express = require("express");
const { getProfile, updateProfile } = require("../controllers/AdminSmall.controller");
const { verifyToken } = require("../middleware/jwt");

const AS_router = express.Router();

// Profile routes
AS_router.get("/profile", verifyToken, getProfile);
AS_router.patch("/updateProfile", verifyToken, updateProfile);

module.exports = AS_router;