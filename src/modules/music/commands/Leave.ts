import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message } from 'discord.js';
import Music from '../Music';

class Leave extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Leaves the current voice channel.';
  }

  public getName(): string {
    return 'leave';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await (this.module as Music).leaveChannel(message);
  }
}

export default Leave;
