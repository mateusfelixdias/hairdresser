import UsersServices from '../../services/users';
import IAuthRequestBody from '../../interfaces/auth';
import { NextFunction, Response, Request } from 'express';
import IUserRequestBody from '../../interfaces/users/userRequestBody';
import IUserUpdateRequestBody from '../../interfaces/users/UserUpdateRequestBody';

export default class UsersController {
  private usersServices: UsersServices;

  constructor() {
    this.usersServices = new UsersServices();
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { body }: IAuthRequestBody = request;
      const { email, password } = body;

      const { auth } = this.usersServices;
      const { status, user, token } = await auth.bind(this.usersServices)(
        email,
        password
      );

      if (status !== 200) return response.status(status).end();

      return response.status(status).json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const { body }: IUserRequestBody = request;

      const { status, user } = await this.usersServices.create(body);
      if (status !== 201) return response.status(status).end();

      return response.status(201).json(user).end();
    } catch (err) {
      next(err);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { body }: IUserUpdateRequestBody = request;
      const { userId, file } = request;

      const avatarUrl = file?.filename || '';

      const { status, user } = await this.usersServices.update(
        { ...body, avatarUrl },
        userId
      );

      if (status !== 200) return response.status(status).end();

      return response.status(status).json(user);
    } catch (err) {
      next(err);
    }
  }
}
