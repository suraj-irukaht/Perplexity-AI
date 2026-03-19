import express from "express";
import cookieParser from "cookie-parser";

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());

/**
 * - Routes required
 */

/**
 * - Routes used
 */

export default app;
