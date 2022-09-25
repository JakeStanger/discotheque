import { ICommandMeta } from '../../../helper/commands/ICommand';
import { Message, MessageEmbed } from 'discord.js';
import ConfigManager from '../../../manager/ConfigManager';
import { shuffle } from 'lodash';
import prisma from '../../../client/prisma';
import { Message as DBMessage } from '@prisma/client';

async function randomPin(message: Message) {
  const pinChannelId = await ConfigManager.get()
    .getById({
      // lazy - just use the hook's channel
      key: 'hook.fun.pin.channel',
      guildId: message.guild.id,
    })
    .then((c) => c.value);

  if (!pinChannelId || message.channel.id === pinChannelId) {
    return;
  }

  const messages = await prisma.message.findMany({
    where: { channelId: pinChannelId as string },
  });

  const randMessage: DBMessage = shuffle(messages)[0];

  if (randMessage.attachments?.length) {
    await message.channel.send(
      `<t:${Math.round(randMessage.timestamp.getTime() / 1000)}:D>`,
      {
        files: randMessage.attachments,
      }
    );
  } else {
    const embed = new MessageEmbed().setTimestamp(randMessage.timestamp);

    await message.reply(embed);
  }
}

export default randomPin;

export const meta: ICommandMeta = {
  help: 'Gets a random message from the pinned messages channel',
};
