import CartItem from "../models/cart.js";
import MESSAGES from "../constants/messages.js";

const { CART, GENERAL } = MESSAGES; 

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { id } = req.user;
    const cartItemExists = await CartItem.findOne({ userId: id, productId });

    if (cartItemExists) {
      cartItemExists.quantity += quantity;
      await cartItemExists.save();
    } else {
      const cartItem = new CartItem({
        userId: id,
        productId,
        quantity: quantity || 1,
      });

      await cartItem.save();
    }

    return res.status(200).json({ success: true, message: CART.PRODUCT_ADDED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getCarts = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = 1, limit = 10, search, sort } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOptions = { createdAt: -1 };
    if (sort) {
      const [key, order] = sort.split(":");
      sortOptions = { [key]: order === "asc" ? 1 : -1 };
    }

    const baseQuery = { userId: id };
    const totalItems = await CartItem.countDocuments(baseQuery);

    const cartItems = await CartItem.find(baseQuery)
      .populate("productId")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    let filteredItems = cartItems;
    if (search) {
      filteredItems = cartItems.filter((item) =>
        item.productId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    let filteredCount = totalItems;
    if (search) {
      const allCartItems = await CartItem.find(baseQuery).populate("productId");
      filteredCount = allCartItems.filter((item) =>
        item.productId?.name?.toLowerCase().includes(search.toLowerCase())
      ).length;
    }

    const totalPages = Math.ceil(filteredCount / limitNumber);

    if (!filteredItems || filteredItems.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        numberofItems: 0,
        message: CART.CART_EMPTY,
      });
    }

    return res.status(200).json({
      success: true,
      data: filteredItems,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      numberofItems: filteredCount,
      message: CART.PRODUCTS_FETCHED,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = await CartItem.findOne({ userId: req.user.id, productId });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: CART.PRODUCT_NOT_IN_CART });
    }

    await CartItem.findByIdAndUpdate(
      { _id: cartItem._id },
      { $set: { quantity } }
    );

    return res
      .status(200)
      .json({ success: true, message: CART.QUANTITY_UPDATED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const isItemExists = await CartItem.findOne({
      userId: req.user.id,
      productId: id,
    });

  

    if (!isItemExists) {
      return res
        .status(400)
        .json({ success: false, message: CART.PRODUCT_NOT_IN_CART });
    }

    await CartItem.deleteOne({ _id: isItemExists._id });

    return res
      .status(200)
      .json({ success: true, message: CART.PRODUCT_DELETED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await CartItem.deleteMany({ userId });

    return res.status(200).json({ success: true, message: CART.CART_CLEARED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

export { addToCart, getCarts, updateCartQuantity, deleteCartItem, clearCart };
