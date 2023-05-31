import { NextFunction, Request, Response } from 'express';

export default function handleError(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof Error) {
    const message = error.message;

    return response.status(400).json({
      message,
    });
  }

  return response.status(500).json('Internal Server Error!');
}
