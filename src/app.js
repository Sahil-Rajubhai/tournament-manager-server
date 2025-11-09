import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// CORS configuration - supports multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: false,
  })
);
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/public", publicRoutes);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;
