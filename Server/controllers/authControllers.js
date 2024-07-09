const User = require("../Models/user.js");

const test = (req, res) => {
  res.json("Hello World!");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if name was entered
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    //check if password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be at least 6 characters",
      });
    }

    //check email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "email is already in use",
      });
    }
    const user = await User.create({ name, email, password });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  registerUser,
};
