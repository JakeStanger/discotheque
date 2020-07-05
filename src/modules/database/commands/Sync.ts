import { DateTime } from 'luxon';
import {
  Collection,
  EmbedFieldData,
  Message,
  MessageEmbedOptions,
  TextChannel
} from 'discord.js';
import * as kleur from 'kleur';
import MessageHandler from '../../../discord/MessageHandler';
import Command from '../../../utils/Command';
import Module from '../../../utils/Module';

class Sync extends Command {
  private msgCount = 0;
  private channelMsgCount = 0;

  private prevMonth = '';
  private syncInProgress = false;

  constructor(module: Module) {
    super(module);
  }

  public async doSync(msg: Message) {
    if (this.syncInProgress) return;
    this.syncInProgress = true;
    this.msgCount = 0;

    const statusMessage: Message = (await msg.reply('', {
      embed: this.getEmbed(msg, '[STARTING]')
    })) as Message;

    const channels: Collection<string, TextChannel> =
      (msg.guild?.channels.cache.filter(c => c.type === 'text') as Collection<
        string,
        TextChannel
      >) || [];

    for (const [channelId, channel] of channels) {
      this.channelMsgCount = 0;

      const lastMessage =
        channel.lastMessage ||
        (await channel.messages.fetch({ limit: 1 }).then(m => m.first()));

      if (!lastMessage) continue;

      this.prevMonth = DateTime.fromMillis(
        lastMessage.createdTimestamp
      ).toFormat('yyyy-MM');

      await this.getNextMessageSet(lastMessage, statusMessage, channel);
    }

    Sync.log(kleur.green('Sync complete'));

    await statusMessage.edit('', {
      embed: this.getEmbed(msg, '[FINISHED]', false)
    });
    this.syncInProgress = false;
  }

  private async getNextMessageSet(
    msg: Message,
    statusMessage: Message,
    channel: TextChannel
  ) {
    Sync.log(
      `Fetching before ${kleur.cyan(
        DateTime.fromMillis(msg.createdTimestamp).toISO()
      )} in ${kleur.blue(channel.name)}`,
      kleur.magenta(this.channelMsgCount),
      kleur.magenta(this.msgCount)
    );

    if (
      DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM') !=
      this.prevMonth
    ) {
      await statusMessage
        .edit('', { embed: this.getEmbed(msg, channel.name) })
        .catch(Sync.error);
    }

    this.prevMonth = DateTime.fromMillis(msg.createdTimestamp).toFormat(
      'yyyy-MM'
    );

    const messages = await msg.channel.messages
      .fetch({ before: msg.id, limit: 100 })
      .catch(Sync.error);

    if (messages) {
      const messageHandler = MessageHandler.get();

      await messageHandler.writeMessages(messages.array());
      this.msgCount += messages.size;
      this.channelMsgCount += messages.size;

      const last = messages.last();
      if (last && last.id !== msg.id) {
        await this.getNextMessageSet(last, statusMessage, channel);
      }
    }
  }

  private getEmbed(
    msg: Message,
    channelName: string,
    progress = true
  ): MessageEmbedOptions {
    return {
      title: progress ? 'Syncing' : 'Sync complete',
      fields: [
        progress && {
          name: 'Channel',
          value: channelName
        },
        progress && {
          name: 'Scan Date',
          value: DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM')
        },
        {
          name: 'Channel Count',
          value: this.channelMsgCount
        },
        {
          name: 'Total Count',
          value: this.msgCount
        }
      ].filter(p => p) as EmbedFieldData[],
      color: progress ? 0xffbf00 : 0x6eff64
    };
  }

  public getDescription(): string {
    return 'Syncs all messages in all channels';
  }

  public getName(): string {
    return 'sync';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await this.doSync(message);
  }
}

export default Sync;
