import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import chatBotRoutes from "./routes/ChatBot.route.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Live 🚀");
});

// Routes
app.use("/bot/v1", chatBotRoutes);


// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");

    app.listen(port, () => {
      console.log(` Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(" MongoDB Connection Error:", error.message);
  });
