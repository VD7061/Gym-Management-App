const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for member details
const memberDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  shift: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  paymentStatus: {
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
      required: true,
    },
    startDate: {
      type: Date,
      validate: {
        validator: function (v) {
          // If status is paid, startDate should be present
          return this.paymentStatus.status === 'unpaid' || v != null;
        },
        message: props => `startDate is required when payment status is 'paid'`,
      },
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (v) {
          // If status is paid, endDate should be present
          return this.paymentStatus.status === 'unpaid' || v != null;
        },
        message: props => `endDate is required when payment status is 'paid'`,
      },
    },
  },
}, { timestamps: true });

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gymName: {
    type: String,
    required: true,
  },
  members: [memberDetailsSchema],
}, { timestamps: true });


userSchema.index({ email: 1 });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
