// controllers/memberController.js
const User = require("../Models/user.js");

// Add a new member
const addMember = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the request object
    const member = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.members.push(member);
    await user.save();

    res.json(user.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all members
const getMembers = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the request object

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a member
const updateMember = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the request object
    const memberId = req.params.memberId;
    const updatedMember = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const memberIndex = user.members.findIndex(member => member._id.toString() === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    user.members[memberIndex] = { ...user.members[memberIndex], ...updatedMember };
    await user.save();

    res.json(user.members[memberIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a member
const deleteMember = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the request object
    const memberId = req.params.memberId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.members = user.members.filter(member => member._id.toString() !== memberId);
    await user.save();

    res.json(user.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
};
