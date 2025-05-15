import dotenv from "dotenv";
dotenv.config();
import("./config/dbConnect.js");
import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
