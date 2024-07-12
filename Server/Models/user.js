const mongoose = require("mongoose");
const { Schema } = mongoose;

//schema for member details
const memberDetailsSchema = new Schema({
  name: String,
  age: Number,
  phoneNumber: String,
  dateOfJoining: Date,
  shift: {
    type: String,
    enum: ['morning', 'evening'],
  },
  paymentStatus: {
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
    },
    startDate: Date,
    endDate: Date,
  },
});

// Define the user schema
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  gymName: String, 
  members: [memberDetailsSchema], 
});


const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
