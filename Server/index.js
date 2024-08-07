const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());

app.use("/", require("./routes/authRoutes.js"));

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
