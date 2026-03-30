import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MongoDB URI is missing");
}
if (!process.env.JWT_SECRET) {
  throw new Error("Jwt secret is missing");
}
if (!process.env.REFRESH_TOKEN) {
  throw new Error("Refresh token secret is missing");
}
if (!process.env.CLIENT_ID) {
  throw new Error("Client Id is missing");
}
if (!process.env.CLIENT_SECRET) {
  throw new Error("Client secret is missing");
}
if (!process.env.GMAIL_USER) {
  throw new Error("Gmail user is missing");
}
if (!process.env.APP_ORIGIN) {
  throw new Error("App origin is missing");
}


const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GMAIL_USER: process.env.GMAIL_USER,
    APP_ORIGIN: process.env.APP_ORIGIN,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
};
console.log(config.REFRESH_SECRET)

export default config;
