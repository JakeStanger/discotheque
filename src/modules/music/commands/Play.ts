import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message } from 'discord.js';
import * as ytdl from 'ytdl-core';
import * as youtubeSearch from 'youtube-search';
import DiscordUtils from '../../../discord/DiscordUtils';
import Music from '../Music';

class Play extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Plays audio, or searches YouTube for a query.';
  }

  public getName(): string {
    return 'play';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    if (!message.guild) {
      await DiscordUtils.sendError(
        message,
        'You can only join voice inside servers'
      );
      return;
    }

    let query = args.join(' ');
    if (query.includes(' ')) {
      const pending = await DiscordUtils.sendOngoing(
        message.channel,
        'Hold on...'
      );
      const results = await Play.search(query);

      await DiscordUtils.sendEmbed(pending, {
        description: results
          .map((result, i) => `${i + 1}. ${unescape(result.title)}`)
          .join('\n')
      });

      const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
      for (const result in results) {
        await pending.react(numbers[result]);
      }

      const selection = await pending
        .awaitReactions(
          (r, u) =>
            numbers.includes(r.emoji.name) && u.id === message.author.id,
          { time: 60_000, errors: ['time'], max: 1 }
        )
        .then(collected => collected.first()?.emoji.name)
        .catch(console.error); // TODO: send timeout error

      if (!selection) return;
      query = results[numbers.indexOf(selection)].link;
    }

    const music = this.module as Music;
    const connection = await music.getConnection(message);
    if (!connection) return;

    if (/^https:\/\/(?:www.)?youtube.com/.test(query)) {
      music.play(ytdl(query, { filter: 'audioonly' }), message.guild);
    } else {
      music.play(query, message.guild);
    }
  }

  private static async search(query: string) {
    return await youtubeSearch(query, {
      key: process.env.YOUTUBE_KEY,
      maxResults: 5 // TODO: Make configurable (up to 9)
    }).then(r => r.results);
  }
}

export default Play;
