import { Logger } from '../utils/Logger';
import {
  Message,
  MessageReaction,
  PartialMessage,
  TextChannel
} from 'discord.js';
import GuildManager from '../database/GuildManager';
import Command from '../utils/Command';
import { Message as DBMessage } from '../database/schema/IMessage';
import * as emojiMap from 'emoji-unicode-map';
import DiscordUtils from './DiscordUtils';

class MessageHandler extends Logger {
  private static instance: MessageHandler;

  constructor() {
    super();
    MessageHandler.instance = this;

    this.onMessage = this.onMessage.bind(this);
    this.onMessageDelete = this.onMessageDelete.bind(this);
  }

  public static get() {
    return MessageHandler.instance || new MessageHandler();
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

        const guild = await GuildManager.get().getGuild(message.guild!.id);
        if (!guild) {
          await DiscordUtils.sendError(
            message.channel,
            'Could not find config for guild'
          );
          return;
        }

        const command = await Command.getCommand(commandName, guild);

        if (command) {
          if (command.nsfw && !(message.channel as TextChannel).nsfw) {
            await DiscordUtils.sendError(
              message.channel,
              'You can only use this command in NSFW channels'
            );
            return;
          }

          if (
            command.admin &&
            !message.member?.hasPermission('ADMINISTRATOR')
          ) {
            await DiscordUtils.sendError(
              message.channel,
              'You must be an administrator to use this command'
            );
            return;
          }

          await command.run(message, ...args);
        }
      }
    }
  }

  public async onMessageReact(reaction: MessageReaction) {
    if (!reaction.message.guild) {
      return;
    }

    const guild = await GuildManager.get().getGuild(reaction.message.guild!.id);
    if (!guild) {
      await DiscordUtils.sendError(
        reaction.message.channel,
        'Could not find config for guild'
      );
      return;
    }

    if (reaction.partial) {
      reaction = await reaction.fetch();
    }

    const identifier = reaction.emoji.identifier;
    const name = emojiMap.get(decodeURIComponent(identifier));
    const command = await Command.getCommand(`react:${name}`, guild);

    if (command) {
      await command.run(reaction.message, identifier);
    }
  }

  public async writeMessage(message: Message) {
    await DBMessage.updateOne(
      { id: message.id },
      {
        $set: this.getMessageDocument(message)
      },
      { upsert: true }
    );
  }

  public async writeMessages(messages: Message[]) {
    const bulk = DBMessage.collection.initializeUnorderedBulkOp();
    messages.forEach(message =>
      bulk
        .find({ id: message.id })
        .upsert()
        .update({ $set: this.getMessageDocument(message) })
    );

    await bulk.execute();
  }

  public async onMessageDelete(message: Message | PartialMessage) {
    await DBMessage.deleteOne({ id: message.id });
  }

  private getMessageDocument(message: Message) {
    return {
      id: message.id,
      content: message.content,
      authorId: message.author.id,
      channelId: message.channel.id,
      guildId: message.guild?.id,
      timestamp: message.createdTimestamp,
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
