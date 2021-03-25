import { Message, TextChannel } from 'discord.js';
import { random } from 'lodash';
import { ICommandMeta } from '../../../helper/commands/ICommand';

function mockCase(string: string) {
  return string
    .split('')
    .map((char) => {
      if (char === ' ') {
        return char;
      }

      const upper = random(1, 3) === 3;

      if (upper) {
        char = char.toUpperCase();
      } else {
        char = char.toLowerCase();
      }

      return char;
    })
    .join('');
}

async function mock(message: Message) {
  const previousMessage = await message.channel.messages
    .fetch({
      before: message.id,
      limit: 1,
    })
    .then((m) => m.first());

  if (!previousMessage?.content) {
    // TODO: Standardise strings and embeds
    return await message.reply('An error occurred');
  }

  const webhooks = await (message.channel as TextChannel).fetchWebhooks();

  await Promise.all([
    webhooks.first().send(mockCase(previousMessage.content), {
      // mock spongebob :)
      avatarURL:
        'https://media.discordapp.net/attachments/423549823229231104/820466971094679553/unknown.png',
      username: mockCase(previousMessage.member?.displayName),
    }),
    message.delete(),
  ]);
}

export default mock;

export const meta: ICommandMeta = {
  help: 'Repeats the last message in mock case',
};
