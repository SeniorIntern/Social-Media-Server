import mongoose from 'mongoose';

import { Intro } from '../types';

const introSchema = new mongoose.Schema<Intro>({
  shortIntro: {
    type: String,
    maxlength: 60,
    default: ''
  },
  study: {
    type: String,
    maxlength: 20,
    default: ''
  },
  location: {
    type: String,
    maxlength: 20,
    default: ''
  },
  job: {
    type: String,
    maxlength: 20,
    default: ''
  }
});

const Intro = mongoose.model<Intro>('Intro', introSchema);

export { introSchema, Intro };
