import { register, login, otpVerify } from "./userValidator.js";
import { itemValidator, statusValidator } from "./buyProductValidator.js";
import productSchema from "./productValidator.js";

export default {
  register,
  login,
  otpVerify,
  productSchema,
  itemValidator,
  statusValidator,
};
