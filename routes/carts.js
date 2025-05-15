import express from "express";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCarts,
  updateCartQuantity,
} from "../controllers/cart.js";
import authorization from "../middleware/authorization.js";
import validate from "../utils/validationAsync.js";

const router = express.Router();

router.post(
  "/addtocart",
  validate("itemValidator"),
  authorization(["Customer"]),
  addToCart
);
router.get("/getcarts", authorization(["Customer"]), getCarts);
router.put(
  "/updatecartquantity",
  validate("itemValidator"),
  authorization(["Customer"]),
  updateCartQuantity
);
router.delete("/deletecart/:id", authorization(["Customer"]), deleteCartItem);
router.delete("/clearcart", authorization(["Customer"]), clearCart);

export default router;
