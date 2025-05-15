import Order from "../models/order.js";
import Product from "../models/products.js";
import MESSAGES from "../constants/messages.js";

const { ORDER, GENERAL } = MESSAGES;

// For customer
const buyProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: ORDER.INVALID_PRODUCT_OR_QUANTITY });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: ORDER.PRODUCT_NOT_FOUND });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: ORDER.INSUFFICIENT_STOCK });
    }

    const priceAtPurchase = product.price;
    const totalAmount = priceAtPurchase * quantity;

    product.stock -= quantity;
    await product.save();

    const newOrder = new Order({
      userId: req.user.id,
      productId,
      quantity: quantity || 1,
      priceAtPurchase,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    return res.status(200).json({
      success: true,
      data: newOrder,
      message: ORDER.PRODUCT_PURCHASED,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getOrderByCustomer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search, sort } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOptions = { createdAt: -1 };
    if (sort) {
      const [key, order] = sort.split(":");
      sortOptions = { [key]: order === "asc" ? 1 : -1 };
    }

    const orders = await Order.find({ userId })
      .populate("productId", "name price")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    let filteredOrders = orders;
    if (search) {
      filteredOrders = orders.filter((order) =>
        order.productId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalOrders = await Order.countDocuments({ userId });

    let filteredCount = totalOrders;
    if (search) {
      const allOrders = await Order.find({ userId }).populate(
        "productId",
        "name price"
      );
      filteredCount = allOrders.filter((order) =>
        order.productId?.name?.toLowerCase().includes(search.toLowerCase())
      ).length;
    }

    const totalPages = Math.ceil(filteredCount / limitNumber);

    if (!filteredOrders.length) {
      return res.status(200).json({
        success: false,
        data: [],
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        numberofItems: 0,
        message: ORDER.NO_ORDERS_CUSTOMER,
      });
    }

    return res.status(200).json({
      success: true,
      data: filteredOrders,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      numberofItems: filteredCount,
      message: ORDER.ORDERS_FETCHED_CUSTOMER,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOptions = { createdAt: -1 };
    if (sort) {
      const [key, order] = sort.split(":");
      sortOptions = { [key]: order === "asc" ? 1 : -1 };
    }

    const orders = await Order.find()
      .populate("userId", "name")
      .populate("productId", "name price")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    let filteredOrders = orders;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredOrders = orders.filter(
        (order) =>
          order.userId?.name?.toLowerCase().includes(lowerSearch) ||
          order.productId?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    const totalOrders = await Order.countDocuments();

    let filteredCount = totalOrders;
    if (search) {
      const allOrders = await Order.find()
        .populate("userId", "name")
        .populate("productId", "name price");

      filteredCount = allOrders.filter(
        (order) =>
          order.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          order.productId?.name?.toLowerCase().includes(search.toLowerCase())
      ).length;
    }

    const totalPages = Math.ceil(filteredCount / limitNumber);

    if (!filteredOrders.length) {
      return res.status(200).json({
        success: false,
        data: [],
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        numberofItems: 0,
        message: ORDER.NO_ORDERS,
      });
    }

    return res.status(200).json({
      success: true,
      data: filteredOrders,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      numberofItems: filteredCount,
      message: ORDER.ORDERS_FETCHED,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id })
      .populate("userId", "name email")
      .populate("productId", "name price");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: ORDER.ORDER_NOT_FOUND });
    }

    return res.status(200).json({
      success: true,
      data: order,
      message: ORDER.ORDER_FETCHED,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

// For Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: ORDER.ORDER_NOT_FOUND });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: order._id },
      { $set: { status } }
    );

    return res.status(200).json({
      success: true,
      data: updatedOrder,
      message: ORDER.ORDER_STATUS_UPDATED,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

// For Customer
const cancelOrder = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const userId = req.user.id.trim();

    const order = await Order.findOne({ userId: userId, _id: id });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: ORDER.ORDER_NOT_FOUND });
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: ORDER.ORDER_CANNOT_CANCEL });
    }

    await Order.updateOne(
      { _id: order._id },
      { $set: { status: "Cancelled" } }
    );

    return res
      .status(200)
      .json({ success: true, message: ORDER.ORDER_CANCELLED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

export {
  buyProduct,
  getOrderByCustomer,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
};
