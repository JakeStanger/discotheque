import Module from './Module';
import { Message } from 'discord.js';
import ModuleRegistry from '../registries/ModuleRegistry';
import { Logger } from './Logger';

abstract class Command extends Logger {
  protected module: Module;

  protected constructor(module: Module) {
    super();
    this.module = module;
  }

  abstract getName(): string;
  abstract getDescription(): string;
  abstract run(message: Message, ...args: string[]): Promise<void>;

  abstract admin: boolean;
  abstract nsfw: boolean;

  public static async getCommand(commandName: string, guild: IGuild) {
    const modules = await ModuleRegistry.get().getEnabledModules(guild);
    for (const module of modules) {
      const command = module.getCommand(commandName);
      if (command) {
        return command;
      }
    }
  }

  public static async getAllCommands(guild: IGuild) {
    const enabledModules = await ModuleRegistry.get().getEnabledModules(guild);
    return enabledModules.map(module => module.getCommands()).flat();
  }
}

export default Command;
