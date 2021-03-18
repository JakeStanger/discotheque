import module from '../../decorators/module';
import Module from '../../utils/Module';
import SongVSong from './commands/SongVSong';
import { CronJob } from 'cron';
import GuildManager from '../../database/GuildManager';
import { TextChannel } from 'discord.js';

@module
class DGM extends Module {
  constructor() {
    super();

    this.addCommands([SongVSong]);

    const job = new CronJob({
      cronTime: '0 13 * * *',
      onTick: async () => {
        const guildConfigs = await this.getConfigs().then(configs =>
          configs.filter(c => !!c?.settings?.has('songVSongChannel'))
        );

        await Promise.all(
          guildConfigs.map(async (config, guildId) => {
            const channelId: string = config?.settings?.get('songVSongChannel');
            const guild = await GuildManager.get().getDiscordGuild(guildId);
            const channel = guild?.channels.resolve(channelId) as TextChannel;

            await SongVSong.run(channel);
          })
        );
      }
    });

    job.start();
  }

  getDescription(): string {
    return 'Functions for interacting with DGM database';
  }

  getIdentifier(): string {
    return 'dgm';
  }

  getLink(): string | undefined {
    return undefined;
  }

  getName(): string {
    return 'DGM';
  }
}

export default DGM;
