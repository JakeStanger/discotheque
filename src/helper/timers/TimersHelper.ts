import ActionHelper from '../ActionHelper';
import ITimer from './ITimer';
import schedule from 'node-schedule';
import * as colors from '../../utils/logging/colors';
import { DateTime } from 'luxon';
import ConfigManager from '../../manager/ConfigManager';
import DiscordClientManager from '../../manager/DiscordClientManager';
import GuildManager from '../../manager/GuildManager';

class TimersHelper extends ActionHelper<ITimer> {
  protected type = 'timer';

  private static instance: TimersHelper;

  private constructor() {
    super();
    TimersHelper.instance = this;
  }

  public static get() {
    return TimersHelper.instance ?? new TimersHelper();
  }

  /**
   * Starts the loaded timers.
   *
   * This must be called *after*
   * all of the clients have logged in.
   */
  public async startTimers() {
    this.actions.forEach((timer) => {
      const logNextRun = (job: schedule.Job) =>
        this.log(
          `[${colors.action(
            `${timer.module}/${timer.name}`
          )}] Next run at ${colors.time(
            ((job.nextInvocation() as any) as {
              _date: DateTime;
            })._date.toFormat('dd/MM/yyyy HH:mm')
          )}`
        );

      // bind log method so we can use it in job
      const log = this.log.bind(this);

      const job = schedule.scheduleJob(timer.pattern, async function () {
        log(
          `[${colors.action(`${timer.module}/${timer.name}`)}] Executing timer`
        );

        const enabledGuilds = await ConfigManager.get().getAll({
          key: `timer.${timer.module}.${timer.name}.enabled`,
          value: { equals: true },
        });

        await Promise.all(
          enabledGuilds.map(async (config) => {
            const guildConfig = await GuildManager.get().getById(
              config.guildId
            );

            const client = DiscordClientManager.get().get(guildConfig.clientId);

            const guild = await client.guilds.fetch(guildConfig.id);
            await timer.exec(guild);
          })
        );

        logNextRun(this);
      });

      logNextRun(job);
    });
  }

  public getAll(): ITimer[] {
    return this.actions.array();
  }

  public async run(name: string, guildId: string) {
    const guildConfig = await GuildManager.get().getById(guildId);
    if(!guildId) return;

    const client = DiscordClientManager.get().get(guildConfig.clientId);
    if(!client) return;

    const guild = await client.guilds.fetch(guildConfig.id);
    if(!guild) return;

    const timer = this.actions.find((t) => t.name == name);
    if (timer) {
      this.log(
        `[${colors.action(`${timer.module}/${timer.name}`)}] Executing timer (manually triggered)`
      );

      timer.exec(guild);
    }
  }
}

export default TimersHelper;
