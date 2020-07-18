import Command from '../../../utils/Command';
import { Message } from 'discord.js';
import Music from '../Music';

class Join extends Command {
  public readonly admin = false;
  public readonly nsfw = false;

  constructor(module: Music) {
    super(module);
  }

  public getDescription(): string {
    return 'Joins your current voice channel.';
  }

  public getName(): string {
    return 'join';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await (this.module as Music).joinChannel(message);
  }
}

export default Join;
