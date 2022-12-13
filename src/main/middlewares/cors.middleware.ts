import { RequestHandler } from 'express';

export const corsMiddleware: RequestHandler = (req, res, next) => {
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', '*');
  res.setHeader('access-control-allow-origin', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
};
