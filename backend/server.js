import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session"; // ← Import session
import passport from "passport"; // ← Import passport

import { fileURLToPath } from "url";

import configurePassport from "./authConfig.js";

import countryRouter from "./routes/countryRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import authRouter from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session middleware (MUST come before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-to-a-random-string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
    },
  }),
);

// Passport middleware (MUST come after session)
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
configurePassport();

// API routes
app.use("/api/countries", countryRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/auth", authRouter);

// Static files from React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is listening on 0.0.0.0:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🚀 Listening on port ${PORT}`);
});

export default app;
