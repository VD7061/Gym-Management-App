const User = require("../Models/user.js");
const { hashPassword, comparePassword } = require("../helpers/auth.js");
const jwt = require("jsonwebtoken");  
const { generateToken,verifyToken } = require('../util/jwtUtils.js');

const test = (req, res) => {
  res.json("Hello World!");
};


//register endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password,gymName  } = req.body;
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


    const hashedPassword = await hashPassword(password);
    //creating user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gymName, 
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};


//login user 

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  test,
  registerUser,
  loginUser,
};
