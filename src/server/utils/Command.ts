import Module from './Module';
import { Message } from 'discord.js';
import ModuleRegistry from '../registries/ModuleRegistry';
import { Logger } from './Logger';
import IGuild from '../database/schema/IGuild';
import ICommandDefinition from './ICommandDefinition';

abstract class Command extends Logger {
  protected module: Module;

  protected constructor(module: Module) {
    super();
    this.module = module;
  }

  protected abstract getDefinition(): ICommandDefinition;

  public get name(): string {
    return this.getDefinition().name;
  }

  public get description(): string {
    return this.getDefinition().description;
  }

  public get aliases(): string[] {
    return this.getDefinition().aliases || [];
  }

  public get requiresAdmin(): boolean {
    return !!this.getDefinition()?.admin;
  }

  public get isNsfw(): boolean {
    return !!this.getDefinition()?.nsfw;
  }

  public abstract run(message: Message, ...args: string[]): Promise<void>;

  public static async getCommand(commandName: string, guild: IGuild) {
    const modules = await ModuleRegistry.get().getEnabledModules(guild);
    for (const module of modules) {
      const command = module.getCommand(commandName);
      if (command) {
        return command;
      }
    }
  }

  public static async getAllCommands(guild: IGuild): Promise<Command[]> {
    const enabledModules = await ModuleRegistry.get().getEnabledModules(guild);
    return enabledModules.map(module => module.getCommands()).flat();
  }
}

export default Command;
