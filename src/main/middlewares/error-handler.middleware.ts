import logger from '$/logger';
import { ErrorRequestHandler } from 'express';

const errors: Record<string, number> = {
  ValidationError: 400,
  UnauthorizedError: 401,
  NotFoundError: 404,
  ConflitError: 409,
  UnprocessableError: 422
};

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const { name, message } = err;
  const status = errors[name];
  if (status) return res.status(status).json({ message });
  res.sendStatus(500);
  logger.error(err);
};
