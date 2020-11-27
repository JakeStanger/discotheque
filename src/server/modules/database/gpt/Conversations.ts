import { GPTConversation } from '../../../database/schema/IGPTConversation';
import IModuleConfiguration from '../../../database/schema/IModuleConfiguration';
import GuildManager from '../../../database/GuildManager';
import { Guild, GuildMember, TextChannel } from 'discord.js';
import { random } from 'lodash';
import Log from '../../../utils/Logger';
import * as kleur from 'kleur';

async function getAuthor(guild: Guild, id: string) {
  try {
    return await guild?.members.fetch(id);
  } catch {
    return guild.members.fetch(guild.client.user!.id);
  }
}

export async function runConversation(
  config: IModuleConfiguration | undefined,
  guildId: string
) {
  const logger = Log.get('GPT-2');

  if (!config?.settings) {
    return;
  }

  const mimicChannelId = config.settings.get('gptMimicChannel');

  const conversation = await GPTConversation.findOne({
    channelId: config.settings.get('gptConversationChannel'),
    used: { $ne: true }
  });

  if (!conversation) {
    logger.warn(`No conversations for guild ${kleur.magenta(guildId)}`);
    return;
  }

  const guild = await GuildManager.get().getDiscordGuild(guildId);

  if (!guild) {
    logger.error(`Could not find guild with ID ${kleur.magenta(guildId)}.`);
    return;
  }

  const channel = (await guild.client.channels.fetch(
    mimicChannelId
  )) as TextChannel;

  const webhook = await channel
    .fetchWebhooks()
    .then(hooks => hooks.first() || channel.createWebhook('discotheque'));

  logger.log('Starting conversation');

  let prevMember: GuildMember | undefined;
  for (const message of conversation.messages.filter(m => m.content)) {
    const author = await getAuthor(guild, message.authorId);

    // get reasonable words per minute, in seconds
    const wps = random(50, 90) / 60;
    const numWords = message.content.split(' ').length;
    let sleepTime = (numWords / wps) * 1000;

    // change in person talking
    if (prevMember && prevMember.id !== author.id) {
      sleepTime += random(5_000, 20_000);
    }

    await new Promise(resolve => setTimeout(resolve, sleepTime));

    await webhook.send(message.content, {
      username: author.displayName,
      avatarURL: author.user.avatarURL() || undefined,
      disableMentions: 'all'
    });

    prevMember = author;
  }

  logger.log('End of conversation');

  await GPTConversation.updateOne({ _id: conversation._id }, { used: true });
}
