import express from "express";
import {
  loginUser,
  logoutUser,
  registeredUser,
  verifyLoginOtp,
} from "../controllers/user.js";
import authorization from "../middleware/authorization.js";
import validate from "../utils/validationAsync.js";
const router = express.Router();

router.post("/register", validate("register"), registeredUser);
router.post("/login", validate("login"), loginUser);
router.post("/verifyotp", validate("otpVerify"), verifyLoginOtp);
router.get("/logout", authorization(["Admin", "Customer"]), logoutUser);

export default router;
