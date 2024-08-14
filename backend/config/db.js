import mongoose from "mongoose";

const connectDB = async () => {
  //console.log(process.env.MONGODB_URL);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;