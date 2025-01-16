const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);

// Database connection
connectDB();

module.exports = app;
