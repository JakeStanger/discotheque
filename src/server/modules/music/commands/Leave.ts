import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message } from 'discord.js';
import Music from '../Music';
import ICommandDefinition from '../../../utils/ICommandDefinition';

class Leave extends Command {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'leave',
      description: 'Leaves the current voice channel.'
    };
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await (this.module as Music).leaveChannel(message);
  }
}

export default Leave;
