import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestId);

/**
 * - Routes used
 */

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
