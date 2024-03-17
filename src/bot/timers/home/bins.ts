import { Guild, TextChannel } from "discord.js";
import ConfigManager from "../../../manager/ConfigManager";
import { ITimerMetadata } from "../../../helper/timers/ITimer";
import { JSDOM } from "jsdom";
import { DateTime } from "luxon";
import { getDates } from "../../commands/home/bins";

export async function bins(guild: Guild) {
  const configManager = ConfigManager.get();

  const channelId = await configManager
    .getById({
      guildId: guild.id,
      key: 'timer.home.bins.channel',
    })
    .then((c) => c.value as string);

  const url = await configManager.getById({
    guildId: guild.id,
    key: 'timer.home.bins.url'
  }).then(c => c.value as string);

  if(channelId && url) {
    const channel = (await guild.channels.resolve(channelId)) as TextChannel;
    const dates = await getDates(url);

    if(dates.generalDate.diffNow('days').as('days') < 1.5) {
      await channel.send({
        embed: {
          title: ':wastebasket: General waste tomorrow',
          color: '#000000'
        }
      });
    }

    if(dates.recyclingDate.diffNow('days').as('days') < 1.5) {
      await channel.send({
        embed: {
          title: ':recycle: Recycling tomorrow',
          color: '#1c7db5'
        }
      });
    }

    if(dates.gardenDate.diffNow('days').as('days') < 1.5) {
      await channel.send({
        embed: {
          title: ':leaves: Garden waste tomorrow',
          color: '#468300'
        }
      });
    }

    if(dates.foodDate.diffNow('days').as('days') < 1.5) {
      await channel.send({
        embed: {
          title: ':meat_on_bone: Food waste tomorrow',
          color: '#585858'
        }
      });
    }
  }
}

export default bins;

export const meta: ITimerMetadata = {
  pattern: '0 15 * * *',
  help: 'Runs the bin checker daily',
  ensureConfig: {
    channel: '',
  },
};
