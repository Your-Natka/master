import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import { User } from '../models/user.js';
import catchAcync from '../helpers/catchAsync.js';
import { updateAvatarService } from '../servis/userServis.js';

const { SECRET_KEY } = process.env;

export const updAvatar = catchAcync(async (req, res) => {
  const updatedUser = await updateAvatarService(req.body, req.user, req.file);
  res.status(200).json({
    user: updatedUser,
  });
});

export const register = catchAcync(async (req, res) => {
  const { email } = req.body;
  const checkImail = await User.findOne({ email });
  if (checkImail) {
    throw HttpError(409, 'Email in use');
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

export const login = catchAcync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
  await User.findOneAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = catchAcync(async (req, res) => {
  const { email, subscription } = await User.findById(req.user.id);

  res.status(200).json({
    email,
    subscription,
  });
});

export const logout = catchAcync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { token: null });

  res.sendStatus(204);
});

export const updateSubscription = catchAcync(async (req, res) => {
  const { _id } = req.user;

  if (!req.body) throw HttpError(400, 'missing field subscription');
  const { email, subscription } = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!email || !subscription) throw HttpError(404, 'Not found');
  res.status(201).json({ email, subscription });
});
