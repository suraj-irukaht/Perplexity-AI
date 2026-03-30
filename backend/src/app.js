import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/helper/errorHandler.middleware.js";
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());


/**
 * - Routes used
 */

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
