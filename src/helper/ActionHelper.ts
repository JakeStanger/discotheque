import Logger from '../utils/logging/LoggerMixin';
import Collection from '@discordjs/collection';
import path from 'path';
import glob from 'glob';
import * as colors from '../utils/logging/colors';
import IAction, { IActionMetadata } from './IAction';
import ConfigManager from '../manager/ConfigManager';

interface IActionModule {
  default: (...args: any[]) => any;
  meta?: IActionMetadata;
}

abstract class ActionHelper<TAction extends IAction> extends Logger {
  protected actions: Collection<string, TAction> = new Collection();

  protected abstract type: string;

  public async load() {
    const actionsFolder = path.join(__dirname, '../', 'bot', `${this.type}s`);
    const commandFiles = glob.sync(`${actionsFolder}/**/*.{ts,js}`);

    for (const commandFile of commandFiles) {
      const relPath = commandFile
        .split(`bot/${this.type}s/`)[1]
        .replace(/\..*$/, '');

      this.log(`Adding ${this.type} ${colors.action(relPath)}`);

      const { default: exec, meta } = (await import(
        commandFile
      )) as IActionModule;

      const [module, name] = relPath.split('/');

      if (!meta) {
        this.error(
          `${this.type} ${module}/${name} is missing a meta export and will not be loaded.`
        );
        continue;
      }

      const action = {
        name,
        module,
        exec,
        ...meta,
      } as TAction;

      this.actions.set(name, action);
    }
  }

  public has(name: string) {
    return this.actions.has(name);
  }

  public get(name: string) {
    return this.actions.get(name);
  }

  public getConfigKey(action: IAction): string {
    return `${this.type}.${action.module}.${action.name}`;
  }

  public async ensureConfig(guildId: string) {
    const configManager = ConfigManager.get();

    const actions = this.getAll();
    for (const action of actions) {
      if (action?.ensureConfig) {
        Object.keys(action.ensureConfig).forEach((key) => {
          configManager.ensure(
            { key: `${this.getConfigKey(action)}.${key}`, guildId },
            action.ensureConfig[key]
          );
        });
      }

      await configManager.ensure(
        { guildId: guildId, key: `${this.getConfigKey(action)}.enabled` },
        true
      );
    }
  }

  public abstract getAll(): TAction[];
}

export default ActionHelper;
