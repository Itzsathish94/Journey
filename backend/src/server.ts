import './utils/loadEnv'

import morgan from "morgan";
import express from "express";
import connectDB from "./config/db";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import redisClient from "./config/redis";
import userRoutes from "./routes/user-routes";
import interviewerRoutes from "./routes/interviewer-routes";
import adminRoutes from "./routes/admin-routes";
import { appLogger, accessLogStream } from "./utils/logger";
import { StatusCode } from "./utils/enum";
import { errorHandler } from "./middlewares/error-handler";

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    appLogger.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Filter only valid string origins
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL ?? "https://ulearnfrontend.onrender.com",
].filter((url): url is string => Boolean(url));

const corsOptions: CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
};

// HTTP request logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
}

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/interviewer", interviewerRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("/api", (_req, res) => {
  res.status(StatusCode.NOT_FOUND).json({
    success: false,
    message: "API route not found",
  });
});

app.use(errorHandler);

// Process-level error logging
process.on("unhandledRejection", (reason: unknown) => {
  const errorDetails =
    reason instanceof Error
      ? { message: reason.message, stack: reason.stack }
      : { reason: String(reason) };

  appLogger.error("Unhandled Promise Rejection", errorDetails);
});

process.on("uncaughtException", (error: Error) => {
  appLogger.error("Uncaught Exception", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

const start = async (): Promise<void> => {
  try {
    await connectDB();
    appLogger.info("Database connected successfully");

    try {
      await redisClient.ping();
      appLogger.info("Redis connected successfully");
    } catch (redisError: unknown) {
      const errorMessage =
        redisError instanceof Error
          ? redisError.message
          : "Unknown Redis error";
      appLogger.warn(
        "Redis connection failed, OTP functionality may be limited",
        { error: errorMessage },
      );
    }

    appLogger.info("Membership expiry job started");

    const httpServer = createServer(app);
    
    httpServer.listen(port, () => {
      appLogger.info(`Server is running on http://localhost:${port}`);
    });

  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error starting server";
    appLogger.error("Failed to start server", { error: errorMessage });
    process.exit(1);
  }
};

start();