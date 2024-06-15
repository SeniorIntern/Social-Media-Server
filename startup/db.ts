import mongoose from 'mongoose';
import winston from 'winston';
import dotenv from 'dotenv';

import { serverConfig } from '../config';

dotenv.config();

export default function () {
  const { URI } = serverConfig;

  mongoose.connect(URI).then(() => {
    winston.info('Connected to MongoBD....');
  });
}
