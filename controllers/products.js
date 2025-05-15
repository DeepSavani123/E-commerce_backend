import Products from "../models/products.js";
import MESSAGES from "../constants/messages.js";
import mongoose from "mongoose";

const { PRODUCT, GENERAL } = MESSAGES;

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res
        .status(400)
        .json({ success: false, message: PRODUCT.FIELDS_REQUIRED });
    }

    const product = await Products.create({
      userId: req.user.id,
      name,
      description,
      price,
      stock,
      category,
    });

    return res
      .status(201)
      .json({ success: true, message: PRODUCT.PRODUCT_CREATED, prod: product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { category: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort) {
      const [key, order] = sort.split(":");
      sortOptions = { [key]: order === "asc" ? 1 : -1 };
    }

    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const productPromise = Products.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = Products.countDocuments(query);

    const [allProducts, totalItems] = await Promise.all([
      productPromise,
      totalProducts,
    ]);

    const totalPages = Math.ceil(totalItems / limitNumber);

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
        message: PRODUCT.PRODUCTS_NOT_FOUND,
      });
    }

    return res.status(200).json({
      success: true,
      data: allProducts,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalItems,
      message: PRODUCT.PRODUCTS_FETCHED,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ _id: id, userId: req.user.id });
    console.log(product);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: PRODUCT.PRODUCT_NOT_FOUND });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: PRODUCT.PRODUCT_FETCHED,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const userId = req.user.id.trim();

    const isProductExists = await Products.findOne({
      _id: id,
      userId: userId,
    });

    if (!isProductExists) {
      return res
        .status(404)
        .json({ success: false, message: PRODUCT.PRODUCT_NOT_EXISTS });
    }

    await Products.updateOne(
      { _id: isProductExists._id },
      { $set: req.body },
      { runValidators: true }
    );

    return res
      .status(200)
      .json({ success: true, message: PRODUCT.PRODUCT_UPDATED });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const isProductExists = await Products.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!isProductExists) {
      return res
        .status(404)
        .json({ success: false, message: PRODUCT.PRODUCT_NOT_EXISTS });
    }

    await Products.findByIdAndDelete({ _id: isProductExists._id });

    return res
      .status(200)
      .json({ success: true, message: PRODUCT.PRODUCT_DELETED });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: GENERAL.INTERNAL_SERVER_ERROR });
  }
};

export { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
