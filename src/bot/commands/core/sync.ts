import {
  EmbedFieldData,
  Message,
  MessageEmbedOptions,
  TextChannel,
} from 'discord.js';
import { ICommandMeta } from '../../../helper/commands/ICommand';
import ConfigManager from '../../../manager/ConfigManager';
import { DateTime } from 'luxon';
import * as colors from '../../../utils/logging/colors';
import { info, error } from '../../../utils/logging/logger';
import MessageManager from '../../../manager/MessageManager';
import SyncHistoryManager from '../../../manager/SyncHistoryManager';

let syncInProgress = false;
let msgCount = 0;
let channelMsgCount = 0;
let prevMonth: string;

const log = (...message: any[]) => info('Sync', ...message);
const logError = (...message: any[]) => error('Sync', ...message);

function getEmbed(
  msg: Message,
  channelName: string,
  progress = true
): MessageEmbedOptions {
  return {
    title: progress ? 'Syncing' : 'Sync complete',
    fields: [
      progress && {
        name: 'Channel',
        value: channelName,
      },
      progress && {
        name: 'Scan Date',
        value: DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM'),
      },
      {
        name: 'Channel Count',
        value: channelMsgCount,
      },
      {
        name: 'Total Count',
        value: msgCount,
      },
    ].filter((p) => p) as EmbedFieldData[],
    color: progress ? 0xffbf00 : 0x6eff64,
  };
}

async function getNextMessageSet(
  msg: Message,
  statusMessage: Message,
  channel: TextChannel
): Promise<string> {
  log(
    `Fetching before ${colors.time(
      DateTime.fromMillis(msg.createdTimestamp).toISO()
    )} in ${colors.client(channel.name)}`,
    colors.data(channelMsgCount),
    colors.data(msgCount)
  );

  if (
    DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM') != prevMonth
  ) {
    await statusMessage
      .edit('', { embed: getEmbed(msg, channel.name) })
      .catch((err) => logError(err));
  }

  prevMonth = DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM');

  const messages = await msg.channel.messages
    .fetch({ before: msg.id, limit: 100 })
    .catch((err) => logError(err));

  if (messages && messages.size) {
    const messageManager = MessageManager.get();
    await messageManager
      .addMany(messages.map(MessageManager.discordToDatabase))
      .catch((e) => {
        logError(e.message);
        log(messages.map(MessageManager.discordToDatabase));
      });

    msgCount += messages.size;
    channelMsgCount += messages.size;

    const last = messages.last();
    if (last && last.id !== msg.id) {
      return await getNextMessageSet(last, statusMessage, channel);
    }
  } else {
    return msg.id;
  }
}

async function sync(message: Message) {
  if (syncInProgress) {
    await message.reply({
      embed: {
        description:
          ':x: A sync is already occurring elsewhere, please wait and try again later.',
      },
    });
  }

  syncInProgress = true;
  const startDate = new Date();

  const statusMessage: Message = (await message.channel.send({
    embed: getEmbed(message, '[STARTING]'),
  })) as Message;

  const mentionedChannels = message.mentions.channels.array();

  const configManager = ConfigManager.get();
  const logChannels = mentionedChannels.length
    ? mentionedChannels
    : await configManager
        .getById({
          key: 'logChannels',
          guildId: message.guild.id,
        })
        .then((r) => r.value as string[]);

  const syncHistoryManager = SyncHistoryManager.get();

  for (const logChannel of logChannels) {
    channelMsgCount = 0;

    const channel = (await message.guild.channels.resolve(
      logChannel
    )) as TextChannel;

    const lastSync = await syncHistoryManager.getLast(channel.id);

    let lastMessage: Message;
    if (lastSync) {
      lastMessage = await channel.messages.resolve(lastSync.lowerBound);
    } else {
      lastMessage =
        channel.lastMessage ||
        (await channel.messages.fetch({ limit: 1 }).then((m) => m.first()));
    }

    if (!lastMessage) continue;

    prevMonth = DateTime.fromMillis(lastMessage.createdTimestamp).toFormat(
      'yyyy-MM'
    );

    const upperBound = lastMessage.id;

    const lowerBound = await getNextMessageSet(
      lastMessage,
      statusMessage,
      channel
    );

    await syncHistoryManager.add({
      date: startDate,
      channelId: channel.id,
      upperBound,
      lowerBound,
    });
  }

  log('Sync complete');

  await statusMessage.edit('', {
    embed: getEmbed(message, '[FINISHED]', false),
  });

  syncInProgress = false;
  msgCount = 0;
}

export default sync;

export const meta = {
  help: 'Syncs all channels to database',
  permission: 'ADMINISTRATOR',
} as ICommandMeta;
