import module from '../../decorators/module';
import Module from '../../utils/Module';
import SongVSong from './commands/SongVSong';

@module
class DGM extends Module {
  constructor() {
    super();

    this.addCommands([SongVSong]);
  }

  getDescription(): string {
    return 'Functions for interacting with DGM database';
  }

  getIdentifier(): string {
    return 'dgm';
  }

  getLink(): string | undefined {
    return undefined;
  }

  getName(): string {
    return 'DGM';
  }
}

export default DGM;
