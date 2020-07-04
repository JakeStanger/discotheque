import module from '../../decorators/module';
import Module from '../../utils/Module';
import Help from './commands/Help';
import Modules from './commands/Modules';
import Ping from './commands/Ping';

@module
class Core extends Module {
  public constructor() {
    super();

    this.addCommands([Help, Modules, Ping]);
  }

  public getDescription(): string {
    return 'Contains core functionality required by the bot. This cannot be disabled.';
  }

  public getLink(): string | undefined {
    return undefined;
  }

  public getName(): string {
    return 'Core';
  }
}

export default Core;
