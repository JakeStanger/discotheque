import { Message } from 'discord.js';
import { ICommandMeta } from '../../../helper/commands/ICommand';
import ConfigManager from '../../../manager/ConfigManager';
import { DateTime } from 'luxon';

export async function getDates(url: string, uprn: string, usrn: string) {
  const dates = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ uprn, usrn }),
  })
    .then((r) => r.json())
    .then((r) => r.dates)
    .then(JSON.parse);

  const generalDate = DateTime.fromISO(dates.blackBinDay[0]).set({hour: 23});
  const foodDate = DateTime.fromISO(dates.foodBinDay[0]).set({hour: 23});
  const gardenDate = DateTime.fromISO(dates.gardenBinDay[0]).set({hour: 23});
  const recyclingDate = DateTime.fromISO(dates.recyclingBinDay[0]).set({hour: 23})

  return {
    recyclingDate,
    foodDate,
    generalDate,
    gardenDate,
  };
}

async function bins(message: Message) {
  const configManager = ConfigManager.get();

  const url = await configManager
    .getById({
      guildId: message.guild.id,
      key: 'timer.home.bins.apiUrl',
    })
    .then((c) => c.value as string);

  const uprn = await configManager
    .getById({
      guildId: message.guild.id,
      key: 'timer.home.bins.uprn',
    })
    .then((c) => c.value as string);

  const usrn = await configManager
    .getById({
      guildId: message.guild.id,
      key: 'timer.home.bins.usrn',
    })
    .then((c) => c.value as string);

  if (url && uprn && usrn) {
    const dates = await getDates(url, uprn, usrn);
    const format = 'EEE dd';

    await message.channel.send({
      embed: {
        fields: [
          {
            name: ':wastebasket: General',
            value: `**${dates.generalDate.toFormat(
              format
            )}** (${dates.generalDate.toRelative()})`,
          },
          {
            name: ':recycle: Recycling',
            value: `**${dates.recyclingDate.toFormat(
              format
            )}** (${dates.recyclingDate.toRelative()})`,
          },
          {
            name: ':leaves: Garden',
            value: `**${dates.gardenDate.toFormat(
              format
            )}** (${dates.gardenDate.toRelative()})`,
          },
          {
            name: ':meat_on_bone: Food',
            value: `**${dates.foodDate.toFormat(
              format
            )}** (${dates.foodDate.toRelative()})`,
          },
        ],
      },
    });
  }
}

export default bins;

export const meta: ICommandMeta = {
  help: 'Gets dates for next bin collection',
  aliases: ['bindates'],
};
