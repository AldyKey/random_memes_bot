import mongoose from "mongoose";
import { config } from "dotenv";

config();
const mongodb_uri = process.env.MONGO_URI;

mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

export default mongoose.connection;
