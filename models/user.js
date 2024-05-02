import { Schema, model } from 'mongoose';
import handleMongooseError from '../helpers/handleMongooseError.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import gravatar from 'gravatar';

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const SUBSCRIPTIONS = ['starter', 'pro', 'business'];

export const userSchema = new Schema(
  {
    email: {
      type: String,
      match: EMAIL_REGEX,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    subscription: {
      type: String,
      enum: {
        values: [...SUBSCRIPTIONS],
        message: `have only ${SUBSCRIPTIONS.join(', ')}`,
      },

      default: 'starter',
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

export const registerSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required().messages({
    'string.pattern.base':
      "Email may contain letters, numbers, an apostrophe, and must be followed by '@' domain name '.' domain suffix. For example Taras@ukr.ua, adrian@gmail.com, JacobM3rcer@hotmail.com",
  }),
  password: Joi.string().pattern(PASS_REGEX).required().messages({
    'string.pattern.base':
      'Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters. For example TgeV23592, 3Greioct.',
  }),
  subscription: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required().messages({
    'string.pattern.base':
      "Email may contain letters, numbers, an apostrophe, and must be followed by '@' domain name '.' domain suffix. For example Taras@ukr.ua, adrian@gmail.com, JacobM3rcer@hotmail.com",
  }),
  password: Joi.string().pattern(PASS_REGEX).required().messages({
    'string.pattern.base':
      'Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters. For example TgeV23592, 3Greioct.',
  }),
});

export const updSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.post('save', handleMongooseError);

export const User = model('user', userSchema);
