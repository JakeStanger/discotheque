import Command from '../../../utils/Command';
import { GuildMember, Message } from 'discord.js';
import Module from '../../../utils/Module';
import { DateTime } from 'luxon';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { map, maxBy, startCase, sortBy } from 'lodash';
import DiscordUtils from '../../../discord/DiscordUtils';
import IMessage, {
  Message as DBMessage
} from '../../../database/schema/IMessage';
import ICommandDefinition from '../../../utils/ICommandDefinition';

class Backlog extends Command {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'backlog',
      description:
        'Generates a summary of messages in a channel since you last spoke.'
    };
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    const channelId =
      message.mentions.channels.first()?.id || message.channel.id;

    const user: GuildMember | null =
      message.mentions.members?.first() || message.member;

    if (!user) {
      await DiscordUtils.sendError(
        message.channel,
        'This command can only be used from inside a server'
      );
      return;
    }

    const fiveMinutesAgo = DateTime.local()
      .minus({ minutes: 5 })
      .toJSDate();

    const botMessage = await DiscordUtils.sendOngoing(
      message.channel,
      'Hold tight...'
    );

    const messages = DBMessage.collection;

    // Get the last message outside of the last 5 minutes
    const lastMessage = (
      await messages
        .find(
          {
            authorId: user.id,
            channelId,
            timestamp: { $lt: fiveMinutesAgo.valueOf() }
          },
          { limit: 1, sort: { timestamp: -1 } }
        )
        .toArray()
    )[0];

    const backlogMessages: IMessage[] = await messages
      .find({
        channelId,
        timestamp: { $gt: lastMessage!.timestamp }
      })
      .toArray();

    // Watson has a 50k character limit, we're only interested in the recent section of the backlog
    const backlogText = backlogMessages
      .map(msg => msg.content)
      .join('\n')
      .slice(-50_000);

    const API_KEY = process.env.WATSON_NAR_KEY!;
    const URL = process.env.WATSON_NAR_URL!;

    const nlu = new NaturalLanguageUnderstandingV1({
      authenticator: new IamAuthenticator({ apikey: API_KEY }),
      version: '2018-04-05',
      url: URL
    });

    const analysis = await nlu
      .analyze({
        text: backlogText,
        features: {
          sentiment: {},
          emotion: {},
          categories: {},
          concepts: {},
          entities: {},
          keywords: {}
        },
        language: 'en'
      })
      .then(res => res.result)
      .catch(console.error);

    if (!analysis) {
      await DiscordUtils.sendError(botMessage, 'An error occurred!');
      return;
    }

    const sentiment = analysis.sentiment?.document?.label;
    const keywords = sortBy(analysis.keywords, [
      kw => -(kw.count || 0),
      kw => -(kw.relevance || 0)
    ])
      .slice(0, 5)
      .map(kw => startCase(kw.text))
      .join(', ');

    const entities = sortBy(analysis.entities, [
      ent => -(ent.count || 0),
      ent => -(ent.relevance || 0)
    ])
      .slice(0, 5)
      .map(ent => startCase(ent.text))
      .join(', ');

    const concepts = analysis.concepts
      ?.filter(con => con.relevance && con.relevance > 0.85)
      .map(con => startCase(con.text))
      .join(', ');

    const categories = analysis.categories
      ?.filter(cat => cat.score && cat.score > 0.85)
      .map(cat => startCase(cat.label?.substr(1)))
      .join(', ');

    const [_strength, emotion] = maxBy(
      map(analysis.emotion!.document!.emotion, (v, k) => [v, k]),
      v => v[0]
    ) || [0, undefined];

    const friendlyTimestamp = DateTime.fromJSDate(
      new Date(lastMessage!.timestamp!)
    ).toFormat('dd MMM HH:mm');

    await DiscordUtils.sendEmbed(botMessage, {
      title: `Backlog since ${friendlyTimestamp}`,
      description: `You have missed **${
        backlogMessages.length
      }** messages. The ${
        backlogText.length === 50_000 ? 'recent ' : ''
      }discussion has been mostly **${sentiment}** with feelings of **${emotion}**. Here were the main topics:`,
      color: user.displayColor,
      fields: [
        {
          name: 'Keywords',
          value: keywords
        },
        {
          name: 'Entities',
          value: entities
        },
        {
          name: 'Concepts',
          value: concepts
        },
        {
          name: 'Categories',
          value: categories
        }
      ].filter(field => field.value)
    });
  }
}

export default Backlog;
