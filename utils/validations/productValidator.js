import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Product name is required",
    "string.max": "Product name must be less than or equal to 100 characters",
  }),

  description: Joi.string().max(200).required().messages({
    "string.empty": "Product description is required",
    "string.max": "Description must be less than or equal to 200 characters",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 0",
    "any.required": "Price is required",
  }),

  stock: Joi.number().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be at least 0",
    "any.required": "Stock is required",
  }),

  category: Joi.string()
    .valid("Electronics", "Clothing", "Books", "Home", "Accessories", "Other")
    .required()
    .messages({
      "any.only":
        "Category must be one of: Electronics, Clothing, Books, Home, Accessories, Other",
      "any.required": "Category is required",
    }),
});

export default productSchema;
