import {
  DMChannel,
  Message,
  MessageEmbedOptions,
  NewsChannel,
  TextChannel
} from 'discord.js';

type MessageChannel = TextChannel | DMChannel | NewsChannel;

class DiscordUtils {
  public static readonly COLOR_SUCCESS = 0x6eff64;
  public static readonly COLOR_ONGOING = 0xffbf00;
  public static readonly COLOR_ERROR = 0xb32b14;

  public static async sendEmbed(
    sendObj: MessageChannel | Message,
    embed: MessageEmbedOptions | string
  ): Promise<Message> {
    return (DiscordUtils.isMessage(sendObj)
      ? await sendObj.edit('', { embed: DiscordUtils.getEmbed(embed) })
      : await sendObj.send('', {
          embed: DiscordUtils.getEmbed(embed)
        })) as Message;
  }

  public static async sendSuccess(
    sendObj: MessageChannel | Message,
    embed: MessageEmbedOptions | string
  ) {
    return await DiscordUtils.sendEmbed(sendObj, {
      ...DiscordUtils.getEmbed(embed),
      color: DiscordUtils.COLOR_SUCCESS
    });
  }

  public static async sendOngoing(
    sendObj: MessageChannel,
    embed: MessageEmbedOptions | string
  ) {
    return await DiscordUtils.sendEmbed(sendObj, {
      ...DiscordUtils.getEmbed(embed),
      color: DiscordUtils.COLOR_ONGOING
    });
  }

  public static async sendError(
    sendObj: MessageChannel | Message,
    embed: MessageEmbedOptions | string
  ) {
    return await DiscordUtils.sendEmbed(sendObj, {
      ...DiscordUtils.getEmbed(embed),
      color: DiscordUtils.COLOR_ERROR
    });
  }

  private static isMessage(
    sendObj: MessageChannel | Message
  ): sendObj is Message {
    return (sendObj as Message).author !== undefined;
  }

  private static getEmbed(
    embed: MessageEmbedOptions | string
  ): MessageEmbedOptions {
    return typeof embed === 'string' ? { title: embed } : embed;
  }
}

export default DiscordUtils;
