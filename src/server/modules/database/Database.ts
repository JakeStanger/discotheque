import Module from '../../utils/Module';
import module from '../../decorators/module';
import Sync from './commands/Sync';
import { CronJob } from 'cron';
import { random } from 'lodash';
import Log from '../../utils/Logger';
import { DateTime } from 'luxon';
import { runConversation } from './gpt/Conversations';

@module
class Database extends Module {
  constructor() {
    super();

    this.addCommands([Sync]);

    this.runAIConversationTimer();
  }

  public getDescription(): string {
    return 'Commands and utilities for interacting with the message database.';
  }

  public getLink(): string | undefined {
    return undefined;
  }

  public getIdentifier(): string {
    return 'database';
  }

  public getName(): string {
    return 'Database';
  }

  private runAIConversationTimer() {
    const job = new CronJob({
      cronTime: '0 8,17 * * *',
      onTick: async () => {
        // wait between 0-5 hours
        const timeout = random(0, 1000 * 3600 * 5);
        Log.get(this.getName()).log(
          `Running next GPT-2 conversation set at ${DateTime.local()
            .plus({ milliseconds: timeout })
            .toISO()}`
        );
        await new Promise(resolve => setTimeout(resolve, timeout));

        const guildConfigs = await this.getConfigs().then(configs =>
          configs.filter(c => !!c?.settings?.has('gptConversationChannel'))
        );

        await Promise.all(guildConfigs.map(runConversation));
      }
    });

    job.start();
  }
}

export default Database;
