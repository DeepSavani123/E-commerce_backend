const MESSAGES = {
  AUTH: {
    EMAIL_ALREADY_EXISTS: "Email Already Exists!",
    USER_CREATED: "User Created Successfully!",
    INVALID_CREDENTIALS: "Invalid Credentials!",
    OTP_SENT: "OTP sent to your email",
    OTP_SEND_FAILED: "Failed to send OTP",
    INVALID_OR_EXPIRED_OTP: "Invalid or expired OTP",
    USER_LOGGED_IN: "User Login Successfully",
    USER_LOGGED_OUT: "User Logout Successfully!",
  },

  PRODUCT: {
    FIELDS_REQUIRED: "All fields are required!",
    PRODUCT_CREATED: "Product Created Successfully!",
    PRODUCTS_NOT_FOUND: "Products are not found!",
    PRODUCT_NOT_FOUND: "Product Not Found!",
    PRODUCT_FETCHED: "Product Fetched Successfully!",
    PRODUCTS_FETCHED: 'Products Fetched Successfully!',
    PRODUCT_UPDATED: "Product Updated Successfully",
    PRODUCT_NOT_EXISTS: "Product does not exist!",
    PRODUCT_DELETED: "Product Deleted Successfully",
    INSUFFICIENT_STOCK: "Insufficient stock available!",
    INVALID_PRODUCT_OR_QUANTITY: "Invalid ProductId or quantity",
  },

  ORDER: {
    ORDER_PLACED: "Product Purchased Successfully",
    ORDER_NOT_FOUND: "Order not found",
    ORDER_FETCHED: "Order fetched Successfully",
    ORDER_LIST_EMPTY: "No orders found!",
    CUSTOMER_ORDER_EMPTY: "Not any product available in the order list",
    CUSTOMER_ORDER_FETCHED: "All the products are fetched successfully which are bought by this customer",
    ORDER_STATUS_UPDATED: "Order status updated successfully",
    ORDER_CANCELLED: "Order cancelled",
    ORDER_CANNOT_CANCEL: "Order cannot be cancelled",
  },

  CART: {
    PRODUCT_ADDED: "Product added to Cart",
    PRODUCTS_FETCHED: "Products are fetched successfully",
    CART_EMPTY: "Not a single product is added into the cart",
    QUANTITY_UPDATED: "Quantity updated successfully",
    PRODUCT_NOT_IN_CART: "This product does not exist in the cart!",
    PRODUCT_DELETED: "Product deleted successfully from the Cart",
    CART_CLEARED: "Cart cleared successfully",
  },

  GENERAL: {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
  },
};

export default MESSAGES;
