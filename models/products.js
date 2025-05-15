import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  description: {
    type: String,
    required: true,
    maxlength: 200,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Books", "Home", "Accessories", "Other"],
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
