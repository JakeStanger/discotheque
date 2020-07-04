import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message, TextChannel } from 'discord.js';

class Help extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getName(): string {
    return 'help';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    const commands = Command.getAllCommands();

    await (message.channel as TextChannel).send({
      embed: {
        title: 'Help',
        fields: commands.map(command => ({
          name: command.getName(),
          value: command.getDescription() || '-'
        }))
      }
    });
  }

  public getDescription(): string {
    return 'Shows this help.';
  }
}

export default Help;
