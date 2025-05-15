import jwt from "jsonwebtoken";

const authorization = (roles) => (req, res, next) => {
  let token =
    req.cookies.accessKey ||
    req.get("Authorization") ||
    req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header missing" });
  }

  if (token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (roles.includes(decode.role)) {
      req.user = decode;
      next();
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "you don't have an access of this route",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

export default authorization;
