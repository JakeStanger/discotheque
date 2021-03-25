import ActionHelper from '../ActionHelper';
import IHook from './IHook';
import ConfigManager from '../../manager/ConfigManager';

class HooksHelper extends ActionHelper<IHook<any>> {
  protected type = 'hook';

  private static instance: HooksHelper;

  private constructor() {
    super();
    HooksHelper.instance = this;
  }

  public static get() {
    return HooksHelper.instance ?? new HooksHelper();
  }

  public async getForGuild(guildId: string) {
    const configManager = ConfigManager.get();

    const settings = await configManager.getAll({
      key: { startsWith: 'hook', endsWith: 'enabled' },
      guildId,
      value: { equals: true },
    });

    const hookNames = settings.map((s) =>
      s.key.replace('hook.', '').replace('.enabled', '').split('.')
    );

    return hookNames.map((name) => this.get(name[1]));
  }

  public getAll(): IHook<any>[] {
    return this.actions.array();
  }
}

export default HooksHelper;
