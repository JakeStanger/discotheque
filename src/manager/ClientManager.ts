import { Client, Prisma } from '@prisma/client';
import ICrud from './ICrud';
import prisma from '../client/prisma';
import Logger from '../utils/logging/LoggerMixin';

class ClientManager
  extends Logger
  implements ICrud<Client, string, Prisma.ClientWhereInput> {
  private static instance: ClientManager;

  private constructor() {
    super();
    ClientManager.instance = this;
  }

  public static get() {
    return ClientManager.instance ?? new ClientManager();
  }

  public async add(data: Prisma.ClientCreateInput): Promise<Client> {
    return prisma.client.create({ data });
  }

  public async delete(id: string) {
    await prisma.client.delete({ where: { id } });
  }

  public async getAll(where?: Prisma.ClientWhereInput) {
    return prisma.client.findMany({ where });
  }

  public async getById(id: string): Promise<Client> {
    return prisma.client.findUnique({ where: { id } });
  }

  public async update(id: string, data: Partial<Client>): Promise<Client> {
    return prisma.client.update({ where: { id }, data });
  }
}

export default ClientManager;
