import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import { resetPasswordService } from "../models/user.js";
import catchAsync from "../helpers/catchAsync.js";
import bcrypt from "bcrypt";
import { updateAvatarService } from "../servis/userServis.js";
import { Email } from "../servis/emailServis.js";

const { SECRET_KEY } = process.env;

export const updAvatar = catchAsync(async (req, res) => {
  const updatedUser = await updateAvatarService(req.body, req.user, req.file);
  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});

export const register = catchAsync(async (req, res) => {
  const { email } = req.body;
  const checkImail = await User.findOne({ email });
  if (checkImail) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await User.create({
    ...req.body,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findOneAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = catchAsync(async (req, res) => {
  const { email, subscription } = await User.findById(req.user.id);

  res.status(200).json({
    email,
    subscription,
  });
});

export const logout = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { token: null });

  res.sendStatus(204);
});

export const updateSubscription = catchAsync(async (req, res) => {
  const { _id } = req.user;

  if (!req.body) throw HttpError(400, "missing field subscription");
  const { email, subscription } = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!email || !subscription) throw HttpError(404, "Not found");
  res.status(201).json({ email, subscription });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await getUserByEmailService(req.body.email);

  if (!user)
    return res
      .status(200)
      .json({ msg: "Password reset instructions sent by email" });

  const otp = user.resetPasswordResetToken();
  console.log({ otp });
  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/reset-password/${otp}`;

    await new Email(user, resetUrl).passwordReset();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExp = undefined;

    await user.save();
  }
  res.status(200).json({ msg: "Password reset instructions sent by email" });
});

export const resetPassword = catchAsync(async (req, res) => {
  // password must be validated

  await resetPasswordService(req.params.otp, req.body.password);

  res.sendStatus(200);
});

export const updateMyPassword = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};
