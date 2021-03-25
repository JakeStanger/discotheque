import ICrud from './ICrud';
import { Config } from '@prisma/client';
import prisma from '../client/prisma';
import { Prisma } from '@prisma/client';
import cache from '../utils/caching/cache';

type Key = Prisma.ConfigKeyGuildIdCompoundUniqueInput;

class ConfigManager implements ICrud<Config, Key, Prisma.ConfigWhereInput> {
  private static instance: ConfigManager;

  private constructor() {
    ConfigManager.instance = this;
  }

  public static get() {
    return ConfigManager.instance ?? new ConfigManager();
  }

  public async add(data: Config): Promise<Config> {
    return prisma.config.create({ data });
  }

  public async delete(id: Key) {
    await prisma.config.delete({ where: { key_guildId: id } });
  }

  public async getAll(where?: Prisma.ConfigWhereInput): Promise<Config[]> {
    return prisma.config.findMany({ where });
  }

  @cache()
  public async getById(id: Key): Promise<Config> {
    return prisma.config.findUnique({ where: { key_guildId: id } });
  }

  public async update(id: Key, data: Partial<Config>): Promise<Config> {
    return prisma.config.update({ where: { key_guildId: id }, data });
  }

  public async ensure(id: Key, value: Prisma.InputJsonValue) {
    return prisma.config.upsert({
      where: { key_guildId: id },
      update: {},
      create: { key: id.key, guildId: id.guildId, value },
    });
  }
}

export default ConfigManager;
