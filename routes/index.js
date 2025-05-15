import express from "express";
const router = express.Router();
import user from "./users.js";
import products from "./products.js";
import carts from "./carts.js";
import order from "./order.js";

router.use("/auth", user);
router.use("/products", products);
router.use("/cart", carts);
router.use("/order", order);

export default router;
