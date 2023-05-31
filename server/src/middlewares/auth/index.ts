import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export default class AuthMiddleware {
  auth(request: Request, response: Response, next: NextFunction) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return response.status(401).end();

      const [, token] = authHeader.split(' ');

      const keyToken = process.env.ACCESS_KEY_TOKEN;
      if (!keyToken) throw new Error('Access key token not found');

      const { sub } = verify(token, keyToken);
      request.userId = sub as string;

      return next();
    } catch (err) {
      console.log(err);
      return response.status(401).end();
    }
  }
}
