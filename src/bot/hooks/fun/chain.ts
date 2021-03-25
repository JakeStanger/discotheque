import { Message } from 'discord.js';
import { IHookMetadata } from '../../../helper/hooks/IHook';
import ConfigManager from '../../../manager/ConfigManager';

let messageChain: Message[] = [];

async function chain(message: Message) {
  const lastInChain = messageChain[messageChain.length - 1];
  if (
    !lastInChain ||
    (lastInChain.content.toLowerCase() === message.content.toLowerCase() &&
      lastInChain.channel.id === message.channel.id &&
      lastInChain.author.id !== message.author.id &&
      message.author.id !== message.client.user.id)
  ) {
    messageChain.push(message);
  } else {
    messageChain = [message];
    return;
  }

  const trigger = await ConfigManager.get()
    .getById({
      key: 'hook.fun.chain.trigger',
      guildId: message.guild.id,
    })
    .then((c) => c.value);

  if (messageChain.length >= trigger) {
    await message.channel.send(message.content);
  }
}

export default chain;

export const meta: IHookMetadata = {
  event: 'message',
  help:
    'Joins in a chain when the same message is posted multiple times by multiple people in a row.',
  ensureConfig: {
    trigger: 3,
  },
};
