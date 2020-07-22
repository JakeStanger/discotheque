import Service from './Service';
import IEvent from '../../../../server/modules/games/hungerGames/database/schema/IEvent';

class EventService extends Service<IEvent> {
  constructor() {
    super('/event');
  }
}

export default EventService;
