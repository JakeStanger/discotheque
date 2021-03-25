import ICommand from './ICommand';
import ActionHelper from '../ActionHelper';

class CommandsHelper extends ActionHelper<ICommand> {
  protected type = 'command';

  private static instance: CommandsHelper;

  private constructor() {
    super();
    CommandsHelper.instance = this;
  }

  public static get() {
    return CommandsHelper.instance ?? new CommandsHelper();
  }

  public async load() {
    await super.load();

    await Promise.all(
      this.actions.map((action) => {
        action.aliases?.forEach((alias) => {
          this.actions.set(alias, {
            ...action,
            isAlias: true,
          });
        });
      })
    );
  }

  public getAll() {
    return this.actions.filter((a) => !a.isAlias).array();
  }
}

export default CommandsHelper;
