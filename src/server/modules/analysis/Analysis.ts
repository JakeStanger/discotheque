import Module from '../../utils/Module';
import module from '../../decorators/module';
import Backlog from './commands/Backlog';

@module
class Analysis extends Module {
  constructor() {
    super();

    this.addCommands([Backlog]);
  }

  getDescription(): string {
    return 'Text analysis commands, mostly fun.';
  }

  getLink(): string | undefined {
    return undefined;
  }

  getIdentifier(): string {
    return 'analysis';
  }

  getName(): string {
    return 'Analysis';
  }
}

export default Analysis;
