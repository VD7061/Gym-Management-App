const User = require("../Models/user.js");

// Function to update payment status
const updatePaymentStatus = (members) => {
  const currentDate = new Date();
  members.forEach(member => {
    if (member.paymentStatus && member.paymentStatus.endDate < currentDate) {
      member.paymentStatus.status = 'unpaid';
    }
  });
};

// Add a new member
const addMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = req.body;

    // Validate required fields
    if (!member.name || !member.age || !member.phoneNumber || !member.shift) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Set default payment status and dates
    member.paymentStatus = {
      status: member.paymentStatus?.status || 'unpaid',
      startDate: member.paymentStatus?.status === 'paid' ? member.paymentStatus.startDate : null,
      endDate: member.paymentStatus?.status === 'paid' ? member.paymentStatus.endDate : null,
    };

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
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update payment statuses
    updatePaymentStatus(user.members);
    await user.save();

    res.json(user.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a member
const updateMember = async (req, res) => {
  try {
    const userId = req.user.id;
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

    // Validate required fields
    if (!updatedMember.name || !updatedMember.age || !updatedMember.phoneNumber || !updatedMember.shift) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Merge updated fields
    user.members[memberIndex] = {
      ...user.members[memberIndex],
      ...updatedMember,
    };

    // Update payment status
    updatePaymentStatus([user.members[memberIndex]]);
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
    const userId = req.user.id;
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

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('name email gymName members'); 
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update payment statuses
    updatePaymentStatus(user.members);
    await user.save();

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        gymName: user.gymName,
        members: user.members,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get member by ID
const getMemberById = async (req, res) => {
  try {
    const userId = req.user.id;
    const memberId = req.params.memberId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const member = user.members.id(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Update payment status
    updatePaymentStatus([member]);
    await user.save();

    res.json(member);
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
  getUserDetails,
  getMemberById,
};
