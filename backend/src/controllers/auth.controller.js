import userModel from "../models/user.model.js";
import { sendEmail } from "../services/email.service.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { welcomeEmail } from "../templates/welcomeEmail.template.js";
import { AppError } from "../utils/appError.utils.js";
import { asyncHandler } from "../middlewares/helper/asyncHandler.middleware.js";
import {generateRandomToken, sha256} from "../utils/crypto.utils.js";

const VERIFICATION_WINDOW_MINUTES = 30;

/**
 * Register a new user:
 * 1. Validate request data through validation middleware.
 * 2. Check whether username or email already exists.
 * 3. Create the user with verified = false.
 * 4. Generate a short-lived email verification token.
 * 5. Send verification email.
 * 6. Return a safe response without exposing password.
 */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const isAlreadyRegister = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegister) throw new AppError("User already exists with provided username or email", 400);

  const user = await userModel.create({
    name,
    username,
    email,
    password,
  });

    // Create one-time token
    const token = generateRandomToken(32);
    user.verificationTokenHash = sha256(token);
    user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_WINDOW_MINUTES * 60 * 1000);
    await user.save();

    const verifyUrl = `${config.APP_ORIGIN}/api/auth/verify-email?token=${token}`;
    const html = welcomeEmail({ name: user.name, verifyUrl });
    await sendEmail({ to: user.email, subject: "Verify your email", html });

    return res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        success: true,
        user: { id: user._id, name: user.name, username: user.username, email: user.email, verified: user.verified },
    });
});

/**
 * Verify email:
 * 1. Read token from query.
 * 2. Validate and decode token.
 * 3. Find the user by email.
 * 4. Mark user as verified.
 * 5. Show a success message with a login link.
 */

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    if (!token) throw new AppError("Verification token is required", 400);

    const tokenHash = sha256(token);

    const user = await userModel.findOne({
        verificationTokenHash: tokenHash,
        verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
        // Do not reveal whether user exists; token could be invalid/expired/already used
        return res.status(400).send(`
          <h1>Invalid or expired verification link</h1>
          <p>Please request a new verification email and try again.</p>
    `);
    }

    if (user.verified) {
        return res.status(200).send(`
      <h1>Email already verified.</h1>
      <p>You can now log in.</p>
    `);
    }

    user.verified = true;
    user.emailVerifiedAt = new Date();
    user.verificationTokenHash = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).send(`
    <h1>Your email is verified.</h1>
    <p>You can now <a href="${config.APP_ORIGIN}/api/auth/login">log in</a>.</p>
  `);
});

/**
 * Login: returns accessToken in JSON, sets refreshToken as httpOnly cookie
 */
export const login = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if (!username && !email) {
        throw new AppError("Provide username or email", 400);
    }

    if (!password) {
        throw new AppError("Password is required", 400);
    }

    const or = [];
    if (username) or.push({username});
    if (email) or.push({email});

    const user = await userModel.findOne({$or: or}).select("+password");

    if (!user) throw new AppError("Invalid credentials", 401);

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) throw new AppError("Invalid credentials", 401);

    if (!user.verified) throw new AppError("Email not verified", 403);

    const accessToken = jwt.sign(
        { sub: user._id.toString(), typ: "access" },
        config.ACCESS_SECRET,
        { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
        { sub: user._id.toString(), typ: "refresh" },
        config.REFRESH_SECRET,
        { expiresIn: "15d" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        path: "/"
    })

    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        },
        accessToken,
    })
})

/**
 * Refresh: rotates refresh token cookie and returns a new accessToken in JSON
 */
export const refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) throw new AppError("Refresh token is required", 400);

    const decoded = jwt.verify(incomingRefreshToken, config.REFRESH_SECRET);
    if (decoded.typ !== "refresh") {
        return res.status(401).json({ message: "Invalid token type", success: false });
    }
    const userId = decoded.sub;
    const user = await userModel.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found", success: false });

    // Optionally check if user is still verified/active

    const accessToken = jwt.sign(
        { sub: user._id.toString(), typ: "access" },
        config.ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        { sub: user._id.toString(), typ: "refresh" },
        config.REFRESH_SECRET,
        { expiresIn: "15d" }
    );

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        path: "/"
    })
    res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
        accessToken,
    })
})

/**
 * Resend verification email: issues a new one-time token (hashed in DB)
 */

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new AppError("Invalid email or email not found", 400);

  const user = await userModel.findOne({ email });

  if (!user) throw new AppError("User not found", 400);

  if (user.verified) throw new AppError("already verified", 400);

    const token = generateRandomToken(32);
    user.verificationTokenHash = sha256(token);
    user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_WINDOW_MINUTES * 60 * 1000);
    await user.save();

    const verifyUrl = `${config.APP_ORIGIN}/api/auth/verify-email?token=${token}`;
    const html = welcomeEmail({ name: user.name, verifyUrl });
    await sendEmail({ to: user.email, subject: "Verify your email", html });

    return res.status(200).json({ message: "Verification email resent.", success: true });
});

export async function getUser(req, res) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
  const user = await userModel.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    message: "user details fetched sucessfully",
    success: true,
    user,
  });
}
