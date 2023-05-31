import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import IUser from '../../interfaces/users/user';
import UsersRepository from '../../repositories/users';
import IUserUpdate from '../../interfaces/users/userUpdate';

export default class UsersServices {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async auth(email: string, password: string) {
    try {
      const { findUserByEmail } = this.usersRepository;

      const user = await findUserByEmail(email);
      if (!user) return { status: 404 };

      const passwordWithHash = user.password;
      const comparePassword = await bcrypt.compare(password, passwordWithHash);

      if (!comparePassword) return { status: 400 };

      const keyToken = process.env.ACCESS_KEY_TOKEN;
      if (!keyToken) throw new Error('Access key token not found');

      const token = sign({ email }, keyToken, {
        subject: user.id,
        expiresIn: '1h',
      });

      return { status: 200, user, token };
    } catch (err) {
      return { status: 500 };
    }
  }

  async create(data: IUser) {
    try {
      const { email, password } = data;
      const { create, findUserByEmail } = this.usersRepository;

      const hasUser = await findUserByEmail(email);
      if (hasUser) return { status: 409 };

      const hash = bcrypt.hashSync(password, 10);
      const user = await create({ ...data, password: hash });

      if (!user) return { status: 400 };
      return { user, status: 201 };
    } catch (err) {
      return { status: 500 };
    }
  }

  async update(data: IUserUpdate, userId: string) {
    try {
      const { newPassword, oldPassword } = data;
      const { findUserById, update, updatePassword } = this.usersRepository;

      const user = await findUserById(userId);
      if (!user) return { status: 404 };

      if (oldPassword && newPassword) {
        if (oldPassword === newPassword) return { status: 409 };

        const { password } = user;

        const comparePassword = await bcrypt.compare(oldPassword, password);
        if (!comparePassword) return { status: 400 };

        const hash = bcrypt.hashSync(newPassword, 10);
        await updatePassword(hash, userId);
      }

      const userUpdated = await update(data, userId);
      return { status: 200, user: userUpdated };
    } catch (err) {
      return { status: 500 };
    }
  }
}
