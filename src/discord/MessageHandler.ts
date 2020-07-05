import { Logger } from '../utils/Logger';
import { Message, PartialMessage } from 'discord.js';
import GuildManager from '../database/GuildManager';
import DBMessage from '../database/schema/IMessage';
import Command from '../utils/Command';
import { Collection } from 'mongodb';
import Database from '../database/Database';
import IMessage from '../database/schema/IMessage';

class MessageHandler extends Logger {
  private static instance: MessageHandler;
  private readonly _collection: Collection<IMessage>;

  constructor() {
    super();
    MessageHandler.instance = this;
    this._collection = Database.get().db.collection<IMessage>('messages');

    this.onMessage = this.onMessage.bind(this);
    this.onMessageDelete = this.onMessageDelete.bind(this);
  }

  public static get() {
    return MessageHandler.instance || new MessageHandler();
  }

  public get collection() {
    return this._collection;
  }

  public async onMessage(message: Message) {
    const guildManager = GuildManager.get();
    if (message.guild) {
      const guild = await guildManager.addGuild(message.guild.id);
      if (!guild) {
        throw Error('missing guild');
        // TODO: display error, handle properly
      }

      const prefix = guild.prefix;

      const isCommand = message.content.startsWith(prefix);

      if (guild.logMessages && !isCommand) {
        await this.writeMessage(message);
      } else if (isCommand) {
        const [commandName, ...args] = message.content
          .substring(prefix.length)
          .split(' ');

        const command = Command.getCommand(commandName);

        if (command) {
          await command.run(message, ...args);
        }
      }
    }
  }

  public async writeMessage(message: Message) {
    await this.collection.updateOne(
      { id: message.id },
      {
        $set: this.getMessageDocument(message)
      },
      { upsert: true }
    );
  }

  public async writeMessages(messages: Message[]) {
    const bulk = this.collection.initializeUnorderedBulkOp();
    messages.forEach(message =>
      bulk
        .find({ id: message.id })
        .upsert()
        .update({ $set: this.getMessageDocument(message) })
    );

    await bulk.execute();
  }

  public async onMessageDelete(message: Message | PartialMessage) {
    await this.collection.deleteOne({ id: message.id });
  }

  private getMessageDocument(message: Message) {
    return {
      id: message.id,
      content: message.content,
      authorId: message.author.id,
      channelId: message.channel.id,
      guildId: message.guild?.id,
      timestamp: message.createdTimestamp, // TODO: Use date!
      attachments: message.attachments.map(attachment => ({
        id: attachment.id,
        fileName: attachment.name,
        fileSize: attachment.size,
        width: attachment.width || undefined,
        height: attachment.height || undefined,
        url: attachment.url
      }))
    };
  }
}

export default MessageHandler;
