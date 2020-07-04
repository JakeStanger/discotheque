import * as kleur from 'kleur';
import { Dictionary } from 'lodash';

class Log {
  private static loggerCache: Dictionary<Log> = {};

  private readonly name: string;

  private constructor(name: string) {
    this.name = name;
    Log.loggerCache[name] = this;
  }

  public static get(name: string) {
    return Log.loggerCache[name] || new Log(name);
  }

  private _getPrefix() {
    return kleur.grey(`[${new Date().toISOString()}] [${this.name}] `);
  }

  public log(...message: any[]) {
    console.log(this._getPrefix(), ...message);
  }

  public warn(...message: any[]) {
    console.warn(
      this._getPrefix(),
      kleur
        .bold()
        .bgYellow()
        .black('[WARNING]'),
      ...message
    );
  }

  public error(...message: any[]) {
    console.error(this._getPrefix(), kleur.bold().bgRed('[ERROR]'), ...message);
  }
}

/**
 * Adds static logger methods.
 */
export abstract class Logger {
  public static log(...message: any[]) {
    Log.get(this.name).log(...message);
  }

  public static warn(...message: any[]) {
    Log.get(this.name).warn(...message);
  }

  public static error(...message: any[]) {
    Log.get(this.name).error(...message);
  }
}

export default Log;
