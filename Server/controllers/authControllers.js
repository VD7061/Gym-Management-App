const User = require("../Models/user.js");
const { hashPassword, comparePassword } = require("../helpers/auth.js");

const test = (req, res) => {
  res.json("Hello World!");
};


//register endpoint
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


    const hashedPassword = await hashPassword(password);
    //creating user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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

    // Check if user exists
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.json({
        error: "user does not exist"
      });
    }

    // Check if password is matched 
    const match = await comparePassword(password, user.password)
    if(match){
      res.json('password matched') 
    }
    if(!match){
      return res.json({
        error: "password is not matched"
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
};
