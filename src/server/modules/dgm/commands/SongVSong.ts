import Command from '../../../utils/Command';
import ICommandDefinition from '../../../utils/ICommandDefinition';
import { Message, TextChannel } from 'discord.js';
import Module from '../../../utils/Module';
import DiscordUtils from '../../../discord/DiscordUtils';
import { shuffle } from 'lodash';
import fetch from 'node-fetch';

class SongVSong extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getDefinition(): ICommandDefinition {
    return {
      name: 'songvsong',
      aliases: ['trackvtrack'],
      description: 'picks two random songs'
    };
  }

  public static async run(channel: TextChannel) {
    const tracks = await fetch(`${process.env.DGM_DATABASE_URL}/track`)
      .then(r => r.json())
      .then(r => r.data);

    let tracksShuffled = shuffle(tracks);

    const track1 = await fetch(
      `${process.env.DGM_DATABASE_URL}/track/${tracksShuffled[0].id}`
    )
      .then(r => r.json())
      .then(r => r.data);

    // Stop some tracks from being matched against others
    if (
      track1.name === 'Coda: I Have A Dream' ||
      track1.name === 'I Have A Dream'
    ) {
      tracksShuffled = tracksShuffled.filter(
        t => t.name !== "Larks' Tongues In Aspic Part IV"
      );
    } else if (track1.name === "Larks' Tongues In Aspic Part IV") {
      tracksShuffled = tracksShuffled.filter(
        t => t.name !== 'Coda: I Have A Dream' && t.name !== 'I Have A Dream'
      );
    }

    const track2 = await fetch(
      `${process.env.DGM_DATABASE_URL}/track/${tracksShuffled[1].id}`
    )
      .then(r => r.json())
      .then(r => r.data);

    const embedMessage = await DiscordUtils.sendEmbed(channel, {
      fields: [
        {
          name: `:regional_indicator_a: ${track1.name}`,
          value: track1.album?.name ?? '-'
        },
        {
          name: `:regional_indicator_b: ${track2.name}`,
          value: track2.album?.name ?? '-'
        }
      ]
    });

    await embedMessage.react('🇦');
    await embedMessage.react('🇧');
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await SongVSong.run(message.channel as TextChannel);
  }
}

export default SongVSong;
