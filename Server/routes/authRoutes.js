const express = require("express");
const router = express.Router();
const cors = require("cors");
const { test, registerUser, loginUser } = require("../controllers/authControllers.js");
const { addMember, getMembers, updateMember, deleteMember, getUserDetails, getMemberById } = require('../controllers/memberController.js');
const { verifyToken } = require('../util/jwtUtils.js');

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post('/members', verifyToken, addMember);
router.get('/members', verifyToken, getMembers);
router.put('/members/:memberId', verifyToken, updateMember);
router.delete('/members/:memberId', verifyToken, deleteMember);
router.get('/details', verifyToken, getUserDetails);
router.get('/members/:memberId', verifyToken, getMemberById);


module.exports = router;
