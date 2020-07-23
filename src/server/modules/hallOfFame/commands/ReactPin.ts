import Command from '../../../utils/Command';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Module from '../../../utils/Module';
import GuildManager from '../../../database/GuildManager';
import ICommandDefinition from '../../../utils/ICommandDefinition';
import MessageHandler from '../../../discord/MessageHandler';

class ReactPin extends Command {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'react:pushpin',
      description: 'Pins a message'
    };
  }

  public async run(message: Message, identifier: string): Promise<void> {
    if (!message.guild) {
      return;
    }
    const guild = await GuildManager.get().getGuild(message.guild.id);
    const config = guild ? this.module.getConfig(guild)?.settings : undefined;

    if (!config?.get('pinChannel')) {
      return; // TODO: Warn?
    }

    const dbMessage = await MessageHandler.get().getMessage(message);
    if (dbMessage?.metadata?.get('pinned')) {
      return; // already pinned
    }

    const requiredPinCount = config?.get('reactCount') || 3;

    const reactCount =
      message.reactions.cache.find(r => r.emoji.identifier === identifier)
        ?.count || 0;

    if (reactCount >= requiredPinCount) {
      await MessageHandler.get().addMetadata(message, 'pinned', true);

      const pinChannel = (await message.guild?.channels.resolve(
        config.get('pinChannel')!
      )) as TextChannel;

      const MAX_UPLOAD_SIZE = 8_000_000;

      const description = [
        message.content,
        message.attachments
          .filter(a => a.size > MAX_UPLOAD_SIZE)
          .map(a => `[${a.name || a.url}](${a.url})`),
        `[Message Link](${message.url})`
      ]
        .join('\n\n')
        .trim();

      const embed = new MessageEmbed()
        .setAuthor(message.member?.nickname || message.author.username)
        .setThumbnail(
          message.author.avatarURL({ size: 32 }) ||
            message.author.defaultAvatarURL
        )
        .setColor(message.member?.displayColor || 0)
        .setTimestamp(message.createdTimestamp)
        .attachFiles(
          message.attachments.filter(a => a.size < MAX_UPLOAD_SIZE).array()
        )
        .setDescription(description);

      await pinChannel.send(embed);
    }
  }
}

export default ReactPin;
