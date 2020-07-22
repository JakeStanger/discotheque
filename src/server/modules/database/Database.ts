import Module from '../../utils/Module';
import module from '../../decorators/module';
import Sync from './commands/Sync';

@module
class Database extends Module {
  constructor() {
    super();

    this.addCommands([Sync]);
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
}

export default Database;
