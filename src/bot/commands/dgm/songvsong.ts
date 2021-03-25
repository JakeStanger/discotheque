import { ICommandMeta } from '../../../helper/commands/ICommand';
import { Message, TextChannel } from 'discord.js';
import { shuffle } from 'lodash';
import fetch from 'node-fetch';

export async function run(channel: TextChannel) {
  const tracks = await fetch(`${process.env.DGM_DATABASE_URL}/track`)
    .then((r) => r.json())
    .then((r) => r.data);

  let tracksShuffled = shuffle(tracks);

  const track1 = await fetch(
    `${process.env.DGM_DATABASE_URL}/track/${tracksShuffled[0].id}`
  )
    .then((r) => r.json())
    .then((r) => r.data);

  // Stop some tracks from being matched against others
  if (
    track1.name === 'Coda: I Have A Dream' ||
    track1.name === 'I Have A Dream'
  ) {
    tracksShuffled = tracksShuffled.filter(
      (t) => t.name !== "Larks' Tongues In Aspic Part IV"
    );
  } else if (track1.name === "Larks' Tongues In Aspic Part IV") {
    tracksShuffled = tracksShuffled.filter(
      (t) => t.name !== 'Coda: I Have A Dream' && t.name !== 'I Have A Dream'
    );
  }

  const track2 = await fetch(
    `${process.env.DGM_DATABASE_URL}/track/${tracksShuffled[1].id}`
  )
    .then((r) => r.json())
    .then((r) => r.data);

  const embedMessage = await channel.send({
    embed: {
      fields: [
        {
          name: `:regional_indicator_a: ${track1.name}`,
          value: track1.album?.name ?? '-',
        },
        {
          name: `:regional_indicator_b: ${track2.name}`,
          value: track2.album?.name ?? '-',
        },
      ],
    },
  });

  await embedMessage.react('🇦');
  await embedMessage.react('🇧');
}

async function songVSong(message: Message) {
  await run(message.channel as TextChannel);
}

export default songVSong;

export const meta: ICommandMeta = {
  help: 'Picks two random King Crimson songs',
  aliases: ['songvssong', 'trackvtrack', 'trackvstrack'],
};
