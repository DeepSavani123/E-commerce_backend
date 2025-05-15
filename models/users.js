import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Customer"],
    defaul: "Customer",
  },

  otp: {
    type: Number,
    default: null,
  },

  otpExpireAt: {
    type: Date,
    default: Date.now,
  },

  isVerify: {
    type: Boolean,
    deafult: "false",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
