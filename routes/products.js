import express from "express";
import authorization from "../middleware/authorization.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.js";
import validate from "../utils/validationAsync.js";
const router = express.Router();

router.post(
  "/createProduct",
  validate("productSchema"),
  authorization(["Admin"]),
  createProduct
);
router.get("/getproducts", authorization(["Admin", "Customer"]), getProducts);
router.get("/getproduct/:id", authorization(["Admin"]), getProduct);
router.put(
  "/updateproduct/:id",
  validate("productSchema"),
  authorization(["Admin"]),
  updateProduct
);
router.delete("/deleteproduct/:id", authorization(["Admin"]), deleteProduct);

export default router;
