import Module from '../../utils/Module';
import module from '../../decorators/module';
import ReactPin from './commands/ReactPin';

@module
class HallOfFame extends Module {
  constructor() {
    super();

    this.addCommands([ReactPin]);
  }

  getDescription(): string {
    return 'Message pin overflow utilities.';
  }

  getLink(): string | undefined {
    return undefined;
  }

  public getIdentifier(): string {
    return 'hallOfFame';
  }

  getName(): string {
    return 'Hall of Fame';
  }
}

export default HallOfFame;
