import express from "express";
import {
  buyProduct,
  cancelOrder,
  getAllOrders,
  getOrderByCustomer,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.js";
import authorization from "../middleware/authorization.js";
import validate from "../utils/validationAsync.js";

const router = express.Router();

router.post(
  "/buyProduct",
  validate("itemValidator"),
  authorization(["Customer"]),
  buyProduct
);
router.get("/getorders", authorization(["Admin"]), getAllOrders);
router.get(
  "/getorderByCustomer",
  authorization(["Customer"]),
  getOrderByCustomer
);
router.get("/getorder/:id", authorization(["Admin"]), getOrderById);
router.put(
  "/updateorderstatus",
  validate("statusValidator"),
  authorization(["Admin"]),
  updateOrderStatus
);
router.delete(
  "/cancelorder/:id",
  authorization(["Admin", "Customer"]),
  cancelOrder
);

export default router;
