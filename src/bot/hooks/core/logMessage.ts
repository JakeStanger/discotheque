import ConfigManager from '../../../manager/ConfigManager';
import MessageManager from '../../../manager/MessageManager';
import { Message } from 'discord.js';
import { IHookMetadata } from '../../../helper/hooks/IHook';

async function logMessage(message: Message) {
  const guildLogChannels = await ConfigManager.get().getById({
    key: 'logChannels',
    guildId: message.guild.id,
  });

  if ((guildLogChannels.value as string[]).includes(message.channel.id)) {
    await MessageManager.get().add(MessageManager.discordToDatabase(message));
  }
}

export const meta: IHookMetadata = {
  event: 'message',
  help: 'Logs a new message to the database',
};

export default logMessage;
