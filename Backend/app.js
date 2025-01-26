const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
