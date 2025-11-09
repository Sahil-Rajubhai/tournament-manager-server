import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);

    // Add connection error handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
