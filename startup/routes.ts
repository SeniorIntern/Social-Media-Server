import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';

import { serverConfig } from '../config';
import { auth, error } from '../middlewares';
import v1Routes from '../routers/v1Routes';

export default function(app: Express) {
  const { CORS_OPTIONS, JWT_SECRET } = serverConfig;

  app.use(cookieParser(JWT_SECRET));
  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/'
    })
  );
  app.use('/api/v1', auth, v1Routes);
  app.use(error);
}
