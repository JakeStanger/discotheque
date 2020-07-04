import { DateTime } from 'luxon';
import { Message, MessageEmbedOptions, TextChannel } from 'discord.js';
import * as kleur from 'kleur';
import MessageHandler from '../../../discord/MessageHandler';
import Command from '../../../utils/Command';
import Module from '../../../utils/Module';

class Sync extends Command {
  private msgCount = 0;
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
      embed: this.getEmbed(msg)
    })) as Message;

    this.prevMonth = DateTime.fromMillis(msg.createdTimestamp).toFormat(
      'yyyy-MM'
    );

    await this.getNextMessageSet(msg, statusMessage);

    Sync.log(kleur.green('Sync complete'));

    await statusMessage.edit('', { embed: this.getEmbed(msg, false) });
    this.syncInProgress = false;
  }

  private async getNextMessageSet(msg: Message, statusMessage: Message) {
    Sync.log(
      `Fetching before ${kleur.cyan(
        DateTime.fromMillis(msg.createdTimestamp).toISO()
      )}`,
      kleur.magenta(this.msgCount)
    );

    if (
      DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM') !=
      this.prevMonth
    )
      await statusMessage
        .edit('', { embed: this.getEmbed(msg) })
        .catch(Sync.error);
    this.prevMonth = DateTime.fromMillis(msg.createdTimestamp).toFormat(
      'yyyy-MM'
    );

    const messages = await msg.channel.messages
      .fetch({ before: msg.id })
      .catch(Sync.error);
    if (messages) {
      const messageHandler = MessageHandler.get();
      await Promise.all(
        messages.map(
          msg =>
            new Promise(resolve =>
              messageHandler
                .writeMessage(msg)
                .then(() => this.msgCount++)
                .then(resolve)
            )
        )
      );

      const last = messages.last();
      if (last && last.id !== msg.id) {
        await this.getNextMessageSet(last, statusMessage);
      }
    }
  }

  private getEmbed(msg: Message, progress = true): MessageEmbedOptions {
    return {
      title: progress ? 'Syncing' : 'Sync complete',
      description: `Current: **${
        progress
          ? DateTime.fromMillis(msg.createdTimestamp).toFormat('yyyy-MM')
          : this.prevMonth
      }**\nMessage count: **${this.msgCount}**`,
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
