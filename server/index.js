const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// json data

app.use(bodyParser.json());
// cors allow origin

app.use(cors());
// store file
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/exceldata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

app.use("/", authRoutes);
app.use("/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
