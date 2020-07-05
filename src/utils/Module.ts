import Command from './Command';
import Log from './Logger';
import * as kleur from 'kleur';

abstract class Module {
  private readonly commands: Record<string, Command> = {};

  public addCommands(commands: (new (...args: any[]) => Command)[]) {
    commands.forEach(command => {
      const commandInstance = new command(this);
      Log.get(this.getName()).log(
        `Added command ${kleur.red(commandInstance.getName())}`
      );
      this.commands[commandInstance.getName()] = commandInstance;
    });
  }

  public getCommand(command: string) {
    return this.commands[command];
  }

  public getCommands() {
    return Object.values(this.commands);
  }

  abstract getName(): string;
  abstract getDescription(): string;
  abstract getLink(): string | undefined;
}

export default Module;
