import { Message, Prisma } from '@prisma/client';
import { Message as DiscordMessage } from 'discord.js';

import ICrud, { UpdatePartial } from './ICrud';
import prisma from '../client/prisma';
import Logger from '../utils/logging/LoggerMixin';
import Collection from '@discordjs/collection';
import ICommand from '../helper/commands/ICommand';

class MessageManager
  extends Logger
  implements ICrud<Message, string, Prisma.MessageWhereInput> {
  private static instance: MessageManager;

  private commands: Collection<string, ICommand> = new Collection();

  private constructor() {
    super();
    MessageManager.instance = this;
  }

  public static get() {
    return MessageManager.instance ?? new MessageManager();
  }

  public static discordToDatabase(
    message: DiscordMessage
  ): UpdatePartial<Message> {
    const validContent = message.content.replace(/\0/g, '');

    return {
      id: message.id,
      authorId: message.author.id,
      channelId: message.channel.id,
      guildId: message.guild.id,
      content: validContent,
      attachments: message.attachments.map((a) => a.url),
      timestamp: new Date(message.createdTimestamp),
    };
  }

  public async add(data: UpdatePartial<Message>): Promise<Message> {
    return prisma.message.create({ data });
  }

  public async addMany(
    data: UpdatePartial<Message>[]
  ): Promise<Prisma.BatchPayload> {
    return prisma.message.createMany({ data, skipDuplicates: true });
  }

  public async delete(id: string) {
    // use deleteMany to avoid error if message doesn't exist
    await prisma.message.deleteMany({ where: { id } });
  }

  public async getAll(where: Prisma.MessageWhereInput): Promise<Message[]> {
    return prisma.message.findMany({ where });
  }

  public async getById(id: string): Promise<Message> {
    return prisma.message.findUnique({ where: { id } });
  }

  public async update(id: string, data: Partial<Message>): Promise<Message> {
    return prisma.message.update({ where: { id }, data });
  }
}

export default MessageManager;
