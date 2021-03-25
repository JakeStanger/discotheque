import { Guild, Prisma } from '@prisma/client';
import prisma from '../client/prisma';
import ICrud from './ICrud';
import cache from '../utils/caching/cache';

class GuildManager implements ICrud<Guild, string, Prisma.GuildWhereInput> {
  private static instance: GuildManager;

  private constructor() {
    GuildManager.instance = this;
  }

  public static get() {
    return GuildManager.instance ?? new GuildManager();
  }

  public async getAll(where?: Prisma.GuildWhereInput) {
    return prisma.guild.findMany({ where });
  }

  @cache()
  public async getById(id: string): Promise<Guild | undefined> {
    return prisma.guild.findUnique({ where: { id } });
  }

  public async getGuildsByClientId(clientId: string): Promise<Guild[]> {
    return prisma.guild.findMany({ where: { clientId } });
  }

  public async add(guild: Guild) {
    return prisma.guild.create({ data: guild });
  }

  public async update(id: string, data: Guild) {
    return prisma.guild.update({ where: { id }, data });
  }

  public async ensure(id: string, clientId: string) {
    return prisma.guild.upsert({
      where: { id },
      update: {},
      create: { id, clientId },
    });
  }

  public async delete(id: string) {
    return prisma.guild.delete({ where: { id } });
  }
}

export default GuildManager;
