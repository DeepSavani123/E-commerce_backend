import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required!",
    "string.min": "Name must be at least 3 characters!",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Email must be valid!",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password must be at least 6 characters!",
  }),

  gender: Joi.string().valid("Male", "Female").optional().messages({
    "any.only": "Gender must be Male or Female!",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid number!",
      "string.empty": "Phone is required!",
    }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required!",
  }),

  role: Joi.string().valid("Admin", "Customer").default("Customer").messages({
    "any.only": "Role must be either Admin or Customer",
  }),

  otp: Joi.number().optional().allow(null),
  otpExpireAt: Joi.date().optional(),
  isVerify: Joi.boolean().default(false),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Email must be valid!",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password must be at least 6 characters!",
  }),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Email must be valid!",
  }),

  otp: Joi.number().required().messages({
    "number.base": "OTP must be a number!",
    "any.required": "OTP is required!",
  }),
});

export {
  registerSchema as register,
  loginSchema as login,
  otpSchema as otpVerify,
};
