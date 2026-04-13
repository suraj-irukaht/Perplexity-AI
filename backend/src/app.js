import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  //logger.info("Hello welcome to the app");
  return res.send("Hello welcome to the app");
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) =>
  res.status(200).json({ message: "Welcome to the API" }),
);

export default app;
