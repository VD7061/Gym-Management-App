const User = require("../Models/user.js");

// Add a new trainer
const addTrainer = async (req, res) => {
  try {
    const userId = req.user.id;
    const trainer = req.body;

    // Validate required fields
    if (!trainer.name || !trainer.age || !trainer.phoneNo || !trainer.address || !trainer.salary) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.trainers.push(trainer);
    await user.save();

    res.json(user.trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all trainers
const getTrainers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a trainer by ID
const getTrainerById = async (req, res) => {
  try {
    const userId = req.user.id;
    const trainerId = req.params.trainerId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const trainer = user.trainers.id(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.json(trainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a trainer
const updateTrainer = async (req, res) => {
  try {
    const userId = req.user.id;
    const trainerId = req.params.trainerId;
    const updatedTrainer = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const trainerIndex = user.trainers.findIndex(trainer => trainer._id.toString() === trainerId);
    if (trainerIndex === -1) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Validate required fields
    if (!updatedTrainer.name || !updatedTrainer.age || !updatedTrainer.phoneNo || !updatedTrainer.address || !updatedTrainer.salary) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Merge updated fields
    user.trainers[trainerIndex] = {
      ...user.trainers[trainerIndex],
      ...updatedTrainer,
    };

    await user.save();

    res.json(user.trainers[trainerIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a trainer
const deleteTrainer = async (req, res) => {
  try {
    const userId = req.user.id;
    const trainerId = req.params.trainerId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.trainers = user.trainers.filter(trainer => trainer._id.toString() !== trainerId);
    await user.save();

    res.json(user.trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addTrainer,
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
};
