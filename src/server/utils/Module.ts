import Command from './Command';
import Log from './Logger';
import kleur from 'kleur';
import IGuild from '../database/schema/IGuild';
import Route from './Route';
import { Collection } from 'discord.js';
import HTTPServer from '../http/HTTPServer';
import { NextFunction, Request, Response } from 'express';

abstract class Module {
  private readonly commands: Collection<string, Command> = new Collection();
  private readonly routes: Collection<string, Route> = new Collection();

  public addCommands(commands: (new (...args: any[]) => Command)[]) {
    commands.forEach(command => {
      const commandInstance = new command(this);
      Log.get(this.getName()).log(
        `Added command ${kleur.red(commandInstance.name)}`
      );
      this.commands.set(commandInstance.name, commandInstance);
    });
  }

  public addRoutes(routes: (new (...args: any[]) => Route)[]) {
    routes.forEach(route => {
      const routeInstance = new route(this);
      Log.get(this.getName()).log(
        `Added route ${kleur.red(routeInstance.name)}`
      );
      this.routes.set(routeInstance.name, routeInstance);

      HTTPServer.get().addRoute(
        routeInstance.path,
        routeInstance.method,
        (req: Request, res: Response, next: NextFunction) => {
          // TODO: Check route enabled via authenticated user/guild settings
          //if (!this.isDisabled()) {
          return routeInstance.run(req, res);
          // } else {
          //   return next();
          // }
        }
      );
    });
  }

  public getConfig(guild: IGuild) {
    return guild.modules.find(m => m.name === this.getIdentifier());
  }

  public isDisabled(guild: IGuild) {
    return this.getConfig(guild)?.disabled;
  }

  public getCommand(commandName: string) {
    return this.commands.get(commandName);
  }

  public getCommands() {
    return [...this.commands.values()];
  }

  public getRoute(routeName: string) {
    return this.routes.get(routeName);
  }

  public getRoutes() {
    return [...this.routes.values()];
  }

  abstract getIdentifier(): string;
  abstract getName(): string;
  abstract getDescription(): string;
  abstract getLink(): string | undefined;
}

export default Module;
