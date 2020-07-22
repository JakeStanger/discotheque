import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message, TextChannel } from 'discord.js';
import DiscordUtils from '../../../discord/DiscordUtils';
import GuildManager from '../../../database/GuildManager';
import ICommandDefinition from '../../../utils/ICommandDefinition';

class Help extends Command {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'help',
      description: 'Shows this help.'
    };
  }

  public getName(): string {
    return 'help';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    if (!message.guild) {
      await DiscordUtils.sendError(
        message.channel,
        'This only works inside guilds'
      );
      return;
    }

    const guild = await GuildManager.get().getGuild(message.guild!.id);
    if (!guild) {
      await DiscordUtils.sendError(
        message.channel,
        'Could not find config for guild'
      );
      return;
    }

    const commands = await Command.getAllCommands(guild);

    await (message.channel as TextChannel).send({
      embed: {
        title: 'Help',
        fields: commands.map(command => ({
          name: command.name,
          value: command.description || '-'
        }))
      }
    });
  }
}

export default Help;
