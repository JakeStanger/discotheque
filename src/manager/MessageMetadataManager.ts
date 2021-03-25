import ICrud from './ICrud';
import { MessageMetadata } from '@prisma/client';
import prisma from '../client/prisma';
import { Prisma } from '@prisma/client';

type Key = Prisma.MessageMetadataKeyMessageIdCompoundUniqueInput;

class MessageMetadataManager
  implements ICrud<MessageMetadata, Key, Prisma.MessageMetadataWhereInput> {
  private static instance: MessageMetadataManager;

  private constructor() {
    MessageMetadataManager.instance = this;
  }

  public static get() {
    return MessageMetadataManager.instance ?? new MessageMetadataManager();
  }

  public async add(data: MessageMetadata): Promise<MessageMetadata> {
    return prisma.messageMetadata.create({ data });
  }

  public async delete(id: Key) {
    await prisma.messageMetadata.delete({ where: { key_messageId: id } });
  }

  public async getAll(
    where?: Prisma.ConfigWhereInput
  ): Promise<MessageMetadata[]> {
    return prisma.messageMetadata.findMany({ where });
  }

  public async getById(id: Key): Promise<MessageMetadata> {
    return prisma.messageMetadata.findUnique({ where: { key_messageId: id } });
  }

  public async update(
    id: Key,
    data: Partial<MessageMetadata>
  ): Promise<MessageMetadata> {
    return prisma.messageMetadata.update({
      where: { key_messageId: id },
      data,
    });
  }
}

export default MessageMetadataManager;
