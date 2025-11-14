import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { fileURLToPath } from "url";

import countryRouter from "../routes/countryRoutes.js";
import quizRouter from "../routes/quizRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend/dist")));

// API routes
app.use("/api/countries", countryRouter);
app.use("/api/quiz", quizRouter);

export default app;
