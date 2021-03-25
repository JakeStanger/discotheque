import { ITimerMetadata } from '../../../helper/timers/ITimer';
import { Guild, TextChannel } from 'discord.js';
import ConfigManager from '../../../manager/ConfigManager';
import { run } from '../../commands/dgm/songvsong';

async function songvsong(guild: Guild) {
  const channelId = await ConfigManager.get()
    .getById({
      guildId: guild.id,
      key: 'timer.dgm.songvsong.channel',
    })
    .then((c) => c.value as string);

  if (channelId) {
    const channel = (await guild.channels.resolve(channelId)) as TextChannel;
    await run(channel);
  }
}

export default songvsong;

export const meta: ITimerMetadata = {
  pattern: '0 13 * * *',
  help: 'Runs the songvsong command daily',
  ensureConfig: {
    channel: '',
  },
};
