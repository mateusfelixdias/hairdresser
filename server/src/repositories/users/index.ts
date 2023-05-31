import prisma from '../../database/prisma';
import IUser from '../../interfaces/users/user';
import IUserUpdate from '../../interfaces/users/userUpdate';

export default class UsersRepository {
  async create(data: IUser) {
    const user = await prisma.users.create({ data });

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    return user;
  }

  async findUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    return user;
  }

  async update(data: IUserUpdate, userId: string) {
    const { avatarUrl, name } = data;

    const update = await prisma.users.update({
      where: { id: userId },
      data: { name, avatarUrl },
    });

    return update;
  }

  async updatePassword(newPassword: string, userId: string) {
    const update = await prisma.users.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    return update;
  }
}
