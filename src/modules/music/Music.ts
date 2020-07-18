import module from '../../decorators/module';
import Module from '../../utils/Module';
import Join from './commands/Join';
import Leave from './commands/Leave';
import Play from './commands/Play';
import {
  Guild,
  Message,
  StreamDispatcher,
  VoiceBroadcast,
  VoiceConnection
} from 'discord.js';
import DiscordUtils from '../../discord/DiscordUtils';
import { Readable } from 'stream';

@module
class Music extends Module {
  private connections: Record<string, VoiceConnection> = {};
  private streams: Record<string, StreamDispatcher> = {};

  constructor() {
    super();

    this.addCommands([Join, Leave, Play]);
  }

  public async joinChannel(message: Message) {
    const requester = message.member;
    if (requester?.voice.channel) {
      this.connections[
        message.guild!.id
      ] = await requester.voice.channel.join();
      return this.connections[message.guild!.id];
    } else {
      await DiscordUtils.sendError(
        message.channel,
        'You must be in a voice channel to do that'
      );
    }
  }

  public async leaveChannel(message: Message) {
    if (!message.guild) return;

    await message.client.voice?.connections
      .find(c => c.channel.guild.id === message.guild?.id)
      ?.disconnect();

    delete this.connections[message.guild.id];
  }

  public play(input: string | VoiceBroadcast | Readable, guild: Guild) {
    const connection = this.connections[guild.id];
    this.streams[guild.id] = connection.play(input);
  }

  public async getConnection(
    message: Message
  ): Promise<VoiceConnection | undefined> {
    if (!message.guild) return Promise.resolve(undefined);
    if (!this.isConnected(message.guild)) {
      return await this.joinChannel(message);
    } else {
      return Promise.resolve(this.connections[message.guild.id]);
    }
  }

  private isConnected(guild: Guild) {
    return !!this.connections[guild.id];
  }

  public getDescription(): string {
    return 'Commands for playing audio in voice channels.';
  }

  public getLink(): string | undefined {
    return undefined;
  }

  public getIdentifier(): string {
    return 'music';
  }

  public getName(): string {
    return 'Music';
  }
}

export default Music;
