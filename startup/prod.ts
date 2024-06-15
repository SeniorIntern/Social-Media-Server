import compression from 'compression';
import { Express } from 'express';
import helmet from 'helmet';

export default function (app: Express) {
  app.use(helmet());
  app.use(compression());
}
