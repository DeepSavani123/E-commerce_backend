import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid Product Id formate");
  }

  return value;
};

const productQuantityValidator = Joi.object({
  productId: Joi.string().custom(objectId).required().messages({
    "any.required": "Product Id is required!",
    "string.empty": "Product Id cannot be empty",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "Quantity must be required!",
    "number.base": "Quantity Must be a number!",
    "number.min": "Quantity Must be at least one!",
  }),
});

const orderStatusValidator = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Product Id is required!",
    "string.empty": "Product Id cannot be empty!",
  }),

  status: Joi.string()
    .valid("Pending", "Packed", "Shipped", "Delivered", "Cancelled")
    .required()
    .messages({
      "any.required": "Status is required!",
      "any.only":
        "Status must be one of : Pending, Packed, Shipped, Delivered, Cancelled, ",
    }),
});

export {
  productQuantityValidator as itemValidator,
  orderStatusValidator as statusValidator,
};
