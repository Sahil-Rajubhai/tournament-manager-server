import * as dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import Admin from "./models/Admin.js";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load environment variables from .env file in the server root directory
dotenv.config({ path: resolve(__dirname, "../.env") });

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in environment variables");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Bootstrap single admin (idempotent)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const existing = await Admin.findOne({
        email: process.env.ADMIN_EMAIL.toLowerCase(),
      });

      if (!existing) {
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await Admin.create({
          email: process.env.ADMIN_EMAIL.toLowerCase(),
          passwordHash: hash,
        });
        console.log("✔ Admin account created:", process.env.ADMIN_EMAIL);
      }
    }

    app.listen(PORT, () => {
      console.log(`✅ API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
