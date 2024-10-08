import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { serverConfig } from '../config';
import { User } from '../types';
import { introSchema } from './intro';

const { JWT_SECRET } = serverConfig;

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  profileImage: {
    type: String,
    default: 'https://picsum.photos/id/40/4106/2806'
  },
  coverImage: {
    type: String,
    default: 'https://picsum.photos/id/40/4106/2806'
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  intro: {
    type: introSchema
  },
  about: {
    type: String,
    default: '',
    maxlength: 260
  }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin
    },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
  return token;
};

const User = mongoose.model<User>('User', userSchema);

export default User;
