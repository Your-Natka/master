import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  registerSchema,
  loginSchema,
  updSubscriptionSchema,
} from "../models/user.js";
import {
  forgotPassword,
  resetPassword,
  updAvatar,
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateMyPassword,
} from "../controllers/authController.js";
import { uploadAvatar } from "../middlewares/upload.js";
import { checkAndUpdateMyPassword } from "../middlewares/userMiddlewares.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updSubscriptionSchema),
  updateSubscription
);

authRouter.patch("/avatars", authenticate, uploadAvatar, updAvatar);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/restore-password/:otp", resetPassword);
authRouter.patch("/password", checkAndUpdateMyPassword, updateMyPassword);
export default authRouter;
