import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error while connecting to the DB");
  }
}

export default connectDB;
