import mongoose from "mongoose";
import dotenv from "dotenv";      // for managing usr/pwd combo without hardcoding into source

dotenv.config();    // When invoked, gives access to the `process.env` object.

const username = process.env["MONGO_USERNAME"];
const password = process.env["MONGO_PASSWORD"];
const uri = `mongodb+srv://${username}:${password}@blog-cluster.yx8fn7i.mongodb.net/?appName=blog-cluster`;

const connectDB = async () => {
    try {
      await mongoose.connect(uri);
      console.log("Connected successfully to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
}

export default connectDB;