import { Message, TextChannel } from "discord.js";
import { ICommandMeta } from "../../../helper/commands/ICommand";
import ConfigManager from "../../../manager/ConfigManager";
import { JSDOM } from "jsdom";
import { DateTime } from "luxon";

export async function getDates(url: string) {
  const html = await fetch(url).then(r => r.text());
  const document = new JSDOM(html).window.document;

  const recycling = document.querySelector(".recyclingBinDay .large").textContent;
  const food = document.querySelector(".foodBinDay .large").textContent;
  const general = document.querySelector(".blackBinDay .large").textContent;
  const garden = document.querySelector(".gardenBinDay .large").textContent;

  const format = "EEEE dd MMMM";
  const recyclingDate = DateTime.fromFormat(recycling, format).plus({hours: 23});
  const foodDate = DateTime.fromFormat(food, format).plus({hours: 23});
  const generalDate = DateTime.fromFormat(general, format).plus({hours: 23});
  const gardenDate = DateTime.fromFormat(garden, format).plus({hours: 23});

  return {
    recyclingDate,
    foodDate,
    generalDate,
    gardenDate
  };
}

async function bins(message: Message) {
  const url = await ConfigManager.get().getById({
    guildId: message.guild.id,
    key: 'timer.home.bins.url'
  }).then(c => c.value as string);

  if(url) {
    const dates = await getDates(url);
    const format = "EEE dd";

    await message.channel.send({
      embed: {
        fields: [
          {
            name: ':wastebasket: General',
            value: `**${dates.generalDate.toFormat(format)}** (${dates.generalDate.toRelative()})`,
          },
          {
            name: ':recycle: Recycling',
            value: `**${dates.recyclingDate.toFormat(format)}** (${dates.recyclingDate.toRelative()})`,
          },
          {
            name: ':leaves: Garden',
            value: `**${dates.gardenDate.toFormat(format)}** (${dates.gardenDate.toRelative()})`,
          },
          {
            name: ':meat_on_bone: Food',
            value: `**${dates.foodDate.toFormat(format)}** (${dates.foodDate.toRelative()})`,
          },
        ]
      }
    });
  }
}

export default bins;

export const meta: ICommandMeta = {
  help: 'Gets dates for next bin collection',
  aliases: ['bindates'],
};
