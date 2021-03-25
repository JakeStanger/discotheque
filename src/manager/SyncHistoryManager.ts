import ICrud from './ICrud';
import { SyncHistory } from '@prisma/client';
import prisma from '../client/prisma';
import { Prisma } from '@prisma/client';

type Key = Prisma.SyncHistoryChannelIdDateCompoundUniqueInput;

class SyncHistoryManager
  implements ICrud<SyncHistory, Key, Prisma.ConfigWhereInput> {
  private static instance: SyncHistoryManager;

  private constructor() {
    SyncHistoryManager.instance = this;
  }

  public static get() {
    return SyncHistoryManager.instance ?? new SyncHistoryManager();
  }

  public async add(data: SyncHistory): Promise<SyncHistory> {
    return prisma.syncHistory.create({ data });
  }

  public async delete(id: Key) {
    await prisma.syncHistory.delete({ where: { channelId_date: id } });
  }

  public async getAll(
    where?: Prisma.SyncHistoryWhereInput
  ): Promise<SyncHistory[]> {
    return prisma.syncHistory.findMany({ where });
  }

  public async getById(id: Key): Promise<SyncHistory> {
    return prisma.syncHistory.findUnique({ where: { channelId_date: id } });
  }

  public async update(
    id: Key,
    data: Partial<SyncHistory>
  ): Promise<SyncHistory> {
    return prisma.syncHistory.update({
      where: { channelId_date: id },
      data,
    });
  }

  public async getLast(channelId: string) {
    return prisma.syncHistory.findFirst({
      where: { channelId },
      orderBy: { date: 'desc' },
    });
  }
}

export default SyncHistoryManager;
