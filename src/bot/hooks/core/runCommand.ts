import ConfigManager from '../../../manager/ConfigManager';
import CommandsHelper from '../../../helper/commands/CommandsHelper';
import { Message } from 'discord.js';
import { IHookMetadata } from '../../../helper/hooks/IHook';

async function runCommand(message: Message) {
  if (message.author.bot) {
    return;
  }

  const configManager = ConfigManager.get();

  const prefix = await configManager
    .getById({
      key: 'prefix',
      guildId: message.guild.id,
    })
    .then((p) => p.value as string);

  if (message.content.startsWith(prefix)) {
    const [commandName, ...args] = message.content
      .substr(prefix.length)
      .split(' ');

    const commandsHelper = CommandsHelper.get();
    if (commandsHelper.has(commandName)) {
      const command = commandsHelper.get(commandName);

      const enabled = await configManager
        .getById({
          key: `command.${command.module}.${command.name}.enabled`,
          guildId: message.guild.id,
        })
        .then((r) => r.value);

      if (!enabled) {
        return;
      }

      if (
        !command.permission ||
        message.member.id === process.env.BOT_OWNER_ID ||
        message.member.hasPermission(command.permission)
      ) {
        await command.exec(message, ...args);
      } else {
        await message.channel.send({
          embed: {
            description: `:no_entry: You need permission **${command.permission}** to do that`,
          },
        });
      }
    }
  }
}

export const meta: IHookMetadata = {
  event: 'message',
  help: 'Executes a command for a new message',
};

export default runCommand;
