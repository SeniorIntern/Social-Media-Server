import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

export default function(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);

  const errResponse = {
    status: res.status,
    message: err.message,
    code: res.statusCode
  };
  res.status(500).send(errResponse);
}
