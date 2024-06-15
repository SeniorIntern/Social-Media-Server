import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);

  const errResponse = {
    status: false,
    message: 'Something failed',
    code: 500
  };
  res.status(500).send(errResponse);
}
