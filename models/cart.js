import mongoose from "mongoose";

// Each cart item represents one product in a user's cart
const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },

  {
    timestamps: true,
  }
);

const cartItem = new mongoose.model("CartItem", cartItemSchema);
export default cartItem;
