import Module from './Module';
import ModuleRegistry from '../registries/ModuleRegistry';
import { Logger } from './Logger';
import IGuild from '../database/schema/IGuild';
import IRouteDefinition from './IRouteDefinition';
import { Request, Response } from 'express';
import { HTTPMethod } from '../http/HTTPServer';

abstract class Route extends Logger {
  protected module: Module;

  protected constructor(module: Module) {
    super();
    this.module = module;
  }

  protected abstract getDefinition(): IRouteDefinition;

  public get name(): string {
    return this.getDefinition().name;
  }

  public get path(): string | RegExp {
    return this.getDefinition().path;
  }

  public get method(): HTTPMethod {
    return this.getDefinition().method;
  }

  public get requiresAdmin(): boolean {
    return !!this.getDefinition()?.admin;
  }

  public get isNsfw(): boolean {
    return !!this.getDefinition()?.nsfw;
  }

  public abstract run(req: Request, res: Response): Promise<void>;

  public static async getRoute(routeName: string, guild: IGuild) {
    const modules = await ModuleRegistry.get().getEnabledModules(guild);
    for (const module of modules) {
      const command = module.getRoute(routeName);
      if (command) {
        return command;
      }
    }
  }

  public static async getAllRoutes(guild: IGuild) {
    const enabledModules = await ModuleRegistry.get().getEnabledModules(guild);
    return enabledModules.map(module => module.getRoutes()).flat();
  }
}

export default Route;
