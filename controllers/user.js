import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/users.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import fs from "fs";
import MESSAGES from "../constants/messages.js"; 
dotenv.config();


const { AUTH, GENERAL } = MESSAGES;

const { EMAIL_USERNAME, EMAIL_PASSWORD, JWT_SECRET } = process.env;

console.log(EMAIL_USERNAME, EMAIL_PASSWORD, JWT_SECRET)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:EMAIL_USERNAME ,
    pass: EMAIL_PASSWORD,
  },
});

const htmlFile = fs.readFileSync("otp.html", "utf-8");

const registeredUser = async (req, res) => {
  try {
    const { name, email, password, gender, phone, address, role } = req.body;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      return res
        .status(400)
        .json({ success: false, message: AUTH.EMAIL_ALREADY_EXISTS });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
      gender,
      phone,
      address,
      role,
    });

    return res.status(201).json({ success: true, message: AUTH.USER_CREATED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const login = await User.findOne({ email });
    if (!login) {
      return res
        .status(400)
        .json({ success: false, message: AUTH.INVALID_CREDENTIALS });
    }

    const isMatch = await bcrypt.compare(password, login.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: AUTH.INVALID_CREDENTIALS });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpireAt = Date.now() + 5 * 60 * 1000;

    login.otp = otp;
    login.otpExpireAt = otpExpireAt;

    await login.save();

    const mailOptions = {
      from: EMAIL_USERNAME,
      to: login.email,
      subject: "Your OTP Code",
      html: htmlFile.replace("{{otp}}", otp.toString()),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: AUTH.OTP_SEND_FAILED });
      } else {
        console.log("Email Sent: " + info.response);
        return res.status(200).json({
          success: true,
          email: login.email,
          message: AUTH.OTP_SENT,
        });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: AUTH.INVALID_OR_EXPIRED_OTP });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
     JWT_SECRET,
      { expiresIn: "1d" }
    );

    await user.updateOne({
      $set: { otp: null, otpExpireAt: null, isVerify: true },
    });

    return res
      .status(200)
      .cookie("accessKey", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: "lax",
      })
      .json({
        success: true,
        token,
        data: {
          ...user._doc,
          password: undefined,
          otpExpireAt: undefined,
          otp: undefined,
        },
        message: AUTH.USER_LOGGED_IN,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessKey");
    return res
      .status(200)
      .json({ success: true, message: AUTH.USER_LOGGED_OUT });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

export { registeredUser, loginUser, verifyLoginOtp, logoutUser };
