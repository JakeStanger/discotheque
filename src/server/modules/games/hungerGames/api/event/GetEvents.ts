import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesEvent } from '../../database/schema/IEvent';

class GetEvents extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-getEvents',
      method: 'GET',
      path: '/hungerGames/event'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const events = await HungerGamesEvent.find();
    await res.json(events);
  }
}

export default GetEvents;
