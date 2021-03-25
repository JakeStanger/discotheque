import { MessageEmbed, MessageReaction, TextChannel } from 'discord.js';
import { IHookMetadata } from '../../../helper/hooks/IHook';
import ConfigManager from '../../../manager/ConfigManager';
import MessageMetadataManager from '../../../manager/MessageMetadataManager';

async function pin(react: MessageReaction) {
  const PUSHPIN = '%F0%9F%93%8C';
  if (react.emoji.identifier !== PUSHPIN) {
    return;
  }

  let message = await react.message;

  const pinChannelId = await ConfigManager.get()
    .getById({
      key: 'hook.fun.pin.channel',
      guildId: message.guild.id,
    })
    .then((c) => c.value);

  if (!pinChannelId || message.channel.id === pinChannelId) {
    return;
  }

  const requiredCount = await ConfigManager.get()
    .getById({
      key: 'hook.fun.pin.count',
      guildId: message.guild.id,
    })
    .then((c) => c.value);

  if (react.partial) {
    react = await react.fetch();
  }

  if (react.count >= requiredCount) {
    const metadataManager = MessageMetadataManager.get();

    const pinned = await metadataManager
      .getById({
        messageId: message.id,
        key: 'pinned',
      })
      .then((m) => m?.value);

    if (!pinned) {
      if (message.partial) {
        message = await message.fetch();
      }

      const pinChannel = message.guild.channels.resolve(
        pinChannelId as string
      ) as TextChannel;

      const MAX_UPLOAD_SIZE = 8_000_000;

      const description = [
        message.content,
        message.attachments
          .filter((a) => a.size > MAX_UPLOAD_SIZE)
          .map((a) => `[${a.name || a.url}](${a.url})`),
        `[Message Link](${message.url})`,
      ]
        .join('\n\n')
        .trim();

      const embed = new MessageEmbed()
        .setAuthor(message.member?.displayName)
        .setThumbnail(
          message.author.avatarURL({ size: 32 }) ||
            message.author.defaultAvatarURL
        )
        .setColor(message.member?.displayColor || 0)
        .setTimestamp(message.createdTimestamp)
        .attachFiles(
          message.attachments.filter((a) => a.size < MAX_UPLOAD_SIZE).array()
        )
        .setDescription(description);

      await pinChannel.send(embed);

      await metadataManager.add({
        key: 'pinned',
        messageId: message.id,
        value: true,
      });
    }
  }
}

export default pin;

export const meta: IHookMetadata = {
  event: 'messageReactionAdd',
  help: 'Copies a message to a pin channel when it gets enough pin reacts',
  ensureConfig: {
    channel: '',
    count: 10,
  },
};
