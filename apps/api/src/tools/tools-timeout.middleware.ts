import { Request, Response, NextFunction } from 'express';

export function toolsTimeoutMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setTimeout(60000 * 10);

  next();
}
