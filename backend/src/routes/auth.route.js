import { Router } from "express";
import {
    registerUser,
    verifyEmail,
    login,
    getUser,
    resendVerificationEmail, refreshToken,
} from "../controllers/auth.controller.js";

import {
  loginValidator,
  registerValidator,
    resendVerificationValidator
} from "../validators/userValidator.js";
import validate from "../middlewares/helper/validate.middleware.js";
import  authUser from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, validate, registerUser);
authRouter.get("/verify-email", verifyEmail);
 authRouter.post("/resend-verification", resendVerificationValidator, validate, resendVerificationEmail);
authRouter.post("/login", loginValidator, validate, login);
authRouter.post("/refresh", refreshToken)
authRouter.get("/get-user", authUser, getUser);

export default authRouter;
