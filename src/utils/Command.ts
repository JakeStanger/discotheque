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

  public static getCommand(commandName: string) {
    const modules = ModuleRegistry.get().getModules();
    for (const module of modules) {
      const command = module.getCommand(commandName);
      if (command) {
        return command;
      }
    }
  }

  public static getAllCommands() {
    return ModuleRegistry.get()
      .getModules()
      .map(module => module.getCommands()).flat();
  }
}

export default Command;
