import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message, TextChannel } from 'discord.js';
import DiscordUtils from '../../../discord/DiscordUtils';
import GuildManager from '../../../database/GuildManager';

class Help extends Command {
  public readonly admin = false;
  public readonly nsfw = false;

  constructor(module: Module) {
    super(module);
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
