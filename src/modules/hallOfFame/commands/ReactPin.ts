import Command from '../../../utils/Command';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Module from '../../../utils/Module';
import GuildManager from '../../../database/GuildManager';

class ReactPin extends Command {
  public readonly admin = false;
  public readonly nsfw = false;

  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Pins a message';
  }

  public getName(): string {
    return 'react:pushpin'; // TODO: Make configurable
  }

  public async run(message: Message, identifier: string): Promise<void> {
    if (!message.guild) {
      return;
    }
    const guild = await GuildManager.get().getGuild(message.guild.id);
    const config = guild ? this.module.getConfig(guild)?.settings : undefined;

    console.log(this.module.getConfig(guild!));

    if (!config?.get('pinChannel')) {
      return; // TODO: Warn?
    }

    const requiredPinCount = config?.get('reactCount') || 3;

    const reactCount =
      message.reactions.cache.find(r => r.emoji.identifier === identifier)
        ?.count || 0;

    if (reactCount >= requiredPinCount) {
      const pinChannel = (await message.guild?.channels.resolve(
        config.get('pinChannel')!
      )) as TextChannel;

      const embed = new MessageEmbed()
        .setAuthor(message.member?.nickname)
        .setThumbnail(
          message.author.avatarURL({ size: 32 }) ||
            message.author.defaultAvatarURL
        )
        .setColor(message.member?.displayColor || 0)
        .setTimestamp(message.createdTimestamp)
        .attachFiles(message.attachments.array())
        .setDescription(message.content);

      await pinChannel.send(embed);
    }
  }
}

export default ReactPin;
