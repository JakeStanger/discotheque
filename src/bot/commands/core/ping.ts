import { Message } from 'discord.js';
import { ICommandMeta } from '../../../helper/commands/ICommand';

async function ping(message: Message) {
  if (message.content.includes('ping')) {
    await message.reply('pong');
  } else {
    await message.reply('polo');
  }
}

export default ping;

export const meta: ICommandMeta = {
  aliases: ['marco'],
  help: 'pong!',
};
