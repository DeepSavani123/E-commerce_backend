import schema from "./validations/index.js";

const validate = (validationReq) => async (req, res, next) => {
  if (!schema[validationReq]) {
    return res
      .status(400)
      .json({ success: false, message: "Validation request not found!" });
  }

  try {
    const value = await schema[validationReq].validateAsync(req.body);
    req.body = value;
    console.log(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default validate;
